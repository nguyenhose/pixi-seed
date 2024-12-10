import { Client, Room, RoomAvailable } from "colyseus.js";
import { GameProto } from "./networks/protocol/Protocol";
import { BaseHandler } from "./networks/handler/BaseHandler";
import { GameSender } from "./networks/sender/GameSender";
import { CLIENT_EVENTS, pixiEmitter } from "./EventEmitter";
import { Manager } from "../Manager";
import { LoadingScreen } from "../screens/LoadingScreen";
import { Dialog } from "../screens/popup/Dialog";

export class RoomSender {
  private _game: GameSender | null;

  constructor() {
    this._game = null;
  }

  get Game(): GameSender | null {
    return this._game;
  }

  set Game(value: GameSender | null) {
    this._game = value;
  }
}

class NetworkServiceImpl {
  private hostname = "localhost";
  private defaultRoomName: string = "testDefaultGame";
  private port = 2567;
  private useSSL = false;
  private mainRoom: Room | null = null;
  private _handlersMap: Map<string, BaseHandler[]> = new Map<
    string,
    BaseHandler[]
  >();
  private _actionsMap: Map<string, string> = new Map<string, string>();
  private _isLeavingProcessing = false;

  client!: Client;
  Senders: RoomSender | null;

  uid: string | null = null;
  token: string | null = null;
  uri: string;
  messageBoxData: any[] = [];
  toastData: any[] = [];

  constructor() {
    this.Senders = new RoomSender();
    this._isLeavingProcessing = false;
    this.uri = "";
  }

  getHandlerByEvent(
    eventName: string | GameProto.GAME_EVENTS
  ): BaseHandler | undefined {
    let args = this._handlersMap.get(eventName);
    if (args && args.length) return args[0];
    return undefined;
  }

  getHandlersByEvent(eventName: string | GameProto.GAME_EVENTS): BaseHandler[] {
    return this._handlersMap.get(eventName) || [];
  }

  addActionHandler(
    action: string,
    method: string,
    handler: string | GameProto.GAME_HANDLER
  ) {
    // this._actionsMap.set(action, method);
    this._actionsMap.set(`${handler}.${action}`, method);
  }

  basicAuthen(token: string): NetworkServiceImpl {
    this.token = token;
    return this;
  }

  checkMessageBox() {
    if (this.messageBoxData.length) {
        pixiEmitter.emit(CLIENT_EVENTS.MESSAGE_BOX, this.messageBoxData.pop())
    }
  }

  checkToast() {
    if (this.toastData.length) {
        pixiEmitter.emit(CLIENT_EVENTS.TOAST, this.toastData.pop());
    }
  }

  async connect(
    host: string,
    port: number,
    useSSL: boolean = false
  ): Promise<boolean> {
    try {
      // Instantiate Colyseus Client
      // connects into (ws|wss)://hostname[:port]
      this.hostname = host;
      this.port = port;
      this.useSSL = useSSL;

      this.uri = `${this.useSSL ? "wss" : "ws"}://${this.hostname}${
        [443, 80].indexOf(this.port) >= 0 || this.useSSL ? "" : `:${this.port}`
      }`;
      // this.__leaveLobbyRoom();
      // this.client = new Client(this.uri);
      this.client = new Client({
        hostname: this.hostname,
        port: this.port,
        secure: this.useSSL,
      });

      // Connect into the lobby room by default
      this.mainRoom = await this.client.joinOrCreate(this.defaultRoomName, {
        accessToken: this.token,
      });

      if (this.Senders) {
        this.Senders.Game = new GameSender(this.mainRoom);
      }


      this.mainRoom.onMessage(GameProto.GAME_EVENTS.DoAction, (data) => {
        console.log("-> on message: ", data);
        if (!data) return;
        switch (data.action) {
          case GameProto.GAME_ACTION.GET_DATA:
            pixiEmitter.emit(CLIENT_EVENTS.GET_DATA, data);
            break;
          default:
            break;
        }
      });

      this.mainRoom.onLeave(this.onLeave.bind(this));

      return true;
    } catch (e: any) {
      console.error(e);
      return false;
    }
  }

 

  onError(code: number, message: string) {
    console.log(`onError : ${code}, ${message}`);
    if (message) {
      console.log(message);
    }
  }

  async onLeave(code: number) {
    try {
      if (this._isLeavingProcessing) return;
      this._isLeavingProcessing = true;
      console.log("onLeave: ", code);
      //// server disconnected, socket closed

      if (code >= 1000 && code <= 4000) {
        //// lost connection, reconnect please ....
        // open loading screen for load assets
        Manager.popModal(
          new Dialog({
            width: Manager.width * 0.8,
            height: 260,
            title: "Lỗi xuất hiện !",
            description: "Bạn đã mất kết nối với máy chủ!",
            buttonText: "Tải lại game",
            noCloseButton: true,
            onClick: () => {
              Manager.changeScreen(new LoadingScreen({ isReconnect: true }));
            },
          })
        );

        return;
      }
      if (code === 4001 || code === 4002) {
        //// logic : server kick client close.
        Manager.popModal(
          new Dialog({
            width: Manager.width * 0.8,
            height: 260,
            title: "Lỗi xuất hiện !",
            description: "Bạn đã mất kết nối với máy chủ!",
            buttonText: "Tải lại game",
            noCloseButton: true,
            onClick: () => {
              Manager.changeScreen(new LoadingScreen({ isReconnect: false }));
            },
          })
        );
        return;
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      this._isLeavingProcessing = false;
    }
  }

  public testDisconnect() {
    this.mainRoom?.leave();
  }
}

const NetworkService = new NetworkServiceImpl();
export { NetworkService };
