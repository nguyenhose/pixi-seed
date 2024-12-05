import { Color, Container, Sprite, Text } from "pixi.js";

export class BetCoins extends Container {
    public coinState: BetCoinState
    constructor(_text: string, _color: string = 'yellow') {
        super();
        const bg = Sprite.from("unselect_coin");
        bg.width = 50;
        bg.height = 50;
        // bg.tint = 'fabd27'

        // bg.alpha = .7;
        const text = new Text({ text: _text, style: {
            fontFamily: 'Archia Medium',
            fontSize: 15,
            align: 'center',
            fill: '#FFD85D'
        }})
        text.anchor.set(.5);
        text.position.set(25, 25);

        this.coinState = BetCoinState.INBET;

        this.addChild(bg);
        this.addChild(text);
    }
}

export enum BetCoinState {
    INBET,
    WIN,
    LOSE,
    MOVING
}