import { InviteModel, TwibModel } from "../types";
import { api } from "./api";

export const createInvite = async (twib?: TwibModel): Promise<InviteModel> => {
  const data = await api.userAuth.post<{ invite: InviteModel }>(
    `/api/v2/user/:firebase_uid/invites`,
    typeof twib !== "undefined" ? { twib_id: twib.id } : {}
  );
  return data.invite;
};

export const fetchInviteForUser = async (): Promise<InviteModel | null> => {
  try {
    const data = await api.userAuth.get<{ invite: InviteModel }>(
      `/api/v2/user/:firebase_uid/invite`
    );
    return data.invite;
  } catch (e) {
    return null;
  }
};

// check to see that an invite exists with the given code, and that it hasn't been used yet
export const inviteCodeIsValid = async (
  inviteCode: string
): Promise<boolean> => {
  try {
    const data = await api.userAuth.get<{ valid: boolean }>(
      `/api/v2/user/:firebase_uid/invites/${inviteCode}/valid`
    );
    return data.valid;
  } catch (e) {
    return false;
  }
};

export const acceptInvite = async (
  inviteCode: string
): Promise<InviteModel> => {
  const data = await api.userAuth.put<{ invite: InviteModel }>(
    `/api/v2/user/:firebase_uid/invites/${inviteCode}/accept`
  );
  return data.invite;
};
