import axios from "axios";

const notificationWorkerUrl = import.meta.env.VITE_NOTIFICATION_WORKER_URL;

export async function sendNotification({
  userId,
  title,
  message,
  targetPath = "/",
}) {
  if (!notificationWorkerUrl) {
    throw new Error("VITE_NOTIFICATION_WORKER_URL is not configured.");
  }

  if (!userId || !title || !message) {
    throw new Error("userId, title, and message are required.");
  }

  const response = await axios.post(notificationWorkerUrl, {
    userId,
    title,
    message,
    targetPath,
  });

  return response.data;
}