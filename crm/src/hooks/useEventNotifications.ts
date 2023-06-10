import { useContext, useEffect } from "react";
import useTranslate from "./useTranslate";
import { AlertContext } from "../context/AlertContextProvider";
import { Event } from "../pages/CalendarPage/CalendarPage";

//сделал как хук, потому что только в App заюзаю
const useEventNotifications = (calendarEvents: Event[]) => {
  const { showAlert } = useContext(AlertContext);
  const { t } = useTranslate();

  const getTimeUntilEvent = (event: Event) => {
    const diff = event.start.getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds };
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      calendarEvents.forEach((event) => {
        const { hours, minutes, seconds } = getTimeUntilEvent(event);
        if (hours === 23 && minutes === 59 && seconds === 59) {
          showAlert(
            `Event "${event.title}" ${t("is_tomorrow")}`,
            "info",
            undefined,
            true
          );
        } else if (minutes === 14 && seconds === 59) {
          showAlert(
            `Event "${event.title}" ${t("in_15_minutes")}`,
            "info",
            undefined,
            true
          );
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [calendarEvents, showAlert, t]);
};

export default useEventNotifications;
