import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenderModel } from "../../lib/types";

export interface GendersSlice {
  genders: GenderModel[];
}

const initialState: GendersSlice = {
  genders: [],
};

const gendersSlice = createSlice({
  name: "genders",
  initialState,
  reducers: {
    setGenders(state, action: PayloadAction<GenderModel[]>) {
      state.genders = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setGenders } = gendersSlice.actions;
export default gendersSlice.reducer;
