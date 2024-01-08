import { ChatUserStatus, Filters, LocationType, VisibilityType } from "./types";
import { ReactNode } from "react";
import { BsGift, BsGlobeAmericas, BsPiggyBank } from "react-icons/bs";
import { LuCherry } from "react-icons/lu";
import { GiReceiveMoney, GiThreeFriends } from "react-icons/gi";
import { MdMoneyOff, MdPeople } from "react-icons/md";
import { BiSolidLockAlt } from "react-icons/bi";
import IconFriends from "../components/icons/IconFriends";

export const MAX_Z_INDEX = 2147483647;

export const filters: Filters = {
  visibilities: {
    everything: 1,
    going: 2,
    myTwibs: 3,
    list: [
      { id: 1, label: "Everything" },
      { id: 2, label: "Going" },
      { id: 3, label: "My Twibs" },
    ],
  },
  timeframes: {
    anytime: 1,
    thisWeek: 2,
    today: 3,
    list: [
      { id: 1, label: "Anytime" },
      { id: 2, label: "This Week" },
      { id: 3, label: "Today" },
    ],
  },
};

export const visibilityTypes: { [type: string]: VisibilityType } = {
  public: 1,
  friendsOfFriends: 2,
  friends: 3,
  private: 4,
};

export const visibilityByType = (visibilityType: number) =>
  visibilityTypeOptions.find((t) => t.value === visibilityType)?.label;

export type Icons = {
  [key: number]: JSX.Element;
};

export const iconForVisibilityType = (visibilityType: number) => {
  const icons: Icons = {
    1: <BsGlobeAmericas size={20} />,
    2: (
      <div
        style={{
          transform: "scale(0.75)",
        }}
      >
        <IconFriends />
      </div>
    ),
    3: <MdPeople size={20} />,
    4: <BiSolidLockAlt size={20} />,
  };
  return icons[visibilityType as keyof Icons];
};

export const visibilityTypeOptions: { label: string; value: VisibilityType }[] =
  [
    { label: "Public", value: visibilityTypes.public },
    {
      label: "Friends & Their Friends",
      value: visibilityTypes.friendsOfFriends,
    },
    { label: "Friends", value: visibilityTypes.friends },
    { label: "Selected Friends", value: visibilityTypes.private },
  ];

export const locationTypes: { [type: string]: LocationType } = {
  place: 1,
  address: 2,
};

export const paymentTypeDetails: {
  [name: string]: { icon: ReactNode; description: string };
} = {
  "Treat Me": {
    icon: "🫴",
    // icon: <BsGift />,
    description: "",
  },
  Splitsies: {
    icon: "🍒",
    // icon: <LuCherry />,
    description: "",
  },
  "My Treat": {
    icon: "🎁",
    // icon: <GiReceiveMoney className={"text-lg"} />,
    description: "",
  },
  Free: {
    // icon: <TbFreeRights className={"text-lg"} />,
    icon: "🆓",
    // icon: <MdMoneyOff className={"text-lg"} />,
    description: "",
  },
  "Pay What You Can": {
    icon: "💸",
    // icon: <BsPiggyBank className={"text-lg"} />,
    description: "",
  },
};

export const chatUserStatus: { [name: string]: ChatUserStatus } = {
  invited: 1,
  accepted: 2,
  declined: 3,
};

export const twibStatus: { [name: string]: 0 | 1 } = {
  inactive: 0,
  active: 1,
};
