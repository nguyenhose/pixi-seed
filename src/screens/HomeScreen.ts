import { BlurFilter, Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { ImageP } from "../components/shared/ImageP";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { GameScreen } from "./GameScreen";
import { secondsToHms } from "../components/utils/timer";
import { NetworkService } from "../services/NetworkService";
import { MissionScreen } from "./MissionScreen";
import { GrayscaleFilter } from "pixi-filters";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { LeaderboardScreen } from "./LeaderboardScreen";
import { ShopScreen } from "./ShopScreen";
import { bgm, sfx } from "../services/Audio";
import { NoXuDialog } from "./popup/NoXuDialog";
import { HowToPlayScreen } from "./HowToPlayScreen";

/** screen show up after loading */
export class HomeScreen extends Container implements ScreenContainer {
    remainRewardTimeUI: Text;
    remainRewardTime: number = 0;
    rewardBag: PrimaryButton;
    debugText: Text;
    playerCoin: Text;
    eslapse = 0;
    tick = 100;

    constructor() {
        super();

        // HEADER
        this.playerCoin = new Text();
        this.addCurrentCoin();
        this.addPlayerInfo();

        // LOGO
        this.addLogo("game_logo");
        // BUTTONS
        this.debugText = new Text({style: {fontSize: 13}});
        this.addPlayButton();
        this.addLeaderBoardButton();
        this.addTermButton();
        this.addMissionButton();
        // this.addWheel();
        this.remainRewardTimeUI = new Text({ style: {
            fontFamily: 'Archia Medium',
            fontSize: 12,
            // fill: 'white'
        }});
        this.rewardBag = new PrimaryButton({
            width: 90,
            height: 90,
            offsetSlides: [2, 2, 2, 2],
            texture: "check_in_btn",
            onClick: () => {
                this.rewardBag.interactive = false;
                this.rewardBag.filters = [new GrayscaleFilter()];
                if (this.remainRewardTime <= 0) {
                    sfx.play("collect");
                    NetworkService.Senders?.Game?.sendOpenGiftTime();
                    
                    Manager.PlayerData.remainingGiftTime = Manager.GameConfig.giftTimeSecond;
                    Manager.PlayerData.getDataTime = new Date();

                    this.remainRewardTimeUI.visible = true;
                    this.remainRewardTime = Manager.GameConfig.giftTimeSecond;
                }
            }
        })
        this.addDailyReward();
        this.addSettingButton();

        pixiEmitter.on(CLIENT_EVENTS.GOLD_CHANGE, this.onGoldChange, this)
        // fix blur bug
        this.filters = [];
        // play bgm
        bgm.play("bgm");
        
        // test disconnect
        // setTimeout(() => {
            // NetworkService.testDisconnect();
            // NetworkService.Senders?.Game?.sendOpenGiftTime();
        // }, 2000)
    }

 
    // life cycle events
    onDestroy(): void {
        pixiEmitter.removeListener(CLIENT_EVENTS.GOLD_CHANGE, this.onGoldChange, this);
    }
 
    update(deltaTime: number) {
        if(this.eslapse > this.tick) {
            this.eslapse = 0;
            if (this.remainRewardTime > 0) {
                this.remainRewardTime--;
                this.remainRewardTimeUI.text = secondsToHms(this.remainRewardTime);
            }
            if (this.remainRewardTime <= 0 && this.rewardBag.interactive == false) {
                this.rewardBag.interactive = true;
                this.rewardBag.filters = [];
                this.remainRewardTimeUI.visible = false;
            }
        } else {
          
        }
        this.eslapse += deltaTime;
        NetworkService.checkMessageBox();
    }

    resize() {}

    blur(): void {
        console.log("blur");
        this.filters = [new BlurFilter()];
    }

    focus(): void {
        this.filters = []
    }

  

    onGoldChange() {
        this.playerCoin.text = Manager.PlayerData.gold.toLocaleString();
    }

    onStartGameClick() {
        console.log("on start game click");
        // sfx.play("select");
        if (Manager.PlayerData.gold >= Manager.GameConfig.chipList[0]) {
            Manager.changeScreen(new GameScreen());
        } else {
            Manager.popModal(new NoXuDialog({
                width: Manager.width * 0.85,
                height: Manager.height / 1.8,
                title: "Opps! Hết XU rồi",
                description: "Bạn có thể kiếm theo XU bằng 2 cách sau",
                inGame: false
            }))
        }
    }

    onHowToPlay() {
        Manager.changeScreen(new HowToPlayScreen())
    }

    // add elements
    addLogo(logoName: string) {
        const logo = Sprite.from(logoName);
        logo.anchor.set(.5);
        // logo.width = 200;
        // logo.height = 200;
        logo.position.set(Manager.width / 2, Manager.height / 2.45);

        this.addChild(logo);
    }

    addGameName() {
        const gameName = new Text({
            text: "Bầu Cua", 
            style: {
                align: 'center',
                fontSize: 40,
                fontFamily: 'Archia Medium',
                fill: 'white',
                stroke: {
                    color: 'black',
                    width: 8,
                    join: 'round'
                }
        }})
        gameName.position.set(Manager.width / 2, Manager.height / 2.2);
        gameName.anchor.set(.5);
        this.addChild(gameName);
    }

    addPlayButton() {
        const startGameButton = new PrimaryButton({
            text: "Chơi",
            fill: 0xffffff,
            fontSize: 26,
            width: 208,
            height: 172/2,
            onClick: this.onStartGameClick,
            texture: "primary_button"
        });
        startGameButton.position.set(Manager.width / 2, Manager.height / 1.4);
        this.addChild(startGameButton);
        if (this.debugText) {
            this.debugText.position.set(0, startGameButton.position.y + 50)
            this.debugText.text = ""
            this.addChild(this.debugText);
        }
    }

    addMissionButton() {
        const mission = new PrimaryButton({
            // text: "Nhiệm vụ",
            width: 90,
            height: 90,
            texture: "mission_btn",
            onClick: () => {
                Manager.changeScreen(new MissionScreen());
            }
        });
        mission.position.set(50, 125);
        this.addChild(mission);
    }

    addTermButton() {
        const mission = new PrimaryButton({
            // text: "Nhiệm vụ",
            width: 150,
            height: 60,
            texture: "htp_btn",
            onClick: this.onHowToPlay
        });
        mission.position.set(Manager.width / 2 + 80, Manager.height - 60);
        this.addChild(mission);
    }

    addLeaderBoardButton() {
        const leaderboard = new PrimaryButton({
            width: 150,
            height: 60,
            texture: "leaderboard_btn",
            onClick: () => {
                sfx.play("click");
                Manager.changeScreen(new LeaderboardScreen());
            }
        });
        leaderboard.position.set(Manager.width / 2 - 80, Manager.height - 60);
        this.addChild(leaderboard);
    }

    addBackground() {
        const backgroundUI = new ImageP({
            width: Manager.width,
            height: Manager.height,
            texture: 'game_bg',
        });
        this.addChild(backgroundUI);
    }

    addWheel() {
        const wheel = Sprite.from("border_circle");
        wheel.position.set(0, Manager.height / 2 - 160);
        wheel.width = 80;
        wheel.height = 80;

        const remainTurn = new Text({text: "0", style: {
            fill: 'black',
            fontSize: 30
        }});


        this.addChild(wheel);
        this.addChild(remainTurn);
        remainTurn.position.set(wheel.position.x + 60, wheel.position.y + 50);
        remainTurn.text = `${Manager.GameConfig.luckySpinDaily}`
    }

    addDailyReward() {
        this.rewardBag.position.set(Manager.width - 50, 125);
        this.remainRewardTime = Manager.PlayerData.remainingGiftTime - (new Date().getTime() - Manager.PlayerData.getDataTime.getTime()) / 1000;
        this.addChild(this.rewardBag);

        this.addChild(this.remainRewardTimeUI);
        this.remainRewardTimeUI.position.set(this.rewardBag.position.x - 25, this.rewardBag.position.y + 30);
        if (this.remainRewardTime > 0) {
            this.remainRewardTimeUI.text = secondsToHms(this.remainRewardTime);
            this.rewardBag.filters = [new GrayscaleFilter()];
            this.rewardBag.interactive = false;
        } 
    }

    addCurrentCoin() {

        const coinContainer = new Container();
        
        const bg = new Graphics().rect(0, 0, 110, 25).fill("#453003");
        bg.position.set(20, 3);
        

        const iconCoin = Sprite.from("currency");
        iconCoin.width = 30;
        iconCoin.height = 30;

        this.playerCoin = new Text({
            text: Manager.PlayerData.gold.toLocaleString(),
            style: {
                fontSize: 15,
                fill: 'white',
                fontFamily: "Archia Medium",
                align: 'right'
            }
        })
        this.playerCoin.anchor.set(1, 0)
        this.playerCoin.position.set(115, 5);

        const addGold = new PrimaryButton({
            width: 25,
            height: 25,
            // text: "Add",
            texture: "add_coin_btn",
            onClick: () => {
                sfx.play("click");
                Manager.changeScreen(new ShopScreen());
            }
        })
        addGold.position.set(128, 15);

        coinContainer.addChild(bg);
        coinContainer.addChild(iconCoin);
        coinContainer.addChild(this.playerCoin);
        coinContainer.addChild(addGold);
        this.addChild(coinContainer);
        coinContainer.position.set(Manager.width - 200, 15)
    }
        
    addSettingButton() {
        const setting = new PrimaryButton({
            width: 30,
            height: 30,
            texture: "setting_btn",
            onClick: () => {
                sfx.play("click");
                Manager.toggleSetting(true);
            }
        })
        setting.position.set(Manager.width - 30, 30);
        this.addChild(setting);
    }
    
    addPlayerInfo() {
        const name = new Text({text: Manager.PlayerData.displayName,
            style: {
                fontSize: 15,
            }
        })
        this.addChild(name);
        name.position.set(10, 20);
    }
}

