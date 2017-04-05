export interface ILogger {
  log(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  assert(...args: any[]): void;
  group(...args: any[]): void;
  groupEnd(...args: any[]): void;
}
