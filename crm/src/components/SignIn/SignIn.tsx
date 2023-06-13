import { FormEvent, useContext, useState } from "react";
import Input from "../Input/Input";
import useInput from "../../hooks/useInput";
import { AlertContext } from "../../context/AlertContextProvider";
import useTranslate from "../../hooks/useTranslate";
import CustomButton from "../CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignIn = () => {
  const initialValues = { email: "", password: "" };
  const [fields, handleChange] = useInput(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showAlert } = useContext(AlertContext);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const loginUser = useFetch("post", "/login", fields);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const emptyFields = Object.keys(fields).filter(
      (key) => !fields[key as keyof typeof fields]
    );

    if (emptyFields.length > 0) {
      const emptyFieldLabels = emptyFields.map((fieldName) => {
        const fieldDefinition = fieldDefinitions.find(
          (field) => field.name === fieldName
        );
        return fieldDefinition ? fieldDefinition.label : fieldName;
      });
      showAlert(
        `${emptyFieldLabels.join(", ")} ${t("required_fields")}`,
        "error"
      );
      return;
    }

    const response = await loginUser();
    if (response?.user) {
      showAlert(`${t("hello")}, ${response.user.name}!`, "success", () => {
        navigate("/");
      });
    }
  };

  const isFieldEmpty = (fieldName: string) => submitted && !fields[fieldName];

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const fieldDefinitions = [
    {
      label: `${t("email")}`,
      name: "email",
      type: "email",
    },
    {
      label: `${t("password")}`,
      name: "password",
      type: showPassword ? "text" : "password",
      togglePassword: toggleShowPassword,
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t("login")}</h1>
      <p>{t("enter_your_details")}</p>
      {fieldDefinitions.map(({ label, name, type, togglePassword }) => (
        <Input
          key={name}
          label={label}
          id={name}
          name={name}
          type={type}
          value={fields[name]}
          onChange={handleChange}
          isFieldEmpty={isFieldEmpty(name)}
          placeholder=" "
          endAdornment={
            name === "password" && (
              <IconButton
                onClick={togglePassword}
                edge="end"
                className="password-toggle"
              >
                {type === "password" ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )
          }
        />
      ))}
      <CustomButton className="auth-button" type="submit">
        {t("sign_in")}
      </CustomButton>
    </form>
  );
};

export default SignIn;
