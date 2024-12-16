import { Container } from "pixi.js";
import { RecapItem } from "./RecapItem";
import { CustomImage } from "../shared/CustomImage";
import { Manager } from "../../Manager";
import { Label } from "../shared/Label";
import { gsap } from "gsap/gsap-core";

export class RecapThree extends Container implements RecapItem {

    voucher_nd: CustomImage;
    voucher_sf: CustomImage;
    voucher_ws: CustomImage;
    voucher_pz: CustomImage;

    constructor() {
        super();
        const data = Manager.RecapData;
        const bg = new CustomImage("bg_3", Manager.width);
        bg.anchor.set(0, 1)
        bg.position.set(0, Manager.height)
        this.addChild(bg);

        // add text

        const text3 = new CustomImage("text_3", Manager.width * .75);
        text3.anchor.set(0);
        text3.position.set(20, Manager.height * 0.1)
        this.addChild(text3);

        const voucherNo = new Label(`${data.voucher} VOUCHER`, {
            fontSize: 30,
            fill: 'white',
            fontWeight: 'bold'
        })
        voucherNo.anchor.set(0, 0);
        voucherNo.position.set(20, text3.position.y + 30 + text3.height);
        this.addChild(voucherNo);

        this.voucher_nd = new CustomImage("v1", Manager.width / 2);
        this.voucher_nd.anchor.set(.5, 1);
        this.voucher_nd.position.set(Manager.width/2, 0);

        this.voucher_sf = new CustomImage("v2", Manager.width / 3.25);
        this.voucher_sf.anchor.set(.5, 1);
        this.voucher_sf.position.set(Manager.width / 2 + this.voucher_sf.width / 2 - 20, 0);

        this.voucher_ws = new CustomImage("v3", Manager.width / 3.25);
        this.voucher_ws.position.set(Manager.width / 2 - this.voucher_ws.width / 2 + 10, 0);
        this.voucher_ws.anchor.set(.5, 1);

        this.voucher_pz = new CustomImage("v4", Manager.width / 3.4);
        this.voucher_pz.position.set(Manager.width / 2 - this.voucher_pz.width / 4, 0)
        this.voucher_pz.anchor.set(.5, 1);

        this.addChild(this.voucher_pz)
        this.addChild(this.voucher_sf)
        this.addChild(this.voucher_nd)
        this.addChild(this.voucher_ws)

    }
    
    animate(): void {
        const tl = gsap.timeline();
        tl.to(this.voucher_nd, {y: Manager.height - 40, duration: 1, ease: "elastic.inOut"});
        tl.to(this.voucher_sf, {y: Manager.height - this.voucher_nd.height - 10, duration: 1, ease: "elastic.inOut"});
        tl.to(this.voucher_ws, {y: Manager.height - this.voucher_nd.height + 10, duration: 1, ease: "elastic.inOut"});
        tl.to(this.voucher_pz, {y: Manager.height - this.voucher_nd.height - 60, duration: 1, ease: "bounce.out"})
    }

}