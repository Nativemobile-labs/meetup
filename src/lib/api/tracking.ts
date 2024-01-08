import { UserModel } from "../types";
import { api } from "./api";
import { DateTime } from "luxon";
import logger from "../utils/logger";
import { auth } from "../../config/firebase";

const track = async (event: TrackingEventTypes, properties: any = {}) => {
  if (auth.currentUser === null) {
    logger("User is not logged in, not tracking event");
    return;
  }
  tracking.counts[event] = DateTime.utc();
  await api.userAuth.post("/api/v2/user/:firebase_uid/tracking", {
    event_name: event,
    payload: properties,
  });
};

type TrackingEventTypes = "app_opened";
type Tracking = {
  user: UserModel | null;
  counts: {
    [key in TrackingEventTypes]: DateTime | null;
  };
  setUser(user: UserModel): Tracking;
  appOpened(): Promise<void>;
  appBackgrounded(): Promise<void>;
  appForegrounded(): Promise<void>;
};
const tracking: Tracking = {
  user: null,
  counts: {
    app_opened: null,
  },
  setUser(user: UserModel): typeof this {
    this.user = user;
    return this;
  },
  async appOpened() {
    if (this.counts.app_opened !== null) {
      return;
    }
    await track("app_opened");
  },
  async appBackgrounded() {
    logger("App is backgrounded!");
    this.counts.app_opened = null;
  },
  async appForegrounded() {
    logger("App is in the foreground!");
    await this.appOpened();
  },
};

export default tracking;
