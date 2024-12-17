import { Container } from "pixi.js";
import { RecapItem } from "./RecapItem";
import { Manager } from "../../Manager";
import { CustomImage } from "../shared/CustomImage";
import { Label } from "../shared/Label";
import { gsap } from "gsap/gsap-core";

export class RecapNoData extends Container implements RecapItem {
    lemuck: CustomImage;
    pig: CustomImage;
    coins: any;
    constructor() {
        super();
        const data = Manager.RecapData;
        const bg = new CustomImage("background_7", Manager.width);
        bg.anchor.set(0, 1)
        bg.position.set(0, Manager.height)
        this.addChild(bg);

        const sorry = new Label("Tiếc quá, trong năm nay \n bạn chưa có dấu ấn nào với TAPTAP", 
            {
                fill: 'white',
                fontSize: 17
            }
        );
        sorry.position.set(Manager.width / 2, Manager.height * .1);
        this.addChild(sorry);

        const memory = new CustomImage("text_memory", Manager.width * .9);
        memory.anchor.set(.5, 0);
        memory.position.set(Manager.width / 2, sorry.position.y + sorry.height + 20);
        this.addChild(memory);

        this.lemuck = new CustomImage("lemuck_7", Manager.width / 2.75);
        this.lemuck.anchor.set(.5, 1);
        this.lemuck.position.set(Manager.width * .35, Manager.height * .96);
        this.addChild(this.lemuck);

        this.pig = new CustomImage("pig", Manager.width / 3);
        this.pig.anchor.set(.5, 1);
        this.pig.position.set(Manager.width * .7, Manager.height * .96);
        this.addChild(this.pig);

        this.coins = new CustomImage("coin_2", Manager.width / 3.5);
        this.coins.anchor.set(.5, 1);
        this.coins.position.set(Manager.width * .65, Manager.height * .7);
        this.coins.alpha = 0;
        this.addChild(this.coins);
    }
    
    animate(): void {
        gsap.to(this.lemuck, {y: Manager.height * .875, duration: .7, ease: "back.inOut"})
        gsap.to(this.pig, {y: Manager.height * .925, duration: 1, ease: "back.inOut", 
            onComplete: () => {
                gsap.to(this.coins, {alpha: 1, duration: 1.2, ease: "sine.out"});
            }
        })
    }
}