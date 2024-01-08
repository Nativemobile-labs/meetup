import { api } from "./api";
import { UserModel, UserPhotoModel, UserPreferencesModel } from "../types";
// import {
//   auth,
//   getFirebasePushToken,
//   supportsMessaging,
// } from "../../config/firebase";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";
import logger from "../utils/logger";
import inviteService from "../services/invite-service";
// import { getRollbar } from "../../config/rollbar";

export const fetchUser = async (): Promise<UserModel> => {
  const data = await api.userAuth.get<{ user: UserModel }>(
    `/api/v1/user/:firebase_uid`,
    {},
  );
  return data!.user;
};

export const fetchUserById = async (userId?: string): Promise<UserModel> => {
  const data = await api.userAuth.get<{ user: UserModel }>(
    `/api/v1/users/${userId}`,
    {},
  );
  return data!.user;
};

export const createUser = async (phone: string): Promise<UserModel> => {
  const data = await api.userAuth.post<{ user: UserModel }>(`/api/v1/user`, {
    firebase_uid: auth().currentUser!.uid,
    phone,
    firebase_push_token: await messaging().getToken(),
    locale: "US",
    referred_by: "",
  });
  return data.user;
};

export const putUserPhotos = async (photos: UserPhotoModel[]) => {
  const payload = {
    photos,
  };
  await api.userAuth.post("/api/v1/user/:firebase_uid/photos", payload);
};

export const finalizeUser = async (
  firstName: string,
  username: string,
  birthdate: string,
  photoUrl: string,
  genderId: number,
): Promise<UserModel> => {
  const payload = {
    first_name: firstName,
    username: username,
    birth_date: birthdate,
    gender_id: genderId,
    searchable_gender_id: genderId,
    height: 70,
  };

  const user = await api.userAuth.put<UserModel>(
    "/api/v1/user/:firebase_uid/finalize",
    payload,
  );

  await putUserPhotos([
    {
      user_id: user.id,
      storage_url: photoUrl,
      thumb_url: photoUrl,
      sort_number: 1,
      is_primary: true,
    },
  ]);

  inviteService.clearInviteCode();

  return user;
};

export type UpdateUserPayload = {
  profile?: UserModel;
  photos?: UserPhotoModel[];
};
export const updateUser = async (
  payload: UpdateUserPayload,
): Promise<UserModel> => {
  const data = await api.userAuth.put<{ user: UserModel }>(
    `/api/v1/user/:firebase_uid`,
    payload,
  );

  if (payload.photos) {
    await putUserPhotos(payload.photos);
  }

  return data.user;
};

export const deleteUser = async () => {
  await api.userAuth.delete(`/api/v1/user/:firebase_uid/delete`);
};

export const refreshPushToken = async () => {
  // const rollbar = getRollbar();

  // if (!(await supportsMessaging())) {
  //   // rollbar.error("messaging not supported");
  //   return;
  // }

  const token = await messaging().getToken();
  await api.userAuth
    .put("/api/v1/user/:firebase_uid/push-token", {
      firebase_push_token: token,
    })
    .catch((err) => logger("failed to push push token"));
};

export const fetchPreferences = async (): Promise<UserPreferencesModel> => {
  const data = await api.userAuth.get<{ preferences: UserPreferencesModel }>(
    `/api/v1/user/:firebase_uid/preferences`,
  );
  return data.preferences;
};

export const updatePreferences = async (
  preferences: UserPreferencesModel,
): Promise<UserPreferencesModel> => {
  const data = await api.userAuth.put<{ preferences: UserPreferencesModel }>(
    `/api/v1/user/:firebase_uid/preferences`,
    {
      preferences,
    },
  );

  return data.preferences;
};

export const usernameInUse = async (
  askingUser: UserModel,
  username: string,
): Promise<boolean> => {
  try {
    return api.userAuth
      .get<{ user: UserModel | null }>(`/api/v1/user/username/${username}`)
      .then((res) => {
        if (res.user === null) {
          return false;
        }
        return askingUser.id !== res.user.id;
      })
      .catch((err) => false);
  } catch (e) {
    return true;
  }
};
