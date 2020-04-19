export class DateTool {
  private constructor() {}

  static fmtFullHour(dt: Date): string {
    const hh = dt
      .getUTCHours()
      .toString()
      .padStart(2, '0');
    const mm = dt
      .getUTCMinutes()
      .toString()
      .padStart(2, '0');
    const ss = dt
      .getUTCSeconds()
      .toString()
      .padStart(2, '0');
    const ms = dt
      .getUTCMilliseconds()
      .toString()
      .padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
  }
}
