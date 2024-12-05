import { Container } from "pixi.js";
import { GameScreen } from "../../screens/GameScreen";
import { BetPlaceConstant } from "./BetDataSchema";
import { PrimaryButton } from "../shared/PrimaryButton";
import { sfx } from "../../services/Audio";

export class BetPlace extends Container {
    constructor(text: BetPlaceConstant, _context: GameScreen) {
        super();
        const backgroundPlace = new PrimaryButton({
            width: 130,
            height: 130,
            texture: text,
            onClick: () => {
                sfx.play("bet_sound");
                _context.betOnValue(text, this.position);
            }
        })
        this.addChild(backgroundPlace);
    }

    onResize() {

    }
}