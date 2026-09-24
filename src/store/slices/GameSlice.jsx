import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ref,
  set,
  get,
  update,
  remove,
  onDisconnect,
  runTransaction,
} from "firebase/database";
import { rtdb } from "@/firebase/firebase";

const generatePIN = async () => {
  for (let i = 0; i < 10; i++) {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    const snap = await get(ref(rtdb, `games/${pin}`));
    if (!snap.exists()) return pin;
  }
  throw new Error("Could not generate pin, try again");
};

const calcPoints = (answerMs, timeLimitSec) => {
  const timeLimitMs = timeLimitSec * 1000;
  const ratio = Math.min(answerMs / timeLimitMs, 1);
  const MaxPoints = 1000;
  const MinPoints = 500;
  const basePoints = Math.round(MaxPoints - (MaxPoints - MinPoints) * ratio);
  const speedPoints =
    ratio < 0.3 ? 200 : ratio < 0.5 ? 100 : ratio < 0.8 ? 50 : 0;
  return basePoints + speedPoints;
};

export const hostRoom = createAsyncThunk(
  "GameSlice/hostRoom",
  async ({ questions }, { rejectWithValue }) => {
    try {
      const pin = await generatePIN();
      const roomRef = ref(rtdb, `games/${pin}`);

      const safeQuestions = questions.map((q) => ({
        question: q.question,
        options: q.options,
        timeLimit: q.timeLimit,
      }));

      const correctAnswers = questions.map((q) => q.correctAnswer);

      await set(roomRef, {
        status: "lobby",
        currentQuestionIndex: -1,
        totalQuestions: questions.length,
        startedAt: 0,
        questions: safeQuestions,
        timeLimit: 0,
        correctAnswerIndex: null,
        players: {},
        answers: {},
      });

      await set(ref(rtdb, `gameSecrets/${pin}`), { correctAnswers });

      return pin;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const joinRoom = createAsyncThunk(
  "GameSlice/joinRoom",
  async ({ pin, uid, name, email }, { rejectWithValue }) => {
    try {
      const snap = await get(ref(rtdb, `games/${pin}`));

      if (!snap.exists()) {
        throw new Error("Room not found, please check the pin and try again.");
      }

      if (snap.val().status !== "lobby") {
        throw new Error("Game has already started, you cannot join now.");
      }

      await set(ref(rtdb, `games/${pin}/players/${uid}`), {
        name,
        email,
        uid,
        score: 0,
        lastGain: 0,
        connect: true,
      });

      onDisconnect(ref(rtdb, `games/${pin}/players/${uid}`)).update({
        connect: false,
      });

      return { pin, uid, name, email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const startQuestion = createAsyncThunk(
  "gameSlice/startQuestion",
  async ({ pin, index }, { rejectWithValue }) => {
    try {
      const snap = await get(ref(rtdb, `games/${pin}`));
      const gameData = snap.val();
      const question = gameData.questions[index];

      if (!question) {
        throw new Error("Question not found for the given index.");
      }

      await update(ref(rtdb, `games/${pin}`), {
        status: "question",
        currentQuestionIndex: index,
        startedAt: Date.now(),
        timeLimit: question.timeLimit,
        correctAnswerIndex: null,
      });

      return { pin, index };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const submitAnswer = createAsyncThunk(
  "gameSlice/submitAnswer",
  async ({ pin, index, uid, choice }, { rejectWithValue }) => {
    try {

      const gameSnap = await get(ref(rtdb, `games/${pin}`));
      if (!gameSnap.exists()) throw new Error("Room not found");

      const game = gameSnap.val();
      
      if (game.status !== "question") throw new Error("Question not active");
      
      if (game.currentQuestionIndex !== index)
        throw new Error("Wrong question");
      if (game.answers?.[index]?.[uid]) throw new Error("Already answered");

      const ms = Date.now() - game.startedAt;
      if (ms > (game.timeLimit || 0) * 1000) {
        throw new Error("Time is up");
      }

      await set(ref(rtdb, `games/${pin}/answers/${index}/${uid}`), {
        choice,
        ms,
      });

      return { index, uid, choice, ms };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const revealAnswer = createAsyncThunk(
  "gameSlice/revealAnswer",
  async ({ pin }, { rejectWithValue }) => {
    try {

      const secretSnap = await get(
        ref(rtdb, `gameSecrets/${pin}/correctAnswers`),
      );
      
      const correctAnswers = secretSnap.val() || {};

      const roomRef = ref(rtdb, `games/${pin}`);
      let result = null;

      const { committed } = await runTransaction(roomRef, (game) => {
        if (!game) throw new Error("Room not found");
        if (game.status !== "question") {
          throw new Error("Answers already revealed");
        }

        const index = game.currentQuestionIndex;
        const correctAnswerIndex = correctAnswers[index];
        const answers = (game.answers && game.answers[index]) || {};
        const players = game.players || {};
        const timeLimitSec = game.questions[index].timeLimit;

        for (const uid in answers) {
          if (!players[uid]) continue;

          const answer = answers[uid];
          const isCorrect = answer.choice === correctAnswerIndex;
          const currentScore = players[uid].score || 0;

          if (isCorrect) {
            const points = calcPoints(answer.ms, timeLimitSec);
            game.players[uid].score = currentScore + points;
            game.players[uid].lastGain = points;
          } else {
            game.players[uid].lastGain = 0;
          }
        }

        game.status = "reveal";
        game.correctAnswerIndex = correctAnswerIndex;
        result = { index, correctAnswerIndex };
        return game;
      });

      if (!committed) {
        throw new Error("Reveal failed, please try again");
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const showLeaderboard = createAsyncThunk(
  "gameSlice/showLeaderboard",
  async ({ pin }, { rejectWithValue }) => {
    try {
      await update(ref(rtdb, `games/${pin}`), { status: "leaderboard" });
      return pin;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const endGame = createAsyncThunk(
  "gameSlice/endGame",
  async ({ pin }, { rejectWithValue }) => {
    try {
      await update(ref(rtdb, `games/${pin}`), { status: "end" });
      return pin;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteGame = createAsyncThunk(
  "gameSlice/deleteGame",
  async ({ pin }, { rejectWithValue }) => {
    try {
      await remove(ref(rtdb, `games/${pin}`));
      await remove(ref(rtdb, `gameSecrets/${pin}`));
      return pin;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const initialState = {
  pin: null,
  uid: null,
  name: null,
  role: null,
  room: null,
  roomDeleted: false,
  myAnswer: null,
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    setRoomDeleted: (state, action) => {
      state.roomDeleted = action.payload;
    },
    setGameError: (state, action) => {
      state.error = action.payload;
    },
    clearGame: (state) => {
      state.pin = null;
      state.uid = null;
      state.name = null;
      state.role = null;
      state.room = null;
      state.roomDeleted = false;
      state.myAnswer = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hostRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hostRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.pin = action.payload;
        state.role = "host";
      })
      .addCase(hostRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(joinRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.pin = action.payload.pin;
        state.uid = action.payload.uid;
        state.name = action.payload.name;
        state.role = "player";
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(startQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startQuestion.fulfilled, (state) => {
        state.loading = false;
        state.myAnswer = null;
      })
      .addCase(startQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.myAnswer = action.payload;
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(revealAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revealAnswer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(revealAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(showLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(showLeaderboard.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(showLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(endGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endGame.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(endGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGame.fulfilled, (state) => {
        state.loading = false;
        state.pin = null;
        state.uid = null;
        state.name = null;
        state.role = null;
        state.room = null;
        state.roomDeleted = false;
        state.myAnswer = null;
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setRoom, setRoomDeleted, setGameError, clearGame } = gameSlice.actions;

export default gameSlice.reducer;
