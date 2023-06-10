import { useState } from "react";
import SignIn from "../../components/SignIn/SignIn";
import SignUp from "../../components/SignUp/SignUp";
import CustomButton from "../../components/CustomButton/CustomButton";
import "./authPage.scss";
import useTranslate from "../../hooks/useTranslate";

const AuthPage = () => {
  const { t } = useTranslate();
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn((prevState) => !prevState);
  };

  return (
    <section className="auth">
      <div className="auth-head">
        <div className="slogan">{t("slogan")}</div>
      </div>
      {isSignIn ? (
        <>
          <div className="switch-block">
            <span>{t("dont_have_account")}</span>
            <CustomButton
              className="switch-button"
              onClick={toggleForm}
              color="secondary"
            >
              {t("sign_up")}
            </CustomButton>
          </div>
          <SignIn />
        </>
      ) : (
        <>
          <div className="switch-block">
            <span>{t("have_account")}</span>
            <CustomButton
              className="switch-button"
              onClick={toggleForm}
              color="secondary"
            >
              {t("sign_in")}
            </CustomButton>
          </div>
          <SignUp />
        </>
      )}
    </section>
  );
};

export default AuthPage;
