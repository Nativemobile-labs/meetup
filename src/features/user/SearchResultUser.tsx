import { UserModel } from "../../lib/types";
import { Button, Card } from "flowbite-react";
import { useState } from "react";
import { addFriend } from "../../lib/api/friends";
import { useAppDispatch } from "../../state/hooks";
import { setAllConnections } from "./user-slice";
import CircleAvatar from "../../components/CircleAvatar";
import { generatePath, useNavigate } from "react-router";
import { routes } from "../../config/routes";
import { PhotoUrl } from "../../lib/utils/photo-url";

export type SearchResultUserProps = {
  user: UserModel;
};
export default function SearchResultUser({ user }: SearchResultUserProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);
  const [friendAdded, setFriendAdded] = useState<boolean>(false);
  const handleAddFriend = async () => {
    setIsAddingFriend(true);

    const result = await addFriend(user);
    dispatch(setAllConnections(result));

    setFriendAdded(true);
    setIsAddingFriend(false);
  };

  const handleUnAddFriend = async () => {
    setIsAddingFriend(true);
    setFriendAdded(false);

    setIsAddingFriend(false);
  };

  const handleUserClicked = () => {
    navigate(generatePath(routes.map, { view: "user", id: user.id }));
  };

  return (
    <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col p-4">
      <div className="flex flex-row items-center justify-between w-full gap-1">
        <div
          className="flex flex-row items-center"
          style={{
            display: "-webkit-inline-box",
          }}
          onClick={handleUserClicked}
        >
          <CircleAvatar imageUri={PhotoUrl.user(user).thumb} />
          <div
            className={
              "w-full flex flex-row justify-between items-center h-full ml-3"
            }
          >
            <div className={"flex flex-col justify-between h-full"}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                {user.first_name}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                @{user.username}
              </span>
            </div>
          </div>
        </div>
        <div className="">
          {!friendAdded && (
            <Button
              className={"bg-gradient-button"}
              pill
              disabled={isAddingFriend}
              onClick={handleAddFriend}
            >
              <p>Add Friend</p>
            </Button>
          )}
          {friendAdded && <p className="mr-2 text-s">✓ Added</p>}
        </div>
      </div>
    </div>
  );
}
