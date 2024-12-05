import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { DropShadowFilter } from "pixi-filters";
import { sfx } from "../services/Audio";
import { HomeScreen } from "./HomeScreen";
import { ImageP } from "../components/shared/ImageP";
import { ScrollBox } from "@pixi/ui";

export class HowToPlayScreen extends Container implements ScreenContainer {
    constructor() {
        super();
        this.addHeader();
        const termContent = new Container();

        const content = new Graphics().roundRect(
            0, 0,
            Manager.width * .9,
            Manager.height, 30).fill("#FFF0DD");
        content.position.set(Manager.width * .05, 100)
        this.addChild(content);

        const title = new Text({text: "Thể lệ chơi Game Bầu Cua Tôm Cá", style: {
            fontSize: 15,
            fontFamily: "Archia Medium"
        }});
        title.position.set(content.position.x + 10, 10);
        const titleContent = new Text({
            text: 
`1.Quy tắc chơi: 
    - Mỗi lượt chơi, bạn có tối đa 8 lần đặt cược.
    - Số XU đặt cược tối thiểu là 10 XU và tối đa là 50 XU cho mỗi lần đặt.

2.Cách chơi:
    - Lắc xúc xắc: Bạn cần lắc điện thoại hoặc chọn vào đĩa để thực hiện thao tác lắc.
    - Đặt XU: Sau khi lắc xúc xắc xong, bạn sẽ:
        + Chọn số lượng XU muốn đặt cược cho từng linh vật (Bầu, Cua, Tôm, Cá, Gà, Nai).
        + Nhấn vào từng linh vật để đặt số XU mong muốn.
        + Trước khi mở đĩa, bạn có thể đặt lại XU bằng cách nhấn vào nút Hoàn.
        + Xem kết quả: Nhấn nút Mở để xem kết quả khi xúc xắc dừng lại.
        
3.Phần thưởng
    - Nếu các linh vật xuất hiện trên đĩa trùng khớp với các linh vật mà bạn đã đặt cược, bạn sẽ nhận được số XU thưởng tương ứng với số XU đã đặt cược cho các linh vật đó.

4.Nhận thêm XU
    - Bạn có thể thực hiện các nhiệm vụ được yêu cầu trong trò chơi để nhận thêm XU và tiếp tục chơi.

Chúc bạn chơi game vui vẻ và gặp nhiều may mắn!`,
            style: {
                wordWrapWidth: content.width * .9,
                wordWrap: true,
                fontSize: 15,
                fontFamily: "Archia Medium"
        }})
        titleContent.position.set(content.position.x + 10, 50);
        const height = title.height + titleContent.height;
        content.height = height + 50;
        termContent.addChild(title);
        termContent.addChild(titleContent);
        const scrollBox = new ScrollBox({
            width: Manager.width * .9,
            height: Manager.height - 120,
            bottomPadding: 10,
            // background: 'red',
            items: [termContent]
        })
        scrollBox.position.set(content.position.x, content.position.y);
        this.addChild(scrollBox);
    }

    addHeader() {
        const title = new Text({ text: "Thể lệ", style: {
            fontSize: 20,
            fontFamily: 'Archia Medium'
        }});
        title.anchor.set(.5);

        title.position.set(Manager.width / 2, 35);
        this.addChild(title);

        const backButton = Sprite.from("back_button");
        backButton.width = 30;
        backButton.height = 30;
        backButton.position.set(10, 18);
        backButton.eventMode = "static";
        backButton.on("pointerup", (e) => {
            sfx.play("click");
            Manager.changeScreen(new HomeScreen());
        });
        this.addChild(backButton);
    }

    update(deltaTime: number): void {
    }
    resize(): void {
    }
    focus?(): void {
    }
    blur?(): void {
    }
    pause?(): void {
    }
    
}