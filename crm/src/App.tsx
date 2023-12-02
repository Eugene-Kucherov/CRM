import "./app.scss";
import Nav from "./components/Nav/Nav";
import { Outlet } from "react-router-dom";
import { useTypedSelector } from "./store";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";
import Time from "./components/Time/Time";
import useEventNotifications from "./hooks/useEventNotifications";
import useInitials from "./hooks/useInitials";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSocket, clearSocket } from "./store/socketSlice";
import { io } from "socket.io-client";

function App() {
  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);
  const calendarEvents = useTypedSelector(
    (state) => state.calendar.calendarEvents
  );
  const profilePhoto = useTypedSelector((state) => state.initials.profilePhoto);
  const name = useTypedSelector((state) => state.initials.name);

  const dispatch = useDispatch();

  useEffect(() => {
    const newSocket = io("http://localhost:5000");

    dispatch(setSocket(newSocket));

    return () => {
      newSocket.disconnect();
      dispatch(clearSocket());
    };
  }, []);

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
