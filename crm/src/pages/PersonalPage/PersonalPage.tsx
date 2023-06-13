import "./personalPage.scss";
import { useContext, useEffect, useState } from "react";
import useTranslate from "../../hooks/useTranslate";
import EditableField from "../../components/EditableField/EditableField";
import { AlertContext } from "../../context/AlertContextProvider";
import CustomButton from "../../components/CustomButton/CustomButton";
import { IUserDetails } from "../../types";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import { useNavigate } from "react-router";
import useFetch from "../../hooks/useFetch";
import ProfilePhoto from "../../components/ProfilePhoto/ProfilePhoto";
import { useDispatch } from "react-redux";
import { setName } from "../../store/initialsSlice";

const PersonalPage = () => {
  const [user, setUser] = useState<IUserDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = JSON.parse(localStorage.getItem("userId")!);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUser = useFetch("get", `/users/${userId}`);
  const updateUser = useFetch("patch", `/users/${userId}`);
  const deleteUser = useFetch("delete", `/users/${userId}`);

  const { t } = useTranslate();
  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser: IUserDetails = await getUser();
      setUser(fetchedUser);
    };
    fetchUser();
  }, []);

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const handleConfirmDelete = async () => {
    await deleteUser();
    navigate("/auth");
    localStorage.clear();
    showAlert(t("deleted_user"), "warning");
    handleCloseModal();
  };

  const handleUpdateField = async (field: string, value: string) => {
    await updateUser({ field, value });
    const updatedUser = await getUser();
    setUser(updatedUser);
    if (field === "name") {
      dispatch(setName(updatedUser.name));
    }
  };

  const fieldDefinitions = [
    { name: "name", label: t("name") },
    { name: "email", label: t("email") },
    { name: "phone", label: t("phone") },
    { name: "address", label: t("address") },
  ];

  return (
    <>
      <ModalConfirm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={t("confirm_delete")}
        message={t("confirm_delete_account")}
      />
      <div className="user-details">
        <h1>{t("user_details")}</h1>
        <ProfilePhoto userId={userId} />
        {user && (
          <ul>
            <span
              className={`activation-label ${
                user.isActivated ? "activated" : "not-activated"
              }`}
            >
              {user.isActivated ? t("activated") : t("not_activated")}
            </span>
            {fieldDefinitions.map(({ name, label }) => (
              <EditableField
                id={name}
                name={name}
                key={name}
                label={label}
                value={user[name]?.toString()}
                onUpdate={handleUpdateField}
              />
            ))}
          </ul>
        )}
        <div className="user-actions">
          <CustomButton
            className="delete-button"
            onClick={handleOpenModal}
            color="error"
          >
            {t("delete")}
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default PersonalPage;
