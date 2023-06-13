import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEvent } from "../types";

interface CalendarState {
  calendarEvents: Array<IEvent>;
}

const initialState: CalendarState = {
  calendarEvents: [],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setCalendarEvents: (state, action: PayloadAction<Array<IEvent>>) => {
      state.calendarEvents = action.payload;
    },
  },
});

export const { setCalendarEvents } = calendarSlice.actions;
export default calendarSlice.reducer;
