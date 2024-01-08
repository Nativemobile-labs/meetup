import {
  BoundsModel,
  LocationModel,
  LocationWithTwibsModel,
  SlimLocationModel,
} from "../types";
import { api } from "./api";

export const fetchLocationById = async (id: number): Promise<LocationModel> => {
  const data = await api.userAuth.get<{ location: LocationModel }>(
    `/api/v1/locations/${id}`
  );
  return data.location;
};


export const fetchLocationByExternalId = async (
  externalId: string
): Promise<LocationModel> => {
  const data = await api.userAuth.get<{ location: LocationModel }>(
    `/api/v1/user/:firebase_uid/locations/external/${externalId}`
  );
  return data.location;
};

export const fetchLocationsWithinBounds = async (
  bounds: BoundsModel
): Promise<LocationModel[]> => {
  const data = await api.userAuth.get<{ locations: LocationModel[] }>(
    `/api/v1/user/:firebase_uid/locations/${bounds.sw_lat}/${bounds.sw_lng}/${bounds.ne_lat}/${bounds.ne_lng}`,
    bounds
  );
  return data.locations;
};

export const fetchLocations = async (): Promise<LocationModel[]> => {
  const data = await api.userAuth.get<{ locations: LocationModel[] }>(
    `/api/v2/user/:firebase_uid/locations`
  );
  return data.locations;
};

export const updateLocationImage = async (
  locationId: number,
  imageUri: string
): Promise<void> => {
  await api.userAuth.put(`/api/v1/locations/${locationId}/image`, {
    image_reference_key: imageUri,
  });
};

export const searchFoursquare = async (
  query: string,
  latitude: string | number,
  longitude: string | number
): Promise<any> => {
  const data = await api.userAuth.get<any>(
    `/api/v2/user/:firebase_uid/locations/foursquare?query=${encodeURIComponent(
      query
    )}&lat=${latitude}&lng=${longitude}`
  );
  return data.results;
};

/**
 * return locations with twibs that match the user based on the twib visibility types
 */
export const matchedLocations = async (
  lat: number | string,
  lng: number | string
): Promise<LocationModel[]> => {
  const data = await api.userAuth.get<{ locations: LocationModel[] }>(
    `/api/v2/user/:firebase_uid/locations/matched`,
    { lat, lng }
  );
  return data.locations;
};

export const fetchLocationWithTwibs = async (
  locationId: number
): Promise<LocationWithTwibsModel> => {
  const data = await api.userAuth.get<{ location: LocationWithTwibsModel }>(
    `/api/v2/user/:firebase_uid/locations/${locationId}`
  );
  return data.location;
};
