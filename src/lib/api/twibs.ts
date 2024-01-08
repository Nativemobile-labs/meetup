import {
  NewTwibModel,
  SlimLocationModel,
  TwibModel,
  UserModel,
} from "../types";
import { api } from "./api";
import { getDistance } from "geolib";

export const fetchTwibById = async (id: number): Promise<TwibModel> => {
  const data = await api.userAuth.get<{ twib: TwibModel }>(
    `/api/v1/twibs/${id}`
  );
  return data.twib;
};

export const createTwib = async (
  twib: NewTwibModel,
  invites: UserModel[]
): Promise<TwibModel> => {
  const payload = {
    twib,
    invites: invites.map((invite) => ({ id: invite.id })),
  };
  const data = await api.userAuth.post<{ twib: TwibModel }>(
    "/api/v2/user/:firebase_uid/twibs",
    payload
  );

  return data.twib;
};

/**
 * Currently only supports updating:
 * - description
 * - twib_date
 * - twib_time
 * @param twib
 */
export const updateTwib = async (twib: TwibModel): Promise<TwibModel> => {
  const payload = {
    twib: {
      description: twib.description,
      twib_date: twib.twib_date,
      twib_time: twib.twib_time,
      timezone: twib.timezone,
    },
  };
  const data = await api.userAuth.put<{ twib: TwibModel }>(
    `/api/v2/user/:firebase_uid/twibs/${twib.id}`,
    payload
  );
  return data.twib;
};

export const deleteTwib = async (twib: TwibModel): Promise<void> => {
  // @todo
};

export const fetchTwibsCreatedByOtherUser = async (
  otherUser: UserModel
): Promise<TwibModel[]> => {
  const data = await api.userAuth.get<{ twibs: TwibModel[] }>(
    `/api/v1/user/${otherUser.firebase_uid}/twibs`
  );
  return data.twibs;
};

export const fetchTwibsCreatedByUser = async (): Promise<TwibModel[]> => {
  const data = await api.userAuth.get<{ twibs: TwibModel[] }>(
    "/api/v1/user/:firebase_uid/twibs"
  );
  return data.twibs;
};

/**
 * includes active, inactive, and "expired" twibs
 */
export const fetchAllTwibsCreatedByUser = async (): Promise<TwibModel[]> => {
  const data = await api.userAuth.get<{ twibs: TwibModel[] }>(
    "/api/v1/user/:firebase_uid/twibs/all"
  );
  return data.twibs;
};

export const fetchTwibsAtLocation = async (
  locationId: number
): Promise<TwibModel[]> => {
  const data = await api.userAuth.get<{ twibs: TwibModel[] }>(
    `/api/v1/user/:firebase_uid/locations/${locationId}/twibs`
  );
  return data.twibs;
};

export const fetchNearbyTwibLocations = async (
  currentLat: number,
  currentLng: number
): Promise<SlimLocationModel[]> => {
  const data = await api.userAuth.get<{ locations: SlimLocationModel[] }>(
    `/api/v1/user/:firebase_uid/locations/all`
  );

  const locationModels: SlimLocationModel[] = data["locations"];

  const locationsWithDistance = locationModels.map((location) => {
    location.distance_from_map_center = getDistanceBetweenTwoPoints(
      currentLat,
      currentLng,
      location.latitude,
      location.longitude
    );
    return location;
  });

  locationsWithDistance.sort(
    (a, b) => a.distance_from_map_center! - b.distance_from_map_center!
  );

  return locationsWithDistance;
};

export const disableTwib = async (twib: TwibModel): Promise<void> => {
  await api.userAuth.delete<any>(`/api/v1/user/:firebase_uid/twib/${twib.id}`);
};

function getDistanceBetweenTwoPoints(
  latOne: number,
  lngOne: number,
  latTwo: number,
  lngTwo: number
): number {
  return getDistance(
    { latitude: latOne, longitude: lngOne },
    { latitude: latTwo, longitude: lngTwo }
  );
}
