import { FormEvent, useContext, useState } from "react";
import Input from "../Input/Input";
import useInput from "../../hooks/useInput";
import { AlertContext } from "../../context/AlertContextProvider";
import useTranslate from "../../hooks/useTranslate";
import CustomButton from "../CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const SignIn = () => {
  const initialValues = { email: "", password: "" };
  const [fields, handleChange] = useInput(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useContext(AlertContext);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const loginUser = useFetch("post", "/login", fields );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const emptyFields = Object.keys(fields).filter(
      (key) => !fields[key as keyof typeof fields]
    );

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.join(", ");
      showAlert(`${fieldNames} ${t("required_fields")}`, "error");
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

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t("login")}</h1>
      <p>{t("enter_your_details")}</p>
      <Input
        label={`${t("email")}:`}
        id="email"
        name="email"
        type="email"
        value={fields.email}
        onChange={handleChange}
        isFieldEmpty={isFieldEmpty("email")}
        placeholder=" "
      />
      <Input
        label={`${t("password")}:`}
        id="password"
        name="password"
        type="password"
        value={fields.password}
        onChange={handleChange}
        isFieldEmpty={isFieldEmpty("password")}
        placeholder=" "
      />
      <CustomButton className="auth-button" type="submit">
        {t("sign_in")}
      </CustomButton>
    </form>
  );
};

export default SignIn;
