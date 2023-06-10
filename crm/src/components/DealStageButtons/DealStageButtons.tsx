import { useState, useEffect, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { IDeal } from "../../types";
import CustomButton from "../../components/CustomButton/CustomButton";
import useTranslate from "../../hooks/useTranslate";
import { AlertContext } from "../../context/AlertContextProvider";

interface DealStageProps {
  deal: IDeal;
}

const DealStageButtons = ({ deal }: DealStageProps) => {
  const { t } = useTranslate();
  const { showAlert } = useContext(AlertContext);
  const STAGES = [
    { id: 1, name: t("interest_detected") },
    { id: 2, name: t("request") },
    { id: 3, name: t("ba_estimate") },
    { id: 4, name: t("pm_estimate") },
    { id: 5, name: t("proposal") },
  ];

  const updateDeal = useFetch("patch", `/deal/${deal.id}`);
  const [currentStage, setCurrentStage] = useState(deal.stage);

  useEffect(() => {
    setCurrentStage(deal.stage);
  }, [deal.stage]);

  const handleNextStage = async () => {
    const currentIndex = STAGES.findIndex((stage) => stage.id === currentStage);
    const nextIndex = currentIndex + 1;

    if (nextIndex < STAGES.length) {
      const nextStage = STAGES[nextIndex].id;
      await updateDeal({ field: "stage", value: nextStage.toString() });
      await updateDeal({ field: "updated_at", value: new Date() });
      setCurrentStage(nextStage);
      showAlert(`${t("upgrated_deal")}`, "info");
    }
  };

  const handlePreviousStage = async () => {
    const currentIndex = STAGES.findIndex((stage) => stage.id === currentStage);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      const previousStage = STAGES[previousIndex].id;
      await updateDeal({ field: "stage", value: previousStage.toString() });
      await updateDeal({ field: "updated_at", value: new Date() });
      setCurrentStage(previousStage);
      showAlert(`${t("downgrated_deal")}`, "info");
    }
  };

  return (
    <div className="deal-stage">
      <CustomButton
        className="previous-button"
        onClick={handlePreviousStage}
        disabled={currentStage === 1}
        variant="outlined"
      >
        Previous Stage
      </CustomButton>
      <span>{STAGES.find((stage) => stage.id === currentStage)?.name}</span>
      <CustomButton
        className="next-button"
        onClick={handleNextStage}
        disabled={currentStage === 5}
        variant="outlined"
      >
        Next Stage
      </CustomButton>
    </div>
  );
};

export default DealStageButtons;
