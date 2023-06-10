import { ChangeEvent } from "react";

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
    </div>
  );
};

export default Input;
