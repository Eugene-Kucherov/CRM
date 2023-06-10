import { Outlet } from "react-router-dom";
import { AlertContextProvider } from "../../context/AlertContextProvider";
import { LoaderContextProvider } from "../../context/LoaderContextProvider";

const ContextPage = () => {
  return (
    <LoaderContextProvider>
      <AlertContextProvider>
        <Outlet />
      </AlertContextProvider>
    </LoaderContextProvider>
  );
};

export default ContextPage;
