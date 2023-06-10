import { PropsWithChildren } from "react";
import Button from "@mui/material/Button";

interface CustomButtonProps {
  onClick?: () => void;
  value?: string;
  className?: string;
  variant?: "text" | "outlined" | "contained" | undefined;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | undefined;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const CustomButton = ({
  onClick,
  className = "",
  variant = "contained",
  color = "primary",
  disabled = false,
  type = "button",
  children,
}: PropsWithChildren<CustomButtonProps>) => {
  return (
    <Button
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
      className={className}
      type={type}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
