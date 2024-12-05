import { Room } from "colyseus.js";
import { GameProto } from "../protocol/Protocol";

export class BaseSender {
  private _currentRoom: Room;

  constructor(room: Room) {
    this._currentRoom = room;
  }

  get currentRoom(): Room {
    return this._currentRoom;
  }

  leave() {
    if(this._currentRoom) {
      this._currentRoom.leave(true);
    }
  }
  
  protected _sendActionMessage(handler: string, action: string, params: any) {
    try {
      if (this.currentRoom) {
        console.log(`Send Action: ${action} ->`);
        
        this.currentRoom.send(GameProto.GAME_EVENTS.DoAction, {
          handler: handler,
          action: action,
          params: params || null,
        });
      }
    } catch (err: any) {}
  }
}