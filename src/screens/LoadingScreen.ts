// @ts-nocheck
import { Assets, Container, Text, Sprite, Graphics } from "pixi.js";
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

var Shake = require('shake.js');
/**  screen  showing for loading asset */
export class LoadingScreen extends Container implements ScreenContainer {
    assetLoaded = false;
    socketConnected = false;
    loading = true;
    loadingTextUI: Text;
    constructor({isReconnect}) {
        super();
        this.loadingTextUI = new Text();
        // add loading image
        this.loadingTextUI = new Text({text: "Loading asset..."});
        this.loadingTextUI.anchor.set(.5);
        this.loadingTextUI.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(this.loadingTextUI);

        // load asset
        this.initializeLoader().then(() => {
            console.log("-> asset loaded");
            this.assetLoaded = true;
            this.loadUnderneath();
            // load socket and game config
            this.connectSocket(isReconnect);
        })
 
        pixiEmitter.on(CLIENT_EVENTS.GET_DATA, this.onGetData, this);
        pixiEmitter.on(CLIENT_EVENTS.LOADING_MESSAGES, this.onLoadMessages, this)
    }

    private async connectSocket(isReconnect: boolean = false) {
        // connect socket
        const credential_token = LoginCredential.__parseTokenFromURL();
        if (credential_token) {
            try {
                console.log("connect socket ->");
                this.loadingTextUI.text = "connect socket...";
                if (isReconnect) {
                    await LoginCredential._loginWithExistToken(credential_token);
                } else {
                    const env = LoginCredential.__parseENVFromURL();
                    await LoginCredential.login(credential_token, env);
                }
                NetworkService.Senders?.Game?.sendGetData();
            } catch (error: any) {
                console.log("fail login", error);
                if (error && error.message) {
                    this.loadingTextUI.text = error.message;
                }
            }
        }
    }

    private async initializeLoader(): Promise<void> {
        console.log("load asset ->");
        
        await Assets.init({ manifest: manifest });

        const bundleIds = manifest.bundles.map(b => b.name);
        await Assets.loadBundle(bundleIds);
    }

    async loadUnderneath() {
        //
        const background = Sprite.from("game_bg");
        background.width = Manager.width;
        background.height = Manager.height;
        Manager.app.stage.addChild(background);
  
        const ss = new Graphics().rect(0, 0, Manager.width, 70).fill("#FFCF10");
        Manager.app.stage.addChild(ss);
        const shadow = new Graphics().rect(0, 68, Manager.width, 2).fill("white");
        shadow.alpha = .7
        Manager.app.stage.addChild(shadow);
      }

    private gameLoaded(): void {
        this.verifyLeadboardDate();
        // Manager.changeScreen(new ShopScreen());
        this.closeWebviewLoading();
    }

    update(deltaTime: number) {
        if (this.loading) {
            if (this.socketConnected && this.assetLoaded) {
                this.gameLoaded();
                this.loading = false;
            }
        }
    }

    resize() {
    }

    closeWebviewLoading() {
        if (window && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ action: "CLOSE_GAME_LOADING" })
            );
        }
    }

    onGetData({params}) {
        if (!params) return;
        console.log("-> socket connected");
        this.socketConnected = true;
        const data: GameConfig = params.leaderboard;
        const player: PlayerData = params.player;
        Manager.GameConfig = {
            chipList: data.chipList,
            closeTime: data.closeTime,
            endTime: data.endTime,
            startTime: data.startTime,
            dailyGold: data.dailyGold,
            giftTimeGold: data.giftTimeGold,
            giftTimeSecond: data.giftTimeSecond,
            gameBgImagePath: data.gameBgImagePath,
            homeBgImagePath: data.homeBgImagePath,
            isPublic: data.isPublic,
            leaderBoardId: data.leaderBoardId,
            luckySpinDaily: data.luckySpinDaily,
            luckySpintData: data.luckySpintData,
            maxTurnBet: data.maxTurnBet,
            shop: data.shop,
            rankRewards: data.rankRewards,
        }

        Manager.PlayerData = {
            displayName: player.displayName,
            gold: player.gold,
            leaderboardId: player.leaderboardId,
            luckySpinTurn: player.luckySpinTurn,
            remainingGiftTime: player.remainingGiftTime,
            getDataTime: new Date(),
            userId: player.userId
        }
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

    onDestroy(): void {
        pixiEmitter.removeListener(CLIENT_EVENTS.GET_DATA, this.onGetData, this);
        pixiEmitter.removeListener(CLIENT_EVENTS.LOADING_MESSAGES, this.onLoadMessages, this)
    }

    public verifyLeadboardDate() {
        const currentTime = new Date().getTime();
        // if current before start day, show ready to start on ...
        // if current after end time, show leaderboard only
        // if current after close time, show game is end()

        if (currentTime < Manager.gameConfig.startTime?.getTime()) {
            this.onLoadMessages("Trò chơi chưa diễn ra!")
        } else if (currentTime > Manager.gameConfig.endTime.getTime()) {
            Manager.gameHasEnd = true;
            Manager.changeScreen(new LeaderboardScreen())
        } else {
            Manager.changeScreen(new HomeScreen());
        }
    }
}