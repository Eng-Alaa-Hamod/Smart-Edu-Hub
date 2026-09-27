import OneSignal from "react-onesignal";
import { useEffect, useRef } from "react";

export const OneSignalInit = ({ userId }) => {
    const oneSignalReady = useRef(null);

    useEffect(() => {
        if (!oneSignalReady.current) {
            oneSignalReady.current = OneSignal.init({
                appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
                safari_web_id: import.meta.env.VITE_ONESIGNAL_SAFARI_WEB_ID,
                allowLocalhostAsSecureOrigin: true,
                notifyButton: {
                    enable: true,
                    size: "medium",
                    position: "bottom-right",
                    offset: {
                        bottom: "24px",
                        right: "24px",
                    },
                    showCredit: false,
                    colors: {
                        "circle.background": "#16a34a",
                        "circle.foreground": "#ffffff",
                        "badge.background": "#16a34a",
                        "badge.foreground": "#ffffff",
                        "badge.bordercolor": "#ffffff",
                        "pulse.color": "#16a34a",
                        "dialog.button.background": "#16a34a",
                        "dialog.button.background.hovering": "#15803d",
                        "dialog.button.background.active": "#166534",
                        "dialog.button.foreground": "#ffffff",
                    },
                    displayPredicate: () => !OneSignal.User.PushSubscription.optedIn,
                    text: {
                        "launcher.button.aria-label": "Subscribe to notifications",
                    },
                },
            });
        }
    }, []);

    useEffect(() => {
        const syncUser = async () => {
            await oneSignalReady.current;

            if (userId) {
                await OneSignal.login(userId);
            } else {
                await OneSignal.logout();
            }
        };

        syncUser().catch((error) => {
            console.error("OneSignal user sync failed:", error);
        });
    }, [userId]);

    return null;
};