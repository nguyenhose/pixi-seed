
import { FancyButton } from "@pixi/ui";
import { Label } from "./Label";
import { Container, NineSliceSprite, Sprite, Texture } from "pixi.js";

const primaryButtonOptions = {
    // text
    text: '',
    fontFamily: 'Archia Medium',
    fill: 0x4a4a4a,
    fontSize: 15,
    // size
    width: 301,
    height: 0,
    // container
    texture: "",
    // icon ?
    icon: '',
    iconSize: 0,
    // 9 slides
    offsetSlides: [0, 0, 0, 0],
    onClick: () => {}
};

type PrimaryButtonOptions = typeof primaryButtonOptions;
export class PrimaryButton extends FancyButton {
    private messageLabel: Label | undefined;
    private icon: Sprite | undefined;
    public onClick: () => void;
    opts: PrimaryButtonOptions;
    constructor(options: Partial<PrimaryButtonOptions> = {}) {
        const opts = { ...primaryButtonOptions, ...options };
        let defaultView =  undefined;
        if (opts.texture) {
            const txt = Texture.from(opts.texture)
            if (opts.height == 0 || opts.height == undefined) {
                opts.height = txt.height * opts.width / txt.width
            }
            defaultView = new NineSliceSprite({
                texture: txt,
                leftWidth: opts.offsetSlides[0],
                rightWidth: opts.offsetSlides[1],
                topHeight: opts.offsetSlides[2],
                bottomHeight: opts.offsetSlides[3],
                width: opts.width,
                height: opts.height
            });
        }
       
        super({
                defaultView,
                anchor: 0.5,
                animations: {
                    pressed: {
                        props: {
                            scale: { x: 0.95, y: 0.95 },
                            y: 0
                        },
                        duration: .1
                    }
                }
        });
        this.opts = opts;
        this.width = opts.width;
        this.height = opts.height;
        this.onClick = opts.onClick;

        if (opts.text) {
            this.messageLabel = new Label(opts.text, {
                fontFamily: opts.fontFamily,
                fill: opts.fill,
                fontSize: opts.fontSize
            });

            this.messageLabel.anchor.set(.5);
            this.messageLabel.position.set(0, -8)
            this.addChild(this.messageLabel);
        }

        if (opts.icon && this.messageLabel) {
            this.icon = Sprite.from(opts.icon);
            if (opts.text) {
                this.icon.position.set(this.messageLabel.position.x - this.messageLabel.width / 2, -6);
                this.icon.anchor.set(1, 0.5);
                this.icon.width = opts.iconSize;
                this.icon.height = opts.iconSize;
                this.addChild(this.icon);
            }
        }

        this.onDown.connect(this.handleDown.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
    }

    private handleDown() {
        this.messageLabel?.scale.set(0.9);
        if (this.icon) {
            const x =  this.icon.scale.x;
            this.icon.scale.set(x - 0.1);
        }
 
        // sfx.play('common/sfx-press.wav');
        // this.messageLabel.y = -5;
    }

    private handleUp() {
        this.messageLabel?.scale.set(1);
        if (this.icon) {
            const x =  this.icon.scale.x;
            this.icon.scale.set(x + 0.1);
        }
        if (this.onClick != null) {
            this.onClick();
        }
    }

    public updateMessageText(text: string) {
        if (this.messageLabel) {
            this.messageLabel.text = text;
        }
    }

    public updateDefaultView(texture: string) {
        this.defaultView = new NineSliceSprite({
            texture: Texture.from(texture),
            leftWidth: this.opts.offsetSlides[0],
            rightWidth: this.opts.offsetSlides[1],
            topHeight: this.opts.offsetSlides[2],
            bottomHeight: this.opts.offsetSlides[3],
            width: this.opts.width,
            height: this.opts.height
        });
    }
}

