import { GameProto } from "../protocol/Protocol";
import { BaseSender } from "./BaseSender";

export class GameSender extends BaseSender {
    sendRequestResult() {
        this._sendActionMessage(GameProto.GAME_HANDLER.COMMON, GameProto.GAME_ACTION.GET_DATA, {})
    }
}