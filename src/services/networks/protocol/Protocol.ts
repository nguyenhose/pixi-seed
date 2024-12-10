export namespace GameProto { 
    
    export enum GAME_EVENTS {
        GET_DATA = "GetData",
        DoAction = "DoAction"
    }
    
    export enum GAME_ACTION {
        GET_DATA = "GetData",
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
}