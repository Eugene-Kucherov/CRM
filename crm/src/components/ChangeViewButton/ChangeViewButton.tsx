import "./changeViewButton.scss";
import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTypedSelector } from "../../store";

interface IToggleButtonProps {
  options: Array<{ value: string; icon: React.ReactNode }>;
  onChange: (value: string) => void;
}

const ChangeViewButton = ({ options, onChange }: IToggleButtonProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    localStorage.getItem("displayType") || options[0].value
  );
  const currentTheme = useTypedSelector((state) => state.theme.currentTheme);

  const handleValueChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      setSelectedValue(newValue);
      onChange(newValue);
      localStorage.setItem("displayType", newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedValue}
      exclusive
      onChange={handleValueChange}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          className={`toggle-button ${currentTheme}`}
        >
          {option.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ChangeViewButton;
