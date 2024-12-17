import { BlurFilter, Container, FederatedEvent, FederatedPointerEvent, Sprite } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { RecapItem } from "../components/item/RecapItem";
import { gsap } from "gsap/gsap-core";
import { RecapZero } from "../components/item/RecapZero";
import { RecapOne } from "../components/item/RecapOne";
import { RecapThree } from "../components/item/RecapThree";
import { RecapFour } from "../components/item/RecapFour";
import { RecapFive } from "../components/item/RecapFive";
import { RecapTwo } from "../components/item/RecapTwo";
import { RecapNoData } from "../components/item/RecapNoData";


/** screen show up after loading */
export class HomeScreen extends Container implements ScreenContainer {
    private recapContainer: Container;
    private recapState: RecapState = RecapState.IDLE;
    public recapItemIndex = 0;
    private recapPosition = 0;

    // Dragging variables
    isDragging = false;
    dragStartX = 0;
    startCarouselX = 0;

    items: RecapItem[] = []

    constructor() {
        super();
        this.recapContainer = new Container();
        const data = Manager.RecapData;
        if (!data)  {
            console.log("no recap data");
            return;
        }
        // for no data user : no vui, no issue point, no voucher
        if (!(data.topThree && data.topThree.length > 0) && !data.issuedPoint && !data.voucher) {
            this.items.push(new RecapZero(this));
            this.items[0].position.set(0 * Manager.width, 0);
            this.recapContainer.addChild(this.items[0]);

            this.items.push(new RecapOne());
            this.items[1].position.set(1 * Manager.width, 0);
            this.recapContainer.addChild(this.items[1]);

            this.items.push(new RecapNoData());
            this.items[2].position.set(2 * Manager.width, 0);
            this.recapContainer.addChild(this.items[2]);
        } else {
            this.items.push(new RecapZero(this));

            this.items[0].position.set(0 * Manager.width, 0);
            this.recapContainer.addChild(this.items[0]);

            this.items.push(new RecapOne());
            this.items[1].position.set(1 * Manager.width, 0);
            this.recapContainer.addChild(this.items[1]);
            let count = 1

            if (data.issuedPoint) {
                count ++;
                this.items.push(new RecapTwo());
                this.items[2].position.set(2 * Manager.width, 0);
                this.recapContainer.addChild(this.items[2]);
            }

            if (data.voucher) {
                count ++;
                this.items.push(new RecapThree());
                this.items[count].position.set(count * Manager.width, 0);
                this.recapContainer.addChild(this.items[count]);
            }

            if (data.topThree && data.topThree.length > 0) {
                count++;
                this.items.push(new RecapFour());
                this.items[count].position.set(count * Manager.width, 0);
                this.recapContainer.addChild(this.items[count]);
            }
            count++;
            this.items.push(new RecapFive());
            this.items[count].position.set(count * Manager.width, 0);
            this.recapContainer.addChild(this.items[count]);
        }

        // navigation
        const nextButton = new PrimaryButton({
            text: "Next",
            onClick: () => {
                this.recapItemIndex ++;
                this.nextSlide();
            }
        })
        nextButton.position.set(Manager.width / 2, Manager.height - 200);
        this.addChild(this.recapContainer);
        // this.addChild(nextButton);



        // Drag events
        this.recapContainer.interactive = true;
        this.recapContainer.on("pointerdown", (e) => {this.onDragStart(e)});
        this.recapContainer.on("pointermove", (e) => {this.onDragMove(e)});
        this.recapContainer.on("pointerup", (e) => {this.onDragEnd(e)});
        this.recapContainer.on("pointerupoutside", (e) => {this.onDragEnd(e)});
    }

    onDragStart(event: FederatedPointerEvent) {
        this.isDragging = true;
        this.dragStartX = event.globalX;
        this.startCarouselX = this.recapContainer.x;
    }

    onDragMove(event: FederatedPointerEvent) {
        if (this.isDragging) {
            const dragDelta = event.globalX - this.dragStartX;
            this.recapContainer.x = this.startCarouselX + dragDelta;
        }
    }


    onDragEnd(event: FederatedPointerEvent) {
        if (this.isDragging) {
            this.isDragging = false;
            const dragDelta = event.globalX - this.dragStartX;
            console.log("drag end", dragDelta);
     
            // Check if drag distance exceeds 1/3 of item width
            if (dragDelta > Manager.width / 3 && this.recapItemIndex > 0) {
                this.recapItemIndex--;
            } else if (dragDelta < -Manager.width / 3) {
                if (this.recapItemIndex + 1 < this.items.length) {
                    this.recapItemIndex++;
                }
            }
            this.nextSlide(); 

        }
    }


    update(deltaTime: number): void {

    }

    resize(): void {
    }

    blur() {
        this.filters = [new BlurFilter()]
    }

    focus() {
        this.filters = []
    }

    nextSlide() {
        if (this.recapState == RecapState.IDLE && this.recapItemIndex < this.items.length) {
            this.recapState = RecapState.MOVING;
            console.log("slide to " + this.recapItemIndex);

            this.recapPosition = this.recapItemIndex * Manager.width * -1;
            gsap.to(this.recapContainer.position, { x: this.recapPosition, ease: "sine", onComplete: () => {
                this.recapState = RecapState.IDLE;
                if (this.items[this.recapItemIndex]) {
                    this.items[this.recapItemIndex].animate();
                }
            }});
        }
    }
}

export enum RecapState {
    IDLE,
    MOVING,

}

