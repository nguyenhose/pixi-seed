import { NineSliceSprite, Sprite, Texture } from "pixi.js";

const defaultImageOption = {
    width: 301,
    height: 112,
    texture: 'btn_blue'
};

type ImagePOptions = typeof defaultImageOption;
// custom image using nine slices sprite
export class ImageP extends Sprite {
    constructor(options: Partial<ImagePOptions>= {}) {
        const opts = { ...defaultImageOption, ...options};
        const view = new NineSliceSprite({
            texture: Texture.from(opts.texture),
            leftWidth: 100,
            rightWidth: 100,
            topHeight: 100,
            bottomHeight: 100,
            width: opts.width,
            height: opts.height
        });
        super(view);
    }
}