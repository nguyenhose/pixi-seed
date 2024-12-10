import { Assets, Container, Text, Sprite, Graphics, isRenderingToScreen } from "pixi.js";
import { manifest } from "../assets";
import { Manager, ScreenContainer } from "../Manager";
import { HomeScreen } from "./HomeScreen";
import { GameScreen } from "./GameScreen";
import { LoginCredential } from "../common/LoginCredential";
import { NetworkService } from "../services/NetworkService";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { GameConfig, PlayerData } from "../common/GameState";
import { Dialog } from "./popup/Dialog";
import { LeaderboardScreen } from "./LeaderboardScreen";

/**  screen  showing for loading asset */
export class LoadingScreen extends Container implements ScreenContainer {
    assetLoaded = false;
    socketConnected = false;

    loading = true;
    loadingTextUI: Text;

    constructor({isReconnect}: any) {
        super();
        console.log("is loading as reconnect socket: ", isReconnect);
        this.loadingTextUI = new Text();
        // add loading image
        this.loadingTextUI = new Text({text: "Loading asset..."});
        this.loadingTextUI.anchor.set(.5);
        this.loadingTextUI.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(this.loadingTextUI);

        // load asset
        this.loadAsset().then(() => {
            console.log("-> asset loaded");
            this.assetLoaded = true;

            // adding background used for all screens
            Manager.LoadUnderneath();

            // close react native webview
            this.closeWebviewLoading();

            // start connect socket and game config
            // this.connectSocket(isReconnect);
        })
 
        pixiEmitter.on(CLIENT_EVENTS.GET_DATA, this.onGetData, this);
        pixiEmitter.on(CLIENT_EVENTS.LOADING_MESSAGES, this.onLoadMessages, this)
    }
    
    update(deltaTime: number) {
        if (this.loading) {
            if (this.assetLoaded 
                // && this.socketConnected 
            ) {
                this.gameLoaded();
                this.loading = false;
            }
        }
    }

    resize() {
    }

    onDestroy(): void {
        pixiEmitter.removeListener(CLIENT_EVENTS.GET_DATA, this.onGetData, this);
        pixiEmitter.removeListener(CLIENT_EVENTS.LOADING_MESSAGES, this.onLoadMessages, this)
    }

    private async loadAsset(): Promise<void> {
        console.log("load asset ->");
        
        await Assets.init({ manifest: manifest });

        const bundleIds = manifest.bundles.map(b => b.name);
        await Assets.loadBundle(bundleIds);
    }

    private gameLoaded(): void {
        // verify before go new screen

        // this.verifyLeadboardDate();
        console.log("-> all loaded");
        Manager.changeScreen(new HomeScreen());
    }

    onLoadMessages(msg: string) {
        Manager.popModal(new Dialog({
            width: Manager.width * .9,
            height: 250,
            title: "Thông báo",
            description: msg,
            buttonText: "OK",
            onClick: () => {
                Manager.closeCurrentPopup();
            },
            noCloseButton: true
        }))
    }
  
    // support functions for taptap games
    private async connectSocket(isReconnect: boolean = false) {
        const credential_token = LoginCredential.__parseTokenFromURL();
        if (credential_token) {
            try {
                console.log("connect socket ->");
                this.loadingTextUI.text = "connect socket...";
                if (isReconnect) {
                    await LoginCredential._loginWithExistToken();
                } else {
                    const env = LoginCredential.__parseENVFromURL();
                    await LoginCredential.login(credential_token, env);
                }
                // NetworkService.Senders?.Game?.sendGetData();
            } catch (error: any) {
                console.log("fail login", error);
                if (error && error.message) {
                    this.loadingTextUI.text = error.message;
                }
            }
        }
    }

    closeWebviewLoading() {
        // @ts-ignore
        if (window && window.ReactNativeWebView) {
             // @ts-ignore
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ action: "CLOSE_GAME_LOADING" })
            );
        }
    }

    onGetData({params}: any) {
        if (!params) return;
        console.log("-> socket connected");
        this.socketConnected = true;
    }
}