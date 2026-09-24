import { db } from "@/firebase/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export const fetchChatData = createAsyncThunk(
  "chat/fetchChatData",
  async (chatId, { rejectWithValue }) => {
    try {
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      return chatDoc.exists() ? chatDoc.data() : {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { chatId, message, senderId, senderName, senderAvatarUrl },
    { rejectWithValue },
  ) => {
    try {
      const senderSnapshot = await getDoc(doc(db, "users", senderId));
      const senderData = senderSnapshot.exists() ? senderSnapshot.data() : {};
      const avatarUrl = senderAvatarUrl || senderData.photoURL || null;

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: message,
        senderId,
        senderName,
        senderAvatarUrl: avatarUrl,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async ({ chatId, messageId }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "chats", chatId, "messages", messageId));
      return messageId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const toggleChatInput = createAsyncThunk(
  "chat/toggleChatInput",
  async (chatId, { rejectWithValue }) => {
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatSnapshot = await getDoc(chatRef);
      const inputDisabled = chatSnapshot.data()?.inputDisabled ?? false;
      await setDoc(chatRef, { inputDisabled: !inputDisabled }, { merge: true });
      return !inputDisabled;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatData: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.chatData = null;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.loading = false;
        state.chatData = action.payload;
      })
      .addCase(toggleChatInput.fulfilled, (state, action) => {
        state.chatData = { ...(state.chatData || {}), inputDisabled: action.payload };
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { setMessages, setError } = chatSlice.actions;
export default chatSlice.reducer;
