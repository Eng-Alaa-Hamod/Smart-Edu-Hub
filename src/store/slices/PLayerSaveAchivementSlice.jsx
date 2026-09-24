import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, setDoc , getDoc, runTransaction, Timestamp } from "firebase/firestore";
import { get, ref } from "firebase/database";
import { db, rtdb } from "@/firebase/firebase";

const getPlayerStats = (uid, room, correctAnswers) => {
  const answers = room.answers || {};
  let answeredQuestions = 0;
  let correctCount = 0;

  Object.entries(answers).forEach(([questionIndex, questionAnswers]) => {
    const answer = questionAnswers?.[uid];
    if (!answer) return 0;

    answeredQuestions += 1;
    if (Number(answer.choice) === Number(correctAnswers?.[questionIndex])) {
      correctCount += 1;
    }
  });

  return {
    answeredQuestions,
    correctAnswers: correctCount,
    wrongAnswers: answeredQuestions - correctCount,
  };
};

const getBadgeType = (rank) => {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
};

const saveOneAchievement = async ({
  uid,
  pin,
  room,
  correctAnswers,
  badgeType,
}) => {
  const player = room.players?.[uid];
  if (!player) return null;

  const stats = getPlayerStats(uid, room, correctAnswers);
  const achievementRef = doc(db, "playerAchievements", uid);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(achievementRef);
    const current = snapshot.exists() ? snapshot.data() : {};
    const previousGame = current.games?.[pin];

    if (previousGame) return;

    const now = Timestamp.now();
    const nextBadges = {
      gold: 0,
      silver: 0,
      bronze: 0,
      ...(current.badges || {}),
    };
    if (badgeType) nextBadges[badgeType] += 1;

    const gameResult = {
      score: player.score || 0,
      answeredQuestions: stats.answeredQuestions,
      correctAnswers: stats.correctAnswers,
      wrongAnswers: stats.wrongAnswers,
      badgeType,
      updatedAt: now,
    };

    const achievementData = {
      uid,
      name: player.name || "User",
      email: player.email || "-",
      totalScore: (current.totalScore || 0) + gameResult.score,
      totalQuestions: (current.totalQuestions || 0) + stats.answeredQuestions,
      totalCorrectAnswers:
        (current.totalCorrectAnswers || 0) + stats.correctAnswers,
      totalWrongAnswers: (current.totalWrongAnswers || 0) + stats.wrongAnswers,
      gamesPlayed: (current.gamesPlayed || 0) + 1,
      badges: nextBadges,
      games: { ...(current.games || {}), [pin]: gameResult },
      updatedAt: now,
    };

    if (snapshot.exists()) {
      transaction.update(achievementRef, achievementData);
    } else {
      transaction.set(achievementRef, achievementData);
    }
  });

  return { uid, ...stats, score: player.score || 0, badgeType };
};

const loadCorrectAnswers = async (pin) => {
  const snapshot = await get(ref(rtdb, `gameSecrets/${pin}/correctAnswers`));
  return snapshot.val() || {};
};

export const savePlayerAchievement = createAsyncThunk(
  "playerAchievements/savePlayerAchievement",
  async ({ uid, pin, room, badgeType }, { rejectWithValue }) => {
    try {
      const correctAnswers = await loadCorrectAnswers(pin);
      return await saveOneAchievement({
        uid,
        pin,
        room,
        correctAnswers,
        badgeType,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const saveGameAchievements = createAsyncThunk(
  "playerAchievements/saveGameAchievements",
  async ({ pin, room }, { rejectWithValue }) => {
    try {
      const correctAnswers = await loadCorrectAnswers(pin);
      const sortedPlayers = Object.entries(room.players || {})
        .map(([uid, player]) => ({ uid, ...player }))
        .sort((a, b) => (b.score || 0) - (a.score || 0));

      const results = [];

      for (let index = 0; index < sortedPlayers.length; index++) {
        const player = sortedPlayers[index];

        const result = await saveOneAchievement({
          uid: player.uid,
          pin,
          room,
          correctAnswers,
          badgeType: getBadgeType(index + 1),
        });

        if (result) results.push(result);
      }

      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const calcRateAchievement = createAsyncThunk(
  "playerAchievementSlice/calcRateAchievement",
  async ({ uid }, { rejectWithValue }) => {
    try {
      const achievementSnapshot = await getDoc(doc(db, "playerAchievements", uid));
      const achievement = achievementSnapshot.exists()
        ? achievementSnapshot.data()
        : {};
      const totalQuestions = achievement.totalQuestions || 0;
      const correctAnswers = achievement.totalCorrectAnswers || 0;
      const rate = totalQuestions
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

      const rateData = {
        uid,
        rate,
      };

      await setDoc(doc(db, "playerAchievements", uid), rateData, { merge: true });

      return { ...achievement, ...rateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const playerAchievementSlice = createSlice({
  name: "playerAchievements",
  initialState: { loading: false, error: null, lastSaved: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(savePlayerAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveGameAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePlayerAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSaved = action.payload;
      })
      .addCase(saveGameAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSaved = action.payload;
      })
      .addCase(savePlayerAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveGameAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(calcRateAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calcRateAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSaved = action.payload;
      })
      .addCase(calcRateAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playerAchievementSlice.reducer;
