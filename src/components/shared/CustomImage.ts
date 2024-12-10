import { TextStyleOptions, Text, TextStyle, Sprite, SpriteOptions, Texture } from 'pixi.js';




/**
 * A Text extension pre-formatted for this app, starting centered by default,
 * because it is the most common use in the app.
 */
export class CustomImage extends Sprite {
    constructor(texture: string, size: number) {
        super({ texture: Texture.from(texture) });
        const ratio = this.width / this.height;
        
        this.width = size;
        this.height = this.width / ratio;
    }
}