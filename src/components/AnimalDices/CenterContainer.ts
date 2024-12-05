import { Container, Point, Sprite, Text } from "pixi.js";
import { GameScreen } from "../../screens/GameScreen";
import { BetDice } from "./BetDice";
import { Manager } from "../../Manager";
import { Bowl } from "./Bowl";
import { PrimaryButton } from "../shared/PrimaryButton";
import { sfx } from "../../services/Audio";
import { gsap } from "gsap";

export class CenterContainer extends Container {
  betDice_1: BetDice;
  betDice_2: BetDice;
  betDice_3: BetDice;
  bowl: Bowl;
  diskUI: Sprite;
  shakingContainer: Container;
  betTimesUI: Text;
  openButton: PrimaryButton;
  instruction_2: Sprite;
  defaultPosition: Point;
  constructor(_context: GameScreen) {
    super();
    this.shakingContainer = new Container();

    // create disk background
    this.diskUI = Sprite.from("disk");
    this.diskUI.anchor.set(.5);
    this.shakingContainer.addChild(this.diskUI);

    this.addChild(this.shakingContainer);

    // scale shaking container as 1/2 screen height
    const height = Manager.height - 350 - 100;
    const maxHeight = Manager.height / 2.5;
    const desiredHeight = height > maxHeight ? maxHeight : height;
    const _ratio = desiredHeight / this.shakingContainer.height;
    this.shakingContainer.scale.set(_ratio);
    this.defaultPosition = new Point(Manager.width / 2, desiredHeight / 2 + 100);

    this.shakingContainer.position.set(
      this.defaultPosition.x,
      this.defaultPosition.y
    );

    // create bowl
    this.bowl = new Bowl(_context, this.defaultPosition);

    // create bet tables
    this.betDice_1 = new BetDice();
    this.betDice_1.position.set(-this.betDice_1.width / 2 - 80, -this.betDice_1.height / 1.5);
    this.betDice_2 = new BetDice();
    this.betDice_2.position.set(-this.betDice_2.width / 2 + 80, -this.betDice_2.height / 1.5);
    this.betDice_3 = new BetDice();
    this.betDice_3.position.set(-this.betDice_3.width / 2, -this.betDice_3.width / 4);

    this.shakingContainer.addChild(this.betDice_1);
    this.shakingContainer.addChild(this.betDice_2);
    this.shakingContainer.addChild(this.betDice_3);
    this.shakingContainer.addChild(this.bowl);

    // create bet times
    this.betTimesUI = new Text({
      text: `Lượt đặt: ${_context.betTime}`,
      style: {
        fontFamily: "Archia Medium",
        fontSize: 28,
      },
    });
    this.betTimesUI.y = this.shakingContainer.position.y;
    this.betTimesUI.x = Manager.width / 2;
    this.betTimesUI.anchor.set(0.5);
    this.addChild(this.betTimesUI);

    this.openButton = new PrimaryButton({
      width: 120,
      height: 80,
      texture: "open_btn",
      onClick: () => {
        sfx.play("open_bet");
        this.openButton.visible = false;
        _context.updateBetResult(this.bowl);
      },
    });

    this.openButton.position.set(
      Manager.width / 2,
      this.shakingContainer.position.y + this.shakingContainer.height / 2 - this.openButton.height / 2
    );
    this.openButton.visible = false;
    this.addChild(this.openButton);


    this.instruction_2 = Sprite.from("shaking_ins");
    this.instruction_2.anchor.set(0.5);
    const ratio = this.instruction_2.width / this.instruction_2.height;
    this.instruction_2.width = Manager.width * 0.8;
    this.instruction_2.height = this.instruction_2.width / ratio;
    this.instruction_2.position.set(Manager.width / 2, -100);
    this.instruction_2.on("pointerup", () => {
      _context.onShake();
    });
    this.instruction_2.eventMode = "static";
    this.instruction_2.visible = false;
    this.addChild(this.instruction_2);
  }

  public showResult(result: string[]) {
    this.betDice_1?.updateDice(result[0]);
    this.betDice_2?.updateDice(result[1]);
    this.betDice_3?.updateDice(result[2]);
    this.bowl.onOpenBowl();
    // show
    this.openButton.visible = false;
    this.betTimesUI.visible = false;
  }

  public hideResultText() {
    this.betDice_1.diceUI.visible = false;
    this.betDice_2.diceUI.visible = false;
    this.betDice_3.diceUI.visible = false;
  }

  public showBetTime(value: boolean) {
    this.betTimesUI.visible = value;
  }

  public showOpenButton(value: boolean) {
    this.openButton.visible = value;
  }

  public showInstruct2(value: boolean) {
    this.instruction_2.visible = value;
    if (value == false) {
      this.instruction_2.position.set(Manager.width / 2, Manager.height + 50);
    }
  }

  public animateInstruct() {
    if (this.instruction_2.visible == false) {
      this.instruction_2.visible = true;
      gsap.to(this.instruction_2.position, {
        x: Manager.width / 2,
        y: Manager.height - 150,
        ease: "bounce.out",
        delay: 0.5,
      });
    }
  }

  public returnDefaultPosition() {
    console.log("this.defaultPosition.x", this.defaultPosition.x);

    this.shakingContainer.position.set(
      this.defaultPosition.x,
      this.defaultPosition.y
    );
  }

 
}
