import {  Container } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { Label } from "../components/shared/Label";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { HomeScreen } from "./HomeScreen";

export class GameScreen extends Container implements ScreenContainer {
    constructor() {
        super();
        // add header bar: name, coin, settings
        this.renderHeader();
    }

    update(deltaTime: number): void {
    }

    resize(): void {
    }

    renderHeader() {
        // add back button
        const backBtn = new PrimaryButton({
            texture: "back_button",
            width: 20,
            onClick: () => {Manager.changeScreen(new HomeScreen());}
        })
        backBtn.tint = 0x000000;
        backBtn.position.set(30, 30);
        this.addChild(backBtn);
    }
}
