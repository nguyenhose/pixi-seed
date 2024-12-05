import { Assets, BlurFilter, Container, Graphics, Sprite, Text } from "pixi.js";
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

export class ShopScreen extends Container implements ScreenContainer {
    vui: number = 0;
    vuiBalance: Text = new Text();
    selectedPrice: number = 0;
    constructor() {
        super();
        this.addHeader();
        NetworkService.Senders?.Game?.sendShop();
        
        pixiEmitter.on(CLIENT_EVENTS.GET_SHOP, this.onGetShop, this);
        pixiEmitter.on(CLIENT_EVENTS.BUY_RESULT, this.onBuyResult, this)
    }

    onBuyResult({params}: any){
        if (params.success) {
            this.vui -= this.selectedPrice;
            this.vuiBalance.text = this.vui.toLocaleString();
        }
    }

    onToast({params}: any) {
        if (!params) return;
        Manager.popToast(new Toast(params.message, params.iconType));
    }

    onGetShop({params}: any) {
        if (!params) return;
        const { vui, shop } = params;
        // update VUI balance
        // render shop package
        let rows = [];
        if (shop && shop.length) {
            for (let i = 0; i < Math.ceil (shop.length / 2 ); i++) {
                const index = i * 2;
                let row = new Container();
                const item = this.renderShopPackage(shop[index]);
                item.position.set(Manager.width / 2 - item.width - 10, 0)
                row.addChild(item);
                if (shop[index + 1]) {
                    const _item = this.renderShopPackage(shop[index + 1]);
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

        if (vui != undefined) {
            this.vui = vui;
            this.renderVUIBalance(vui);
        }
    }

    onDestroy(): void {
        pixiEmitter.removeListener(CLIENT_EVENTS.BUY_RESULT, this.onBuyResult, this);
        pixiEmitter.removeListener(CLIENT_EVENTS.GET_SHOP, this.onGetShop, this);
    }
    update(deltaTime: number): void {
        NetworkService.checkMessageBox();
    }

       // data events
    resize(): void {
    }

    addHeader() {
        const title = new Text({ text: "Đổi XU", style: {
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

    renderVUIBalance(vui: number) {
        const bg = Sprite.from("vui_balance");
        bg.scale.set(.5);
        bg.anchor.set(1, .5);
        bg.position.set(Manager.width - 10, 40);
        this.addChild(bg);

        this.vuiBalance = new Text({
            text: vui.toLocaleString(),
            style: {
                fontFamily: "Archia Medium",
                fontSize: 13,
                fill: "white"
            }
        })
       this.vuiBalance.anchor.set(0, .5);
       this.vuiBalance.position.set(bg.position.x - bg.width + 40, 32);
        this.addChild(this.vuiBalance);
    }

    addBackground() {
        const backgroundUI = new ImageP({
            width: Manager.width,
            height: Manager.height,
            texture: 'game_bg',
        });
        this.addChild(backgroundUI);
    }

    renderShopPackage(data: any) {
        console.log(data);
        const container = new Container();
        const background = Sprite.from("package");
        const ratio = background.width / background.height;
        background.width = Manager.width / 2.2;
        background.height = background.width / ratio;
        container.addChild(background);
        this.loadRemoteImagePath(data.imagePath, container);
        const text = new Text({ text: data.value.toLocaleString(), style: {
            fontSize: 18,
            fontFamily: "Archia Medium",
        }})
  
        text.anchor.set(.5);
        text.position.set(container.width / 2, container.height / 1.85);
        container.addChild(text);

        const coin = Sprite.from("currency");
        coin.width = 22; coin.height = 22; coin.anchor.set(1, .5);
        coin.position.set(container.width / 2 - (text.width / 2 + 5), container.height / 1.85);
        container.addChild(coin);

        const button = new PrimaryButton({
            text: data.price.toLocaleString(),
            texture: 'long_btn',
            width:  background.width * .85,
            offsetSlides: [0, 0, 0, 0],
            fill: 0xffffff,
            fontSize: 14,
            icon: 'vui_icon',
            iconSize: 32,
            onClick: () => {
                Manager.popModal(
                    new Dialog({
                        width: Manager.width * 0.85,
                        height: Manager.height / 3,
                        title: "Đợi xíu",
                        description: "Bạn muốn đổi theo gói này?",
                        buttonText: "Đổi Ngay",
                        onClick: () => {
                            sfx.play("collect");
                            this.selectedPrice = data.price;
                            NetworkService.Senders?.Game?.sendBuyPackage(data.id);
                            Manager.closeCurrentPopup();
                        }
                }))
            }
        })
        button.anchor.set(.5);
        button.position.set(container.width / 2, container.height - 35)
        
        container.addChild(button);

        return container;
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
        this.filters = [new BlurFilter()];
    }

    focus(): void {
        this.filters = []
    }
 }