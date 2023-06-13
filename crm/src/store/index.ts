import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import languageReducer from "./languageSlice";
import calendarReducer from "./calendarSlice";
import dealsReducer from "./dealsSlice";
import initialsReducer from "./initialsSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    initials: initialsReducer,
    calendar: calendarReducer,
    deals: dealsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
