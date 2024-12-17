import { Assets, Container, Graphics } from "pixi.js";
import { manifest } from "../assets";
import { Manager, ScreenContainer } from "../Manager";
import { HomeScreen } from "./HomeScreen";
import { LoginCredential } from "../common/LoginCredential";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { Dialog } from "./popup/Dialog";
import { taptap3 } from "../components/utils/theme";
import { dateToDmy, getFormatedStringFromDays } from "../components/utils/timer";

/**  screen  showing for loading asset */
export class LoadingScreen extends Container implements ScreenContainer {
    assetLoaded = false;
    dataLoaded = false;

    loading = true;

    constructor({isReconnect}: any) {
        super();
        console.log("is loading as reconnect socket: ", isReconnect);

        

        // load asset
        this.loadAsset().then(() => {
            console.log("-> asset loaded");
            this.assetLoaded = true;

            // adding background used for all screens
            // Manager.LoadUnderneath();

            // close react native webview
            this.closeWebviewLoading();

            // start connect socket and game config
            this.getRecapData();
        })
 
        pixiEmitter.on(CLIENT_EVENTS.GET_DATA, this.onGetData, this);
        pixiEmitter.on(CLIENT_EVENTS.LOADING_MESSAGES, this.onLoadMessages, this)
    }
    
    update(deltaTime: number) {
        if (this.loading) {
            if (this.assetLoaded 
                && this.dataLoaded 
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

        // create a progress bar
        const processBar = new Container();
        const bg = new Graphics().rect(0, 0, Manager.width - 40, 5);
        bg.fill(taptap3[1]);
        
        let fillbar = new Graphics().rect(0, 0, 1, 5);
        fillbar.fill(taptap3[2]);

        processBar.addChild(bg); processBar.addChild(fillbar);
        processBar.position.set(20, Manager.height / 2);
        this.addChild(processBar);

        const bundleIds = manifest.bundles.map(b => b.name);
        await Assets.loadBundle(bundleIds, (progress: number) => {
            fillbar.scale.x = progress * bg.width;
        });
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
                // this.loadingTextUI.text = "connect socket...";
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
                    // this.loadingTextUI.text = error.message;
                }
            }
        }
    }

    private async getRecapData() {
        const userId = LoginCredential.__parseUserIdFromURL();
        if (userId) {
            try {
                console.log("get recap data ->");
                await LoginCredential.getRecapData(userId);
            } catch (error) {
                
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

    onGetData(data: any) {
        if (!data) return;
        if (!data.delta) return;
        
        this.dataLoaded = true;
        var d = new Date();
        d.setDate(d.getDate() - data.delta)
        const convertDate = dateToDmy(d)
        const convertFromDays = getFormatedStringFromDays(data.delta);
        
        Manager.RecapData = {
            userName: data.name,
            startFrom: convertDate,
            year: convertFromDays.year,
            month: convertFromDays.month,
            day: convertFromDays.day,
            redeemPoint: data.total_point_redeem,
            issuedPoint: data.total_point_issue,
            voucher: data.no_purchase_voucher,
            topThree: data.top_3_redeem_brand
        } 
    }
}