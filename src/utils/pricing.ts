export function calculateSharedFare(privateFare: number, passengerShareRatio: number) {
  return Math.max(0, Math.round(privateFare * passengerShareRatio));
}
