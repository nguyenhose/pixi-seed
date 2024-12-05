import { Container, Point, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { GameScreen } from "../../screens/GameScreen";
import { BetValueData } from "./BetDataSchema";

export class BetValues extends Container {
    _background: Sprite;
    _iconName: string;
    _isSelected: boolean = false;
    _id: number;
    // show 6 results
    constructor(data: BetValueData, _context: GameScreen) {
        super();
        this._iconName = data.icon || 'coin';
        this._id = data.value;
        this._background = Sprite.from(`unselect_${this._iconName}`);
        this._background.width = 60;
        this._background.height = 60;
        this._background.anchor.set(.5);
        if (data.color) {
            this._background.tint = data.color
        }
        const _text = new Text({text: data.label, style: {
            fontFamily: 'Archia Medium',
            fontSize: 18,
            align: 'center',
            fill: '#FFD85D'
        }});
        _text.anchor.set(.5);
        this._background.on('pointerdown', (e) => {
            _context.onSelectedDefaultBet(data.value, this.getGlobalPosition());
        })
        this._background.eventMode = 'static';
        this.addChild(this._background);
        this.addChild(_text);
    }

    onSelect() {
        this._background.texture = Texture.from(`selected_${this._iconName}`);
        this._isSelected = true;
        this.scale.set(1.2);
    }

    onUnSelect() {
        this._background.texture = Texture.from(`unselect_${this._iconName}`);
        this._isSelected = false;
        this.scale.set(1);
    }
}