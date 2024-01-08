import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageThreadModel } from "../../lib/types";

export interface MessageThreadsSlice {
  threads: MessageThreadModel[];
}

const initialState: MessageThreadsSlice = {
  threads: [],
};

const messageThreadsSlice = createSlice({
  name: "message-threads",
  initialState,
  reducers: {
    setMessageThreads(state, action: PayloadAction<MessageThreadModel[]>) {
      state.threads = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setMessageThreads } = messageThreadsSlice.actions;
export default messageThreadsSlice.reducer;
