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

const SignUp = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [fields, handleChange] = useInput(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showAlert } = useContext(AlertContext);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { name, email, password, confirmPassword } = fields;
  const registerUser = useFetch("post", "/registration", {
    name,
    email,
    password,
  });
  const loginUser = useFetch("post", "/login", { email, password });

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
        `${emptyFieldLabels.join(", ")} ${t(
          "required_fields"
        )}`,
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert(t("password_mismatch"), "error");
      return;
    }

    const regResponse = await registerUser();

    if (regResponse) {
      await loginUser();
      showAlert(t("registration_success"), "success", () => {
        navigate("/");
      });
    }
  };

  const isFieldEmpty = (fieldName: string) => submitted && !fields[fieldName];

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const fieldDefinitions = [
    {
      label: `${t("name")}`,
      name: "name",
      type: "text",
    },
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
    {
      label: `${t("confirm_password")}`,
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      togglePassword: toggleShowConfirmPassword,
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t("registration")}</h1>
      <p>{t("fill_in_fields")}</p>
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
            (name === "password" || name === "confirmPassword") && (
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
        {t("sign_up")}
      </CustomButton>
    </form>
  );
};

export default SignUp;
