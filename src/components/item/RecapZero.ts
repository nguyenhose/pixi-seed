import { Container, Sprite } from "pixi.js";
import { CustomImage } from "../shared/CustomImage";
import { Manager } from "../../Manager";
import { gsap } from "gsap/gsap-core";
import { PrimaryButton } from "../shared/PrimaryButton";
import { RecapItem } from "./RecapItem";
import { HomeScreen } from "../../screens/HomeScreen";

export class RecapZero extends Container implements RecapItem {
    private _context: HomeScreen;
    constructor(context: HomeScreen) {
        super();
        this._context = context;
        const bg = new CustomImage("BG", Manager.width);
        this.addChild(bg);

        const gift = new CustomImage("GIFT", Manager.width);
        gift.anchor.set(.5);
        gift.position.set(Manager.width / 2, -200);
        this.addChild(gift)

        const lemuck = new CustomImage("LEMUCK", Manager.width / 1.6);
        lemuck.anchor.set(.5);
        lemuck.position.set(Manager.width / 2, -200);
        this.addChild(lemuck);

        const year = new CustomImage("2024", Manager.width * .7);
        year.anchor.set(.5);
        year.position.set(Manager.width / 2, Manager.height / 2 + 40)
        year.scale.set(0);
        this.addChild(year);

        const firework_1 = new CustomImage("FIREWORK_LEFT", 50);
        firework_1.position.set(10, Manager.height / 3);
        firework_1.alpha = 0;
        this.addChild(firework_1);

        const firework_2 = new CustomImage("FIREWORK_LEFT", 100);
        firework_2.anchor.set(1, 0);
        firework_2.alpha = 0;
        firework_2.position.set(Manager.width + 20, Manager.height / 3 + 50);
        this.addChild(firework_2);

        const exploreBtn = new PrimaryButton({
            texture: "explore_btn",
            width: Manager.width * .75,
            onClick: () => {
                this._context.recapItemIndex = 1;
                this._context.nextSlide();
            }
        })
        exploreBtn.anchor.set(.5);
        exploreBtn.position.set(Manager.width / 2, Manager.height * 1.2);
        this.addChild(exploreBtn);


        const tl = gsap.timeline();
        tl.to(lemuck.position, {y: Manager.height * .72, duration: 1, ease: "back.in"});
        tl.to(gift.position, { y: Manager.height * .72, duration: .7, ease: "back.in"});
        tl.to(year.scale, {x: .2, y: .2, duration: .7, ease: "back.out"})
        tl.to(exploreBtn.position, {y: Manager.height * 0.92, duration: 1, ease: "bounce.out"})
        tl.to(firework_1, { alpha: 1, yoyo: true, repeat: -1, duration: 1.5});
        tl.to(firework_2, { alpha: 1, yoyo: true, repeat: -1, duration: 1.5, delay: 1});
    }
    
    animate() {

    }
}