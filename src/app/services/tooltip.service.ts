///<reference path="../../../node_modules/@types/jquery/index.d.ts"/>

import { Injectable } from '@angular/core';

@Injectable()
export class TooltipService {
  public static setup(): void {
    setTimeout(() => {
      $('[data-toggle="tooltip"]')
        .tooltip()
        .click(function () {
          $(this).tooltip('hide');
        });
    });
  }
}
