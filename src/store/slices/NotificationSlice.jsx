import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const getNotificationsRef = (userId) =>
  collection(db, "users", userId, "notifications");

const serializeNotification = (docSnap) => {
  const notification = docSnap.data();

  return {
    id: docSnap.id,
    ...notification,
    createdAt: notification.createdAt?.toDate
      ? notification.createdAt.toDate().toISOString()
      : notification.createdAt || null,
  };
};

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (!userId) return rejectWithValue("A user ID is required.");

      const notificationsQuery = query(
        getNotificationsRef(userId),
        orderBy("createdAt", "desc"),
        limit(10),
      );
      const querySnapshot = await getDocs(notificationsQuery);

      return querySnapshot.docs.map(serializeNotification);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const saveNotification = createAsyncThunk(
  "notification/saveNotification",
  async (
    {
      userId,
      title,
      message,
      type = "general",
      relatedId = null,
      targetPath = "/",
    },
    { rejectWithValue },
  ) => {
    try {
      if (!userId || !title || !message) {
        return rejectWithValue("userId, title, and message are required.");
      }

      const notification = {
        title,
        message,
        type,
        relatedId,
        targetPath,
        read: false,
        createdAt: serverTimestamp(),
      };
      const notificationRef = await addDoc(
        getNotificationsRef(userId),
        notification,
      );

      return {
        id: notificationRef.id,
        ...notification,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async ({ userId, notificationId }, { rejectWithValue }) => {
    try {
      if (!userId || !notificationId) {
        return rejectWithValue("userId and notificationId are required.");
      }

      await updateDoc(
        doc(db, "users", userId, "notifications", notificationId),
        { read: true, readAt: serverTimestamp() },
      );

      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (!userId) return rejectWithValue("A user ID is required.");

      const unreadQuery = query(
        getNotificationsRef(userId),
        where("read", "==", false),
      );
      const querySnapshot = await getDocs(unreadQuery);
      const notificationIds = querySnapshot.docs.map((item) => item.id);

      for (const item of querySnapshot.docs) {
        await updateDoc(item.ref, {
          read: true,
          readAt: serverTimestamp(),
        });
      }

      return notificationIds;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async ({ userId, notificationId }, { rejectWithValue }) => {
    try {
      if (!userId || !notificationId) {
        return rejectWithValue("userId and notificationId are required.");
      }

      await deleteDoc(
        doc(db, "users", userId, "notifications", notificationId),
      );
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteAllNotifications = createAsyncThunk(
  "notification/deleteAllNotifications",
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (!userId) return rejectWithValue("A user ID is required.");

      const querySnapshot = await getDocs(getNotificationsRef(userId));
      const notificationIds = querySnapshot.docs.map((item) => item.id);

      for (const item of querySnapshot.docs) {
        await deleteDoc(item.ref);
      }

      return notificationIds;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift(action.payload);
      })
      .addCase(saveNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (item) => item.id === action.payload,
        );
        if (notification) notification.read = true;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        const notificationIds = new Set(action.payload);
        state.notifications.forEach((notification) => {
          if (notificationIds.has(notification.id)) notification.read = true;
        });
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload,
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = new Set(action.payload);
        state.notifications = state.notifications.filter(
          (notification) => !deletedIds.has(notification.id),
        );
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotifications, clearNotificationError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
