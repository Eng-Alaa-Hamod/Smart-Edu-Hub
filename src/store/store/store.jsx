import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userSlice from "../slices/userSlice";
import courseStudentSlice from "../slices/courseStudentSlice";
import courseTeacherSlice from "../slices/CourseTeacherSlice";
import lessonSlice from "../slices/LessonTeacherSlice";
import chatSlice from "../slices/ChatSlice";
import librarySlice from "../slices/LibraryPdfsFromStudentSlice";
import gameSlice from "../slices/GameSlice";
import QuizSlice from "../slices/QuizSlice";
import playerAchievementSlice from "../slices/PLayerSaveAchivementSlice";
import bookLessonSlice from "../slices/BookLessonSlice";
import adminSlice from "../slices/adminSlice";
import notificationSlice from "../slices/NotificationSlice";

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const rootReducer = combineReducers({
  user: userSlice,
  courseStudent: courseStudentSlice,
  courseTeacher: courseTeacherSlice,
  lessons: lessonSlice,
  chat: chatSlice,
  library: librarySlice,
  game: gameSlice,
  quiz: QuizSlice,
  playerAchievements: playerAchievementSlice,
  bookLesson: bookLessonSlice,
  admin: adminSlice,
  notification: notificationSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "lessons", "courseTeacher", "courseStudent"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(Store);
