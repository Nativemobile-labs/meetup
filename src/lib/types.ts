export type AllConnections = {
  friends: UserModel[];
  following: UserModel[];
  followers: UserModel[];
};

export type BoundsModel = {
  sw_lat: number;
  sw_lng: number;
  ne_lat: number;
  ne_lng: number;
};

export type CategoryModel = {
  id?: number;
  external_id: string;
  name: string;
  plural_name: string;
  short_name: string;
  icon_prefix: string;
  icon_suffix: string;
  primary: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FilterVisibility = {
  id: number;
  label: string;
};

export type FilterTimeframe = {
  id: number;
  label: string;
};

export type Filters = {
  visibilities: {
    everything: number;
    going: number;
    myTwibs: number;
    list: FilterVisibility[];
  };
  timeframes: {
    anytime: number;
    thisWeek: number;
    today: number;
    list: FilterTimeframe[];
  };
};

export type GenderModel = {
  id: number;
  name: string;
  plural_name: string;
  treat_as_gender_id: number;
  require_own_label: boolean;
};

export type HourModel = {
  id: number;
  location_id: number;
  location: LocationModel;
  day: number;
  open: string;
  close: string;
  created_at: string;
  updated_at: string;
};

export type InviteModel = {
  id: number;
  invite_code: string;
  user_id: number;
  invited_user_id: number | null;
  twib_id: number | null;
  created_at: string;
  updated_at: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type LocationImageOverrideModel = {
  location_id: number;
  external_id: string;
  override_photo_url: string;
};

export type LocationType = 1 | 2; // 1 = business, 2 = address

export type LocationModel = {
  id: number;
  external_id: string;
  location_type: LocationType;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  country_code: string;
  icon_uri: string;
  image_reference_key: string;
  website: string;
  created_at: string;
  updated_at: string;
  twibs: TwibModel[];
  hours: HourModel[];
  categories: CategoryModel[];
  unseen_twib_count: number;
  override_photo_url: string | null;
  override_photo_thumb_url: string | null;
};

export type LocationWithTwibsModel = LocationModel & {
  twibs: TwibModel[];
};

export type FoursquareSearchResult = {
  categories: CategoryModel[];
  chains?: any[];
  distance: number;
  fsq_id: string;
  geocodes: {
    main: any;
    roof: any;
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
  related_places: any;
  timezone: string;
};

export type LocationSearchFilterModel = {
  categories: string[];
};

export type LookingForModel = {
  id: number;
  label: string;
  sort_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LookingForOption = {
  looking_for: LookingForModel;
  is_selected: boolean;
};

export type MessageGroupModel = {
  user: UserModel;
  messages: MessageModel[];
  index: number;
  out_of: number;
};

export type MessageModel = {
  id: number;
  chat_id: number;
  chat: MessageThreadModel;
  text: string;
  user: UserModel;
  user_id: number;
  reads: MessageReadModel[];
  created_at: string;
  updated_at: string;
  status: string;
};

export type MessageReadModel = {
  id: number;
  message_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
};

export type MessageThreadModel = {
  id: number;
  twib_id: number;
  twib: TwibModel;
  users: ChatUserModel[];
  created_at: string;
  updated_at: string;
  messages: MessageModel[];
  status: string;
  requesting_user_id: number;
  requesting_user: UserModel;
  pivot: {
    status: 1 | 2 | 3;
  };
};

export type PaymentTypeModel = {
  id: number;
  name: string;
  is_default: boolean;
  sort_number: number;
  created_at: string;
  updated_at: string;
};

export type SlimLocationModel = {
  id: number;
  external_id?: string;
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  image_reference_key?: string;
  twibs?: TwibModel[];
  unseen_twib_count?: number;
  distance_from_map_center?: number;
};

export type SlimTwibModel = {
  id: number;
  location_id: number;
  view_count: number;
  viewed: boolean;
};

export type SwipeLocationModel = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  external_id: string;
  image_reference_key: string;
  distance_from_map_center: number;
  address: string;
  city: string;
  region: string;
  postal_code: string;
};

export type SwipeTwibModel = {
  id: number;
  user_id: number;
  payment_type_id: number;
  location_id: number;
  location: SwipeLocationModel;
};

export type SwipeUserModel = {
  id: number;
  username: string;
  first_name: string;
  birth_date: string;
  emojis: string;
  photos: SwipeUserPhotoModel[];
  twibs: SwipeTwibModel[];
};

export type SwipeUserPhotoModel = {
  id: number;
  user_id: number;
  storage_url: string;
  thumb_url: string;
};

export type SystemMessageModel = {
  id: string;
  type: "system";
  text: string;
  created_at: string;
};

export type TwibStatusActive = 1;
export type TwibStatusInactive = 0;

export type NewTwibAddressModel = {
  location_type: 2;
  fsq_addr_id: string;
  primary: string;
  secondary: string;
};

export type NewTwibLocationModel = {
  id?: number;
  external_id: string;
  location_type: LocationType;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  image_reference_key: string;
  website: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  country_code: string;
  categories: CategoryModel[];
  hours: HourModel[];
};
export type SearchResultItem = NewTwibAddressModel | NewTwibLocationModel;
export type NewTwibModel = {
  visibility_type: VisibilityType;
  location_id?: number;
  location: NewTwibLocationModel;
  payment_type_id: number;
  description: string | null;
  twib_date: string | null;
  twib_time: string | null;
  image_uri: string;
  timezone: string;
};
export type TwibModel = {
  id: number;
  visibility_type: VisibilityType;
  location_id: number;
  location: LocationModel;
  user_id: number;
  user: UserModel;
  payment_type_id: number;
  type: PaymentTypeModel;
  status: TwibStatusActive | TwibStatusInactive;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  viewed: boolean;
  twib_date: string | null;
  twib_time: string | null;
  image_uri: string;
  timezone: string;
  chat: MessageThreadModel;
};

export type TwibRSVP = "accept" | "decline";

export type UserModel = {
  id: number;
  firebase_uid: string;
  firebase_push_token: string;
  phone: string;
  email: string;
  username: string;
  first_name: string;
  birth_date: string;
  gender_id: number;
  gender: GenderModel;
  searchable_gender_id: number;
  searchable_gender: GenderModel;
  gender_label: string;
  seeking_genders: GenderModel[];
  about_me: string;
  looking_for: LookingForModel[];
  emojis: string;
  photos: UserPhotoModel[];
  height: number;
  status: "created" | "active" | "paused" | "flagged" | "deactivated";
  profile_dynamic_link: string;
  locale: string;
  referral_code: string;
  referred_by: string;
  seeking_age_min: number;
  seeking_age_max: number;
  seeking_height_min: number;
  seeking_height_max: number;
  seeking_twibs_only: boolean;
  seeking_category_ids: number[];
  seeking_payment_type_ids: number[];
  seeking_payment_types: PaymentTypeModel[];
};

export type ChatUserStatus = 1 | 2 | 3;
export type ChatUserModel = UserModel & {
  pivot: {
    user_id: number;
    chat_id: number;
    status: ChatUserStatus;
    updated_at: string;
    created_at: string;
  };
};

export type UserPhotoModel = {
  id?: number;
  user_id: number;
  user?: UserModel;
  storage_url: string;
  thumb_url: string;
  sort_number: number;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
};

export type UserPreferencesModel = {
  id: number;
  user_id: number;
  nearby_twibs_notifications_enabled: boolean;
  reminder_notifications_enabled: boolean;
  incoming_message_notifications_enabled: boolean;
  ongoing_message_notifications_enabled: boolean;
  all_notifications_enabled: boolean;
  app_usage_tracking_enabled: boolean;
};

export type VisibilityType = 1 | 2 | 3 | 4; // 1 = public, 2 = friends of friends, 3 = friends, 4 = private

export type WebsocketEvent = {
  event: "message_sent" | "message_received";
  payload: {
    [key: string]: any;
  };
};
export type WebsocketMessageEvent = {
  event: "message_received";
  payload: {
    message: MessageModel;
  };
};
export type WebsocketStatus = "connected" | "disconnected" | "connecting";
