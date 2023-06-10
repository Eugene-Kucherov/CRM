import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { AlertContext } from "../../context/AlertContextProvider";
import useTranslate from "../../hooks/useTranslate";

const ActivationPage = () => {
  const { userId } = useParams();
  const activateAccount = useFetch("head", `/activate/${userId}`);
  const getUser = useFetch("get", `/users/${userId}`);
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const { t } = useTranslate();

  useEffect(() => {
    let isMounted = true;

    const toActivateAccount = async () => {
      const user = await getUser();
      if (isMounted) {
        if (user) {
          await activateAccount();
          showAlert(t("Your account has been activated!"), "success", () =>
            navigate("/personal")
          );
        } else {
          navigate("/auth");
        }
      }
    };

    toActivateAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  return <div></div>;
};

export default ActivationPage;
