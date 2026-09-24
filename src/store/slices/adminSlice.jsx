/* some action create in another slice */

import { db } from "@/firebase/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const usersRef = collection(db, "users");

      const querySnapshot = await getDocs(usersRef);

      const users = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAllCourses = createAsyncThunk(
  "admin/fetchAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, "courses"));
      return snapshot.docs.map((courseDoc) => ({
        id: courseDoc.id,
        ...courseDoc.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchStudentAchievements = createAsyncThunk(
  "admin/fetchStudentAchievements",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, "playerAchievements"));
      return snapshot.docs.map((achievementDoc) => ({
        id: achievementDoc.id,
        ...achievementDoc.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changeUserRole = createAsyncThunk(
  "admin/changeUserRole",
  async ({ userId, newRole }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      return { userId, newRole };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changeUserCanSendMessageStatus = createAsyncThunk(
  "admin/changeUserCanSendMessageStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const canSend = userDoc.data().canSend;
      await updateDoc(userRef, { canSend: !canSend });
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changeUserDisableStatus = createAsyncThunk(
  "admin/changeUserDisableStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const isDisable = userDoc.data().isDisable;
      await updateDoc(userRef, { isDisable: !isDisable });
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchNameCourseById = createAsyncThunk(
  "admin/fetchNameCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const courseRef = doc(db, "courses", courseId);
      const courseDoc = await getDoc(courseRef);

      if (!courseDoc.exists()) {
        return rejectWithValue("Course not found");
      }

      return courseDoc.data().title;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchTeacherCoursesCount = createAsyncThunk(
  "admin/fetchTeacherCoursesCount",
  async (teacherId, { rejectWithValue }) => {
    try {
      const ref = collection(db, "courseCount");
      const snapshot = await getDocs(ref);
      return snapshot.docs.map((countDoc) => ({
        id: countDoc.id,
        ...countDoc.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    courses: [],
    courseCounts: [],
    courseName: null,
    studentAchievements: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchStudentAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAchievements = action.payload;
      })
      .addCase(fetchStudentAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchNameCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNameCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.courseName = action.payload;
      })
      .addCase(fetchNameCourseById.rejected, (state, action) => {
        state.loading = false;
        state.courseName = null;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchTeacherCoursesCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCoursesCount.fulfilled, (state, action) => {
        state.loading = false;
        state.courseCounts = action.payload;
      })
      .addCase(fetchTeacherCoursesCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        const user = state.users.find(
          (user) => user.id === action.payload.userId,
        );

        if (user) user.role = action.payload.newRole;
      })
      .addCase(changeUserCanSendMessageStatus.fulfilled, (state, action) => {
        const user = state.users.find((user) => user.id === action.payload);

        if (user) user.canSend = !user.canSend;
      })
      .addCase(changeUserDisableStatus.fulfilled, (state, action) => {
        const user = state.users.find((user) => user.id === action.payload);

        if (user) user.isDisable = !user.isDisable;
      });
  },
});

export default adminSlice.reducer;