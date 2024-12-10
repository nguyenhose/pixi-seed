import { Container, Point, Sprite, Text } from "pixi.js";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { Manager } from "../../Manager";

export class Tutorial extends Container {
    constructor(_title: string, _content: string, _buttonText: string, _onClick: any) {
        super();
        const bg = Sprite.from("tooltip");
        const ratio = bg.width / (Manager.width * .8)
        bg.width = Manager.width * .8;
        bg.height = bg.height / ratio;
        const title = new Text({
            text: _title,
            style: {
                fontFamily: 'Archia Medium',
                fontSize: 20,
            }
        });
        title.position.set(85, 20);
        const content = new Text({
            text: _content,
            style: {
                fontSize: 16,
                fontFamily: "Archia Medium",
                wordWrap: true,
                wordWrapWidth: bg.width * 0.7, 
                fill: 0x1A1818
            }
        });
        content.position.set(85, 50);

        const button = new PrimaryButton({
            text: _buttonText,
            texture: 'white_border_button',
            width:  100,
            offsetSlides: [0, 0, 0, 0],
            textStyle: {
                fill: 0xffffff,
                fontSize: 14,
            },
            onClick: _onClick
        })
        button.anchor.set(.5);
        button.position.set(bg.width - button.width / 2 - 10, bg.height - button.height)

        this.addChild(bg);
        this.addChild(title);
        this.addChild(content);
        this.addChild(button);
    }
}