import "./notFound.scss";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hooks/useTranslate";

interface NotFoundProps {}

const NotFound = (props: NotFoundProps) => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  return (
    <div className="not-found">
      <h1>404 - {t("not_found")}</h1>
      <p>{t("sorry")}</p>
      <button onClick={() => navigate(-1)}>{t("back")}</button>
    </div>
  );
};

export default NotFound;
