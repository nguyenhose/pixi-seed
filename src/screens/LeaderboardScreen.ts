import { Container, Sprite, Text } from "pixi.js";

import { Manager, ScreenContainer } from "../Manager";
import { HomeScreen } from "./HomeScreen";
import { ScrollBox } from "@pixi/ui";
import { LeaderBoardItem } from "../components/item/LeaderBoardItem";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { Label } from "../components/shared/Label";

export class LeaderboardScreen extends Container implements ScreenContainer {
    constructor() {
        super();
        this.addBackground();
        this.addHeader();
        this.onRenderMockData();
    }

    ranks = [
        {
            "rank": 1,
            "displayName": "Chin",
            "goldRank": 9610,
            "userId": "90d48fed-718a-4481-98fb-59de3f6e7578"
        },
        {
            "rank": 2,
            "displayName": "Nguyen",
            "goldRank": 390,
            "userId": "271d0f1d-baa5-48a3-bb4d-3f0881306197"
        },
        {
            "rank": 3,
            "displayName": "Ní",
            "goldRank": 0,
            "userId": "e8fa5f4c-15fc-4c91-b692-0c4e283ab47f"
        },
        {
            "rank": 4,
            "displayName": "Ní 2",
            "goldRank": 0,
            "userId": "e8fa5f4c-15fc-4c91-b692-0c4e283ab47f"
        },
        {
            "rank": 5,
            "displayName": "Ní 3",
            "goldRank": 0,
            "userId": "e8fa5f4c-15fc-4c91-b692-0c4e283ab47f"
        }
    ]

    myRank = {
        "rank": 2,
        "displayName": "Nguyen",
        "goldRank": 390,
        "userId": "271d0f1d-baa5-48a3-bb4d-3f0881306197"
    }

    onRenderMockData(): void {
        this.renderTopRank(this.ranks);
        this.addPlayersList(this.ranks, 4);
        this.renderMyRank(this.myRank); 
    }

    onDestroy(): void {
    }

    update(deltaTime: number): void {
        // NetworkService.checkMessageBox();
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
            // add back button
            const backBtn = new PrimaryButton({
                texture: "back_button",
                width: 20,
                onClick: () => {Manager.changeScreen(new HomeScreen());}
            })
            backBtn.tint = 0x000000;
            backBtn.position.set(30, 30);
            this.addChild(backBtn);
        }
    }
    
    addBackground() {
        const cup = Sprite.from("trophy_icon");
        cup.anchor.set(.5);
        cup.position.set(Manager.width / 2, 140)
        cup.scale.set(.25);
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

    colorPalette = ["#432E54", "#AE445A", "#E8BCB9"];
    addTopRank(data: any, offset: any) {
        if (!data) return;
        // const sprite = Sprite.from(`top_${data.rank}`);
        const sprite = Sprite.from(`round_avt`);
        sprite.width = 80; sprite.height = 80;
        sprite.anchor.set(.5);
        sprite.position.set(Manager.width / 2 + offset.x, Manager.height / 2 - 200 + offset.y);
        sprite.tint = this.colorPalette[data.rank - 1];
        this.addChild(sprite);

        // render rank
        const rank = new Label(data.rank, {
            fontSize: 30,
            fill: 'white',
            stroke: {
                color: 'black',
                width: 5,
                join: 'bevel'
            }
        });
        rank.position = sprite.position;
        this.addChild(rank);

        const name = new Label(data.displayName.toUpperCase(), {fontSize: 15});
        name.anchor.set(.5);
        name.position.set(Manager.width / 2 + offset.x, Manager.height / 2 - 145 + offset.y);
        this.addChild(name);

        const coin = new Label(`+${data.goldRank.toLocaleString()}`, {fontSize: 13});
        coin.position.set(
            Manager.width / 2 + offset.x, 
            Manager.height / 2 - 118 + offset.y);
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
        item.position.set(0, Manager.height - item.height - 2);
    }
}