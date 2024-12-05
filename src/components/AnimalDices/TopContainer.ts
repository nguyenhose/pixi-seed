import { Container, Graphics, Point } from "pixi.js";
import { GameScreen } from "../../screens/GameScreen";
import { BetValueData } from "./BetDataSchema";
import { BetValues } from "./BetValues";
import { Manager } from "../../Manager";
import { sfx } from "../../services/Audio";
import { PrimaryButton } from "../shared/PrimaryButton";

export class TopContainer extends Container {
    values: BetValues[] = [];
    undoButton: PrimaryButton;
    constructor(_context: GameScreen, data: BetValueData[]) {
        super();
        // create money
        let lastPosition = new Point();
         for(let i = 0; i < data.length; i++) {
            const value = new BetValues(data[i], _context);
            this.values.push(value);
            value.position.y = Manager.height - 330;
            const dist = (Manager.width / data.length);
            value.position.x = (i * dist) + dist/2;
            lastPosition = value.position;
            this.addChild(value);
        }

        this.undoButton = new PrimaryButton({
            icon: "undo_btn",
            text: "Đặt lại XU", 
            fontSize: 18,
            fill: 0xffffff,
            iconSize: 26,
            width: 45,
            height: 45,
            onClick:  () => {
                _context.undoBet();
                this.showResetButton(false);
            }
        })
        this.undoButton.anchor.set(.5);
        this.undoButton.position.set(Manager.width / 2, Manager.height - this.undoButton.height / 2);
        // this.undoButton.visible = false;
        this.addChild(this.undoButton);
    } 

    selectBetValue(value: number) {
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i]._id === value) {
                sfx.play("select");
                this.values[i].onSelect();
            } else {
                this.values[i].onUnSelect();
            }
        }
    }

    showResetButton(value: boolean) {
        this.undoButton.interactive = value;
        this.undoButton.visible = value;
    }
}