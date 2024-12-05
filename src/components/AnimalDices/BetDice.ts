import { Container, Sprite, Text, Texture } from "pixi.js";
import { gsap as tweener } from "gsap/gsap-core";
import { randomRange } from "../utils/random";

export class BetDice extends Container {
    diceUI: Text;
    spriteUI: Sprite;
    dice_strings: string[] = [];
    // show 6 results
    constructor() {
        super();
        //
        this.diceUI = new Text({ text: this.dice(), style: {
            fontFamily: 'Archia Medium',
            fill: 'gold',
            fontSize: 30,
            stroke: {
                color: 'black',
                width: 8,
            },
            align: 'center'
        }})
        this.diceUI.anchor.set(.5);
        this.addChild(this.diceUI);

        this.spriteUI = Sprite.from("ga");
        this.spriteUI.width = 130;
        this.spriteUI.height = 130;
        this.spriteUI.anchor.set(0, 0);
        this.addChild(this.spriteUI);

        this.dice_strings = ["nai", "bau", "ga", "ca", "cua", "tom"];
        this.updateDice(this.dice());
    }

    dice(): string {
        return this.dice_strings[Math.floor(randomRange(0, 6))];
    }

    updateDice(_value: string) {
        this.diceUI.position.set(this.width / 2, 50);
        this.diceUI.scale.set(1, .1);
        this.spriteUI.texture = Texture.from(`r_${_value}`);
    }

    showResult(result: string) {
        if (result) {
            this.diceUI.text = result;
            this.diceUI.style.fill = 'gold';
        } else {
              this.diceUI.text = `+0`;
            this.diceUI.style.fill = 'red';
        }
        this.diceUI.visible = true;
        tweener.to(this.diceUI.position, {
            x: this.diceUI.position.x,
            y: -50,
            duration: .5,
            ease: 'bounce.out',
            delay: .5
        })
        tweener.to(this.diceUI.scale, {x: 1, y: 1, duration: .5, ease: 'bounce.out',
            delay: .5 });
    }
}