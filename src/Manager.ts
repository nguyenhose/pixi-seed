import { Application, Container, Graphics, Point, Sprite, Ticker } from "pixi.js";
import { PixiPlugin } from "gsap/all";
import { gsap } from "gsap/gsap-core";
gsap.registerPlugin(PixiPlugin);

import { AudioConfig, GameConfig, PlayerData } from "./common/GameState";
import { QuickSetting } from "./screens/popup/QuickSetting";
import { clamp } from "./components/utils/timer";
import { Tutorial } from "./screens/popup/Tutorial";
import { CLIENT_EVENTS, pixiEmitter } from "./services/EventEmitter";
import { Toast } from "./screens/popup/Toast";
import { Dialog } from "./screens/popup/Dialog";

export class Manager {
    private constructor() {}

    private static app: Application;

    private static currentScreen: ScreenContainer;
    private static currentPopup: ScreenContainer | undefined;
    private static currentToast: ScreenContainer | undefined;
    private static quickSetting: ScreenContainer | undefined;
    private static tutorialPop: Container | undefined;

    private static gameConfig: GameConfig;
    private static playerData: PlayerData;
    public static audioSetting: AudioConfig;

    public static gameHasEnd: boolean = false;
    private static isNewUser: boolean = false;

    private static _width: number;
    private static _height: number;

    public static get width(): number {
        return Manager._width;
    }

    public static get height(): number {
        return Manager._height;
    }

    public static get GameConfig(): GameConfig {
        return Manager.gameConfig;
    }

    public static set GameConfig(_gc: GameConfig) {
        this.gameConfig = _gc;
    }

    public static set PlayerData(_pd: PlayerData) {
        this.playerData = _pd;
    }

    public static get PlayerData() {
        return this.playerData;
    }

    public static async initialize(backgroundColor: number): Promise<void> {
        Manager.app = new Application();
        // mock data
        Manager.PlayerData = {
            displayName: "",
            gold: 0,
            leaderboardId: "",
            luckySpinTurn: 0,
            remainingGiftTime: 0,
            getDataTime: new Date(),
            userId: ""
        }
        // register gsap
        PixiPlugin.registerPIXI(Manager.app);
        // enable sound
        this.audioSetting = {
            bgmOn: true,
            sfxOn: true
        }

        await Manager.app.init({
            // resizeTo: window,
            background: backgroundColor,
            resolution: Math.max(window.devicePixelRatio, 2),
        });
        document.getElementById("_pixi-content")?.appendChild(Manager.app.canvas);
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        Manager.app.ticker.add(Manager.update);

        pixiEmitter.on(CLIENT_EVENTS.TOAST, ({params}) => {
            if (!params) return;
            Manager.popToast(new Toast(params.message, params.iconType));
        }, this);
        
        pixiEmitter.on(CLIENT_EVENTS.MESSAGE_BOX, ({params}) => {
            if (!params) return;
            Manager.popModal(new Dialog({
                width: Manager.width * 0.85,
                height: Manager.height / 3,
                title: params.title,
                description: params.message,
                noCloseButton: true,
                buttonText: "OK",
                onClick: () => {
                    Manager.closeCurrentPopup();
                }
            }))
        }, this)
    }

    public static resize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        console.log(`window: ${windowWidth} x ${windowHeight}`);
        
        const minWidth = 320, minHeight = 640, maxWidth = 430, maxHeight = 932;
      
        Manager._width = clamp(maxWidth, minWidth, windowWidth);
        Manager._height = clamp(maxHeight, minHeight, windowHeight);
     
        this.app.renderer.canvas.style.width = `${Manager._width}px`;
        this.app.renderer.canvas.style.height = `${ Manager._height}px`;
        window.scrollTo(0, 0);

        Manager.app.renderer.resize(Manager._width, Manager._height);
        console.log(`renderer resize to: ${Manager.width} ${Manager.height}`);
        
        Manager.currentScreen?.resize();
    }

    private static update(ticker: Ticker): void {
        if (Manager.currentScreen) {
            Manager.currentScreen.update(ticker.deltaTime);
        }

        if (Manager.currentPopup) {
            Manager.currentPopup.update(ticker.deltaTime);
        }

        if (Manager.currentToast) {
            Manager.currentToast.update(ticker.deltaTime)
        }
    }

    public static changeScreen(newScreen: ScreenContainer): void {
        // remove old screen and popup
        if (Manager.currentScreen) {
            if (Manager.currentScreen.onDestroy) {
                Manager.currentScreen.onDestroy();
            };
            Manager.app.stage.removeChild(Manager.currentScreen);
            Manager.currentScreen.destroy();
        }
        this.closeCurrentPopup();
        // add new screen
        Manager.currentScreen = newScreen;
        Manager.app.stage.addChild(Manager.currentScreen);
 

    }

    public static popModal(modal: ScreenContainer): void {
        if (this.currentPopup != undefined) return;

        Manager.currentScreen.interactiveChildren = false;
        if (Manager.currentScreen.blur) {
            Manager.currentScreen.blur();
        }
        Manager.currentPopup = modal;
        Manager.app.stage.addChild(Manager.currentPopup); 
    }

    public static popToast(toast: ScreenContainer) {
        this.removeToast();
        Manager.currentToast = toast;
        Manager.app.stage.addChild(Manager.currentToast); 
    }

    public static removeToast() {
        if (Manager.currentToast) {
            Manager.app.stage.removeChild(Manager.currentToast);
            Manager.currentToast?.destroy();
            Manager.currentToast = undefined;
        }
    }

    public static closeCurrentPopup() {
        if (Manager.currentPopup) {
            Manager.app.stage.removeChild(Manager.currentPopup);
            Manager.currentPopup.destroy();
            Manager.currentPopup = undefined
            if (Manager.currentScreen) {
                Manager.currentScreen.interactiveChildren = true
                if (Manager.currentScreen.focus) {
                    Manager.currentScreen.focus();
                }
            }
        }
    }

    public static toggleSetting(value: boolean) {
        if (value) {
            Manager.currentScreen.interactiveChildren = false;
            if (Manager.currentScreen.blur) {
                Manager.currentScreen.blur();
            }
            Manager.quickSetting = new QuickSetting();
            Manager.app.stage.addChild(Manager.quickSetting);
        } else {
            Manager.currentScreen.interactiveChildren = true;
            if (Manager.quickSetting) {
                Manager.quickSetting.destroy();
                Manager.app.stage.removeChild(Manager.quickSetting);
            }
            if (Manager.currentScreen.focus) {
                Manager.currentScreen.focus();
            }
        }

    }

    // TUTORIAL
    public static showTutorial(title: string, content: string, buttonText: string, position: Point, onClick: any) {
        if (this.isNewUser == false) return;
        if (this.tutorialPop) {
            Manager.app.stage.removeChild(this.tutorialPop); 
            this.tutorialPop.destroy();
            this.tutorialPop = undefined;   
        }
        this.tutorialPop = new Tutorial(title, content, buttonText, onClick);
        this.tutorialPop.position.set(position.x - this.tutorialPop.width / 2, position.y - this.tutorialPop.height - 10);
        Manager.currentScreen.interactiveChildren = false
        Manager.app.stage.addChild(this.tutorialPop);
    }

    public static closeTutorial() {
        if (this.tutorialPop) {
            Manager.app.stage.removeChild(this.tutorialPop); 
            this.tutorialPop.destroy();
            this.tutorialPop = undefined;   
            this.isNewUser = false;
            Manager.currentScreen.interactiveChildren = true
            
        }
    }

    public static setNewUser(value: boolean) {
        this.isNewUser = value
    }

    /**
     * Blur screens when lose focus
     */
    public blur() {
        Manager.currentScreen?.blur?.();
        Manager.currentPopup?.blur?.();
    }

    /**
     * Focus screens
     */
    public focus() {
        Manager.currentScreen?.focus?.();
        Manager.currentPopup?.focus?.();
    }

    public static LoadUnderneath() {
        const background = Sprite.from("background_image");
        background.width = Manager.width;
        background.height = Manager.height;
        Manager.app.stage.addChild(background);
        // todo: check if hideHeader == true
        const ss = new Graphics().rect(0, 0, Manager.width, 70).fill("#FFCF10");
        Manager.app.stage.addChild(ss);
        const shadow = new Graphics().rect(0, 68, Manager.width, 2).fill("white");
        shadow.alpha = .7
        Manager.app.stage.addChild(shadow);
    }
}
export interface ScreenContainer extends Container {
    update(deltaTime: number): void;
    resize(): void;
    
    onDestroy?(): void;
    focus?(): void;
    blur?(): void;
    pause?(): void;

}