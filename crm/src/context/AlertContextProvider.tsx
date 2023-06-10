import { createContext, useState, useEffect, useCallback } from "react";
import { Alert, IconButton } from "@mui/material";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";

type Severity = "success" | "info" | "warning" | "error";

type AlertProps = {
  id: string;
  message: string;
  severity: Severity;
  waitOnClose?: () => void;
  persist?: boolean;
};

type AlertContextProps = {
  showAlert: (
    message: string,
    severity: Severity,
    waitOnClose?: () => void,
    persist?: boolean
  ) => void;
  hideAlert: (id: string) => void;
};

export const AlertContext = createContext<AlertContextProps>({
  showAlert: () => {},
  hideAlert: () => {},
});

export const AlertContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const showAlert = (
    message: string,
    severity: Severity,
    waitOnClose?: () => void,
    persist?: boolean
  ) => {
    const id = String(Date.now());
    const newAlert: AlertProps = {
      id,
      message,
      severity,
      waitOnClose,
      persist,
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const hideAlert = useCallback(
    (id: string) => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
      const closedAlert = alerts.find((alert) => alert.id === id);
      if (closedAlert && closedAlert.waitOnClose) closedAlert.waitOnClose();
    },
    [alerts]
  );

  useEffect(() => {
    alerts.forEach((alert) => {
      let timer: ReturnType<typeof setTimeout>;
      if (alert && !alert.persist) {
        timer = setTimeout(() => hideAlert(alert.id), 2000);
      }
      return () => clearTimeout(timer);
    });
  }, [alerts, hideAlert]);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alerts.map((alert, index) => (
        <AlertWrapper key={alert.id} style={{ bottom: 10 + index * 70 }}>
          <Alert
            severity={alert.severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => hideAlert(alert.id)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        </AlertWrapper>
      ))}
    </AlertContext.Provider>
  );
};

const AlertWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 100;
`;
