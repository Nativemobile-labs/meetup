import { AllConnections, UserModel } from "../types";
import { api } from "./api";

export const search = async (query: string): Promise<UserModel[]> => {
  if (query.trim().length === 0) {
    return [];
  }

  const data = await api.userAuth.get<{ users: UserModel[] }>(
    `/api/v2/user/:firebase_uid/search?search=${encodeURIComponent(query)}`,
  );

  return data.users;
};

export const addFriend = async (friend: UserModel): Promise<AllConnections> => {
  return await api.userAuth.post<AllConnections>(
    `/api/v2/user/:firebase_uid/follows/${friend.id}`,
  );
};

export const fetchAllConnections = async (): Promise<AllConnections> => {
  return api.userAuth.get<AllConnections>(`/api/v2/user/:firebase_uid/follows`);
};

export const fetchSuggestions = async (): Promise<UserModel[]> => {
  const data = await api.userAuth.get<{ users: UserModel[] }>(
    `/api/v2/user/:firebase_uid/friends/suggestions`,
  );
  return data.users;
};
