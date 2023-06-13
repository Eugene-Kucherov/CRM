import { ChangeEvent } from "react";
import { InputAdornment } from "@mui/material";

type InputProps = {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  isFieldEmpty?: boolean;
  label?: string;
  placeholder?: string;
  endAdornment?: React.ReactNode; // Optional prop for end adornment
};

const Input = ({
  id,
  name,
  type,
  value,
  onChange,
  className = "",
  isFieldEmpty = false,
  label = "",
  placeholder = " ",
  endAdornment,
}: InputProps) => {
  return (
    <div>
      <input
        className={`${isFieldEmpty ? "empty" : ""} ${className}`}
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
      {label && <label htmlFor={id}>{label}</label>}
      {endAdornment && (
        <InputAdornment position="end" className="end-adornment">
          {endAdornment}
        </InputAdornment>
      )}
    </div>
  );
};

export default Input;
