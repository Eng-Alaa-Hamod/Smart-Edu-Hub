import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";

import { auth, db } from "../../firebase/firebase";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  setDoc,
  where,
} from "firebase/firestore";

import { normalizeCreatedAt } from "../../functions/normalizeCreateat";

const initialState = {
  user: null,
  countReports: 0,
  canSend: true,
  isDisable: false,
  loadingLogin: false,
  errorLogin: null,
  loadingSignUp: false,
  errorSignUp: null,
  loadingLogout: false,
  errorLogout: null,
  loadingResetPassword: false,
  errorResetPassword: null,
  resetPasswordMessage: null,
  loadingEmailVerification: false,
  errorEmailVerification: null,
  emailVerificationMessage: null,
  loadingVerificationRefresh: false,
  loadingChangePassword: false,
  errorChangePassword: null,
  changePasswordMessage: null,
  loadingUpdateProfile: false,
  errorUpdateProfile: null,
};

export const SignUp = createAsyncThunk(
  "userSlice/SignUp",
  async (
    { email, password, firstName, secondName, role },
    { rejectWithValue },
  ) => {
    let createdUser = null;
    try {
      if (!["student", "teacher"].includes(role)) {
        return rejectWithValue(
          "Please choose whether you are a student or teacher.",
        );
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      createdUser = user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        secondName,
        email: user.email,
        role,
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(user);

      return {
        uid: user.uid,
        email: user.email,
        firstName,
        secondName,
        role,
        createdAt: normalizeCreatedAt(new Date()),
        emailVerified: false,
      };
    } catch (error) {
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch (cleanupError) {
          console.error("Error occurred while cleaning up user:", cleanupError);
        }
      }
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const resendEmailVerification = createAsyncThunk(
  "userSlice/resendEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        return rejectWithValue("Please log in again to verify your email.");
      }
      await sendEmailVerification(auth.currentUser);
      return "Verification email sent. Check your inbox.";
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const refreshEmailVerification = createAsyncThunk(
  "userSlice/refreshEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) {
        return rejectWithValue("Please log in again to check verification.");
      }
      await auth.currentUser.reload();
      const token = await auth.currentUser.getIdToken(true);

      return { emailVerified: auth.currentUser.emailVerified, token };
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  "userSlice/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const { user } = credentials;

      await user.reload();

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await signOut(auth);
        return rejectWithValue(
          "Please verify your email address before logging in.",
        );
      }

      const userSnapshot = await getDoc(doc(db, "users", user.uid));
      const userData = userSnapshot.exists() ? userSnapshot.data() : {};
      if (userData.isDisable) {
        await signOut(auth);
        return rejectWithValue("Account banned.");
      }

      return {
        ...userData,
        uid: user.uid,
        email: user.email,
        createdAt: normalizeCreatedAt(userData.createdAt),
        emailVerified: user.emailVerified,
        token: await user.getIdToken(),
      };
    } catch (error) {
      if (error?.code === "auth/invalid-credential") {
        const userSnapshot = await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", email.trim().toLowerCase()),
          ),
        );

        if (userSnapshot.empty) {
          return rejectWithValue("This account does not exist.");
        }
      }

      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "userSlice/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const resetPassword = createAsyncThunk(
  "userSlice/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const userSnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", normalizedEmail)),
      );

      if (userSnapshot.empty) {
        return rejectWithValue("This account does not exist.");
      }

      await sendPasswordResetEmail(auth, normalizedEmail);
      return "Password reset link sent! Check your inbox.";
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const changePassword = createAsyncThunk(
  "userSlice/changePassword",
  async (password, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) return rejectWithValue("Please log in again.");
      await updatePassword(auth.currentUser, password);
      return "Password changed successfully.";
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const reportUser = createAsyncThunk(
  "userSlice/reportUser",
  async (userId, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);

      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(userRef);
        if (!snapshot.exists()) {
          throw new Error("User not found.");
        }

        const countReports = Number(snapshot.data().countReports) || 0;
        const nextCount = countReports + 1;

        transaction.update(userRef, {
          countReports: nextCount,
          canSend: nextCount < 5,
          isDisable: nextCount >= 10,
        });
      });

      return userId;
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "userSlice/updateUserProfile",
  async ({ firstName, secondName, email, CV, photoURL }, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid; 
      if (!userId) return rejectWithValue("User not authenticated.");

      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (secondName !== undefined) updateData.secondName = secondName;
      if (email !== undefined) updateData.email = email;
      if (CV !== undefined) updateData.CV = CV;
      if (photoURL !== undefined) updateData.photoURL = photoURL;

      await updateDoc(doc(db, "users", userId), updateData);
      return updateData;
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  }
);

function getFirebaseErrorMessage(error) {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  const messages = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/missing-password": "Please enter your password.",
    "auth/user-not-found": "This account does not exist.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests":
      "Too many attempts. Please wait a while and try again.",
    "auth/network-request-failed":
      "Network error. Check your internet connection and try again.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/operation-not-allowed":
      "This sign-in method is currently unavailable.",
    "auth/api-key-not-valid":
      "Firebase configuration is invalid. Please provide a valid Firebase API key.",
    "auth/requires-recent-login":
      "Please sign in again before repeating this action.",
    "auth/email-not-verified":
      "Please verify your email address before continuing.",
    "permission-denied": "You do not have permission to complete this action.",
    unauthenticated: "Your session has expired. Please sign in again.",
    "not-found": "The requested account data could not be found.",
    "failed-precondition":
      "This action is temporarily unavailable. Please try again later.",
  };

  const code = error?.code;
  if (code && messages[code]) {
    return messages[code];
  }

  return "Something went wrong. Please try again.";
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    updateUserState: (state, action) => {
      state.countReports = action.payload.countReports ?? 0;
      state.canSend = action.payload.canSend ?? true;
      state.isDisable = action.payload.isDisable ?? false;

      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuthMessages: (state) => {
      state.errorLogin = null;
      state.errorSignUp = null;
      state.errorLogout = null;
      state.errorResetPassword = null;
      state.resetPasswordMessage = null;
      state.errorEmailVerification = null;
      state.emailVerificationMessage = null;
      state.errorChangePassword = null;
      state.changePasswordMessage = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.countReports = 0;
      state.canSend = true;
      state.isDisable = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignUp.pending, (state) => {
        state.loadingSignUp = true;
        state.errorSignUp = null;
        state.errorLogin = null;
      })
      .addCase(SignUp.rejected, (state, action) => {
        state.loadingSignUp = false;
        state.errorSignUp =
          action.payload || getFirebaseErrorMessage(action.error);
      })
      .addCase(SignUp.fulfilled, (state, action) => {
        state.loadingSignUp = false;
        state.user = action.payload;
        state.countReports = action.payload.countReports || 0;
        state.canSend = action.payload.canSend ?? true;
        state.isDisable = action.payload.isDisable ?? false;
        state.errorSignUp = null;
      })

      .addCase(loginUser.pending, (state) => {
        state.loadingLogin = true;
        state.errorLogin = null;
        state.errorSignUp = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingLogin = false;
        state.errorLogin =
          action.payload || getFirebaseErrorMessage(action.error);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingLogin = false;
        state.user = action.payload;
        state.countReports = action.payload.countReports || 0;
        state.canSend = action.payload.canSend ?? true;
        state.isDisable = action.payload.isDisable ?? false;
        state.errorLogin = null;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loadingLogout = true;
        state.errorLogout = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loadingLogout = false;
        state.errorLogout =
          action.payload || getFirebaseErrorMessage(action.error);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.countReports = 0;
        state.canSend = true;
        state.isDisable = false;
        state.loadingLogout = false;
        state.errorLogout = null;
        state.errorLogin = null;
        state.errorSignUp = null;
        state.loadingEmailVerification = false;
        state.errorEmailVerification = null;
        state.emailVerificationMessage = null;
        state.errorChangePassword = null;
        state.changePasswordMessage = null;
      })

      .addCase(resendEmailVerification.pending, (state) => {
        state.loadingEmailVerification = true;
        state.errorEmailVerification = null;
        state.emailVerificationMessage = null;
      })
      .addCase(resendEmailVerification.fulfilled, (state, action) => {
        state.loadingEmailVerification = false;
        state.emailVerificationMessage = action.payload;
      })
      .addCase(resendEmailVerification.rejected, (state, action) => {
        state.loadingEmailVerification = false;
        state.errorEmailVerification =
          action.payload || getFirebaseErrorMessage(action.error);
      })
      .addCase(refreshEmailVerification.pending, (state) => {
        state.loadingVerificationRefresh = true;
        state.errorEmailVerification = null;
        state.emailVerificationMessage = null;
      })
      .addCase(refreshEmailVerification.fulfilled, (state, action) => {
        state.loadingVerificationRefresh = false;
        if (state.user) {
          state.user.emailVerified = action.payload.emailVerified;
          state.user.token = action.payload.token;
        }
        state.emailVerificationMessage = action.payload.emailVerified
          ? "Email verified successfully."
          : "Email is not verified yet. Open the link from your inbox first.";
      })
      .addCase(refreshEmailVerification.rejected, (state, action) => {
        state.loadingVerificationRefresh = false;
        state.errorEmailVerification =
          action.payload || getFirebaseErrorMessage(action.error);
      })
      .addCase(resetPassword.pending, (state) => {
        state.loadingResetPassword = true;
        state.errorResetPassword = null;
        state.resetPasswordMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loadingResetPassword = false;
        state.resetPasswordMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loadingResetPassword = false;
        state.errorResetPassword =
          action.payload || getFirebaseErrorMessage(action.error);
      })
      .addCase(changePassword.pending, (state) => {
        state.loadingChangePassword = true;
        state.errorChangePassword = null;
        state.changePasswordMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loadingChangePassword = false;
        state.changePasswordMessage = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loadingChangePassword = false;
        state.errorChangePassword =
          action.payload || getFirebaseErrorMessage(action.error);
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loadingUpdateProfile = true;
        state.errorUpdateProfile = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loadingUpdateProfile = false;

        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loadingUpdateProfile = false;
        state.errorUpdateProfile =
          action.payload || getFirebaseErrorMessage(action.error);
      });
  },
});

export const {
  clearAuthMessages,
  clearUser,
  updateUserState,
} = userSlice.actions;
export default userSlice.reducer;
