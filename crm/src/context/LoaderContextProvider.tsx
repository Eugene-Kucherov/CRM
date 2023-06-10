import {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { api } from "../API/service";

interface LoadingContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoaderContextProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      setIsLoading(true);
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setIsLoading(false);
        return response;
      },
      (error) => {
        setIsLoading(false);
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
};
