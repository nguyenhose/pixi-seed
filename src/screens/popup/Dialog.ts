import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager, ScreenContainer } from "../../Manager";
import {
  ColorGradientFilter,
  OutlineFilter,
} from "pixi-filters";
import { gsap } from "gsap/gsap-core";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { sfx } from "../../services/Audio";

const dialogDefaultOptions = {
  width: 300,
  height: 100,
  title: "Fair Trade",
  description: "Dont let them run",
  buttonText: "Đổi Xu",
  onClick: () => {},
  noCloseButton: false,
};
type DialogOptions = typeof dialogDefaultOptions;
export class Dialog extends Container implements ScreenContainer {
  constructor(options: Partial<DialogOptions> = {}) {
    super();
    const opts = { ...dialogDefaultOptions, ...options };
    let { title, width, height, description } = opts;
    if (height < 250) height = 250;
    const bg = new Graphics().roundRect(0, 0, width, height, 30).fill("orange");
    bg.filters = [
      new ColorGradientFilter({
        type: 0,
        angle: 0,
        stops: [
          {
            color: "#E6C539",
            alpha: 1,
            offset: 1,
          },
          {
            color: "#FFB725",
            alpha: 1,
            offset: 0.8,
          },
          {
            color: "#F02C2C",
            alpha: 1,
            offset: 0,
          },
        ],
      }),
      new OutlineFilter({
        color: "white",
        thickness: 4,
      }),
    ];
    bg.position.set((Manager.width - width) / 2, 0);
    this.addChild(bg);

    const _title = new Text({
      text: title,
      style: {
        fontFamily: "Archia Medium",
        fontSize: 22,
        fill: "white",
      },
    });
    _title.anchor.set(0.5);
    _title.position.set(Manager.width / 2, bg.position.y + 30);
    // _title.filters = [new DropShadowFilter()];
    this.addChild(_title);

    const content = new Graphics()
      .roundRect(0, 0, width * 0.9, height - 80)
      .fill("#FFF0DD");
    content.position.set(
      bg.position.x + 20,
      bg.position.y + bg.height - (height - 60)
    );
    this.addChild(content);

    const _description = new Text({
      text: description,
      style: {
        fontSize: 17,
        wordWrapWidth: content.width * 0.95,
        wordWrap: true,
        fontFamily: "Archia Medium",
      },
    });
    // _description.anchor.set(.5);
    _description.position.set(content.position.x + 18, content.position.y + 20);
    this.addChild(_description);
    this.position.set(0, -bg.height);

    // todo: custom content ?

    const _button = new PrimaryButton({
      width: 180,
      height: 80,
      texture: "primary_button",
      text: opts.buttonText,
      fontSize: 20,
      fill: 0xffffff,
      onClick: () => {
        sfx.play("click");
        opts.onClick();
      },
    });
    _button.position.set(
      Manager.width / 2,
      content.position.y + content.height - 50
    );
    this.addChild(_button);

    if (opts.noCloseButton == false) {
      const _closeButton = Sprite.from("close_modal");
      _closeButton.anchor.set(0.5);
      _closeButton.width = 60;
      _closeButton.height = 60;
      _closeButton.position.set(
        bg.position.x + bg.width / 2,
        bg.position.y + bg.height + 60
      );
      _closeButton.on("pointerup", (e) => {
        sfx.play("click");
        Manager.closeCurrentPopup();
      });
      _closeButton.eventMode = "static";
      this.addChild(_closeButton);
    }
    gsap.to(this.position, { x: 0, y: Manager.height / 4, ease: "bounce" });
  }

  update(deltaTime: number): void {}

  resize(): void {}

  focus?(): void {}

  blur?(): void {}

  pause?(): void {}
}
