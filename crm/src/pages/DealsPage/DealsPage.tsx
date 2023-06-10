import "./dealsPage.scss";
import { useCallback, useState } from "react";
import DealForm from "../../components/DealForm/DealForm";
import useTranslate from "../../hooks/useTranslate";
import CustomButton from "../../components/CustomButton/CustomButton";
import DealsTable from "../../components/DealsTable/DealsTable";
import DealsByStage from "../../components/DealsByStage/DealsByStage";
import ChangeViewButton from "../../components/ChangeViewButton/ChangeViewButton";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";

const ButtonOptions = [
  { value: "stage", icon: <ViewModuleIcon /> },
  { value: "table", icon: <ViewListIcon /> },
];

const DealsPage = () => {
  const [updateDeals, setUpdateDeals] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const userId = JSON.parse(localStorage.getItem("userId")!);
  const [displayType, setDisplayType] = useState<string>(
    localStorage.getItem("displayType") || "stage"
  );
  const { t } = useTranslate();

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleUpdateDeals = useCallback(() => {
    setUpdateDeals(true);
  }, []);

  const handleDisplayTypeChange = (value: string) => {
    setDisplayType(value);
  };

  return (
    <section className="deals-page">
      <h1>{t("deals")}</h1>
      <div className="deals-page-buttons">
        <ChangeViewButton
          onChange={handleDisplayTypeChange}
          options={ButtonOptions}
        />
        <CustomButton onClick={handleOpenForm} color="success">
          {t("add_new_deal")}
        </CustomButton>
      </div>
      {displayType === "stage" && (
        <DealsByStage
          userId={userId}
          updateDeals={updateDeals}
          setUpdateDeals={setUpdateDeals}
        />
      )}
      {displayType === "table" && (
        <DealsTable
          userId={userId}
          updateDeals={updateDeals}
          setUpdateDeals={setUpdateDeals}
        />
      )}
      {showForm && (
        <DealForm
          userId={userId}
          onClose={handleCloseForm}
          onUpdate={handleUpdateDeals}
        />
      )}
    </section>
  );
};

export default DealsPage;
