import { FederatedEvent, FederatedPointerEvent, Point, Sprite, State, Texture, Ticker } from "pixi.js";
import { Manager } from "../../Manager";
import { GameScreen } from "../../screens/GameScreen";
import gsap from "gsap";
import { StateIndex } from "./BetDataSchema";
export class Bowl extends Sprite {
    isOpen: boolean = false;
    eslapseTime = 0;
    startPosition: Point = new Point();
    endPosition: Point = new Point();
    prevPosition: Point = new Point();
    private context: GameScreen;

    constructor(_context: GameScreen, _origin: Point) {
        super(Texture.from("bowl"));
        this.context = _context;
        this.height = 400;
        this.startPosition = new Point(_origin.x + 180, _origin.y - Manager.height / 2);
        this.endPosition = new Point(_origin.x, _origin.y - 50);
        this.position.set(Manager.width / 2, Manager.height / 5);
        this.anchor.set(.5);
        this.visible = false;
    }

    onOpenBowl() {
        gsap.to(this, {
            x: 0,
            y: -400,
            duration: 2,
            ease: "circ.inOut",
            onComplete: () => {
                this.context.processCoinAnimation();
                this.visible = false;
            }
        })
    }

    onStartBowl() {

    }
}