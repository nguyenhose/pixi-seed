import { EventEmitter } from "pixi.js";
console.log("init emitter");

const pixiEmitter = new EventEmitter();

export { pixiEmitter };

export enum CLIENT_EVENTS {
    GET_DATA = "GetData",
    GET_SHOP = "GetShop",
    UPDATE_RESULT = "UpdateResult",
    GET_MISSION_DATA = "GetMissionData",
    GET_LEADERBOARD = "GetLeaderBoard",
    TOAST = "Toast",
    MESSAGE_BOX = "MessageBox",
    LOADING_MESSAGES = "LoadingMessages",
    GOLD_CHANGE = "GoldChange",
    BUY_RESULT = "Buy",
    SHAKE_EVENTS = "shake",
    UPDATE_RANK_REWARD = "UpdateRankReward"
}