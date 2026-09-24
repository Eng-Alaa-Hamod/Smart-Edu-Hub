import { db } from "@/firebase/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { deleteFileByUrl } from "@/supabase/functions/functions";

export const fetchLessonsByCourse = createAsyncThunk(
  "lessons/fetchLessonsByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const lessonsRef = collection(db, "courses", courseId, "lessons");
      const q = query(lessonsRef, orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return lessonsData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addLesson = createAsyncThunk(
  "lessons/addLesson",
  async (
    { courseId, title, description, order,pdfUrl },
    { rejectWithValue }
  ) => {
    try {

      const lessonsRef = collection(db, "courses", courseId, "lessons");
      const lessonData = {
        title,
        description: description || "",
        pdfUrl: pdfUrl || "",
        order: Number(order) || 1,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(lessonsRef, lessonData);

      return {
        id: docRef.id,
        ...lessonData,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "lessons/deleteLesson",
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);
      const lessonData = (await getDoc(lessonRef)).data();
      await deleteDoc(lessonRef);

      // The lesson record must not remain blocked by storage cleanup.
      try {
        await deleteFileByUrl(lessonData?.pdfUrl);
      } catch (storageError) {
        console.error("Lesson PDF cleanup failed:", storageError);
      }

      return lessonId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  lessons: [],
  loading: false,
  uploading: false,
  deletingLessonId: null,
  error: null,
};

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearLessons: (state) => {
      state.lessons = [];
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchLessonsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      
      .addCase(addLesson.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.uploading = false;
        state.lessons.push(action.payload);
        state.lessons.sort((a, b) => a.order - b.order);
      })
      .addCase(addLesson.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || action.error.message;
      })

      
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.deletingLessonId = null;
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id !== action.payload
        );
      })
      .addCase(deleteLesson.pending, (state, action) => {
        state.deletingLessonId = action.meta.arg.lessonId;
        state.error = null;
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.deletingLessonId = null;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearLessons } = lessonSlice.actions;
export default lessonSlice.reducer;