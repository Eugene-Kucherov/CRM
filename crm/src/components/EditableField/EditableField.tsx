import { useState, useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import "./editableField.scss";
import { AlertContext } from "../../context/AlertContextProvider";
import CustomButton from "../CustomButton/CustomButton";
import { useTypedSelector } from "../../store";
import useTranslate from "../../hooks/useTranslate";
import Input from "../Input/Input";

interface EditableFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onUpdate: (field: string, value: string) => void;
}

const EditableField = ({ id, name, label, value, onUpdate }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const { showAlert } = useContext(AlertContext);
  const { t } = useTranslate();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewValue(value);
  };

  const handleSave = async () => {
    await onUpdate(name, newValue);
    if (newValue && newValue !== value) {
      showAlert(`${t("saved_changes")}`, "success");
    }
    setIsEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(event.target.value);
  };

  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);

  return (
    <li className="editable-field">
      <span>{label}:</span>
      <div className="input-block">
        {isEditing ? (
          <>
            <Input
              id={id}
              name={name}
              type="text"
              value={newValue}
              onChange={handleChange}
            />
            <div className="edit-buttons">
              <CustomButton
                onClick={handleSave}
                color="success"
                variant="outlined"
              >
                {t("save")}
              </CustomButton>
              <CustomButton
                onClick={handleCancel}
                color="error"
                variant="outlined"
              >
                {t("cancel")}
              </CustomButton>
            </div>
          </>
        ) : (
          <>
            {value}
            <EditIcon
              className={`edit-icon ${currentTheme}`}
              onClick={handleEdit}
            />
          </>
        )}
      </div>
    </li>
  );
};

export default EditableField;
