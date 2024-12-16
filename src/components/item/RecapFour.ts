import { Container } from "pixi.js";
import { RecapItem } from "./RecapItem";
import { Manager } from "../../Manager";
import { CustomImage } from "../shared/CustomImage";
import { Label } from "../shared/Label";
import { gsap } from "gsap/gsap-core";

export class RecapFour extends Container implements RecapItem {

    food: CustomImage;
    xienban: CustomImage;
    milkTea: CustomImage;
    pizza: CustomImage;

    constructor() {
        super();
        const data = Manager.RecapData;
        const bg = new CustomImage("bg_4", Manager.width);
        bg.anchor.set(0, 1)
        bg.position.set(0, Manager.height)
        this.addChild(bg);

        const text = new CustomImage("text_omg", Manager.width * 0.7);
        text.position.set(20, Manager.height * .05);
        this.addChild(text);
        if (data.topThree) {
            for(let i = 0; i < data.topThree.length; i++) {
                const initY = text.position.y + text.height + 30;
                this.renderBrand(data.topThree[i], initY + i * 45);
            }
        }
      
        
        this.food = new CustomImage("food", Manager.width / 5.5);
        this.food.anchor.set(0, 1);
        this.food.position.set(Manager.width / 6 * 4, Manager.height - Manager.width / 5 * 2.7)
        this.food.alpha = 0;
        this.addChild(this.food)

        this.xienban = new CustomImage("xien", Manager.width / 9);
        this.xienban.anchor.set(0, 1);
        this.xienban.position.set(Manager.width / 6 * 4 + 30, Manager.height - Manager.width / 5 * 4.5)
        this.xienban.alpha = 0;
        this.addChild(this.xienban)

        this.milkTea = new CustomImage("milk_tea", Manager.width / 5);
        this.milkTea.anchor.set(0, 1);
        this.milkTea.position.set(Manager.width / 6 + 10, Manager.height - Manager.width / 5 * 4.5)
        this.milkTea.alpha = 0;
        this.addChild(this.milkTea);

        this.pizza = new CustomImage("pizza", Manager.width / 5);
        this.pizza.anchor.set(0, 1);
        this.pizza.position.set(Manager.width / 6 - 20, Manager.height - Manager.width / 5 * 2.7)
        this.pizza.alpha = 0;
        this.addChild(this.pizza);



    }
    
    animate(): void {
        const tl = gsap.timeline();
        tl.to(this.pizza, {alpha: 1, duration: .7, ease: "sine.in"});
        tl.to(this.milkTea, {alpha: 1, duration: .7, ease: "sine.in"});
        tl.to(this.xienban, {alpha: 1, duration: .7, ease: "sine.in"});
        tl.to(this.food, {alpha: 1, duration: .7, ease: "sine.in"});

        this.renderBling(Manager.width / 6 + 10, Manager.height - Manager.width / 5 * 4.5 + 20, tl)
        this.renderBling(Manager.width / 6 + 20, Manager.height - Manager.width / 5 * 2.5, tl)
        this.renderBling(Manager.width - 20, Manager.height - Manager.width / 5 * 2, tl)
      

    }

    renderBrand(brand: string, _y: number) {
        const _brand = new Label(`${brand}`, {
            fontSize: 30,
            fill: 'white',
            fontWeight: 'bold'
        })
        _brand.anchor.set(0, 0);
        _brand.position.set(20, _y);
        this.addChild(_brand);
    }

    renderBling(x: number, y: number, _tl: any) {
        const blingbling = new CustomImage("bling", Manager.width / 20);
        blingbling.position.set(x, y);
        blingbling.alpha = 0;
        this.addChild(blingbling);
        _tl.to(blingbling, { alpha: 1, yoyo: true, repeat: -1, duration: 1.5, ease: "sine"});
    }
}