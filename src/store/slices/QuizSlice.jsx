/* for store questions */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  deleteDoc,
  collection,
  Timestamp,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const fetchAllQuestions = createAsyncThunk(
  "QuizSlice/Questions",
  async ({ teacherId, quizName }, { rejectWithValue }) => {
    try {
      const questionsRef = collection(
        db,
        "Game",
        teacherId,
        "Quizzes",
        quizName,
        "Questions",
      );
      const q = query(questionsRef);
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return questionsData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchQuizNames = createAsyncThunk(
  "QuizSlice/QuizNames",
  async (teacherId, { rejectWithValue }) => {
    try {
      const quizzesSnapshot = await getDocs(
        collection(db, "Game", teacherId, "Quizzes"),
      );
      return quizzesSnapshot.docs.map((quizDoc) => ({
        id: quizDoc.id,
        name: quizDoc.id,
        ...quizDoc.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addQuestion = createAsyncThunk(
  "QuizSlice/addQuestion",
  async (
    { question, options, correctAnswer, teacherId, quizName, timeLimit },
    { rejectWithValue },
  ) => {
    try {
      const questionData = {
        question,
        options,
        correctAnswer,
        timeLimit: timeLimit || 30,
        createdAt: Timestamp.now().toMillis(),
      };
      await setDoc(
        doc(db, "Game", teacherId, "Quizzes", quizName),
        { name: quizName },
        { merge: true },
      );
      const docRef = await addDoc(
        collection(
          db,
          "Game",
          teacherId,
          "Quizzes",
          quizName,
          "Questions",
        ),
        questionData,
      );
      return { id: docRef.id, ...questionData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteQuestion = createAsyncThunk(
  "QuizSlice/deleteQuestion",
  async ({ teacherId, quizName, questionId }, { rejectWithValue }) => {
    try {
      await deleteDoc(
        doc(
          db,
          "Game",
          teacherId,
          "Quizzes",
          quizName,
          "Questions",
          questionId,
        ),
      );
      const questionsRef = collection(
        db,
        "Game",
        teacherId,
        "Quizzes",
        quizName,
        "Questions",
      );
      const q = query(questionsRef);
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return questionsData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  quizNames: [],
  questions: [],
  loading: false,
  error: null,
};

const QuizSlice = createSlice({
  name: "QuizSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizNames.fulfilled, (state, action) => {
        state.loading = false;
        state.quizNames = action.payload;
      })
      .addCase(fetchQuizNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default QuizSlice.reducer;