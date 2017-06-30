import { DOCUMENT } from "@angular/platform-browser";

import { Inject } from "@angular/core";
import { Injectable } from "@angular/core";

@Injectable()
export class AppReadyEventService {
  private _doc: Document;
  private _isAppReady = false;

  // NOTE: When I first tried to approach this problem, I was going to try and use the
  // core Renderer service; however, it appears that the Renderer cannot be injected
  // into a service object (throws error: No provider for Renderer!). As such, I am
  // treating THIS class as the implementation of the DOM abstraction (so to speak),
  // which can be overridden on a per-environment basis.
  constructor(@Inject(DOCUMENT) doc: any) {
    this._doc = doc;
  }

  // NOTE: In this particular implementation of this service on this PLATFORM, this
  // simply triggers the event on the DOM (Document Object Model); however, one could
  // easily imagine this event being triggered on an Observable or some other type of
  // message transport that makes more sense for a different platform. Nothing about
  // the DOM-interaction leaks outside of this service.
  public trigger(): void {
    if (this._isAppReady) {
      return;
    }

    const bubbles = true;
    const cancelable = false;

    this._doc.dispatchEvent(this._createEvent("appready", bubbles, cancelable));
    this._isAppReady = true;
  }

  // I create and return a custom event with the given configuration.
  private _createEvent(eventType: string, bubbles: boolean, cancelable: boolean): Event {
    let customEvent: any;

    // IE uses some other kind of event initialization. As such,
    // we"ll default to trying the "normal" event generation and then fallback to
    // using the IE version.
    try {

      customEvent = new CustomEvent(eventType, { bubbles: bubbles, cancelable: cancelable });

    } catch (error) {
      customEvent = this._doc.createEvent("CustomEvent");
      customEvent.initCustomEvent(eventType, bubbles, cancelable);
    }

    return (customEvent);
  }
}
