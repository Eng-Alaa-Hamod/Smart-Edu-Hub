import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { saveNotification } from "@/store/slices/NotificationSlice";
import { sendNotification } from "@/functions/sendNotification";

export const fetchBooksForTeacher = createAsyncThunk(
  "BookSlice/fetchBooksForTeacher",
  async ({ teacherId }, { rejectWithValue }) => {
    try {
      const requestsRef = collection(db, "bookings");

      const q = query(requestsRef, where("teacherUID", "==", teacherId));
      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return requestsData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchBooksForStudent = createAsyncThunk(
  "BookSlice/fetchBooksForStudent",
  async ({ studentId }, { rejectWithValue }) => {
    try {
      const requestsRef = collection(db, "bookings");
      const q = query(requestsRef, where("studentId", "==", studentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAllBookLessons = createAsyncThunk(
  "BookSlice/fetchAllBookLessons",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      return querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const submitBookLesson = createAsyncThunk(
  "BookSlice/submitBookLesson",
  async (
    {
      teacherUID,
      teacherName,
      teacherEmail,
      teacherPhotoURL,
      studentId,
      studentName,
      studentEmail,
      date,
      startTime,
      endTime,
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      if (!teacherUID || !studentId || !date || !startTime || !endTime) {
        return rejectWithValue("Please complete the booking details.");
      }

      if (startTime >= endTime) {
        return rejectWithValue("End time must be after start time.");
      }

      const now = new Date();
      const bookingDate = new Date(date);
      const [hours, minutes] = startTime.split(":").map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);

      if (bookingDate < now) {
        return rejectWithValue("Start time must be in the future.");
      }

      const requestRef = collection(db, "bookings");

      const booking = {
        teacherUID,
        teacherName: teacherName || "Teacher",
        teacherEmail: teacherEmail || "",
        teacherPhotoURL: teacherPhotoURL || "",
        studentId,
        studentName: studentName || "Student",
        studentEmail: studentEmail || "",
        date: Timestamp.fromDate(new Date(date)),
        startTime,
        endTime,
        status: "pending",
        createdAt: Timestamp.now(),
      };

      const bookingRef = await addDoc(requestRef, booking);

      const notification = {
        userId: teacherUID,
        title: "New booking request",
        message: `${booking.studentName} sent you a booking request.`,
        type: "booking",
        relatedId: bookingRef.id,
        targetPath: "/teacher/dashboard/bookings",
      };

      try {
        await sendNotification(notification);
      } catch (notificationError) {
        console.error("Booking push notification failed:", notificationError);
      }

      try {
        await dispatch(saveNotification(notification)).unwrap();
      } catch (notificationError) {
        console.error("Booking notification save failed:", notificationError);
      }

      

      return { id: bookingRef.id, ...booking };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateBookLessonStatus = createAsyncThunk(
  "BookSlice/updateBookLessonStatus",
  async ({ bookingId, status }, { rejectWithValue, dispatch }) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      const bookingSnapshot = await getDoc(bookingRef);
      await updateDoc(bookingRef, { status });

      const booking = bookingSnapshot.exists() ? bookingSnapshot.data() : null;
      if (booking?.studentId && ["accepted", "rejected"].includes(status)) {
        const notification = {
          userId: booking.studentId,
          title: status === "accepted" ? "Booking accepted" : "Booking declined",
          message:
            status === "accepted"
              ? "Your booking request was accepted."
              : "Your booking request was declined.",
          type: "booking",
          relatedId: bookingId,
          targetPath: "/student/dashboard/my-bookings",
        };

        try {
          await sendNotification(notification);
        } catch (notificationError) {
          console.error("Booking status push notification failed:", notificationError);
        }

        try {
          await dispatch(saveNotification(notification)).unwrap();
        } catch (notificationError) {
          console.error("Booking status notification save failed:", notificationError);
        }

        
      }

      return { bookingId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteBookLesson = createAsyncThunk(
  "BookSlice/deleteBookLesson",
  async ({ bookingId }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  books: [],
  loading: false,
  error: null,
  submitted: false,
};

const bookLessonSlice = createSlice({
  name: "BookSlice",
  initialState,
  reducers: {
    clearBookLessonStatus: (state) => {
      state.error = null;
      state.submitted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksForTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksForTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooksForTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBooksForStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksForStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooksForStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllBookLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBookLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitBookLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitted = false;
      })
      .addCase(submitBookLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.submitted = true;
        state.books.push(action.payload);
      })
      .addCase(submitBookLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBookLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(deleteBookLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBookLessonStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookLessonStatus.fulfilled, (state, action) => {
        state.loading = false;
        const book = state.books.find((item) => item.id === action.payload.bookingId);
        if (book) book.status = action.payload.status;
      })
      .addCase(updateBookLessonStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookLessonStatus } = bookLessonSlice.actions;
export default bookLessonSlice.reducer;
