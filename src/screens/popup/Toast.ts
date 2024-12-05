import { Container, Graphics, Sprite, Text } from "pixi.js";
import { gsap } from "gsap/gsap-core";
import { Manager, ScreenContainer } from "../../Manager";

export class Toast extends Container implements ScreenContainer {
    toastHeight: number = 50;

    duration: number = 300; //3s
    
    eslapseTime: number = 0;
    startPop: boolean;
    constructor(text: string, icon: string) {
        super();
        const bg = new Graphics().rect(0, 0, Manager.width, this.toastHeight).fill('black');
        bg.alpha = .5;
        this.addChild(bg);
        
        const _text = new Text({text, style: { fontFamily: "Archia Medium", fontSize: 20, fill: 'white'}});
        _text.anchor.set(.5);
        _text.position.set(Manager.width / 2, this.height / 2);
        this.addChild(_text);


        if (icon) {
            const _icon = Sprite.from(icon);
            if (_icon) {
                _icon.width = 30;
                _icon.height = 30;
                _icon.anchor.set(.5);
                _icon.position.set(Manager.width / 2 - _text.width / 2 - 20, this.height / 2);
                this.addChild(_icon);
            }
        }

        this.position.set(0, Manager.height);
        gsap.to(this.position, {x: 0, y: Manager.height - this.toastHeight, ease: "bounce"});
        this.startPop = true;
    }
    
    update(deltaTime: number): void {
        if (this.startPop) {
            if (this.eslapseTime < this.duration) {
                this.eslapseTime += deltaTime;
            } else {
                gsap.to(this.position, { x : 0, y: Manager.height, ease: "sine"});
                this.eslapseTime = 0;
                this.startPop = false;
            }
        }
    }

    resize(): void {
    }
}