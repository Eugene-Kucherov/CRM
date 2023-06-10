import { useContext } from "react";
import { api } from "../API/service";
import { LoadingContext } from "../context/LoaderContextProvider";
import { AxiosError } from "axios";
import { AlertContext } from "../context/AlertContextProvider";
import { useNavigate } from "react-router-dom";

const useFetch = (method: string, url: string, body?: object) => {
  const { setIsLoading } = useContext(LoadingContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const fetchData = async (optionalParams?: object) => {
    try {
      setIsLoading(true);

      const { data } = await api.request({
        method,
        url,
        data: { ...body, ...optionalParams },
      });

      if (url === "/login") {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userId", JSON.stringify(data.user.id));
      }

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        showAlert(error.response?.data?.error || error.message, "error");
        if (error.response?.status === 401) {
          navigate("/auth");
        }
      } else {
        showAlert(String(error), "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return fetchData;
};

export default useFetch;
