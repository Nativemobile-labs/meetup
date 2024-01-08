import { MessageThreadModel, UserModel } from "../types";
import { getSocket } from "../../config/sockets";
import logger from "../utils/logger";

export const sendMessage = async (
  thread: MessageThreadModel,
  user: UserModel,
  text: string
) => {
  const socket = getSocket(user);

  logger("WebSocket.OPEN", WebSocket.OPEN);
  logger(socket.readyState);

  if (socket.readyState !== WebSocket.OPEN) {
    // @todo: fall back to sending the message via the API
    logger("socket not open");
    return;
  }

  socket.send(
    JSON.stringify({
      event: "message_sent",
      payload: {
        chat_id: thread.id,
        user_id: user.id,
        text,
      },
    })
  );
};
