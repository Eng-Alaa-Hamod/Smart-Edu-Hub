import { db } from "@/firebase/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const getFirestoreError = (error, fallbackMessage) =>
  error?.message || fallbackMessage;

export const fetchAllCourses = createAsyncThunk(
  "courseStudent/fetchAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const courses = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return courses;
    } catch (error) {
      return rejectWithValue(getFirestoreError(error, "Unable to load courses."));
    }
  },
);

export const enrollInCourse = createAsyncThunk(
  "courseStudent/enrollInCourse",
  async ({ studentId, courseId }, { rejectWithValue }) => {
    try {
      const enrollmentsRef = collection(db, "enrollments");

      const q = query(
        enrollmentsRef,
        where("studentId", "==", studentId),
        where("courseId", "==", courseId),
      );

      const existing = await getDocs(q);
      if (!existing.empty) {
        return rejectWithValue("You are already enrolled in this course.");
      }

      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (!courseDoc.exists()) {
        return rejectWithValue("Course not found.");
      }

      const newEnrollment = {
        studentId,
        courseId,
        enrolledAt: serverTimestamp(),
      };

      const docRef = await addDoc(enrollmentsRef, newEnrollment);
      return {
        enrollmentId: docRef.id,
        id: courseDoc.id,
        ...courseDoc.data(),
      };
    } catch (error) {
      return rejectWithValue(getFirestoreError(error, "Unable to enroll in this course."));
    }
  },
);

export const fetchEnrolledCourses = createAsyncThunk(
  "courseStudent/fetchEnrolledCourses",
  async (studentId, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "enrollments"),
        where("studentId", "==", studentId),
      );
      const querySnapshot = await getDocs(q);

      const coursePromises = querySnapshot.docs.map(async (docSnap) => {
        const enrollmentData = docSnap.data();
        const courseDoc = await getDoc(
          doc(db, "courses", enrollmentData.courseId),
        );
        return courseDoc.exists()
          ? {
              enrollmentId: docSnap.id,
              id: courseDoc.id,
              ...courseDoc.data(),
            }
          : null;
      });

      const enrolledCourses = await Promise.all(coursePromises);
      return enrolledCourses.filter(Boolean);
    } catch (error) {
      return rejectWithValue(getFirestoreError(error, "Unable to load enrolled courses."));
    }
  },
);

export const unenrollFromCourse = createAsyncThunk(
  "courseStudent/unenrollFromCourse",
  async ({ studentId, courseId }, { rejectWithValue }) => {
    try {
      const enrollmentsRef = collection(db, "enrollments");
      const q = query(
        enrollmentsRef,
        where("studentId", "==", studentId),
        where("courseId", "==", courseId),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return rejectWithValue("Enrollment record not found.");
      }

      await deleteDoc(doc(db, "enrollments", querySnapshot.docs[0].id));

      return courseId;
    } catch (error) {
      return rejectWithValue(getFirestoreError(error, "Unable to unenroll from this course."));
    }
  },
);



const courseStudentSlice = createSlice({
  name: "courseStudent",
  initialState: {
    allCourses: [],
    enrolledCourses: [],
    loading: false,
    enrolling: false,
    enrollingCourseId: null,
    unenrollingCourseId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.allCourses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(enrollInCourse.pending, (state, action) => {
        state.enrolling = true;
        state.enrollingCourseId = action.meta.arg.courseId;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.enrolling = false;
        state.enrollingCourseId = null;
        state.enrolledCourses.push(action.payload);
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.enrolling = false;
        state.enrollingCourseId = null;
        state.error = action.payload;
      })

      .addCase(unenrollFromCourse.pending, (state, action) => {
        state.loading = true;
        state.unenrollingCourseId = action.meta.arg.courseId;
        state.error = null;
      })
      .addCase(unenrollFromCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.unenrollingCourseId = null;
        state.enrolledCourses = state.enrolledCourses.filter(
          (course) => course.id !== action.payload,
        );
      })
      .addCase(unenrollFromCourse.rejected, (state, action) => {
        state.loading = false;
        state.unenrollingCourseId = null;
        state.error = action.payload;
      });
  },
});

export default courseStudentSlice.reducer;
