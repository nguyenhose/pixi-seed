import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager, ScreenContainer } from "../../Manager";
import { ColorGradientFilter, DropShadowFilter, OutlineFilter } from "pixi-filters";
import { gsap } from "gsap/gsap-core";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { sfx } from "../../services/Audio";
import { MissionScreen } from "../MissionScreen";
import { ShopScreen } from "../ShopScreen";


const dialogDefaultOptions = {
    width: 300, 
    height: 100,
    title: "Fair Trade",
    description: "Dont let them run",
    buttonText: "Đổi Xu",
    inGame: false
}
type DialogOptions = typeof dialogDefaultOptions;
export class NoXuDialog extends Container implements ScreenContainer {
    constructor(options: Partial<DialogOptions> = {}) {
        super();
        const opts = { ...dialogDefaultOptions, ...options }
        const  { title, width, height, description } = opts;
        const bg = new Graphics().roundRect(0, 0, width, height, 30).fill("orange");
        bg.filters = [ 
            new ColorGradientFilter({
                type: 0,
                angle: 0,
                stops: [
                    {
                        color: "#E6C539",
                        alpha: 1,
                        offset: 1,
                    },
                    {
                        color: "#FFB725",
                        alpha: 1,
                        offset: .8,
                    },
                    {
                        color: "#F02C2C",
                        alpha: 1,
                        offset: 0,
                    },
            ]
            }),
            new OutlineFilter({
                color: "white",
                thickness: 4
            }), 
        ]
        bg.position.set((Manager.width - width) / 2, 0)
        this.addChild(bg);

        const _title = new Text({
            text: title,
            style: {
                fontFamily: "Archia Medium",
                fontSize: 22,
                fill: 'white',
            }
        });
        _title.anchor.set(.5);
        _title.position.set(Manager.width / 2, bg.position.y + 40);
        // _title.filters = [new DropShadowFilter()];
        this.addChild(_title)

        const content = new Graphics().roundRect(
            0, 0,
            width * .9,
            height - 110, 30).fill("#FFF0DD");
        content.position.set( bg.position.x + 20, bg.position.y + 90)
        this.addChild(content);

        const _description = new Text({
            text: description,
            style: {
                fontSize: 17,
                wordWrapWidth: content.width * .85,
                wordWrap: true,
                fontFamily: "Archia Medium"
            }
        });
        _description.position.set(content.position.x + 25, content.position.y + 20);
        this.addChild(_description);
        this.position.set(0, -bg.height)

        // todo: custom content ?

        const _button = new PrimaryButton({
            width: 238,
            height: 172/2,
            texture: "primary_button",
            text: "Đổi XU",
            fontSize: 26,
            fill: 0xffffff,
            onClick: () => {
                sfx.play("click");
                Manager.changeScreen(new ShopScreen())
            }
        })
        _button.position.set(Manager.width / 2,  content.position.y + content.height - (opts.inGame ? 50 : 140))
        this.addChild(_button);
        if (opts.inGame == false) {
            const _button_2 = new PrimaryButton({
                width: 238,
                height: 172/2,
                texture: "second_button",
                text: "Làm nhiệm vụ",
                fontSize: 26,
                fill: 0xffffff,
                onClick: () => {
                    sfx.play("click");
                    Manager.changeScreen(new MissionScreen());
                }
            })
            _button_2.position.set(Manager.width / 2,  content.position.y + content.height - 50)
            this.addChild(_button_2);
        }

        const _closeButton = Sprite.from("close_modal");
        _closeButton.anchor.set(.5);
        _closeButton.width = 60; _closeButton.height = 60;
        _closeButton.position.set(bg.position.x + bg.width / 2, bg.position.y + bg.height + 60);
        _closeButton.on('pointerup', (e) => {
            sfx.play("click");
            Manager.closeCurrentPopup();
        })
        _closeButton.eventMode = 'static';
        this.addChild(_closeButton);
        gsap.to(this.position, {x: 0, y: Manager.height / 4, ease: "bounce" });
    }

    update(deltaTime: number): void {
    }

    resize(): void {
    }

    focus?(): void {
    }

    blur?(): void {
    }
    
    pause?(): void {
    }
    
}