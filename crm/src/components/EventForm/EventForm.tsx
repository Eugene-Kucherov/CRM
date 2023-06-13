import "./eventForm.scss";
import { Dispatch, SetStateAction, useContext } from "react";
import { IEvent } from "../../types";
import useInput from "../../hooks/useInput";
import useFetch from "../../hooks/useFetch";
import moment from "moment-timezone";
import Input from "../Input/Input";
import CustomButton from "../CustomButton/CustomButton";
import useTranslate from "../../hooks/useTranslate";
import { setCalendarEvents } from "../../store/calendarSlice";
import { useDispatch } from "react-redux";
import { AlertContext } from "../../context/AlertContextProvider";

type EventFormProps = {
  userId: string;
  eventStart: Date | undefined;
  eventEnd: Date | undefined;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  getEvents: () => Promise<Array<IEvent>>;
};

const EventForm = ({
  userId,
  eventStart,
  eventEnd,
  setShowForm,
  getEvents,
}: EventFormProps) => {
  const initialValues = {
    title: "",
  };
  const { t } = useTranslate();
  const [fields, handleChange] = useInput(initialValues);
  const createEvent = useFetch("post", "/events", {
    userId,
    start: eventStart,
    end: eventEnd,
    ...fields,
  });
  const { showAlert } = useContext(AlertContext);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (fields.title) {
      await createEvent();
      const newEvents = await getEvents();
      dispatch(setCalendarEvents(newEvents));
      showAlert(
        `Event "${fields.title}" ${t("saved_successfully")}`,
        "success"
      );
    } else {
      showAlert(`${t("title")} ${t("required_fields")}`, "error");
      return;
    }

    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const fieldsConfig = [
    {
      name: "title",
      type: "text",
      label: `${t("title")} (${t("required")})`,
    },
    {
      name: "start",
      type: "datetime-local",
      value: eventStart ? moment(eventStart).format("YYYY-MM-DDTHH:mm") : "",
    },
    {
      name: "end",
      type: "datetime-local",
      value: eventEnd ? moment(eventEnd).format("YYYY-MM-DDTHH:mm") : "",
    },
  ];

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {fieldsConfig.map(({ name, type, label, value }) => (
        <Input
          id={name}
          label={label}
          key={name}
          type={type}
          name={name}
          value={value || fields[name]}
          onChange={handleChange}
        />
      ))}
      <div className="event-form-actions">
        <CustomButton type="button" onClick={handleCancel} color="error">
          {t("cancel")}
        </CustomButton>
        <CustomButton type="submit" color="success">{t("save")}</CustomButton>
      </div>
    </form>
  );
};

export default EventForm;
