import { Container, Sprite } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { Label } from "../components/shared/Label";
import { CustomImage } from "../components/shared/CustomImage";
import { GameScreen } from "./GameScreen";
import { LeaderboardScreen } from "./LeaderboardScreen";


/** screen show up after loading */
export class HomeScreen extends Container implements ScreenContainer {
    constructor() {
        super();
        // add header bar: name, coin, settings
        this.renderHeader();

        // add game logo
        this.renderGameLogo()

        // add buttons group: play button, mission button, leaderboard buttons
        this.renderButtonGroup();

    }
    update(deltaTime: number): void {
    }

    resize(): void {
    }

    renderHeader() {
         // add user name
         const userName = new Label("Lovely Guest");
         userName.position.set(10, 25);
         userName.anchor.set(0);
         this.addChild(userName);
 
         // add coin section
         const coinSection = new Container();
         const coinIcon = Sprite.from("coin_icon");
         coinIcon.width = 30; coinIcon.height = 30;
         
         const coinValue = new Label("100"); coinValue.anchor.set(0);
         coinValue.position.set(35, 5);

         coinSection.addChild(coinIcon);
         coinSection.addChild(coinValue);
         coinSection.position.set(Manager.width - 150, 20)
         this.addChild(coinSection);

         // add setting section
         const settingBtn = new PrimaryButton({
            texture: "setting_icon",
            width: 30
         });
         settingBtn.position.set(Manager.width - 25, 25)
         this.addChild(settingBtn);
    }

    renderGameLogo() {
        // add game name
        const gameName = new CustomImage("game_title", Manager.width * .85);
        gameName.anchor.set(.5);
        gameName.position.set(Manager.width / 2, Manager.height / 3)

        this.addChild(gameName);
    }

    renderButtonGroup() {
        const buttonGroup = new Container();

        const playBtn = new PrimaryButton({
            width: 200,
            texture: 'yellow_button',
            text: 'Chơi Ngay',
            textStyle: {
                fontSize: 30,
                fill: 0x000000,
                fontWeight: 'bold',
                stroke: { color: '#ffffff', width: 5, join: 'round' },
            },
            onClick: () => {this.onStartPlay()}
        });
        
        buttonGroup.addChild(playBtn);
        buttonGroup.position.set(Manager.width / 2, Manager.height / 1.5);
        this.addChild(buttonGroup);

        const leaderboardBtn = new PrimaryButton({
            texture: 'yellow_button',
            width: 150,
            text: "Xếp Hạng",
            textStyle: {
                fontSize: 20,
                fill: 0x000000,
            },
            icon: 'trophy_icon',
            iconSize: 25,
            iconColor: 'black',
            onClick: () => {this.onOpenLeaderboardScreen()}
        })
        leaderboardBtn.position.set(100, Manager.height - 100);
        this.addChild(leaderboardBtn);
    }

    // events
    onStartPlay() {
        Manager.changeScreen(new GameScreen());
    }

    onOpenLeaderboardScreen() {
        Manager.changeScreen(new LeaderboardScreen());
    }
}

