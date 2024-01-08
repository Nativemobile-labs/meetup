import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WebsocketStatus } from "../lib/types";

export interface AppSlice {
  websocketStatus: WebsocketStatus;
  isInstalled: boolean | null; // null means not yet checked
  installPrompt: "installed" | null | Event;
  isMenuOpen: boolean;
}

const initialState: AppSlice = {
  websocketStatus: "disconnected",
  isInstalled: null,
  installPrompt: null,
  isMenuOpen: false,
};

const appSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setWebsocketConnected(state, action: PayloadAction<WebsocketStatus>) {
      state.websocketStatus = action.payload;
    },
    setIsInstalled(state, action: PayloadAction<boolean>) {
      state.isInstalled = action.payload;
    },
    setInstallPrompt(state, action: PayloadAction<any>) {
      state.installPrompt = action.payload;
    },
    setIsMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMenuOpen = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setWebsocketConnected,
  setInstallPrompt,
  setIsInstalled,
  setIsMenuOpen,
} = appSlice.actions;
export default appSlice.reducer;
