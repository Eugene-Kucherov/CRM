import { useState, useEffect } from "react";
import "./time.scss";
import { useTypedSelector } from "../../store";

interface TimeProps {
  timezone: string;
}

const Time = ({ timezone }: TimeProps) => {
  const [time, setTime] = useState(new Date());

  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: timezone,
  };

  const formattedTime = time.toLocaleString("ru-BY", options);
  const city = timezone.split("/").pop();

  return (
    <div className={`time ${currentTheme}`}>
      <h1 className="time__header">{formattedTime}</h1>
      <p className="time__timezone">{city}</p>
    </div>
  );
};

export default Time;
