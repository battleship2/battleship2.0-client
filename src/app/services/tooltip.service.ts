///<reference path="../../../node_modules/@types/jquery/index.d.ts"/>
///<reference path="../definitions/jquery-extended.d.ts"/>

import { Injectable } from '@angular/core';

@Injectable()
export class TooltipService {
  public static setup(): void {
    setTimeout(() => {
      $('[data-toggle="tooltip"]')
        .tooltip()
        .click(function () {
          setTimeout(() => $(this).tooltip('hide'));
        });
    });
  }
}
