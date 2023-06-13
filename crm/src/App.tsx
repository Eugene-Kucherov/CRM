import "./app.scss";
import Nav from "./components/Nav/Nav";
import { Outlet } from "react-router-dom";
import { useTypedSelector } from "./store";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import Time from "./components/Time/Time";
import useEventNotifications from "./hooks/useEventNotifications";
import useInitials from "./hooks/useInitials";

function App() {
  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);
  const calendarEvents = useTypedSelector(
    (state) => state.calendar.calendarEvents
  );
  const profilePhoto = useTypedSelector((state) => state.initials.profilePhoto);
  const name = useTypedSelector((state) => state.initials.name);

  useInitials();

  useEventNotifications(calendarEvents);

  return (
    <div className={`main ${currentTheme}`}>
      <Nav />
      <div className="outlet">
        <ProfileInfo profilePhoto={profilePhoto} name={name} />
        <Time timezone="Europe/Minsk" />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
