import { UserInfo } from "firebase/app";

export declare type Dictionary = { [key: string]: string };

export declare type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export enum AuthProviders {
  Google,
  Github,
  Twitter,
  Facebook,
  Password
}

export declare interface BSUserInfo extends UserInfo {
  phoneNumber: string | null;
}
