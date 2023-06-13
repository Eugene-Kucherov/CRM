import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDeal } from "../types";

interface DealsState {
  deals: Array<IDeal>;
}

const initialState: DealsState = {
  deals: [],
};

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    setDeals: (state, action: PayloadAction<Array<IDeal>>) => {
      state.deals = action.payload;
    },
  },
});

export const { setDeals } = dealsSlice.actions;
export default dealsSlice.reducer;
