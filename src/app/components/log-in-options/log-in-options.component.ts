import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { isUndefined, merge } from "../../core/utils/utils";
import { Dictionary } from "../../definitions/types";
import { TooltipService } from "../../services/tooltip.service";

export declare type Option = {
  css: string;
  name: string;
  title: string;
  image: string;
  linkTo?: string;
  loading?: boolean;
};

export declare type Options = Array<Option>;

@Component({
  selector: "bsc-log-in-options",
  styleUrls: [ "log-in-options.component.scss" ],
  templateUrl: "log-in-options.component.html"
})
export class LogInOptionsComponent implements OnInit, AfterViewInit {
  @Input()
  public ignore: Array<string> = [];

  @Input()
  public phoneLink = "";

  @Input()
  public emailLink = "";

  @Input()
  public options: Array<string> = [];

  @Output()
  public selectedOption: EventEmitter<string> = new EventEmitter<string>();

  public optionTriggered = false;
  public displayedOptions: Options = [];

  private _defaultOptions: Dictionary<Option> = {
    PHONE: {
      css: "btn-phone",
      name: "Phone",
      title: "Connect with your phone number",
      image: "assets/img/logos/phone.png"
    },

    EMAIL: {
      css: "btn-email",
      name: "Email",
      title: "Connect with your email address",
      image: "assets/img/logos/at.png"
    },

    FACEBOOK: {
      css: "btn-facebook",
      name: "Facebook",
      title: "Connect with Facebook",
      image: "assets/img/logos/fb.png"
    },

    GITHUB: {
      css: "btn-github",
      name: "Github",
      title: "Connect with Github",
      image: "assets/img/logos/github.png"
    },

    GOOGLE: {
      css: "btn-google",
      name: "Google",
      title: "Connect with Google",
      image: "assets/img/logos/google.png"
    },

    TWITTER: {
      css: "btn-twitter",
      name: "Twitter",
      title: "Connect with Twitter",
      image: "assets/img/logos/twitter.png"
    }
  };

  public ngOnInit(): void {
    this._populateOptions();
  }

  public ngAfterViewInit(): void {
    TooltipService.setup();
  }

  public select(option: Option): void {
    this.optionTriggered = true;
    option.loading = true;
    this.selectedOption.emit(option.name);
  }

  public reset(): void {
    this.optionTriggered = false;
    this._populateOptions();
  }

  private _populateOptions(options?: Array<string>): void {
    options = (this.options.length > 0 ? this.options : Object.keys(this._defaultOptions));

    this.displayedOptions =
      options
        .filter((option: string) => (this.ignore.indexOf(option) === -1))
        .map((optionName: string): Option => {
          const option = this._defaultOptions[ optionName ];

          switch (optionName) {
            case "PHONE":
              option.linkTo = this.phoneLink;
              break;
            case "EMAIL":
              option.linkTo = this.emailLink;
              break;
          }

          if (isUndefined(option)) {
            throw new Error(`Unknown log in option: ${optionName}`);
          }

          return <Option>merge({}, option);
        });
  }
}
