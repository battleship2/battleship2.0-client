import { Injectable } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { isArray } from "../core/utils/utils";

@Injectable()
export class SubscriptionCleanerService {
  public static handleOne(subscription: Subscription): void {
    if (subscription instanceof Subscription && !subscription.closed) {
      subscription.unsubscribe();
    }
  }

  public static handleSome(subscriptions: Array<Subscription>): void {
    if (isArray(subscriptions) && subscriptions.length > 0) {
      subscriptions.forEach(SubscriptionCleanerService.handleOne);
    }
  }
}
