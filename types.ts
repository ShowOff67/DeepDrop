export interface HeightResult {
  meters: number;
  feet: number;
  fallTime: number;
  soundTime: number;
  speedOfSound: number;
  errorMargin: number;
}

export enum TimingMode {
  HOLD = 'HOLD',
  TAP = 'TAP'
}