import { GeoPoint } from '@/types/location';

export function toCoordinatePair(point: GeoPoint): [number, number] {
  return [point.longitude, point.latitude];
}
