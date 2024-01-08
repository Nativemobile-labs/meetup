import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationModel } from "../../lib/types";

/**
 * I think this is deprecated. MapSlice contains locations, which is preferred.
 * Maybe? Where should this live? Anyway, that's where it is now
 */

export interface LocationsSlice {
  locations: LocationModel[];
}

const initialState: LocationsSlice = {
  locations: [],
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocations(state, action: PayloadAction<LocationModel[]>) {
      state.locations = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setLocations } = locationsSlice.actions;
export default locationsSlice.reducer;
