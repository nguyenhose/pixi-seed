import { ColorGradientFilter, DropShadowFilter, OutlineFilter } from "pixi-filters";
import { checkDataUrl, Container, Graphics, Point, Sprite, Text } from "pixi.js";
import { Manager, ScreenContainer } from "../../Manager";
import { CheckBox } from "@pixi/ui";
import gsap from "gsap";
import { bgm, sfx } from "../../services/Audio";
export class QuickSetting extends Container implements ScreenContainer  {
    constructor() {
        super();
        const minHeight = 120;
        let width = Manager.width * .9, 
        height = Manager.height * .25 > minHeight ? Manager.height * .25 : minHeight, title = "Cài đặt";
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
        _title.position.set(Manager.width / 2, bg.position.y + 30);
        // _title.filters = [new DropShadowFilter()];
        this.addChild(_title)
        const content = new Graphics().roundRect(
            0, 0,
            width * .9,
            height * 0.8).fill("#FFF0DD");
        content.position.set( bg.position.x + 20, 20)
        this.addChild(content);
        this.renderSettingOption("Âm thanh", (checked: boolean) => {
            sfx.play("click");
            Manager.audioSetting.sfxOn = checked;
        }, 1, content.position, content.width, Manager.audioSetting.sfxOn)

        this.renderSettingOption("Nhạc nền", (checked: boolean) => {
            sfx.play("click");
            Manager.audioSetting.bgmOn = checked;
            if (checked) {
                bgm.play("bgm");
            } else {
                bgm.stop();
            }
        }, 2, content.position, content.width, Manager.audioSetting.bgmOn)

        const _closeButton = Sprite.from("close_modal");
        _closeButton.anchor.set(.5);
        _closeButton.width = 60; _closeButton.height = 60;
        _closeButton.position.set(bg.position.x + bg.width / 2, bg.position.y + bg.height + 60);
        _closeButton.on('pointerup', (e) => {
            Manager.toggleSetting(false);
        })
        _closeButton.eventMode = 'static';
        this.addChild(_closeButton);

        gsap.to(this.position, {x: 0, y: Manager.height / 4, ease: "bounce" });
    }

    renderSettingOption(_text: string, onToggle: any, rowNumber: number, point: Point, width: number, defaultValue: boolean) {
        const label = new Text({text: _text, style: {
            fontSize: 20,
            fontFamily: "Archia Medium"
        }})
        label.position.set(point.x + 20, point.y + 20 * rowNumber + (rowNumber - 1) * 40);
        const checkbox = new CheckBox({style: {
            unchecked: "toggleOff",
            checked: "toggleOn"
        }})
        const ratio = checkbox.width / checkbox.height;
        checkbox.width = 60;
        checkbox.height = checkbox.width / ratio;
        checkbox.position.set(point.x + width - 40 - checkbox.width, point.y + 20 * rowNumber + (rowNumber - 1) * 40);
        // loading default 
        checkbox.checked = defaultValue;
        checkbox.onChange.connect(onToggle)
        this.addChild(label);
        this.addChild(checkbox);
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