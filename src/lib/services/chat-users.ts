import { ChatUserModel } from "../types";
import { chatUserStatus } from "../dictionary";

export const filterAcceptedUsers = (user: ChatUserModel) => {
  return user.pivot.status === chatUserStatus.accepted;
};
