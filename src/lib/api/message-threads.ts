import { api } from "./api";
import {
  MessageModel,
  MessageThreadModel,
  TwibModel,
  TwibRSVP,
} from "../types";

export const createThread = async (
  twib: TwibModel,
  message: string,
): Promise<MessageThreadModel> => {
  const data = await api.userAuth.post<{ thread: MessageThreadModel }>(
    `/api/v1/user/:firebase_uid/threads`,
    {
      twib_id: twib.id,
      message,
    },
  );

  return data.thread;
};

export const fetchThread = async (
  threadId: number,
): Promise<MessageThreadModel> => {
  const data = await api.userAuth.get<{ thread: MessageThreadModel }>(
    `/api/v1/user/:firebase_uid/threads/${threadId}`,
  );

  return data.thread;
};

export const fetchThreads = async (): Promise<MessageThreadModel[]> => {
  const data = await api.userAuth.get<{ threads: MessageThreadModel[] }>(
    `/api/v1/user/:firebase_uid/threads`,
  );

  return data.threads;
};

export const fetchThreadMessages = async (
  thread: MessageThreadModel,
): Promise<MessageModel[]> => {
  const data = await api.userAuth.get<{ messages: MessageModel[] }>(
    `/api/v1/user/:firebase_uid/threads/${thread.id}/messages`,
  );

  return data.messages;
};

export const submitRSVP = async (
  thread: MessageThreadModel,
  rsvp: TwibRSVP,
): Promise<MessageThreadModel> => {
  const data = await api.userAuth.put<{ thread: MessageThreadModel }>(
    `/api/v2/user/:firebase_uid/chats/${thread.id}/rsvp`,
    {
      rsvp,
    },
  );

  return data.thread;
};
