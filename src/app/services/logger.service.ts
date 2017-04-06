import { Injectable } from '@angular/core';
import { ILogger } from '../interfaces/logger.interface';
import { environment } from '../../environments/environment';

declare const console: any;

@Injectable()
export class LoggerService implements ILogger {
  private _loggingActivated = environment.useConsole;

  public log(...args: any[]): void {
    // tslint:disable-next-line
    this._loggingActivated && (console && console.log) && console.log(...args);
  }

  public info(...args: any[]): void {
    // tslint:disable-next-line
    this._loggingActivated && (console && console.info) && console.info(...args);
  }

  public warn(...args: any[]): void {
    // tslint:disable-next-line
    this._loggingActivated && (console && console.warn) && console.warn(...args);
  }

  public assert(...args: any[]): void {
    // tslint:disable-next-line
    this._loggingActivated && (console && console.assert) && console.assert(...args);
  }

  public error(...args: any[]): void {
    // tslint:disable-next-line
    this._loggingActivated && (console && console.error) && console.error(...args);
  }

  public group(...args: any[]): void {
    // tslint:disable-next-line
    this._loggingActivated && (console && console.group) && console.group(...args);
  }

  public groupEnd(...args: any[]): void {
    // tslint:disable-next-line
    this._loggingActivated && (console && console.groupEnd) && console.groupEnd(...args);
  }
}
