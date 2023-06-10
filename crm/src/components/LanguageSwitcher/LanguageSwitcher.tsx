import "./languageSwitcher.scss";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../store/languageSlice";
import useTranslate from "../../hooks/useTranslate";
import CustomButton from "../CustomButton/CustomButton";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") ?? "en"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageChange = useCallback(
    (language: string) => {
      setSelectedLanguage(language);
      dispatch(setLanguage(language));
    },
    [dispatch]
  );

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prevState) => !prevState);
  }, []);

  const options = [
    { value: "en", label: "english" },
    { value: "de", label: "german" },
  ];

  const { t } = useTranslate();
  return (
    <div className="language-switcher">
      <div className="language-switcher__current">
        <CustomButton
          className="language-switcher__current-button"
          onClick={toggleDropdown}
          variant="outlined"
          color="success"
        >
          <LanguageIcon />
        </CustomButton>
      </div>
      {isDropdownOpen && (
        <div className="language-switcher__dropdown">
          {options.map((option) => (
            <CustomButton
              key={option.value}
              value={option.value}
              className={`language-switcher__button ${
                selectedLanguage === option.value ? "active" : ""
              }`}
              onClick={() => handleLanguageChange(option.value)}
              color="success"
              variant="outlined"
            >
              {t(option.label)}
            </CustomButton>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
