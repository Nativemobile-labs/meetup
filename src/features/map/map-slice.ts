import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FilterTimeframe,
  FilterVisibility,
  LocationModel,
  SlimLocationModel,
} from "../../lib/types";
import logger from "../../lib/utils/logger";
import { filters } from "../../lib/dictionary";
import { dateForTwib, normalize } from "../../lib/utils/date";
// import { DateTime } from "luxon";

export interface MapSlice {
  isAddingTwib: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  currentMapCenter: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  filters: {
    visibility: FilterVisibility;
    timeframe: FilterTimeframe;
  };
  locations: LocationModel[];
}

const initialState: MapSlice = {
  isAddingTwib: false,
  coordinates: {
    latitude: 34.05486685107711,
    longitude: -118.24465600806091,
  },
  currentMapCenter: {
    latitude: 34.05486685107711,
    longitude: -118.24465600806091,
    zoom: 11,
  },
  filters: {
    visibility: filters.visibilities.list.find(
      (v) => v.id === filters.visibilities.everything
    )!,
    timeframe: filters.timeframes.list.find(
      (v) => v.id === filters.timeframes.thisWeek
    )!,
  },
  locations: [],
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setIsAddingTwib(state, action: PayloadAction<MapSlice["isAddingTwib"]>) {
      state.isAddingTwib = action.payload;
    },
    setCoordinates(state, action: PayloadAction<MapSlice["coordinates"]>) {
      state.coordinates = action.payload;
    },
    setCurrentMapCenter(
      state,
      action: PayloadAction<MapSlice["currentMapCenter"]>
    ) {
      logger("setting map center");
      state.currentMapCenter = action.payload;
    },
    setLocations(state, action: PayloadAction<MapSlice["locations"]>) {
      state.locations = action.payload;
    },
    setVisibilityFilter(state, action: PayloadAction<FilterVisibility>) {
      state.filters.visibility = action.payload;
    },
    setTimeframeFilter(state, action: PayloadAction<FilterTimeframe>) {
      state.filters.timeframe = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const selectFilteredLocations = (state: any): LocationModel[] => {
  if (state.user.user === null) {
    return state.map.locations;
  }

  // copy locations
  const filteredLocations = state.map.locations.map(
    (location: LocationModel) => ({ ...location })
  );

  // filter twibs at each location based on visibility filter
  filteredLocations.forEach((location: LocationModel) => {
    switch (state.map.filters.visibility.id) {
      case filters.visibilities.going:
        location.twibs = location.twibs.filter((twib) => {
          return twib.chat.users.some((chat_user) => {
            return chat_user.id === state.user.user.id;
          });
        });
        break;
      case filters.visibilities.myTwibs:
        location.twibs = location.twibs.filter((twib) => {
          return twib.user.id === state.user.user.id;
        });
        break;
      case filters.visibilities.everything:
      default:
        break;
    }
  });

  filteredLocations.forEach((location: LocationModel) => {
    switch (state.map.filters.timeframe.id) {
      case filters.timeframes.thisWeek:
        location.twibs = location.twibs.filter((twib) => {
          const twibDate = dateForTwib(twib);
          return (
            twibDate === null || twibDate <= DateTime.now().plus({ week: 1 })
          );
        });
        break;
      case filters.timeframes.today:
        location.twibs = location.twibs.filter((twib) => {
          const twibDate = dateForTwib(twib);
          return (
            twibDate &&
            twibDate.toFormat("yyyy-MM-dd") === DateTime.now().toFormat("yyyy-MM-dd")
          );
        });
        break;
      case filters.timeframes.anytime:
      default:
        break;
    }
  });

  return filteredLocations.filter((location: LocationModel) => {
    return location.twibs.length > 0;
  });
};

export const {
  setIsAddingTwib,
  setCoordinates,
  setCurrentMapCenter,
  setLocations,
  setVisibilityFilter,
  setTimeframeFilter,
} = mapSlice.actions;
export default mapSlice.reducer;
