import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProfilePhoto } from "../types"; 

export interface InitialsState {
  profilePhoto: IProfilePhoto | null;
  name: string;
}

const initialState: InitialsState = {
  profilePhoto: null,
  name: "",
};

const initialsSlice = createSlice({
  name: "initials",
  initialState,
  reducers: {
    setProfilePhoto: (state, action: PayloadAction<IProfilePhoto | null>) => {
      state.profilePhoto = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { setProfilePhoto, setName } = initialsSlice.actions;

export default initialsSlice.reducer;
