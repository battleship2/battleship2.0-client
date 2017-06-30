import { Component, Input } from "@angular/core";

@Component({
  selector: "bsc-icon-checkbox",
  styleUrls: [ "icon-checkbox.component.scss" ],
  templateUrl: "icon-checkbox.component.html"
})
export class IconCheckboxComponent {
  @Input()
  public value = "";

  @Input()
  public active = false;
}
