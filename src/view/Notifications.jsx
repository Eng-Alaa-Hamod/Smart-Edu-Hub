import { useEffect } from "react";
import {
	Bell,
	BellRing,
	Check,
	CheckCheck,
	ExternalLink,
	Inbox,
	Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";
import { SpinnerCustom } from "@/components/ui/spinner";
import {
	deleteAllNotifications,
	deleteNotification,
	fetchNotifications,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "@/store/slices/NotificationSlice";

function Notifications() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.user.user);
	const { notifications, loading, error } = useSelector(
		(state) => state.notification,
	);
	const unreadCount = notifications.filter((notification) => !notification.read).length;
	const dashboardPath = `/${user?.role}/dashboard`;

	useEffect(() => {
		if (user?.uid) {
			dispatch(fetchNotifications({ userId: user.uid }));
		}
	}, [dispatch, user?.uid]);

	const handleOpenNotification = async (notification) => {
		if (!notification.read) {
			await dispatch(
				markNotificationAsRead({
					userId: user.uid,
					notificationId: notification.id,
				}),
			);
		}

		const targetPath = notification.targetPath;
		navigate(targetPath?.startsWith("/") ? targetPath : dashboardPath);
	};

	const formatDate = (value) => {
		if (!value) return "Just now";
		const date = new Date(value);
		return !isValid(date)
			? "Date unavailable"
			: format(date, "PPpp");
	};

	return (
		<main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-5xl space-y-6">
				<header className="rounded-3xl bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
					<p className="flex items-center gap-2 text-sm font-medium text-sky-100">
						<BellRing className="h-4 w-4" />
						{user?.role === "admin"
							? "Admin Area"
							: user?.role === "teacher"
								? "Teacher Area"
								: "Student Area"}
					</p>
					<div className="mt-2 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold">Notifications</h1>
							<p className="mt-2 text-sm text-white/85">
								{unreadCount
									? `${unreadCount} unread in your latest notifications`
									: "You are all caught up."}
							</p>
						</div>
						<span className="rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold text-white">
							{notifications.length} latest
						</span>
					</div>
				</header>

				<section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
						<div>
							<h2 className="font-semibold text-slate-800">Recent activity</h2>
							<p className="mt-1 text-sm text-slate-500">
								Showing up to 10 notifications.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={!unreadCount || loading}
								onClick={() =>
									dispatch(markAllNotificationsAsRead({ userId: user.uid }))
								}
							>
								<CheckCheck />
								Mark all read
							</Button>
							<ConfirmDialog
								trigger={
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled={!notifications.length || loading}
										className="border-rose-200 text-rose-700 hover:bg-rose-50"
									>
										<Trash2 />
										Delete all
									</Button>
								}
								title="Delete all notifications?"
								description="This removes all of your notifications, not only the 10 shown here. This action cannot be undone."
								confirmText="Delete all"
								cancelText="Cancel"
								confirmVariant="destructive"
								onConfirm={() =>
									dispatch(deleteAllNotifications({ userId: user.uid }))
								}
							/>
						</div>
					</div>

					{loading && !notifications.length && (
						<div className="p-8">
							<SpinnerCustom />
						</div>
					)}
					{error && (
						<p className="m-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
							{error}
						</p>
					)}
					{!loading && !error && !notifications.length && (
						<div className="flex flex-col items-center px-6 py-14 text-center">
							<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
								<Inbox className="h-7 w-7" />
							</span>
							<h3 className="mt-4 font-semibold text-slate-800">
								No notifications yet
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								New updates will appear here.
							</p>
						</div>
					)}

					{!!notifications.length && (
						<div className="divide-y divide-slate-100">
							{notifications.map((notification) => (
								<article
									key={notification.id}
									className={`flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 ${
										notification.read ? "bg-white" : "bg-sky-50/60"
									}`}
								>
									<div className="flex min-w-0 gap-3">
										<span
											className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
												notification.read
													? "bg-slate-100 text-slate-500"
													: "bg-sky-100 text-sky-700"
											}`}
										>
											<Bell className="h-5 w-5" />
										</span>
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-2">
												<h3 className="font-semibold text-slate-800">
													{notification.title}
												</h3>
												{!notification.read && (
													<span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
														New
													</span>
												)}
											</div>
											<p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
												{notification.message}
											</p>
											<p className="mt-2 text-xs text-slate-400">
												{formatDate(notification.createdAt)}
											</p>
										</div>
									</div>

									<div className="flex shrink-0 items-center gap-2 pl-[3.25rem] sm:pl-0">
										{!notification.read && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												title="Mark as read"
												onClick={() =>
													dispatch(
														markNotificationAsRead({
															userId: user.uid,
															notificationId: notification.id,
														}),
													)
												}
											>
												<Check />
												<span className="hidden sm:inline">Read</span>
											</Button>
										)}
										<Button
											type="button"
											variant="outline"
											size="sm"
											title="Open notification"
											onClick={() => handleOpenNotification(notification)}
										>
											<ExternalLink />
											<span className="hidden sm:inline">Open</span>
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											title="Delete notification"
											aria-label="Delete notification"
											className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
											onClick={() =>
												dispatch(
													deleteNotification({
														userId: user.uid,
														notificationId: notification.id,
													}),
												)
											}
										>
											<Trash2 />
										</Button>
									</div>
								</article>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}

export default Notifications;
