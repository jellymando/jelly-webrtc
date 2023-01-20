export enum EVENT {
  MESSAGE = "meesage"
}

export enum ROLE {
  VIEWER = "viewer",
  CLIENT = "client"
}

export type messageType = { key: EVENT; payload?: any };
