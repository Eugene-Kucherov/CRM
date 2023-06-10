import "./dealsByStage.scss";
import { Link } from "react-router-dom";
import { IDeal } from "../../types";
import useTranslate from "../../hooks/useTranslate";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

type DealsByStageProps = {
  userId: string;
  updateDeals: boolean;
  setUpdateDeals: Dispatch<SetStateAction<boolean>>;
};

const DealsByStage = ({
  userId,
  updateDeals,
  setUpdateDeals,
}: DealsByStageProps) => {
  const [deals, setDeals] = useState<Array<IDeal>>([]);
  const dealsByStage: { [key: number]: Array<IDeal> } = {};
  const [draggedDeal, setDraggedDeal] = useState<IDeal | null>(null);

  const updateDeal = useFetch("patch", `/deal/${draggedDeal?.id}`);
  const getDeals = useFetch("get", `/deals/${userId}`);

  const { t } = useTranslate();

  useEffect(() => {
    const fetchDeals = async () => {
      const fetchedDeals: Array<IDeal> = await getDeals();
      const sortedDeals = fetchedDeals.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateA.getTime() - dateB.getTime();
      });
      setDeals(sortedDeals);
    };
    fetchDeals();
    if (updateDeals) {
      setUpdateDeals(false);
    }
  }, [updateDeals]);

  const handleDragStart = (deal: IDeal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: number) => {
    if (draggedDeal) {
      if (draggedDeal.stage !== stageId) {
        await updateDeal({ field: "stage", value: stageId });
        await updateDeal({ field: "updated_at", value: new Date() });
        const updatedDeals = await getDeals();
        setDeals(updatedDeals);
      }
      setDraggedDeal(null);
    }
  };

  const getTime = (deal: IDeal) => {
    console.log(deal.created_at);
  };

  const STAGES = [
    { id: 1, name: t("interest_detected") },
    { id: 2, name: t("request") },
    { id: 3, name: t("ba_estimate") },
    { id: 4, name: t("pm_estimate") },
    { id: 5, name: t("proposal") },
  ];

  if (deals) {
    STAGES.forEach((stage) => {
      dealsByStage[stage.id] = deals
        .filter((deal) => deal.stage === stage.id)
        .sort((a, b) => {
          return (
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          );
        });
    });
  }

  return (
    <table className="deals-by-stage">
      <thead>
        <tr>
          {STAGES.map((stage) => (
            <th key={stage.id}>{stage.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {STAGES.map((stage) => (
            <td
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              <ul className="deal-list">
                {dealsByStage[stage.id]?.map((deal) => (
                  <li
                    key={deal.id}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    onClick={() => getTime(deal)}
                  >
                    <Link to={`/deals/${deal.id}`}>{deal.name}</Link>
                    <span>{deal.company}</span>
                  </li>
                ))}
              </ul>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default DealsByStage;
