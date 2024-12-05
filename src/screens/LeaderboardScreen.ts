import { Container, Graphics, Sprite, Text } from "pixi.js";

import { Manager, ScreenContainer } from "../Manager";
import { ImageP } from "../components/shared/ImageP";
import { DropShadowFilter } from "pixi-filters";
import { HomeScreen } from "./HomeScreen";
import { LeaderBoardItem } from "../components/AnimalDices/LeaderBoardItem";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { NetworkService } from "../services/NetworkService";
import { ScrollBox } from "@pixi/ui";
import { sfx } from "../services/Audio";
import { RewardScreen } from "./RewardScreen";

export class LeaderboardScreen extends Container implements ScreenContainer {
    constructor() {
        super();
        this.addBackground();
        this.addHeader();
        NetworkService.Senders?.Game?.sendLeaderboard();
        pixiEmitter.on(CLIENT_EVENTS.GET_LEADERBOARD, this.onGetData, this);
    }

    onGetData({params}: any): void {
        if (!params) return;
        const { myRank, ranks } = params;
        this.renderTopRank(ranks);
        this.addPlayersList(ranks, 4);
        this.renderMyRank(myRank); 
    }

    onDestroy(): void {
        pixiEmitter.removeListener(CLIENT_EVENTS.GET_LEADERBOARD, this.onGetData, this)
    }

    update(deltaTime: number): void {
        NetworkService.checkMessageBox();
    }

    resize(): void {
    }

    addHeader() {
        const title = new Text({ text: "Bảng Vàng", style: {
            fontSize: 20,
            fontFamily: 'Archia Medium'
        }});
        title.anchor.set(.5);
     
        title.position.set(Manager.width / 2, 35);
        this.addChild(title);
        if (Manager.gameHasEnd == false) {
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

        const toRewardScreenBtn = Sprite.from("giftIcon");
        toRewardScreenBtn.width = 50;
        toRewardScreenBtn.height = 50;
        toRewardScreenBtn.position.set(Manager.width - 55, 75);
        toRewardScreenBtn.eventMode = 'static';
        toRewardScreenBtn.on('pointerup', (e) => {
            sfx.play("click");
            Manager.changeScreen(new RewardScreen());
        })
        this.addChild(toRewardScreenBtn);
    }
    
    addBackground() {
        const cup = Sprite.from("leader_cup");
        cup.anchor.set(.5);
        cup.position.set(Manager.width / 2, 140)
        cup.scale.set(.5);
        this.addChild(cup);
    }

    addPlayersList(ranks: any, from: number) {
        let items = []; 
        if (ranks && ranks.length && ranks.length >= from) {
            for(let i = from - 1; i < ranks.length; i++) {
                const item = new LeaderBoardItem(i, ranks[i], this);
                items.push(item);
            }
        }
        const startY =  Manager.height / 2.3;
        const list = new ScrollBox({
            width: Manager.width,
            height: Manager.height - startY - 70,
            elementsMargin: 10,
            bottomPadding: 10,
            // background: 'red',
            items
        })
        list.position.set(0, startY);
        this.addChild(list);
    }

    renderTopRank(ranks: any) {
        
            this.addTopRank(ranks[1], {x: -120, y: 10} );
            this.addTopRank(ranks[0], {x: 0, y: -20});
            this.addTopRank(ranks[2], {x: 120, y: 10});
    }


    addTopRank(data: any, offset: any) {
        if (!data) return;
        const sprite = Sprite.from(`top_${data.rank}`);
        sprite.width = 100; sprite.height = 100;
        sprite.anchor.set(.5);
        sprite.position.set(Manager.width / 2 + offset.x, Manager.height / 2 - 200 + offset.y);
        this.addChild(sprite);

        const name = new Text({ text: data.displayName.toUpperCase(), style: {fontSize: 15, fontFamily: "Archia Medium"} });
        name.anchor.set(.5);
        name.position.set(Manager.width / 2 + offset.x, Manager.height / 2 - 145 + offset.y);
        this.addChild(name);

        const coin = new Text({ text: `+${data.goldRank.toLocaleString()}`, style: {fontSize: 13, fontFamily: "Archia Medium"} });
        coin.position.set(
            Manager.width / 2 + offset.x - (coin.width / 2), 
            Manager.height / 2 - 125 + offset.y);
        this.addChild(coin);

        const coinIcon = Sprite.from("currency");
        coinIcon.width = 20; coinIcon.height = 20;
        coinIcon.position.set(Manager.width / 2 + offset.x - (coin.width / 2 + 10 + 15), Manager.height / 2 - 126 + offset.y)
        this.addChild(coinIcon) ;
    }

    renderMyRank(data: any) {
        const item = new LeaderBoardItem(data.rank, data, this);
        this.addChild(item);
        item.background.alpha = 1;
        // item.filters = [new DropShadowFilter()];
        item.position.set(0, Manager.height - item.height - 2);
    }
}