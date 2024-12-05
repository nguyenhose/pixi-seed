import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { DropShadowFilter, OutlineFilter } from "pixi-filters";
import { ImageP } from "../components/shared/ImageP";
import { NetworkService } from "../services/NetworkService";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { ScrollBox } from "@pixi/ui";
import { MissionItem } from "../components/AnimalDices/MissionItem";
import { HomeScreen } from "./HomeScreen";
import { sfx } from "../services/Audio";

export class MissionScreen extends Container implements ScreenContainer {
    list: ScrollBox;
    constructor() {
        super();
        this.addHeader();
        NetworkService.Senders?.Game?.sendGetChallenge();
        this.list = new ScrollBox({
            width: Manager.width,
            height: Manager.height - 320,
            elementsMargin: 10,
            bottomPadding: 10,
        })
        this.list.position.set(0, 320);
        this.addChild(this.list);

        pixiEmitter.on(CLIENT_EVENTS.GET_MISSION_DATA, this.onGetData, this)        
    }

    onGetData({params}: any) {
        if (!params) return;
        const { currentCheckin, challenges } = params;

        this.addCheckinSession(currentCheckin);
        let items = [];
        if (challenges && challenges.length) {
            for(let i = 0; i < challenges.length; i++) {
                const item = new MissionItem(i, challenges[i], this);
                items.push(item);
            }
        }
        this.list.removeItems();
        this.list.addItems(items);
    }

    onDestroy(): void {
        pixiEmitter.removeListener(CLIENT_EVENTS.GET_MISSION_DATA, this.onGetData, this);
    }

    addHeader() {
        const title = new Text({ text: "Nhiệm vụ", style: {
            fontSize: 20,
            fontFamily: 'Archia Medium'
        }});
        title.anchor.set(.5);
     
        title.position.set(Manager.width / 2, 35);
        this.addChild(title);

        const backButton = Sprite.from("back_button");
        backButton.width = 30;
        backButton.height = 30;
        backButton.position.set(10, 18);
        backButton.eventMode = 'static';
        backButton.on('pointerup', (e) => {
            sfx.play("click");
            Manager.changeScreen(new HomeScreen());
        })
        this.addChild(backButton);

    }

    addCheckinSession(currentDay: number) {
        const checkingSs = new Graphics().roundRect(Manager.width * .05, 100, Manager.width * .9, 200).fill("#FFF0DD");
        // checkingSs.filters = [new DropShadowFilter({})]
        this.addChild(checkingSs);

        const icon = Sprite.from("checkin_icon");
        icon.position.set(Manager.width * .05 + 20, 120);
        this.addChild(icon);
        
        const text = new Text({
            text: "Điểm danh mỗi ngày",
            style: {
                fontSize: 16,
                fontFamily: "Archia Medium"
            }
        });
        text.anchor.set(0, 0);
        text.position.set(Manager.width * .05 + 50, 120);
        this.addChild(text);
        const startPosition = {x: Manager.width * .05 + 20, y: 160}
        const secondPosition = {x: Manager.width * .05 + 20, y: 230}
        const goldList = Manager.GameConfig.dailyGold;
        for (let i = 0; i < goldList.length; i++) {
            if (i < 4) {
                this.addCheckInDay(i, i * 75, 0, startPosition, goldList[i], currentDay > i);
            } else {
                this.addCheckInDay(i, (i - 4) * 75, 0, secondPosition, goldList[i], currentDay > i);
            }
        }
        // icon.text = "Điểm danh mỗi ngày";
    }

    addCheckInDay(index: number, x: number, y: number, startPoint: any, gold: any, isReceived: boolean) {
        const cd = new Graphics().roundRect(startPoint.x + x, startPoint.y + y, 60, 55, 10).fill("white");
        const text = new Text({text: 'Ngày ' + (index + 1), style: {
            fontFamily: "Archia Medium",
            fontSize: 14,
        }})
        const rewardCoin = Sprite.from("currency");
        rewardCoin.position.set(startPoint.x + x + 6, startPoint.y + y + 32);
        rewardCoin.width = 15;
        rewardCoin.height = 15;

        text.position.set(startPoint.x + x + 5, startPoint.y + y + 10)
        const value = new Text({text: "+" + gold, style: { fill: "green", fontSize: 13, fontFamily: "Archia Medium" }})
        value.position.set(startPoint.x + x + 3 + 20, startPoint.y + y + 32);

        this.addChild(cd);
        this.addChild(text);
        this.addChild(rewardCoin);
        this.addChild(value)

        if (isReceived) {
            const checkin = Sprite.from("check_icon");
            checkin.scale.set(.9);
            checkin.position.set(startPoint.x + x + 42, startPoint.y + y - 10);
            this.addChild(checkin);
            cd.filters = [new OutlineFilter({thickness: 2, color: "#453003"})]
        } else {
            
        }

    }

    update(deltaTime: number): void {
        NetworkService.checkMessageBox();
    }

    resize(): void {
        
    }

  
}