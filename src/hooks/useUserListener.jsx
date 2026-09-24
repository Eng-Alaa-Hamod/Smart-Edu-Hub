import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { logoutUser, updateUserState } from "@/store/slices/userSlice";

export function useUserListener() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user?.uid);

  useEffect(() => {
    if (!userId) return undefined;

    let isLoggingOut = false;
    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const userData = snapshot.data();
      dispatch(updateUserState(userData));

      if (userData.isDisable && !isLoggingOut) {
        isLoggingOut = true;
        dispatch(logoutUser());
      }
    });

    return () => unsubscribe();
  }, [userId, dispatch]);
}