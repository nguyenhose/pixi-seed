import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../../Manager";
import { LeaderboardScreen } from "../../screens/LeaderboardScreen";

export class LeaderBoardItem extends Container {
    background: Graphics;
    constructor(index: number, data: any, _context: LeaderboardScreen) {
        super();
        const startX = 0.05 * Manager.width, startY = 0;
        this.background = new Graphics().roundRect(startX, startY, Manager.width * .9, 70, 10).fill("white");
        this.background.alpha = .7;
        this.addChild(this.background);
        const stt = new Text({text: `#${data.rank}`, style: {
            fontFamily: 'Archia Medium',
            fontSize: 13
        }})
        stt.anchor.set(.5);
        stt.position.set(startX + 20, startY + 35);
        this.addChild(stt);

        const avt = Sprite.from("round_avt");
        avt.width = 40; avt.height = 40;
        avt.anchor.set(.5);
        avt.position.set(startX + 60, startY + 35);
        this.addChild(avt);

        const name = new Text({text: data.displayName, style: {
            fontFamily: 'Archia Medium',
            fontSize: 12
        }})
        name.position.set(startX + 90, startY + 35);
        name.anchor.set(0, .5) ;
        this.addChild(name);

        const icon = Sprite.from("currency");
        icon.width = 25, icon.height = 25;
        icon.anchor.set(.5);

        icon.position.set(Manager.width - 110, startY + 35);
        this.addChild(icon);

        const coinValue = new Text({ text: `+${data.goldRank.toLocaleString()}`, style: {
            fontSize: 13,
            fontFamily: 'Archia Medium'
        }})
        coinValue.anchor.set(0, .5);
        coinValue.position.set(Manager.width - 90, startY + 35);
        this.addChild(coinValue);
    }
}