import { GameProto } from "../protocol/Protocol";
import { BaseSender } from "./BaseSender";

export class GameSender extends BaseSender {
    sendRequestResult() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.GET_DATA, {})
    }

    sendGetData() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.GET_DATA, {})
    }

    senGetRankReward() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.GET_RANK_REWARD, {})
    }

    sendRequestPlay(listBet: []) {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.START_PLAY, {
            listBet
        });
    }

    sendGetChallenge() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.GET_CHALLENGE, {});
    }

    sendOpenGiftTime() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.OPEN_GIFT_TIME, {});
    }

    sendLeaderboard() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.GET_RANK, {});
    }

    sendShop() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.GET_SHOP, {});
    }

    sendBuyPackage(packageId: string) {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.BUY, {
            id: packageId
        });
    }

    claimMission(challengeId: string) {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.CLAIM_CHALLENGE, {
            id: challengeId
        }); 
    }

    redirectChallenge(challengeId: string) {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.CLAIM_REDIRECT, {
            id: challengeId
        }); 
    }
}