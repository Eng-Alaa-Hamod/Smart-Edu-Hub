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

import {
  deleteFileByUrl,
  uploadFile,
  uploadLibraryImage,
} from "@/supabase/functions/functions";

export const fetchLibraryPdfs = createAsyncThunk(
  "library/fetchLibraryPdfs",
  async (_, { rejectWithValue }) => {
    try {
      const libraryRef = collection(db, "library");
      const q = query(libraryRef, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const libraryData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return libraryData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);



export const AddLibraryPdf = createAsyncThunk(
  "library/AddLibraryPdf",
  async (
    { title, description, file, imageFile, userId },
    { rejectWithValue }
  ) => {
    try {
      const pdfUrl = await uploadFile(file, userId);
      const imageUrl = await uploadLibraryImage(imageFile, userId);
      const libraryRef = collection(db,"library");
      const libraryData = {
        title,
        description: description || "",
        pdfUrl,
        imageUrl,
        userId,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(libraryRef, libraryData);

      return {
        id: docRef.id,
        ...libraryData,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePdf = createAsyncThunk(
  "library/deletePdf",
  async ({ pdfId }, { rejectWithValue }) => {
    try {
      const pdfRef = doc(db, "library", pdfId);
      const pdfData = (await getDoc(pdfRef)).data();
      await deleteFileByUrl(pdfData?.pdfUrl);
      await deleteFileByUrl(pdfData?.imageUrl);
      await deleteDoc(pdfRef);
      return pdfId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  lessons: [],
  loading: false,
  uploading: false,
  deletingPdfId: null,
  error: null,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    clearLibrary: (state) => {
      state.lessons = [];
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchLibraryPdfs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibraryPdfs.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLibraryPdfs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      
      .addCase(AddLibraryPdf.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(AddLibraryPdf.fulfilled, (state, action) => {
        state.uploading = false;
        state.lessons.push(action.payload);
      })
      .addCase(AddLibraryPdf.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || action.error.message;
      })

      
      .addCase(deletePdf.fulfilled, (state, action) => {
        state.deletingPdfId = null;
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id !== action.payload
        );
      })
      .addCase(deletePdf.pending, (state, action) => {
        state.deletingPdfId = action.meta.arg.pdfId;
        state.error = null;
      })
      .addCase(deletePdf.rejected, (state, action) => {
        state.deletingPdfId = null;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearLibrary } = librarySlice.actions;
export default librarySlice.reducer;