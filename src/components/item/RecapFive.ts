import { Container } from "pixi.js";
import { RecapItem } from "./RecapItem";
import { CustomImage } from "../shared/CustomImage";
import { Manager } from "../../Manager";
import { PrimaryButton } from "../shared/PrimaryButton";
import { Label } from "../shared/Label";
import { gsap } from "gsap/gsap-core";

export class RecapFive extends Container implements RecapItem {
    frame: CustomImage;
    plannet: CustomImage;
    arrow: any;
    starDust: CustomImage;
    sunBlend: CustomImage;
    animated: boolean = false;

    constructor() {
        super();
        const data = Manager.RecapData;
        const bg = new CustomImage("bg_5", Manager.width);
        bg.anchor.set(0, 1)
        bg.position.set(0, Manager.height)
        this.addChild(bg); 
        
        const share_btn = new PrimaryButton({
            texture: "share_now",
            width: Manager.width / 2.5,
            onClick: () => {
                // this.shareFacebook();
                this.sharing();
            }
        })
        share_btn.position.set(Manager.width * .5, Manager.height - 60);
        this.addChild(share_btn);

        const share_text = new CustomImage("share", Manager.width * .5);
        share_text.anchor.set(.5, 0);
        share_text.position.set(share_btn.position.x, share_btn.position.y - 80);
        this.addChild(share_text);
    
        const rankFrame = data.issuedPoint == 0 ? "frame_2" : "frame";
        this.frame = new CustomImage(rankFrame, Manager.width * 0.9);
        this.frame.anchor.set(.5);
        this.frame.position.set(Manager.width / 2, share_text.position.y - 60 - this.frame.height / 2);
        this.addChild(this.frame);

        const rank = data.issuedPoint == 0 ? "NEWBIE TAPTAP" : "BẠN THÂN TAPTAP";
        const bestfriend = new Label(rank, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        })
        bestfriend.anchor.set(0, 0);
        bestfriend.position.set(20, this.frame.position.y - this.frame.height * 0.9);
        this.addChild(bestfriend);
        const bestfriendTitle = new Label("Chúc mừng bạn chính thức ẳm danh hiệu", {
            fill: 'white',
            fontSize: 16
        })
        bestfriendTitle.anchor.set(0);
        bestfriendTitle.position.set(20, bestfriend.position.y - bestfriend.height / 2 - 5);
        this.addChild(bestfriendTitle);

        const vui = new Label(`${data.issuedPoint.toLocaleString()} VUI`, {
            fill: 'white',
            fontSize: 30,
            fontFamily: 'Archia Bold'
        });
        vui.anchor.set(0, 0);
        vui.position.set(20, bestfriendTitle.position.y - bestfriendTitle.height / 2 - 40);
        this.addChild(vui);

        const issuedTitle = new Label("Năm 2024, bạn đã tích được", {
            fill: 'white',
            fontSize: 16
        })
        issuedTitle.anchor.set(0);
        issuedTitle.position.set(20, vui.position.y - vui.height / 2 - 5);
        this.addChild(issuedTitle);

        const title = new CustomImage("text_journey", Manager.width * .8);
        title.anchor.set(0, 1);
        title.position.set(20, issuedTitle.position.y - issuedTitle.height / 2 - 20);
        this.addChild(title);

        this.plannet = new CustomImage("plannet", Manager.width / 14);
        this.plannet.anchor.set(1, 0);
        this.plannet.position.set(Manager.width - this.plannet.width / 2, this.frame.position.y + 20)
        this.addChild(this.plannet);
        this.plannet.alpha = 0;

        this.arrow = new CustomImage("arrow", Manager.width / 8);
        this.arrow.anchor.set(1, 0);
        this.arrow.position.set(Manager.width - this.arrow.width / 2 - 20, this.frame.position.y - this.frame.height / 2)
        this.addChild(this.arrow);
        this.arrow.alpha = 0;

        this.starDust = new CustomImage("star_dust", Manager.width / 8);
        this.starDust.anchor.set(1, 0);
        this.starDust.position.set(Manager.width * .35, this.frame.position.y - this.frame.height / 2 - 30)
        this.addChild(this.starDust);
        this.starDust.alpha = 0;

        this.sunBlend = new CustomImage("sun", Manager.width / 8);
        this.sunBlend.anchor.set(0, 0);
        this.sunBlend.position.set(0, this.frame.position.y + this.frame.height / 2)
        this.addChild(this.sunBlend);
        this.sunBlend.alpha = 0;
    }

    animate(): void {
        if (this.animated == false) {
            this.animated = true;
            const tl = gsap.timeline();
            tl.to(this.sunBlend, {alpha: 1, duration: 1, ease: "sine.in"});
            tl.to(this.starDust, {alpha: 1, duration: 1, ease: "sine.in"});
            tl.to(this.arrow, {alpha: 1, duration: 1, ease: "sine.in"});
            tl.to(this.plannet, {alpha: 1, duration: 1, ease: "sine.in"});
        }
    }

    async sharing() {
        try {
            const base64url =  await Manager.CaptureScreenShot(this);
            const blob = await (await fetch(base64url)).blob();

            if (blob && navigator && navigator.canShare()) {
                navigator.share({
                    url: encodeURIComponent("youtube.com"),
                    title: "MY TAPTAP's WRAPUP 2024",
                    files: [new File([blob], "tt_wrapup_2024.png", {type: "image/png"})]
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

  
      
    async startCapture() {
        const displayMediaOptions = {
            video: {
                displaySurface: "browser",
            },
            preferCurrentTab: false,
            selfBrowserSurface: "exclude",
            systemAudio: "include",
            surfaceSwitching: "include",
            monitorTypeSurfaces: "include",
        };
        let captureStream;
        
        try {
            captureStream =
            await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        } catch (err) {
            console.error(`Error: ${err}`);
        }
        return captureStream;
    }
}