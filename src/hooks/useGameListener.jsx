import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/firebase/firebase";
import { setGameError, setRoom, setRoomDeleted } from "@/store/slices/GameSlice";

export function useGameListener(pin) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRoom(null));
    dispatch(setRoomDeleted(false));
    dispatch(setGameError(null));

    if (!pin) return undefined;

    const gameRef = ref(rtdb, `games/${pin}`);

    const unsubscribe = onValue(
      gameRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          dispatch(setRoomDeleted(true));
          return;
        }

        dispatch(setRoomDeleted(false));
        dispatch(setRoom(snapshot.val()));
      },
      (error) => {
        dispatch(setGameError(error.message));
      },
    );

    return () => unsubscribe();
  }, [pin, dispatch]);
}