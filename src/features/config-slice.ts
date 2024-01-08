import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TwibModel } from "../lib/types";

type ToastMessage = {
  title?: string;
  body: string;
  image?: string;
  link?: string;
  timeout?: number;
};

export interface ConfigSlice {
  dialogMessage: string | null;
  dialogResponse: boolean | null;
  toastMessage: ToastMessage | null;
  twibToDelete: TwibModel | null;
}

const initialState: ConfigSlice = {
  dialogMessage: null,
  dialogResponse: null,
  toastMessage: null,
  twibToDelete: null,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setToast(state, action: PayloadAction<ToastMessage | null>) {
      state.toastMessage = action.payload;
    },
    setDialogMessage(state, action: PayloadAction<string>) {
      state.dialogResponse = null;
      state.dialogMessage = action.payload;
    },
    setDialogResponse(state, action: PayloadAction<boolean>) {
      state.dialogResponse = action.payload;
      state.dialogMessage = null;
    },
    setTwibToDelete(state, action: PayloadAction<TwibModel | null>) {
      state.twibToDelete = action.payload;
    },
  },
});

export const {
  setToast,
  setDialogMessage,
  setDialogResponse,
  setTwibToDelete,
} = configSlice.actions;
export default configSlice.reducer;
