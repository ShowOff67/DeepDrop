import { HeightResult } from './types';

export class HeightCalculator {
  private gravity = 9.80665;

  constructor(
    private totalTime: number,
    private temperatureC: number
  ) {}

  private getSpeedOfSound(): number {
    return 331.3 + 0.606 * this.temperatureC;
  }

  private solveForHeight(time: number): number {
    if (time <= 0) return 0;
    const vs = this.getSpeedOfSound();
    const a = 1 / vs;
    const b = Math.sqrt(2 / this.gravity);
    const c = -time;
    const u = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    return u * u;
  }

  public calculate(): HeightResult {
    const vs = this.getSpeedOfSound();
    const h = this.solveForHeight(this.totalTime);

    const lowH = this.solveForHeight(Math.max(0, this.totalTime - 0.15));
    const highH = this.solveForHeight(this.totalTime + 0.15);
    const errorMargin = (highH - lowH) / 2;

    const soundTime = h / vs;
    const fallTime = this.totalTime - soundTime;

    return {
      meters: h,
      feet: h * 3.28084,
      fallTime,
      soundTime,
      speedOfSound: vs,
      errorMargin
    };
  }
}