import { BlurFilter, Container, FederatedEvent, FederatedPointerEvent, Sprite } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { RecapItem } from "../components/item/RecapItem";
import { spectral10 } from "../components/utils/theme";
import { gsap } from "gsap/gsap-core";
import { RecapOne } from "../components/item/RecapOne";
import { RecapTwo } from "../components/item/RecapTwo";
import { RecapThree } from "../components/item/RecapThree";
import { RecapFour } from "../components/item/RecapFour";


/** screen show up after loading */
export class HomeScreen extends Container implements ScreenContainer {
    private recapContainer: Container;
    private recapState: RecapState = RecapState.IDLE;
    private recapItemIndex = 0;
    private recapPosition = 0;
    
    // Dragging variables
    isDragging = false;
    dragStartX = 0;
    startCarouselX = 0;

    items: RecapItem[] = []

    constructor() {
        super();
        this.recapContainer = new Container();
        // add items
        for(let i = 0; i < 8; i++) {
            switch (i) {
                case 1:
                    this.items.push(new RecapTwo());
                    break;
                case 2:
                    this.items.push(new RecapThree());
                    break;
                case 3:
                    this.items.push(new RecapThree());
                    break;
                default:
                    // this.items.push(new RecapThree());
                    this.items.push(new RecapFour());
            }
            this.items[i].position.set(i * Manager.width, 0);
            this.recapContainer.addChild(this.items[i]);
        
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
            console.log(dragDelta);
            
            // Check if drag distance exceeds 1/3 of item width
            if (dragDelta > Manager.width / 3 && this.recapItemIndex > 0) {
            this.recapItemIndex--;
            } else if (dragDelta < -Manager.width / 3 && this.recapItemIndex < this.items.length) {
            this.recapItemIndex++;
            }
  
          // Animate to new position
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
        if (this.recapState == RecapState.IDLE && this.recapItemIndex < 7) {
            this.recapState = RecapState.MOVING;
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

