import { ILogger } from '../interfaces/logger.interface';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { isDefined, isFunction, isString } from '../core/utils/utils';

function consoleOverride(target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {
  descriptor.value = function (...args: any[]) {
    if (this._loggingActivated && isDefined(console) && isFunction(console[ key ])) {
      const firstArg = Array.prototype.splice.call(args, 0, 1)[ 0 ];

      if (isString(firstArg)) {
        Array.prototype.unshift.call(args, `${this._loggerPrefix} ${firstArg}`, this._loggerPrefixStyle, '');
      } else {
        Array.prototype.unshift.call(args, this._loggerPrefix, this._loggerPrefixStyle, '', firstArg);
      }

      (<Function>console[ key ]).apply(console, args);
    }
  };

  return descriptor;
}

function toggleLog(state: boolean) {
  return function (target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {
    descriptor.value = function (...args: any[]) {
      if (environment.useConsole) {
        this._loggingActivated = state;
        console.log(this._loggerPrefix, this._loggerPrefixStyle, '', (state ? 'Activated.' : 'Deactivated'));
      }
    };
    return descriptor;
  }
}

@Injectable()
export class LoggerService implements ILogger {
  private _loggerPrefix = '%c[Logger]%c';
  private _loggingActivated = environment.useConsole;
  private _loggerPrefixStyle = 'background: white; color: black;';

  @toggleLog(true) public on(): void {}
  @toggleLog(false) public off(): void {}

  @consoleOverride public log(...args: any[]): void {}
  @consoleOverride public info(...args: any[]): void {}
  @consoleOverride public warn(...args: any[]): void {}
  @consoleOverride public error(...args: any[]): void {}
  @consoleOverride public debug(...args: any[]): void {}
}
