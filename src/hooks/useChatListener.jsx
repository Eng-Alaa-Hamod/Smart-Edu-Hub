import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  endBefore,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { setError, setMessages } from "@/store/slices/ChatSlice";

export function useChatListener(chatId) {
  const dispatch = useDispatch();
  const currentMessages = useSelector((state) => state.chat.messages);
  const [firstDoc, setFirstDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFirstDoc(null);
    setHasMore(true);
    setLoadingMore(false);
    dispatch(setMessages([]));

    if (!chatId) {
      return undefined;
    }

    let isActive = true;

    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc"),
      limitToLast(25),
    );

    dispatch(setError(null));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        if (!isActive) return;

        if (!snapshot.empty) {
          setFirstDoc(snapshot.docs[0]);
        }

        const messages = snapshot.docs.map((message) => {
          const data = message.data();

          return {
            id: message.id,
            ...data,
            timestamp: data.timestamp?.toDate?.()?.toISOString() ?? null,
          };
        });

        dispatch(setMessages(messages));
      },
      (error) => {
        if (!isActive) return;
        dispatch(setError(error.message));
      },
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [chatId, dispatch]);

  const fetchMoreMessages = async () => {
    if (!chatId || !firstDoc || loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const olderMessagesQuery = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc"),
        endBefore(firstDoc),
        limitToLast(10),
      );

      const snapshot = await getDocs(olderMessagesQuery);
      if (snapshot.empty) {
        setHasMore(false);
      } else {
        setFirstDoc(snapshot.docs[0]);

        const olderMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.()?.toISOString() ?? null,
        }));

        dispatch(setMessages([...olderMessages, ...currentMessages]));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setLoadingMore(false);
    }
  };

  return { fetchMoreMessages, hasMore, loadingMore };
}
