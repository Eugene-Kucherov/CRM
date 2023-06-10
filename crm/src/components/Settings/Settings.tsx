import { useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import "./settings.scss";
import useTranslate from "../../hooks/useTranslate";
import CustomButton from "../CustomButton/CustomButton";

function Settings() {
  const [showOptions, setShowOptions] = useState(false);
  const { t } = useTranslate();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="settings">
      {showOptions && (
        <div className="settings__options">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      )}
      <CustomButton className="settings__button" onClick={toggleOptions} color="success">
        {t("settings")}
      </CustomButton>
    </div>
  );
}

export default Settings;
