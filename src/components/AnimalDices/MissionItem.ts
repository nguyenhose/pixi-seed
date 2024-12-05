import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../../Manager";
import { DropShadowFilter, GrayscaleFilter } from "pixi-filters";
import { PrimaryButton } from "../shared/PrimaryButton";
import { MissionScreen } from "../../screens/MissionScreen";
import { NetworkService } from "../../services/NetworkService";
import { GameScreen } from "../../screens/GameScreen";
import { ShopScreen } from "../../screens/ShopScreen";

export class MissionItem extends Container {
    _data: any;
    button: PrimaryButton;
    constructor(index: number, data: any, _context: MissionScreen) {
        super();
        this._data = data;
        this.addMission(index, data, _context)
        this.button = new PrimaryButton({
            text: this._data.buttonText,
            width: 116,
            height: 55,
            texture: "white_border_button",
            fill: 0xffffff,
            fontSize: 13
        })
        this.button.position.set(Manager.width - 116 / 1.4, 78);
        this.addChild(this.button);
        this.updateButtonStatus();
    }

    addMission(index: number = 0, data: any, _this: MissionScreen) {
        const ss = new Graphics().roundRect(20, 0, Manager.width * .9, 100).fill("#FFF0DD");
        // ss.filters = [new DropShadowFilter({})]
        this.addChild(ss);

        const text = new Text({text: data.name, style: {
            fontSize: 17,
            fontFamily: "Archia Medium"
        }})

        const _x = ss.position.x + 20;
        const _y = ss.position.y;

        text.position.set(_x + 20, _y + 16);
        this.addChild(text);
       
        const coin = Sprite.from("currency");
        coin.width = 25; coin.height = 25;
        coin.position.set(_x + ss.width - 80, _y + 10)
        this.addChild(coin);

        const coinValue = new Text({
            text: data.gold.toLocaleString(),
            style: {
                fill: "#23B082",
                fontSize: 15,
                fontFamily: "Archia Medium"
            }
        })
        coinValue.position.set(_x + ss.width - 50, _y + 14)
        this.addChild(coinValue);

        const countValue = new Text({text: `${data.currentProgress}/${data.progress}`, style: {
            fontFamily: "Archia Medium",
            fontSize: 15
        }})
        countValue.position.set(_x + 20, _y + 60);
        this.addChild(countValue);
     
    }

    updateButtonStatus() {
        if (this._data.received) {
            this.button.visible = true;
            this.button.updateMessageText("ĐÃ NHẬN");    
            this.button.filters = [new GrayscaleFilter()]
            this.button.interactive = false;
        } else {
            if (this._data.currentProgress >= this._data.progress) {
                this.button.updateDefaultView("claim_btn");
                this.button.updateMessageText("NHẬN NGAY");
                this.button.onClick = this.claim.bind(this);
            } else {
                if (this._data.action == "checkin") {
                    this.button.visible = false;
                } else {
                    this.button.onClick = this.doMissionByType.bind(this);
                }
            }
        }
    }

    doMissionByType() {
        switch (this._data.type) {
            case "ingame":
                // play now
                if (this._data.action === "play-count" || this._data.action === "play-value") {
                    Manager.changeScreen(new GameScreen());
                } 
                // open shop
                else if (this._data.action === "buy-count" || this._data.action === "buy-value") {
                    Manager.changeScreen(new ShopScreen());
                } else {
                    // do nothing 
                    this.button.visible = false
                }
                break;
            case "redirect":
                // play now\
                this.redirectChallenge();
                window.open(this._data.action, "_system", "popup");
                break;
            default:
                break;
        }
    }

    claim() {
        NetworkService.Senders?.Game?.claimMission(this._data.challengeId);
    }

    redirectChallenge() {
        NetworkService.Senders?.Game?.redirectChallenge(this._data.challengeId);
    }

    updateData(data: any) {

    }   
}