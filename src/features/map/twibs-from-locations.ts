import { LocationModel, TwibModel } from "../../lib/types";

export const twibsFromLocations = (locations: LocationModel[]): TwibModel[] => {
  return locations.reduce((acc, location) => {
    const twibs = [...location.twibs];
    const locationCopy = { ...location };
    // @ts-ignore
    delete locationCopy.twibs;
    const extendedTwibs = twibs.map((twib) => {
      return {
        ...twib,
        location: locationCopy,
      };
    });
    return [...acc, ...extendedTwibs];
  }, [] as TwibModel[]);
};
