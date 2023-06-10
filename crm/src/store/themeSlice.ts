import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  currentTheme: "light" | "dark";
}

const initialState: ThemeState = {
  currentTheme: (localStorage.getItem("theme") as "light" | "dark") || "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.currentTheme);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;

