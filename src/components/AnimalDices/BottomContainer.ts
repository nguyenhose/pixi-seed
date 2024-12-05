import { Container } from "pixi.js";
import { GameScreen } from "../../screens/GameScreen";
import { BetPlace } from "./BetPlace";
import { Manager } from "../../Manager";
import gsap from "gsap";
import { RoughEase } from "gsap/all";

export class BottomContainer extends Container {
    bet_nai: BetPlace;
    bet_bau: BetPlace;
    bet_ga: BetPlace;
    bet_ca: BetPlace;
    bet_cua: BetPlace;
    bet_tom: BetPlace;

    constructor(_context: GameScreen) {
        super();
        gsap.registerPlugin(RoughEase);
        const dist = Manager.width / 3;
         // create disk of dices
        this.bet_nai = new BetPlace(`nai`, _context);
        this.bet_nai.position.set(dist / 2, Manager.height - this.bet_nai.height * 1.7)

        this.bet_bau = new BetPlace(`bau`, _context);
        this.bet_bau.position.set(dist * 1 + (dist / 2), Manager.height - this.bet_nai.height * 1.7)

        this.bet_ga = new BetPlace(`ga`, _context);
        this.bet_ga.position.set(dist * 2 + (dist / 2), Manager.height - this.bet_nai.height * 1.7)
        const offset = this.bet_nai.height - 10;

        this.bet_ca = new BetPlace(`ca`, _context);
        this.bet_ca.position.set(dist / 2, Manager.height - (this.bet_ca.height / 2 + 30))

        this.bet_cua = new BetPlace(`cua`, _context);
        this.bet_cua.position.set(dist * 1 + (dist / 2), Manager.height - (this.bet_ca.height / 2 + 30))
        
        this.bet_tom = new BetPlace(`tom`, _context);
        this.bet_tom.position.set(dist * 2 + (dist / 2), Manager.height - (this.bet_ca.height / 2 + 30))

        this.addChild(this.bet_nai);
        this.addChild(this.bet_bau);
        this.addChild(this.bet_ga);
        this.addChild(this.bet_ca);
        this.addChild(this.bet_cua);
        this.addChild(this.bet_tom);
    }

    showResult(results: []) {
        this.resetChildAlpha(.5);
        for(let i = 0; i < results.length; i++) {
            const cont = this[`bet_${results[i]}`]  as Container 
            cont.alpha = 1
            const _position = cont.position;
            gsap.to(cont, {
                x: "+=10",
                yoyo: true,
                repeat: 3,
                duration: .1,
                onComplete: () => { cont.position = _position}
            })
        }
    }

    resetChildAlpha(value: number) {
        this.bet_nai.alpha = value;
        this.bet_bau.alpha = value;
        this.bet_ga.alpha = value;
        this.bet_ca.alpha = value;
        this.bet_cua.alpha = value;
        this.bet_tom.alpha = value;
    }

    resetPosition() {
       const dist = Manager.width / 3;

       this.bet_nai.position.set(dist / 2, Manager.height - this.bet_nai.height * 1.7)

       this.bet_bau.position.set(dist * 1 + (dist / 2), Manager.height - this.bet_nai.height * 1.7)

       this.bet_ga.position.set(dist * 2 + (dist / 2), Manager.height - this.bet_nai.height * 1.7)

       this.bet_ca.position.set(dist / 2, Manager.height - (this.bet_ca.height / 2 + 30))

       this.bet_cua.position.set(dist * 1 + (dist / 2), Manager.height - (this.bet_ca.height / 2 + 30))
       
       this.bet_tom.position.set(dist * 2 + (dist / 2), Manager.height - (this.bet_ca.height / 2 + 30))

       this.alpha = 1;
       this.resetChildAlpha(.5);
    }
}