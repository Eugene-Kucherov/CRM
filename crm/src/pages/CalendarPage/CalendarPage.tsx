import "./calendarPage.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import { useContext, useEffect, useState } from "react";
import { IEvent } from "../../types";
import useFetch from "../../hooks/useFetch";
import EventForm from "../../components/EventForm/EventForm";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useTypedSelector } from "../../store";
import useTranslate from "../../hooks/useTranslate";
import { setCalendarEvents } from "../../store/calendarSlice";
import { useDispatch } from "react-redux";
import { AlertContext } from "../../context/AlertContextProvider";

const CalendarPage = () => {
  const [eventStart, setEventStart] = useState<Date>();
  const [eventEnd, setEventEnd] = useState<Date>();
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent>();
  const userId = JSON.parse(localStorage.getItem("userId")!);
  const localizer = momentLocalizer(moment);
  const calendarEvents = useTypedSelector(
    (state) => state.calendar.calendarEvents
  );
  const dispatch = useDispatch();
  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);
  const { t } = useTranslate();
  const { showAlert } = useContext(AlertContext);

  const getEvents = useFetch("get", `/events/${userId}`);
  const deleteEvent = useFetch("delete", `/events/${selectedEvent?.id}`);

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents: Array<IEvent> = await getEvents();
      dispatch(setCalendarEvents(fetchedEvents));
    };
    fetchEvents();
  }, []);

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    setEventStart(moment.tz(start, "Europe/Minsk").toDate());
    setEventEnd(moment.tz(end, "Europe/Minsk").toDate());
    setShowForm(true);
  };

  const handleEventClick = (event: IEvent) => {
    setSelectedEvent(event);
  };

  const handleDeleteEvent = async () => {
    await deleteEvent();
    showAlert(
      `Event "${selectedEvent?.title}" ${t("deleted")}`,
      "warning"
    );
    const newEvents = await getEvents();
    dispatch(setCalendarEvents(newEvents));
    setSelectedEvent(undefined);
  };

  moment.tz.setDefault("Europe/Minsk");

  const calendarFormats = {
    timeGutterFormat: "HH:mm",
  };

  return (
    <div className={`calendar-page ${currentTheme}`}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor={(event) => new Date(event.start)}
        endAccessor={(event) => new Date(event.end)}
        style={{ height: 650 }}
        selectable={true}
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventClick}
        formats={calendarFormats}
      />
      {showForm && (
        <EventForm
          userId={userId}
          eventStart={eventStart}
          eventEnd={eventEnd}
          setShowForm={setShowForm}
          getEvents={getEvents}
        />
      )}

      {selectedEvent && (
        <CustomButton
          className="delete-button"
          type="button"
          onClick={handleDeleteEvent}
          color="error"
        >
          {`${t("delete")} "${selectedEvent.title}"`}
        </CustomButton>
      )}
    </div>
  );
};

export default CalendarPage;
