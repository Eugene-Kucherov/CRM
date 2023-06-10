import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CustomButton from "../CustomButton/CustomButton";
import useTranslate from "../../hooks/useTranslate";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ModalProps) => {
  const { t } = useTranslate();
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <CustomButton onClick={onClose} variant="text">
          {t("cancel")}
        </CustomButton>
        <CustomButton onClick={onConfirm} variant="text" color="error">
          {t("confirm")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirm;
