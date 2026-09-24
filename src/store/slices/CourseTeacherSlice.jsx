import { db } from "@/firebase/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  setDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { deleteFileByUrl } from "@/supabase/functions/functions";

export const fetchCourseTeacher = createAsyncThunk(
  "courseTeacher/fetchCourseTeacher",
  async (teacherId, { rejectWithValue }) => {
    try {
      const coursesRef = collection(db, "courses");
      const q = query(coursesRef, where("teacherId", "==", teacherId));
      const querySnapshot = await getDocs(q);
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return coursesData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addCourseTeacher = createAsyncThunk(
  "courseTeacher/addCourseTeacher",
  async (
    { teacherId, teacherName, teacherPhotoURL, title, description, coverUrl },
    { rejectWithValue },
  ) => {
    try {
      const coursesRef = collection(db, "courses");
      const newCourseData = {
        teacherId,
        teacherName,
        teacherPhotoURL: teacherPhotoURL || "",
        title,
        description: description || "",
        coverUrl: coverUrl || "",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(coursesRef, newCourseData);

      return {
        id: docRef.id,
        ...newCourseData,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCourseTeacher = createAsyncThunk(
  "courseTeacher/deleteCourseTeacher",
  async (courseId, { rejectWithValue }) => {
    try {
      const courseDocRef = doc(db, "courses", courseId);
      await deleteDoc(courseDocRef);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCourseWithLessons = createAsyncThunk(
  "courseTeacher/deleteCourseWithLessons",
  async ({ courseId, coverUrl }, { rejectWithValue }) => {
    try {
      const lessons = await getDocs(collection(db, "courses", courseId, "lessons"));
      await Promise.all(lessons.docs.map(async (lesson) => {
        await deleteFileByUrl(lesson.data().pdfUrl);
        await deleteDoc(lesson.ref);
      }));
      await deleteFileByUrl(coverUrl);
      await deleteDoc(doc(db, "courses", courseId));
      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const saveCountOfCourses = createAsyncThunk(
  "courseTeacherSlice/saveCountOfCourses",
  async({ count , teacherName , teacherID },{rejectWithValue}) => {
    const countRef = doc(db, "courseCount", teacherID);
    try {
      await setDoc(countRef, { count , teacherName , teacherID });
      return { count , teacherName , teacherID };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

const initialState = {
  courseTeacher: [],
  courseCount: null,
  loading: false,
  deletingCourseId: null,
  error: null,
};

const courseTeacherSlice = createSlice({
  name: "courseTeacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCourseTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.courseTeacher = action.payload;
      })
      .addCase(fetchCourseTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addCourseTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourseTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.courseTeacher.push(action.payload);
      })
      .addCase(addCourseTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(saveCountOfCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCountOfCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courseCount = action.payload;
      })
      .addCase(saveCountOfCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteCourseTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourseTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.courseTeacher = state.courseTeacher.filter(
          (ct) => ct.id !== action.payload,
        );
      })
      .addCase(deleteCourseTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteCourseWithLessons.pending, (state, action) => {
        state.loading = true;
        state.deletingCourseId = action.meta.arg.courseId;
        state.error = null;
      })
      .addCase(deleteCourseWithLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.deletingCourseId = null;
        state.courseTeacher = state.courseTeacher.filter(
          (course) => course.id !== action.payload,
        );
      })
      .addCase(deleteCourseWithLessons.rejected, (state, action) => {
        state.loading = false;
        state.deletingCourseId = null;
        state.error = action.payload || action.error.message;
      });
  },
});

export default courseTeacherSlice.reducer;
