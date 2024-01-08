import { api } from "./api";
import { NewTwibAddressModel, NewTwibLocationModel } from "../types";
import { locationTypes } from "../dictionary";

export const getImageSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const min = Math.min(width, height);
  // find the largest number that is a multiple of 100, up to a maximum of 800, that is less than min
  const size = Math.min(Math.floor(min / 100) * 100, 800);
  return `${size}x${size}`;
};

export type FoursquareAddress = {
  fsq_addr_id: string;
  location: {
    address: string;
    admin_region: string;
    country: string;
    locality: string;
    post_town: string;
    postcode: string;
    region: string;
  };
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
};
export const address = async (
  fsqAddrId: string,
  sessionToken: string = ""
): Promise<NewTwibLocationModel> => {
  const data = await api.userAuth.get<FoursquareAddress>(
    `/api/v2/user/:firebase_uid/locations/foursquare/address/${fsqAddrId}`,
    sessionToken ? { session_token: sessionToken } : {}
  );

  return {
    external_id: data.fsq_addr_id,
    location_type: locationTypes.address,
    name: data.location.address,
    address: data.location.address,
    city: data.location.locality,
    region: data.location.region,
    postal_code: data.location.postcode,
    country: data.location.country,
    country_code: data.location.country,
    latitude: data.geocodes.main.latitude,
    longitude: data.geocodes.main.longitude,
    image_reference_key: "",
    website: "",
    hours: [],
    categories: [],
  };
};

export type FoursquareAutocompleteQuery = {
  query: string;
  ll: string; // "${lat},${lng}"
  radius?: number; // in meters
  types?: string;
  bias?: string;
  session_token?: string;
};
export type FoursquareAutocompleteResponseAddress = {
  type: "address";
  text: {
    primary: string;
    secondary: string;
    highlight: {
      start: number;
      length: number;
    }[];
  };
  link: string;
  address: {
    address_id: string;
  };
};
export type FoursquareAutocompleteResponsePlace = {
  type: "place";
  text: {
    primary: string;
    secondary: string;
    highlight: {
      start: number;
      length: number;
    }[];
  };
  link: string;
  place: {
    fsq_id: string;
    categories: {
      id: number;
      name: string;
      icon: {
        prefix: string;
        suffix: string;
      };
    }[];
    distance: number; // meters
    geocodes: {
      main: {
        latitude: number;
        longitude: number;
      };
      roof?: {
        latitude: number;
        longitude: number;
      };
    };
    location: {
      address: string;
      census_block: string;
      country: string;
      cross_street: string;
      dma: string;
      formatted_address: string;
      locality: string;
      postcode: string;
      region: string;
    };
    name: string;
  };
};
export type FoursquareAutocompleteResponse = {
  results: (
    | FoursquareAutocompleteResponsePlace
    | FoursquareAutocompleteResponseAddress
  )[];
};

export const autocomplete = async (
  payload: FoursquareAutocompleteQuery
): Promise<(NewTwibLocationModel | NewTwibAddressModel)[]> => {
  const data = await api.userAuth.get<FoursquareAutocompleteResponse>(
    `/api/v2/user/:firebase_uid/locations/foursquare/autocomplete`,
    payload
  );

  return data.results.map(
    (
      item:
        | FoursquareAutocompleteResponsePlace
        | FoursquareAutocompleteResponseAddress
    ) => {
      if (item.type === "address") {
        return {
          location_type: locationTypes.address,
          fsq_addr_id: item.address.address_id,
          primary: item.text.primary,
          secondary: item.text.secondary,
        } as NewTwibAddressModel;
      }

      return {
        external_id: item.place.fsq_id,
        location_type: locationTypes.place,
        name: item.place.name,
        address: item.place.location.address,
        city: item.place.location.locality,
        region: item.place.location.region,
        postal_code: item.place.location.postcode,
        country: item.place.location.country,
        country_code: item.place.location.country,
        latitude: item.place.geocodes.main.latitude,
        longitude: item.place.geocodes.main.longitude,
        image_reference_key: "",
        website: "",
        hours: [],
        categories: item.place.categories.map((category, index) => {
          return {
            name: category.name,
            icon_prefix: category.icon.prefix,
            icon_suffix: category.icon.suffix,
            external_id: category.id.toString(),
            plural_name: category.name,
            short_name: category.name,
            primary: index === 0,
          };
        }),
      } as NewTwibLocationModel;
    }
  );
};

export type FoursquareSearchQuery = {
  query: string;
  ll: string; // "${lat},${lng}"
  radius?: number; // in meters
  categories?: string;
  chains?: string;
  exclude_chains?: string;
  exclude_all_chains?: boolean;
  fields?: string;
  min_price?: number;
  max_price?: number;
  open_at?: string;
  open_now?: boolean;
  ne?: string; // "${lat},${lng}"
  sw?: string; // "${lat},${lng}"
  near?: string;
  polygon?: string;
  sort?: "relevance" | "rating" | "distance"; // defaults to "relevance"
  limit?: number; // defaults to 10
  session_token?: string;
};
export type FoursquareSearchResponseItem = {
  fsq_id: string;
  categories: {
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }[];
  chains: any[];
  distance: number; // meters
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
    roof?: {
      latitude: number;
      longitude: number;
    };
  };
  link: string;
  location: {
    address: string;
    address_extended: string;
    census_block: string;
    country: string;
    cross_street: string;
    dma: string;
    formatted_address: string;
    locality: string;
    postcode: string;
    region: string;
  };
  name: string;
  related_places: {
    parent: {
      fsq_id: string;
      name: string;
    };
  };
  timezone: string;
};
export type FoursquareSearchResponse = {
  results: FoursquareSearchResponseItem[];
};

export const search = async (
  payload: FoursquareSearchQuery
): Promise<NewTwibLocationModel[]> => {
  const data = await api.userAuth.get<FoursquareSearchResponse>(
    `/api/v2/user/:firebase_uid/locations/foursquare/search`,
    payload
  );
  return data.results.map((item: FoursquareSearchResponseItem) => {
    return {
      external_id: item.fsq_id,
      location_type: 1,
      name: item.name,
      address: item.location.address,
      city: item.location.locality,
      region: item.location.region,
      postal_code: item.location.postcode,
      country: item.location.country,
      country_code: item.location.country,
      latitude: item.geocodes.main.latitude,
      longitude: item.geocodes.main.longitude,
      image_reference_key: "",
      website: "",
      hours: [],
      categories: item.categories.map((category, index) => {
        return {
          name: category.name,
          icon_prefix: category.icon.prefix,
          icon_suffix: category.icon.suffix,
          external_id: category.id.toString(),
          plural_name: category.name,
          short_name: category.name,
          primary: index === 0,
        };
      }),
    };
  });
};

export type FoursquareDetailsQuery = {
  fields?: string;
  session_token?: string;
};
export type FoursquareDetailsResponse = {
  fsq_id: string;
  categories: {
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }[];
  chains: [];
  geocodes: {
    drop_off?: {
      latitude: number;
      longitude: number;
    };
    main: {
      latitude: number;
      longitude: number;
    };
    roof?: {
      latitude: number;
      longitude: number;
    };
  };
  link: string;
  location: {
    address: string;
    census_block: string;
    country: string;
    cross_street: string;
    dma: string;
    formatted_address: string;
    locality: string;
    postcode: string;
    region: string;
  };
  name: string;
  related_places: {};
  timezone: string;
};
export const details = async (
  fsqId: string,
  payload: FoursquareDetailsQuery = {},
  fetchPhoto: boolean = true
): Promise<NewTwibLocationModel> => {
  const fsqLocation = await api.userAuth.get<FoursquareDetailsResponse>(
    `/api/v2/user/:firebase_uid/locations/foursquare/${fsqId}/details`,
    payload
  );
  const fsqPhotos = fetchPhoto ? await photos(fsqId, { limit: 1 }) : [];

  const fsqPhotoUrl =
    fsqPhotos.length > 0
      ? `${fsqPhotos[0].prefix}${getImageSize(fsqPhotos[0])}${
          fsqPhotos[0].suffix
        }`
      : "";

  return {
    external_id: fsqLocation.fsq_id,
    location_type: 1,
    name: fsqLocation.name,
    address: fsqLocation.location.address,
    city: fsqLocation.location.locality,
    region: fsqLocation.location.region,
    postal_code: fsqLocation.location.postcode,
    country: fsqLocation.location.country,
    country_code: fsqLocation.location.country,
    latitude: fsqLocation.geocodes.main.latitude,
    longitude: fsqLocation.geocodes.main.longitude,
    image_reference_key: fsqPhotoUrl,
    website: "",
    hours: [],
    categories: fsqLocation.categories.map((category, index) => {
      return {
        name: category.name,
        icon_prefix: category.icon.prefix,
        icon_suffix: category.icon.suffix,
        external_id: category.id.toString(),
        plural_name: category.name,
        short_name: category.name,
        primary: index === 0,
      };
    }),
  };
};

export type FoursquarePhotosQuery = {
  limit?: number;
  sort?: "popular" | "newest"; // defaults to "popular"
  classifications?: "food" | "indoor" | "menu" | "outdoor"; // defaults to all
};
export type FoursquarePhotosResponseItem = {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
};
export const photos = async (
  fsqId: string,
  payload: FoursquarePhotosQuery = {}
) => {
  return await api.userAuth.get<FoursquarePhotosResponseItem[]>(
    `/api/v2/user/:firebase_uid/locations/foursquare/${fsqId}/photos`,
    payload
  );
};
