import "./calendarPage.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";

export interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

//как пример, потом будут прилетать с сервера
export const initialCalendarEvents: Event[] = [
  {
    id: 1,
    title: "Meeting with John",
    start: new Date(2023, 4, 8, 13, 53),
    end: moment().add(1, "hours").toDate(),
  },
  {
    id: 2,
    title: "Lunch with Sarah",
    start: new Date(2023, 4, 8, 15, 27),
    end: moment().add(1, "hours").toDate(),
  },
];

const CalendarPage = () => {
  const localizer = momentLocalizer(moment);
  const [calendarEvents, setCalendarEvents] = useState<Event[]>(
    initialCalendarEvents
  );

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    //тоже как пример, потом будет форма
    const title = window.prompt("Enter Event Title");
    if (title) {
      const newEvent: Event = {
        id: calendarEvents.length + 1,
        start,
        end,
        title,
      };
      setCalendarEvents([...calendarEvents, newEvent]);
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 650 }}
        selectable={true}
        onSelectSlot={handleSelect}
      />
    </div>
  );
};

export default CalendarPage;
