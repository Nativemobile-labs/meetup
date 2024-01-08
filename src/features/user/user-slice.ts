import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllConnections, TwibModel, UserModel } from "../../lib/types";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

import logger from "../../lib/utils/logger";

export type UserAuth = {
  user: FirebaseAuthTypes.User;
  accessToken: string;
  uid: string;
};

export interface UserSlice {
  auth: UserAuth | null;
  user: UserModel | null;
  twibs: TwibModel[];
  connections: AllConnections;
}

const initialState: UserSlice = {
  auth: null,
  user: null,
  twibs: [],
  connections: {
    friends: [],
    followers: [],
    following: [],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setApiUser(state, action: PayloadAction<UserModel | null>) {
      logger("setting new data for API User", action.payload);
      state.user = action.payload;
    },
    setUserAuth(state, action: PayloadAction<UserAuth | null>) {
      state.auth = action.payload;
    },
    setUserTwibs(state, action: PayloadAction<TwibModel[]>) {
      state.twibs = action.payload;
    },
    setAllConnections(state, action: PayloadAction<AllConnections>) {
      state.connections = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setUserAuth, setApiUser, setUserTwibs, setAllConnections } =
  userSlice.actions;
export default userSlice.reducer;
