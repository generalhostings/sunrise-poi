import raw from "./map.json";

export type MapProvince = {
  g: string;
  n: string | null;
  d: string;
};

export const MAP = raw as { viewBox: string; provinces: MapProvince[] };
