import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { toggleTheme } from "../../store/themeSlice";
import "./themeSwitcher.scss";
import { createSelector } from "reselect";

interface ThemeButtonProps {}

const currentThemeSelector = createSelector(
  (state: RootState) => state.theme,
  (theme) => theme.currentTheme
);

const ThemeSwitcher = (props: ThemeButtonProps) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(currentThemeSelector);

  const handleClick = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const switchClassName = `theme-switch ${currentTheme}`;

  return (
    <label className={switchClassName} htmlFor="theme-toggle">
      <input
        type="checkbox"
        id="theme-toggle"
        checked={currentTheme === "dark"}
        onChange={handleClick}
        style={{ display: "none" }}
      />
      <div className="slider round"></div>
    </label>
  );
};

export default ThemeSwitcher;
