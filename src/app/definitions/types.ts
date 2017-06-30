import { UserInfo } from "firebase/app";

export declare type Dictionary<T> = { [key: string]: T };

export declare type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export enum AuthProviders {
  Google,
  Github,
  Twitter,
  Facebook,
  Password,
  Phone
}

export declare interface BSUserInfo extends UserInfo {
  phoneNumber: string | null;
}
