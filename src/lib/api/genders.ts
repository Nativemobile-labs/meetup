import { GenderModel } from "../types";
import { api } from "./api";

let _cache: GenderModel[] = [];

export const fetchGenders = async (
  reFetch: boolean = false,
): Promise<GenderModel[]> => {
  if (_cache.length > 0 && !reFetch) {
    return _cache;
  }

  const data = await api.serverAuth.get<{ genders: GenderModel[] }>(
    "/api/v1/genders/list",
  );
  _cache = data.genders;
  return data.genders;
};

export const getGenderById = async (id: number): Promise<GenderModel> => {
  if (_cache.length > 0 && _cache.find((g) => g.id === id)) {
    return _cache.find((g) => g.id === id)!;
  }

  if (_cache.length === 0) {
    await fetchGenders();
  }

  return _cache.find((g) => g.id === id)!;
};

export const fetchSeekingGenders = async (): Promise<GenderModel[]> => {
  const data = await api.serverAuth.get<{ genders: GenderModel[] }>(
    "/api/v1/genders/seeking/list",
  );
  return data.genders;
};
