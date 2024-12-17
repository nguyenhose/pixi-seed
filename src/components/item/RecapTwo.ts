import { Container } from "pixi.js";
import { RecapItem } from "./RecapItem";
import { CustomImage } from "../shared/CustomImage";
import { Manager } from "../../Manager";
import { Label } from "../shared/Label";
import { gsap } from "gsap/gsap-core";

export class RecapTwo extends Container implements RecapItem {
    lemuck: CustomImage;
    coins: CustomImage;
    animated: boolean = false
    constructor() {
        super();
        const data = Manager.RecapData;
        const bg = new CustomImage("background_6", Manager.width);
        bg.anchor.set(0, 1)
        bg.position.set(0, Manager.height)
        this.addChild(bg);

        const text = new CustomImage("text_ca", Manager.width * .8);
        text.position.set(20, Manager.height * .05)
        this.addChild(text);

        const issuedText = new Label("Bạn đã tích được", {
            fill: 'white',
            fontSize: 20
        })
        issuedText.anchor.set(0, .5);
        issuedText.position.set(20, text.position.y + text.height + 30);
        this.addChild(issuedText);

        const issueTextValue = new Label(`${data.issuedPoint.toLocaleString()} VUI`, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        })
        issueTextValue.anchor.set(0, .5);
        issueTextValue.position.set(20, issuedText.position.y + issuedText.height + 8)
        this.addChild(issueTextValue);

        const issuedText2 = new Label("Bạn đã tiêu được", {
            fill: 'white',
            fontSize: 20,
        })
        issuedText2.anchor.set(0, .5);
        issuedText2.position.set(20, issueTextValue.position.y + issueTextValue.height + 30);
        this.addChild(issuedText2);

        const issueTextValue2 = new Label(`${data.redeemPoint.toLocaleString()} VUI`, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        })
        issueTextValue2.anchor.set(0, .5);
        issueTextValue2.position.set(20, issuedText2.position.y + issuedText2.height + 8)
        this.addChild(issueTextValue2);

        this.lemuck = new CustomImage("lemuck_agent", Manager.width / 3.5);
        this.lemuck.anchor.set(.5, 1);
        this.lemuck.position.set(Manager.width / 2, - this.lemuck.height);
        this.addChild(this.lemuck);

        this.coins = new CustomImage("coin", Manager.width * .9);
        this.coins.anchor.set(.5, 0);
        this.coins.position.set(Manager.width / 2, Manager.height);
        this.addChild(this.coins);
    }
    animate() {
        if (this.animated == false) {
            this.animated = true;
            const tl = gsap.timeline();
            tl.to(this.lemuck, { y: Manager.height - Manager.width * .21, duration: .75, ease: "circ.in" })
            tl.to(this.coins, {y : Manager.height * .55, duration: .75, ease: "circ.out"})
        } 
    }
}