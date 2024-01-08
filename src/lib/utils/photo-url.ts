import placeholder from "../../assets/images/location.png";
import addressPlaceholder from "../../assets/images/house.jpeg";
import {
  LocationModel,
  SlimLocationModel,
  TwibModel,
  UserModel,
} from "../types";

export const PhotoUrl = {
  location(location: LocationModel | SlimLocationModel): string {
    // this is an address-only location
    if (location.name === location.address) {
      return addressPlaceholder;
    }

    if (
      "override_photo_url" in location &&
      location.override_photo_url !== null
    ) {
      return location.override_photo_url;
    }

    if (
      !("image_reference_key" in location) ||
      location.image_reference_key === null ||
      location.image_reference_key === ""
    ) {
      return placeholder;
    }

    return location.image_reference_key!;
  },

  twib(twib: TwibModel): string {
    return twib.image_uri || this.location(twib.location);
  },

  user(user: UserModel | null): { full: string; thumb: string } {
    if (user === null) {
      return {
        full: placeholder,
        thumb: placeholder,
      };
    }

    const full =
      user.photos.find((photo) => photo.is_primary)?.storage_url || placeholder;
    const thumb =
      user.photos.find((photo) => photo.is_primary)?.thumb_url || placeholder;

    return {
      full,
      thumb,
    };
  },
};
