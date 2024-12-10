
import { FancyButton } from "@pixi/ui";
import { Label } from "./Label";
import { NineSliceSprite, Sprite, Texture, Text, TextStyle, TextStyleOptions, ColorSource } from "pixi.js";

interface PrimaryButtonOptions {
  // text
  text?: string,
  textStyle?: TextStyleOptions,
  // size
  width: number,
  height?: number,
  // container
  texture: string,
  // icon ?
  icon?: string,
  iconSize?: number,
  iconColor?: ColorSource,
  // 9 slides
  offsetSlides: number[],
  onClick?: Function
}

const primaryButtonOptions: PrimaryButtonOptions = {
    // text
  text: '',
  textStyle: {
      fontFamily: 'Archia Medium',
      fill: 0x4a4a4a,
      fontSize: 15,
  },
    // size
  width: 300,
  height: 0,

  texture: "yellow_button",
    // icon ?
  icon: '',
  iconSize: 0,
  iconColor: 'white',
    // 9 slides
  offsetSlides: [0, 0, 0, 0],
  onClick: () => {}
}

export class PrimaryButton extends FancyButton {
    private messageLabel: Label | undefined;
    private icon: Sprite | undefined;
    public onClick: Function = () => {};

    originalIconScale: number = 1;
    pressedIconScale: number = 1; 

    opts: PrimaryButtonOptions;
    constructor(options: Partial<PrimaryButtonOptions> = {}) {
        const opts = { ...primaryButtonOptions, ...options };
        let defaultView =  undefined;

        let txt = Texture.from(opts.texture)
        if (!txt) {
            console.error("error: button texture doesn't exist!");
            txt = Texture.from(primaryButtonOptions.texture);
        }
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
        if (opts.height) {
            this.height = opts.height;
        }

        if (opts.onClick) {
            this.onClick = opts.onClick;
        }

        if (opts.text) {
            this.messageLabel = new Text({
                text: opts.text,
                style: opts.textStyle
            })

            this.messageLabel.anchor.set(.5);
            this.addChild(this.messageLabel);
        }

        if (opts.icon && this.messageLabel) {
            this.icon = Sprite.from(opts.icon);
            if (opts.text) {
                this.icon.anchor.set(0.5, .5);
                this.icon.position.set(
                    this.messageLabel.position.x
                    - this.messageLabel.width / 2 - 5
                    , -6);
                if (opts.iconSize) {
                    this.icon.width = opts.iconSize;
                    this.icon.height = opts.iconSize;
                    this.messageLabel.position.x += opts.iconSize / 2;
                    this.icon.position.y += opts.iconSize / 4;
                    this.originalIconScale = this.icon.scale.x;
                    this.pressedIconScale = this.icon.scale.x * 0.9;
                }
                if (opts.iconColor) {
                    this.icon.tint = opts.iconColor
                }
            
                this.addChild(this.icon);
            }
        }

        this.onDown.connect(this.handleDown.bind(this));
        this.onUp.connect(this.handleUp.bind(this));
    }

    private handleDown() {
        this.messageLabel?.scale.set(0.9);
        if (this.icon) {
            this.icon.scale.set(this.pressedIconScale);
        }
    }

    private handleUp() {
        this.messageLabel?.scale.set(1);
        if (this.icon) {
            this.icon.scale.set(this.originalIconScale);
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

