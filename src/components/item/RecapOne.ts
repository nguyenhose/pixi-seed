import { Container, Graphics, Sprite } from "pixi.js";
import { Label } from "../shared/Label";
import { Manager } from "../../Manager";
import { CustomImage } from "../shared/CustomImage";
import { gsap } from "gsap/gsap-core";
import { taptap3 } from "../utils/theme";

export class RecapOne extends Container {
    lemuck: CustomImage;
    gate: CustomImage;
    light: CustomImage;
    spaceship: CustomImage;
    founded: CustomImage;
    startX: number = 0;
    animated: boolean = false;

    constructor() {
        super();
        const data = Manager.RecapData;
        const bg = new Graphics().rect(0, 0, Manager.width, Manager.height);
        bg.fill(taptap3[0]);
        this.addChild(bg);

        // add xin chao
        const hello = new Label("Xin Chào", {
            fill: 'white',
            fontSize: 18
        });
        hello.anchor.set(0, 1);
        hello.position.set(20, Manager.height * .2);
        this.addChild(hello);
        
        // add name
        const name = new Label(data.userName, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        });
        name.anchor.set(0, 0);
        name.position.set(20, hello.position.y + 4);
        this.addChild(name);

        // ban da dong hanh
        const fromText = new Label("Bạn đã đồng hành cùng TAPTAP từ", {
            fill: 'white',
            fontSize: 18
        });
        fromText.anchor.set(0, 1);
        fromText.position.set(20, name.position.y + 80);
        this.addChild(fromText);

        const fromTextValue = new Label(data.startFrom, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        });
        fromTextValue.anchor.set(0, 0);
        fromTextValue.position.set(20, fromText.position.y + 4);
        this.addChild(fromTextValue);

           // moi do ma da
        const timeTitle = new Label("Mới đó mà đã", {
            fill: 'white',
            fontSize: 18
        });
        timeTitle.anchor.set(0, 1);
        timeTitle.position.set(20, fromTextValue.position.y + 80);
        this.addChild(timeTitle);
        
        // 
        const yearValue = new Label(`${data.year} Năm`, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        });
        yearValue.anchor.set(0, 0);
        yearValue.position.set(20, timeTitle.position.y + 4);
        this.addChild(yearValue);

        const monthValue = new Label(`${data.month} Tháng`, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        });
        monthValue.anchor.set(0, 0);
        monthValue.position.set(20, timeTitle.position.y + 44);
        this.addChild(monthValue);

        const dayValue = new Label(`${data.day} Ngày`, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        });
        dayValue.anchor.set(0, 0);
        dayValue.position.set(20, timeTitle.position.y + 84);
        this.addChild(dayValue);

        // hoat canh

        // add phi thuyen

        this.spaceship = new CustomImage("spaceship", Manager.width / 5);
        this.spaceship.anchor.set(1, 0);
        this.spaceship.position.set(Manager.width - 30, Manager.height / 5 * 3);

        // add light
        this.light = new CustomImage("light", this.spaceship.width * 2.5);
        this.light.alpha = 0;
        this.light.anchor.set(.5);
        this.light.position.set(
            this.spaceship.position.x - this.spaceship.width * 1.45, 
            this.spaceship.position.y + this.spaceship.height * 2.3);
        this.addChild(this.light);
        this.addChild(this.spaceship);

        // add gate
        this.gate = new CustomImage("gate", Manager.width / 2)
        this.gate.anchor.set(0, 1);
        this.gate.position.set(0, Manager.height);

        // add lemuck
        this.lemuck = new CustomImage("lemuck_2", Manager.width / 3);
        this.lemuck.anchor.set(0, 1);
        this.lemuck.position.set(0, Manager.height - 50);
        this.addChild(this.lemuck);
        this.addChild(this.gate);

        // add hanh tinh tim
        const pinkPlannet = new CustomImage("pink_plannet", this.spaceship.width/2)
        pinkPlannet.anchor.set(1, 0);
        pinkPlannet.position.set(Manager.width + pinkPlannet.width * .3, Manager.height * .7);
        this.addChild(pinkPlannet);

        // add sao
        const stars = new CustomImage("star", this.spaceship.width / 4);
        stars.anchor.set(1, 0);
        stars.position.set(this.spaceship.position.x - this.spaceship.width * 1.5, this.spaceship.position.y + 10)
        this.addChild(stars)

        this.founded = new CustomImage("founded", this.spaceship.width / 2);
        this.founded.anchor.set(.5);
        this.founded.position.set(
            this.spaceship.position.x - this.spaceship.width/2, 
            this.spaceship.position.y - 20);
        this.founded.alpha = 0;
        this.addChild(this.founded);
    }

    animate() {
        if (this.animated == false) {
            this.animated = true;
            const tl = gsap.timeline();
            tl.to(this.lemuck.position, {x: this.gate.width * 0.65, duration: 1, ease: "sine.out"});
            tl.to(this.light, {alpha: 1, duration: 1, ease: "circ.in"});
            tl.to(this.founded, { alpha: 1, yoyo: true, repeat: -1, duration: 1.5});
        }
   
    }

}