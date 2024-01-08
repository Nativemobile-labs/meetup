import { useState } from "react";
import { addFriend } from "../../lib/api/friends";
import { Button, Card } from "flowbite-react";
import { UserModel } from "../../lib/types";
import { generatePath, useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import { PhotoUrl } from "../../lib/utils/photo-url";
import { BiStar } from "react-icons/bi";

export type FriendUserProps = {
  user: UserModel;
  isMutual: boolean;
};
export default function FriendUser({ user, isMutual }: FriendUserProps) {
  const navigate = useNavigate();
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);
  const [friendAdded, setFriendAdded] = useState<boolean>(false);
  const handleAddFriend = async () => {
    setIsAddingFriend(true);

    const result = await addFriend(user);

    setFriendAdded(true);
    setIsAddingFriend(false);
  };

  const handleUnAddFriend = async () => {
    setIsAddingFriend(true);
    setFriendAdded(false);

    setIsAddingFriend(false);
  };

  const handleViewProfile = () => {
    navigate(
      generatePath(routes.map, {
        view: "user",
        id: user.id.toString(),
      })
    );
  };

  return (
    <Card>
      <div className="flex flex-row items-center">
        <img
          alt={`${user.first_name} image`}
          className="rounded shadow-lg mr-2 aspect-square"
          height="72"
          src={PhotoUrl.user(user).thumb}
          width="72"
        />
        <div
          className={"w-full flex flex-row justify-between items-center h-full"}
        >
          <div className={"flex flex-col justify-between h-full"}>
            <h5 className="text-xl font-medium text-gray-900 dark:text-white flex flex-row justify-start items-center">
              <span>{user.first_name}</span>
              {isMutual && <BiStar className={"ml-2"} />}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              @{user.username}
            </span>
          </div>

          <div className="">
            <Button
              pill
              size={"sm"}
              disabled={isAddingFriend}
              onClick={handleViewProfile}
              className={"text-sm bg-gradient-button"}
            >
              <p>View Profile</p>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
