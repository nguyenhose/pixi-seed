export namespace GameProto { 
    export enum GAME_EVENTS {
        GET_DATA = "GetData",
        DoAction = "DoAction"
    }
    
    export enum GAME_ACTION {
        GET_DATA = "GetData",
        GET_SHOP = "GetShop",
        GET_CHALLENGE = "GetChallenge",
        CLAIM_REDIRECT = "RedirectChallenge",
        GET_RANK = "GetRank",
        OPEN_GIFT_TIME = "OpenGiftTime",
        SPIN = "Spin",
        START_PLAY = "Play",
        CLAIM_CHALLENGE = "ClaimChallenge",
        BUY_COIN = "Buy",
        SHOW_TOAST = "ShowToast",
        BUY = "Buy",
        MESSAGE_BOX = "ShowMessageBox",
        CHANGE_GOLD = "ChangeGold",
        GET_RANK_REWARD = "GetRankReward"
    }

    export enum GAME_HANDLER {
        COMMON = "Common"
    }

    export enum GAME_INFO {
        GET_CONFIG,
        GET_USER_PROFILE
    }

    export interface ActionMessage {
        handler: string;
        fromId: string;
        toId?: string;
        action: string;
        params?: any;
    }
    
    export enum GAME_ROOM_AVAILABLE_ACTIONS {
        UPDATE_ROOM_LIST = "UpdateRoomList",
    }
}