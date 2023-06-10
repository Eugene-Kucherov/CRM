import "./logoutButton.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ModalConfirm from "../ModalConfirm/ModalConfirm";
import useTranslate from "../../hooks/useTranslate";
import CustomButton from "../CustomButton/CustomButton";
import useFetch from "../../hooks/useFetch";

interface LogoutButtonProps {}

const LogoutButton = (props: LogoutButtonProps) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const logoutUser = useFetch("post", "/logout");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <>
      <CustomButton
        className="logout-button"
        onClick={handleOpenModal}
        color="error"
      >
        {t("logout")}
      </CustomButton>
      <ModalConfirm
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleLogout}
        title={t("confirm_logout")}
        message={t("sure_to_logout")}
      />
    </>
  );
};

export default LogoutButton;
