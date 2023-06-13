import "./dealsPage.scss";
import { useContext, useEffect, useState } from "react";
import DealForm from "../../components/DealForm/DealForm";
import useTranslate from "../../hooks/useTranslate";
import CustomButton from "../../components/CustomButton/CustomButton";
import DealsTable from "../../components/DealsTable/DealsTable";
import DealsByStage from "../../components/DealsByStage/DealsByStage";
import ChangeViewButton from "../../components/ChangeViewButton/ChangeViewButton";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useTypedSelector } from "../../store";
import useFetch from "../../hooks/useFetch";
import { IDeal } from "../../types";
import { setDeals } from "../../store/dealsSlice";
import { useDispatch } from "react-redux";

const ButtonOptions = [
  { value: "stage", icon: <ViewModuleIcon /> },
  { value: "table", icon: <ViewListIcon /> },
];

const DealsPage = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const userId = JSON.parse(localStorage.getItem("userId")!);
  const [displayType, setDisplayType] = useState<string>(
    localStorage.getItem("displayType") || "stage"
  );
  const { t } = useTranslate();
  const deals = useTypedSelector((state) => state.deals.deals);
  const getDeals = useFetch("get", `/deals/${userId}`);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDeals = async () => {
      const fetchedDeals: Array<IDeal> = await getDeals();
      dispatch(setDeals(fetchedDeals));
    };
    fetchDeals();
  }, []);

  const handleOpenForm = () => {
    setShowForm(true);
  };

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
        <DealsByStage deals={deals} getDeals={getDeals} />
      )}
      {displayType === "table" && (
        <DealsTable deals={deals} />
      )}
      {showForm && (
        <DealForm
          userId={userId}
          getDeals={getDeals}
          setShowForm={setShowForm}
        />
      )}
    </section>
  );
};

export default DealsPage;

