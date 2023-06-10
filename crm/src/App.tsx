import "./app.scss";
import Nav from "./components/Nav/Nav";
import { Outlet } from "react-router-dom";
import { useTypedSelector } from "./store";
import Time from "./components/Time/Time";
import { initialCalendarEvents } from "./pages/CalendarPage/CalendarPage";
import useEventNotifications from "./hooks/useEventNotifications";

function App() {
  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);

  useEventNotifications(initialCalendarEvents);

  return (
    <div className={`main ${currentTheme}`}>
      <Nav />
      <div className="outlet">
        <Time timezone="Europe/Minsk" />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
