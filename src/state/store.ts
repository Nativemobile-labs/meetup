import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/user-slice";
import messageThreadsReducer from "../features/messages/message-threads-slice";
import gendersReducer from "../features/genders/genders-slice";
import locationsReducer from "../features/locations/locations-slice";
import mapReducer from "../features/map/map-slice";
import configReducer from "../features/config-slice";
import appReducer from "../features/app-slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    map: mapReducer,
    user: userReducer,
    messageThreads: messageThreadsReducer,
    genders: gendersReducer,
    locations: locationsReducer,
    config: configReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;