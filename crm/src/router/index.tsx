import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "../App";
import ContextPage from "../pages/ContextPage/ContextPage";
import AuthPage from "../pages/AuthPage/AuthPage";
import NotFound from "../pages/NotFound/NotFound";
import PersonalPage from "../pages/PersonalPage/PersonalPage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import DealsPage from "../pages/DealsPage/DealsPage";
import DetailedDealPage from "../pages/DetailedDealPage/DetailedDealPage";
import AnimationPage from "../pages/AnimationPage/AnimationPage";
import ActivationPage from "../pages/ActivationPage/ActivationPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ContextPage />}>
        <Route path="/" element={<App />}>
          <Route index element={<AnimationPage />} />
          <Route path="personal" element={<PersonalPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="deals/:dealId" element={<DetailedDealPage />} />
        </Route>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/activate/:userId" element={<ActivationPage />} />
      </Route>
    </>
  )
);

export default router;
