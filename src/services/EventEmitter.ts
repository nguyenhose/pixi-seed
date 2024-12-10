import { EventEmitter } from "pixi.js";
console.log("init emitter");

const pixiEmitter = new EventEmitter();

export { pixiEmitter };

export enum CLIENT_EVENTS {
    GET_DATA = "GetData",
    TOAST = "Toast",
    MESSAGE_BOX = "MessageBox",
    LOADING_MESSAGES = "LoadingMessages",
}