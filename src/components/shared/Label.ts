import { TextStyleOptions, Text, TextStyle } from 'pixi.js';

const defaultLabelStyle: Partial<TextStyleOptions> = {
    fontFamily: 'Archia Medium',
    align: 'center',
    fontSize: 15
};

export type LabelOptions = typeof defaultLabelStyle;

/**
 * A Text extension pre-formatted for this app, starting centered by default,
 * because it is the most common use in the app.
 */
export class Label extends Text {
    constructor(text?: string | number, style?: Partial<TextStyleOptions> | TextStyle) {
        style = { ...defaultLabelStyle, ...style };
        super({ text, style });
        // Label is always centered, but this can be changed in instance afterwards
        this.anchor.set(0.5);
    }
}