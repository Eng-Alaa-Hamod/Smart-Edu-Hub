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