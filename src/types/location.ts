export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type MoviLocation = {
  id: string;
  label: string;
  address?: string;
  point: GeoPoint;
};
