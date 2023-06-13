import "./detailedDealPage.scss";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IDeal } from "../../types";
import useTranslate from "../../hooks/useTranslate";
import EditableField from "../../components/EditableField/EditableField";
import { AlertContext } from "../../context/AlertContextProvider";
import CustomButton from "../../components/CustomButton/CustomButton";
import useFetch from "../../hooks/useFetch";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";
import DealStageButtons from "../../components/DealStageButtons/DealStageButtons";

interface RouteParams {
  dealId?: string;
  [key: string]: string | undefined;
}

const DetailedDealPage = () => {
  const { dealId = "" } = useParams<RouteParams>();
  const [deal, setDeal] = useState<IDeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { showAlert } = useContext(AlertContext);
  const [createdAt, setCreatedAt] = useState<string>("");

  const getDeal = useFetch("get", `/deal/${dealId}`);
  const updateDeal = useFetch("patch", `/deal/${dealId}`);
  const deleteDeal = useFetch("delete", `/deal/${dealId}`);

  useEffect(() => {
    const fetchDeal = async () => {
      const fetchedDeal: IDeal = await getDeal();
      setDeal(fetchedDeal);
      const time = new Date(fetchedDeal.created_at).toLocaleString("ru-BY", {
        timeZone: "Europe/Minsk",
      });
      setCreatedAt(time);
    };
    fetchDeal();
  }, []);

  function handleGoBack() {
    navigate(-1);
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const handleConfirmDelete = async () => {
    await deleteDeal();
    showAlert(`${t("deal")} "${deal?.name}" ${t("deleted")}`, "warning");
    handleCloseModal();
    navigate("/deals");
  };

  const handleUpdateField = async (field: string, value: string) => {
    await updateDeal({ field, value });
    const updatedDeal = await getDeal();
    setDeal(updatedDeal);
  };

  const fieldDefinitions = [
    { name: "name", label: t("name") },
    { name: "email", label: t("email") },
    { name: "phone", label: t("phone") },
    { name: "company", label: t("company") },
    { name: "website", label: t("website") },
    { name: "notes", label: t("notes") },
  ];

  return (
    <>
      <ModalConfirm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={t("confirm_delete")}
        message={t("confirm_delete_deal")}
      />
      <div className="deal-details">
        <h1>{t("deal_details")}</h1>
        {deal && (
          <ul>
            {fieldDefinitions.map(({ name, label }) => (
              <EditableField
                id={name}
                name={name}
                key={name}
                label={label}
                value={deal[name].toString()}
                onUpdate={handleUpdateField}
              />
            ))}
            <div className="created">
              <span>{t("created")}: </span>
              {createdAt}
            </div>
            <DealStageButtons deal={deal} />
          </ul>
        )}
        <div className="deal-actions">
          <CustomButton className="back-button" onClick={handleGoBack}>
            {t("back")}
          </CustomButton>
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

export default DetailedDealPage;
