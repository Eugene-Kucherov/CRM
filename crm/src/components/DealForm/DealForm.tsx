import "./dealForm.scss";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Input from "../Input/Input";
import useInput from "../../hooks/useInput";
import { AlertContext } from "../../context/AlertContextProvider";
import CustomButton from "../CustomButton/CustomButton";
import useTranslate from "../../hooks/useTranslate";
import useFetch from "../../hooks/useFetch";
import { setDeals } from "../../store/dealsSlice";
import { useDispatch } from "react-redux";
import { IDeal } from "../../types";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  notes: "",
};

interface DealFormProps {
  userId: string;
  getDeals: () => Promise<Array<IDeal>>;
  setShowForm: Dispatch<SetStateAction<boolean>>;
}

const DealForm = ({ userId, getDeals, setShowForm }: DealFormProps) => {
  const [fields, handleChange] = useInput(initialValues);
  const { showAlert } = useContext(AlertContext);
  const { t } = useTranslate();
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const createDeal = useFetch("post", "/deal", {
    userId,
    stage: selectedStage,
    ...fields,
  });
  const dispatch = useDispatch();

  const inputFields = [
    { label: `${t("name")} (${t("required")})`, name: "name", type: "text" },
    { label: t("email"), name: "email", type: "email" },
    { label: t("phone"), name: "phone", type: "tel" },
    { label: t("company"), name: "company", type: "text" },
    { label: t("website"), name: "website", type: "url" },
    { label: t("notes"), name: "notes", type: "text" },
  ];

  const STAGES = [
    { id: 1, name: t("interest_detected") },
    { id: 2, name: t("request") },
    { id: 3, name: t("ba_estimate") },
    { id: 4, name: t("pm_estimate") },
    { id: 5, name: t("proposal") },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (fields.name) {
      await createDeal();
      const newDeals = await getDeals();
      dispatch(setDeals(newDeals));
      showAlert(
        `${t("deal")} "${fields.name}" ${t("saved_successfully")}`,
        "success"
      );
    } else {
      showAlert(`Name ${t("required_fields")}`, "error");
      return;
    }
    setShowForm(false);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  
  return (
    <div className="deal-form">
      <form onSubmit={handleSubmit}>
        {inputFields.map(({ label, name, type }) => (
          <Input
            key={name}
            label={label}
            id={name}
            name={name}
            type={type}
            value={fields[name]}
            onChange={handleChange}
          />
        ))}
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(Number(e.target.value))}
        >
          {STAGES.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
        <div className="form-actions">
          <CustomButton onClick={closeForm} color="error">
            {t("cancel")}
          </CustomButton>
          <CustomButton type="submit" color="success">
            {t("save")}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default DealForm;
