import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import languageReducer from "./languageSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;