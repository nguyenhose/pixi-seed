import { TextStyleOptions, Text, TextStyle, Sprite, SpriteOptions, Texture } from 'pixi.js';




/**
 * A Text extension pre-formatted for this app, starting centered by default,
 * because it is the most common use in the app.
 */
export class CustomImage extends Sprite {
    constructor(texture: string, size: number) {
        const _texture = Texture.from(texture);

        super({ texture: _texture });
        const ratio = this.width / this.height;
        
        this.width = size;
        this.height = this.width / ratio;
    }
}

export class CustomImageHeight extends Sprite {
    constructor(texture: string, size: number) {
        const _texture = Texture.from(texture);

        super({ texture: _texture });
        const ratio = this.width / this.height;
        
        this.height = size;
        this.width = this.height * ratio;
    }
}