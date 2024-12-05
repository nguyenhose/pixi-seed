import { DropShadowFilter } from "pixi-filters";
import { Assets, BlurFilter, Container, convertFormatIfRequired, Graphics, Sprite, Text, Texture } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { HomeScreen } from "./HomeScreen";
import { ImageP } from "../components/shared/ImageP";
import { NetworkService } from "../services/NetworkService";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { ScrollBox } from "@pixi/ui";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { Dialog } from "./popup/Dialog";
import { Toast } from "./popup/Toast";
import { sfx } from "../services/Audio";
import { LeaderboardScreen } from "./LeaderboardScreen";

export class RewardScreen extends Container implements ScreenContainer {
    vui: number = 0;
    vuiBalance: Text = new Text();
    selectedPrice: number = 0;
    constructor() {
        super();
        this.addHeader();
        pixiEmitter.on(CLIENT_EVENTS.UPDATE_RANK_REWARD, this.updateRankReward, this);
        NetworkService.Senders?.Game?.senGetRankReward();

    }

    updateRankReward({params}: any) {
        if (!params) return;
        // update VUI balance
        // render shop package
        let rows = [];
        if (params && params.length) {
            for (let i = 0; i < Math.ceil (params.length / 2 ); i++) {
                const index = i * 2;
                let row = new Container();
                const item = this.renderRewardItem(params[index]);
                item.position.set(Manager.width / 2 - item.width - 10, 0)
                row.addChild(item);
                if (params[index + 1]) {
                    const _item = this.renderRewardItem(params[index + 1]);
                    _item.position.set(Manager.width / 2 + 10, 0);
                    row.addChild(_item);
                }
                rows.push(row);
            }
            const startY =  Manager.height / 8;
            const list = new ScrollBox({
                width: Manager.width,
                height: Manager.height - startY,
                elementsMargin: 10,
                bottomPadding: 10,
                // background: 'red', 
                items: rows
            })
            list.position.set(0, startY);
            this.addChild(list);
        }
    }

    onDestroy(): void {
        pixiEmitter.removeListener(CLIENT_EVENTS.GET_SHOP, this.updateRankReward, this);
    }
    update(deltaTime: number): void {
    }
    resize(): void {
    }

    addHeader() {
        const title = new Text({ text: "Quà thưởng", style: {
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
            Manager.changeScreen(new LeaderboardScreen());
        })
        this.addChild(backButton);
    }

    renderRewardItem(data: any) {
        const container = new Container();
        const background = Sprite.from("package");
        const ratio = background.width / background.height;
        background.width = Manager.width / 2.2;
        background.height = background.width / ratio;
        container.addChild(background);
        this.loadRemoteImagePath(data.imagePath, container);
        const text = new Text({ text: data.name, style: {
            fontSize: 15,
            fontFamily: "Archia Medium",
        }})
  
        text.anchor.set(.5);
        text.position.set(container.width / 2, container.height - text.height - 30);
        container.addChild(text);

        const text_2 = new Text({ text: `${this.getRankText(data.fromRank, data.toRank)}`, style: {
            fontSize: 15,
            fontFamily: "Archia Medium",
        }})
  
        text_2.anchor.set(.5);
        text_2.position.set(container.width / 2, container.height / 1.85);
        container.addChild(text_2);
        return container;
    }

    getRankText(from: number, to: number) {
        if (from == to) {
            return `Hạng ${from}`
        } else {
            return `Hạng ${from} đến ${to}`
        }

    }

    async loadRemoteImagePath(path: string, container: Container) {
        try {
            const texture = await Assets.load(path);
            const label = Sprite.from(texture);
            label.anchor.set(.5);
            label.position.set(container.width / 2, container.height / 3)
            const ratio = label.width / label.height;
            label.width = 60; 
            label.height = label.width / ratio;
          
            container.addChild(label);
        } catch (error) {
            console.log(error);
        }
    }

    blur(): void {
    }

    focus(): void {
    }
 }