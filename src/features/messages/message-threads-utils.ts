import { MessageThreadModel } from "../../lib/types";

export const threadStatus = (
  thread: MessageThreadModel,
): "pending" | "active" | "declined" => {
  if (thread.pivot.status === 2) {
    return "active";
  }
  if (thread.pivot.status === 3) {
    return "declined";
  }
  return "pending";
};
