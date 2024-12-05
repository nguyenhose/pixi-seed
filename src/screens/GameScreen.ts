import { BlurFilter, Container, Graphics, Point, Sprite , Text } from "pixi.js";
import { Manager, ScreenContainer } from "../Manager";
import { TopContainer } from "../components/AnimalDices/TopContainer";
import {
    BetPlaceConstant,
    BetValueDetail,
    GameState,
    StateIndex,
    BetValueData,
} from "../components/AnimalDices/BetDataSchema";
import { CenterContainer } from "../components/AnimalDices/CenterContainer";
import { BottomContainer } from "../components/AnimalDices/BottomContainer";
import gsap from "gsap";
import { BetCoins } from "../components/AnimalDices/BetCoin";
import { ImageP } from "../components/shared/ImageP";
import { randomRange } from "../components/utils/random";
import { NetworkService } from "../services/NetworkService";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { DropShadowFilter } from "pixi-filters";
import { HomeScreen } from "./HomeScreen";
import { iOSDetect, Shake } from "../components/utils/shake";
import { sfx } from "../services/Audio";
import { ShopScreen } from "./ShopScreen";
import { NoXuDialog } from "./popup/NoXuDialog";
import { BetPlace } from "../components/AnimalDices/BetPlace";
export class GameScreen extends Container implements ScreenContainer {
    // UI
    topContainer: TopContainer;
    centerContainer: CenterContainer;
    bottomContainer: BottomContainer;
    coinPoolUIContainer: Container;
    userValueUI: Text;
    instruction: Sprite;
    coinTarget: Point = new Point();
    selectedCoinMark: Point = new Point();
    loadingTextUI: Text;
    coinWinArray: BetCoins[] = [];
    coinLoseArray: BetCoins[] = [];

    // Data
    gameState: GameState = {
        state: StateIndex.ReadyToShake,
        selectedValue: -1,
        userValue: -1,
        result: [],
        betDetail: {
            nai: [],
            bau: [],
            ga: [],
            ca: [],
            cua: [],
            tom: [],
        },
        coinPool: {
            nai: [],
            bau: [],
            ga: [],
            ca: [],
            cua: [],
            tom: [],
        },
    };
    targetResult: number = 0;
    betTime = 8;
    rewardByDices: string[] = [];
    bettableValue: BetValueData[] = [];
    eslapseTime: number = 0;
    lastBetPlace: BetPlaceConstant = "ga";
    
    constructor() {
        super();
        this.getConfig();
        // create dices table
        this.centerContainer = new CenterContainer(this);
        this.addHeader();
        
        // create bet table
        this.bottomContainer = new BottomContainer(this);
        this.addChild(this.bottomContainer);

        this.topContainer = new TopContainer(this, this.bettableValue);
        this.addChild(this.topContainer);
        this.addChild(this.centerContainer);

        this.topContainer.visible = false;
        this.bottomContainer.visible = false;
        this.centerContainer.showBetTime(false);

        // first instruct
        this.instruction = Sprite.from("shaking_ins_0");
        this.instruction.anchor.set(0.5, 1);
        this.instruction.position.set(Manager.width / 2, Manager.height + 50);
        gsap.to(this.instruction.position, {x: Manager.width / 2, y:  Manager.height - 50, duration: .5, ease: "back.out"})
        const ratio = this.instruction.width / this.instruction.height;
        this.instruction.width = Manager.width * 0.7;
        this.instruction.height = this.instruction.width / ratio;
        this.instruction.on("pointerup", () => {
            this.onShake();
        });
        this.instruction.eventMode = "static";
        this.addChild(this.instruction);

        // trigger resize
        // this._layout.resize(Manager.width, Manager.height);
        this.resize();
     
        // this.addChild(this.instructionTextUI);
        this.userValueUI = new Text();
        this.addCurrentCoin();
        this.addSettingButton();
        
        this.coinPoolUIContainer = new Container();
        this.addChild(this.coinPoolUIContainer);

        setTimeout(() => {
            this.selectedCoinMark = this.topContainer.values[0].getGlobalPosition();

            this.topContainer.selectBetValue(this.topContainer.values[0]._id);
        }, 1);

        pixiEmitter.on(CLIENT_EVENTS.UPDATE_RESULT, this.onUpdateResult, this);

        this.loadingTextUI = new Text({style: {fontSize: 10}});
        this.addChild(this.loadingTextUI);
        this.loadingTextUI.text = `is context secure: ${window.isSecureContext}`;

        // detect android or ios to ask permission
        if (iOSDetect()) {
            setTimeout(() => {
                this.requestPermission();
            });
        } else {
            this.detectShake();
        }

        this.filters = []
    }

    requestPermission() {
        if (
            typeof DeviceMotionEvent !== "undefined" &&
            //@ts-ignore
            typeof DeviceMotionEvent.requestPermission === "function"
        ) {
            // (optional) Do something before API request prompt.

            //@ts-ignore
            DeviceMotionEvent.requestPermission()
                .then((response: any) => {
                    // (optional) Do something after API prompt dismissed.
                    if (response == "granted") {
                        this.detectShake();
                    }
                })
                .catch((e: any) => {
                    this.loadingTextUI.text = `Device unsupport shake motion`;
                });
        } else {
            this.loadingTextUI.text = `Device unsupport shake motion`;
        }
    }
    
    tryVibrate() {
        try {
            navigator.vibrate([200, 100, 200]);
        } catch (error) {
            console.log(error);
        }
    }

    detectShake() {
        var myShakeEvent = new Shake({
            threshold: 7, // optional shake strength threshold
            timeout: 1000, // optional, determines the frequency of event generation
        });
        myShakeEvent.start();
        this.onShake = this.onShake.bind(this);
        window.addEventListener(CLIENT_EVENTS.SHAKE_EVENTS, this.onShake);
        // window.addEventListener("devicemotion", (event) => {
        //     //@ts-ignore
        //     this.loadingTextUI.text = `${event.acceleration.x?.toFixed()} m/s2`;
        // });
    }

    onDestroy(): void {
        window.removeEventListener(CLIENT_EVENTS.SHAKE_EVENTS, this.onShake);
        pixiEmitter.removeListener(CLIENT_EVENTS.UPDATE_RESULT, this.onUpdateResult, this);
    }

    onUpdateResult({params}: any) {
        console.log("dice data", params);
        if (!params) return;
        this.gameState.result = params.result;
        this.centerContainer.showResult(this.gameState.result);
        this.topContainer.alpha = 0;
        this.topContainer.interactiveChildren = false;

        this.bottomContainer.showResult(params.result);
        this.bottomContainer.interactiveChildren = false;

        this.targetResult = params.gold;

        if (params.gold != null && params.gold != undefined && Manager.PlayerData.gold != params.gold) {
            Manager.PlayerData.gold = params.gold;
        }
        if (params.goldChange > 0) {
            sfx.play("good_result");
        } else {
            sfx.play("bad_result");
        }
    }

    getConfig() {
        const _config = Manager.GameConfig;
        const _player = Manager.PlayerData;
        this.gameState = {
            state: StateIndex.ReadyToShake,
            selectedValue: _config.chipList[0],
            userValue: _player.gold,
            result: [],
            betDetail: {
                nai: [],
                bau: [],
                ga: [],
                ca: [],
                cua: [],
                tom: [],
            },
            coinPool: {
                nai: [],
                bau: [],
                ga: [],
                ca: [],
                cua: [],
                tom: [],
            },
        };
        // create bettable values
        this.bettableValue = [];
        for (let i = 0; i < _config.chipList.length; i++) {
            this.bettableValue.push({
                label: `${_config.chipList[i]}`,
                value: _config.chipList[i],
                icon: "coin",
                // color: 'fabd27'
            });
        }
        this.betTime = _config.maxTurnBet;
    }
    update(deltaTime: number) {
        const deltaSecond = deltaTime / 100;
        // coin animation
        if (this.gameState.state === StateIndex.ShowResult) {
            if (this.eslapseTime > .1) {
                this.eslapseTime = 0;

                if (this.coinWinArray.length > 0) {
                    const coin = this.coinWinArray.pop();
                    if (coin) {
                        gsap.to(coin, {
                            x: this.coinTarget.x - 5,
                            y: this.coinTarget.y - 5,
                            duration: .8,
                            ease: "circ.out",
                            onComplete: () => {
                                coin.visible = false;
                            },
                        });
                        gsap.to(coin.scale, {
                            x: .8,
                            y: .8,
                            duration: .8,
                            ease: "back.out",
                        });
                    }
                }
                if (this.coinLoseArray.length > 0) {
                    const coin = this.coinLoseArray.pop();
                    if (coin) {
                        gsap.to(coin, {
                            alpha: 0,
                            duration: .2,
                            ease: "back.out",
                            onComplete: () => {
                                coin.visible = false;
                            },
                        });
                    }
                }
            }
            // check finish animation, reset pool
            if (this.coinWinArray.length === 0
                && this.coinLoseArray.length === 0) {
                this.gameState.coinPool.nai = [];
                this.gameState.coinPool.bau = [];
                this.gameState.coinPool.ga = [];
                this.gameState.coinPool.ca = [];
                this.gameState.coinPool.cua = [];
                this.gameState.coinPool.tom = [];
                this.gameState.userValue = this.targetResult;
                this.centerContainer.animateInstruct();
                this.bottomContainer.visible = false;
                this.gameState.state = StateIndex.ReadyToShake;
            }
            this.eslapseTime += deltaSecond;
            this.userValueUI.text = Math.round(this.gameState.userValue).toLocaleString();
        }

        this.centerContainer.betTimesUI.text = `Lượt đặt: ${this.betTime}`;
        NetworkService.checkMessageBox();
    }

    resize() {
        console.log("resize", Manager.width, Manager.height);
    }

    onSelectedDefaultBet(v: number, position: Point) {
        this.gameState.selectedValue = v;
        this.selectedCoinMark.set(position.x, position.y);
        this.topContainer.selectBetValue(v);
    }

    chooseProperOne(currentIndex: number): number {
        if (currentIndex >= 0) {
            if (this.bettableValue[currentIndex].value <= this.gameState.userValue) {
                return currentIndex;
            } else {
                return this.chooseProperOne(currentIndex - 1);
            }
        } else {
            return -1;
        }
    }

    betOnValue(type: BetPlaceConstant, clickPoint: Point) {
        // in betting stage
        if (
            this.betTime > 0 &&
            (this.gameState.state == StateIndex.Betting ||
                this.gameState.state == StateIndex.MakeFirstBet)
        ) {
            // check if user have enough money
            const index = this.bettableValue.findIndex(
                (i) => i.value == this.gameState.selectedValue
            );
            const betValueIndex = this.chooseProperOne(index);

            if (betValueIndex >= 0) {
                this.onSelectedDefaultBet(
                    this.bettableValue[betValueIndex].value,
                    this.topContainer.values[betValueIndex].getGlobalPosition()
                );
            } else {
                Manager.popModal(new NoXuDialog({
                    width: Manager.width * 0.85,
                    height: Manager.height / 2.5,
                    title: "Opps! Hết XU rồi",
                    description: "Bạn có thể kiếm thêm XU ngay",
                    inGame: true
                }))
                return;
            }
            console.log(`bet on ${type} with value: ${this.gameState.selectedValue}`);
            // save for undo
            this.lastBetPlace = type;
            // add coin to animation pool
            const coin = new BetCoins(this.gameState.selectedValue.toString());

            const bet = this.gameState.betDetail;
            const pool = this.gameState.coinPool;
            const keys = Object.keys(bet);

            keys.forEach((key) => {
                if (this.isKey(bet, key) && key === type) {
                    bet[key].push(this.gameState.selectedValue);
                    pool[key].push(coin);
                }
            });

            const position = this.selectedCoinMark;
            coin.position.set(position.x, position.y);
            this.coinPoolUIContainer.addChild(coin);
            let cointDist = Manager.width / 3 / 6;
            let yDist = 0;
            if (bet[type].length > 4) {
                yDist = 30;
                // cointDist *= -1;
            }
            gsap.to(coin.position, {
                x:
                    clickPoint.x -
                    cointDist * 3 +
                    cointDist *
                    (bet[type].length > 4
                        ? bet[type].length - 5
                        : bet[type].length - 1),
                y: clickPoint.y + (bet[type].length % 2 == 0 ? 10 : 0) - yDist,
                duration: 0.5,
                ease: "back.out",
            });
            //
            this.gameState.userValue -= this.gameState.selectedValue;
            this.userValueUI.text = this.gameState.userValue.toLocaleString();
            
            this.centerContainer.bowl.visible = true;
            if (this.gameState.state != StateIndex.MakeFirstBet) {
                this.gameState.state = StateIndex.MakeFirstBet;
                this.centerContainer.showOpenButton(true);
                this.topContainer.showResetButton(true);
            }
            this.betTime--;
        }
    }

    undoBet() {
        if (this.gameState.state != StateIndex.OpeningBet) {
            sfx.play("click");
            this.gameState.coinPool.nai = [];
            this.gameState.coinPool.bau = [];
            this.gameState.coinPool.ga = [];
            this.gameState.coinPool.ca = [];
            this.gameState.coinPool.cua = [];
            this.gameState.coinPool.tom = [];
    
            this.gameState.betDetail.nai = [];
            this.gameState.betDetail.bau = [];
            this.gameState.betDetail.ga = [];
            this.gameState.betDetail.ca = [];
            this.gameState.betDetail.cua = [];
            this.gameState.betDetail.tom = [];
    
            this.coinPoolUIContainer.removeChildren();
            this.gameState.userValue = Manager.PlayerData.gold;
            this.userValueUI.text = this.gameState.userValue.toLocaleString();
            
            this.betTime = Manager.GameConfig.maxTurnBet;
            this.centerContainer.openButton.visible = false;
            this.gameState.state = StateIndex.Betting;
        }
    }

    updateBetResult(_bowl: Container): void {
        if (this.canOpenBowl()) {
            // reset data before get new
            this.gameState.result = [];
            this.rewardByDices = [];
            this.gameState.state = StateIndex.OpeningBet;
            this.topContainer.showResetButton(false)

            const listBet: any = [];
            const bet = this.gameState.betDetail;
            const keys = Object.keys(bet);
            keys.forEach((key) => {
                if (this.isKey(bet, key) && bet[key].length) {
                    listBet.push({
                        id: key,
                        bet: bet[key],
                    });
                }
            });
            console.log("sending listBet: ", listBet);
            NetworkService.Senders?.Game?.sendRequestPlay(listBet);
        }
    }

    dice(): string {
        return `bet_${Math.floor(randomRange(1, 7))}`;
    }

    countInArray(array: string[], value: string) {
        return array.reduce((n: number, x) => n + (x === value ? 1 : 0), 0);
    }

    processCoinAnimation() {
        if (this.gameState.state == StateIndex.ShowResult) return;
        this.centerContainer.bowl.interactive = false;
        // compare with bet
        const bet = this.gameState.betDetail;
        const pool = this.gameState.coinPool;
        const keys = Object.keys(bet);

        let totalOffset = 0;
        keys.forEach((key) => {
            if (this.isKey(bet, key)) {
                if (bet[key].length > 0) {
                    // add gold
                    const timesReward = this.countInArray(this.gameState.result, key);
                    if (timesReward > 0) {
                        const reward = bet[key].reduce((m: number, p: number) => m + p, 0);
                        console.log(`${key} + ${reward} ${timesReward} times `);
                        totalOffset += reward * (timesReward + 1);
                        if (pool[key] && pool[key].length > 0) {
                            for (let i = pool[key].length - 1; i >= 0; i--) {
                                this.coinWinArray.push(pool[key][i]);
                            }
                        }
                    } else {
                        const reward = bet[key].reduce((m: number, p: number) => m + p, 0);
                        if (pool[key] && pool[key].length > 0) {
                            for (let i = pool[key].length - 1; i >= 0; i--) {
                                this.coinLoseArray.push(pool[key][i]);
                            }
                        }
                        console.log(`${key} - ${reward} `);
                    }
                }
            }
        });
        console.log(
            `Final: ${this.gameState.userValue} (${totalOffset >= 0 ? "+" : "-"
            } ${totalOffset})`
        );
        gsap.to(this.gameState, {
            userValue: this.targetResult,
            duration: 2
        })
        this.gameState.state = StateIndex.ShowResult;
        // this.targetResult = this.gameState.userValue + totalOffset;
        // this.targetResult = this.gameState.userValue;
        this.centerContainer.betDice_1?.showResult(
            this.getRewardByKey(bet, this.gameState.result[0])
        );
        this.centerContainer.betDice_2?.showResult(
            this.getRewardByKey(bet, this.gameState.result[1])
        );
        this.centerContainer.betDice_3?.showResult(
            this.getRewardByKey(bet, this.gameState.result[2])
        );

        // clear bet detail
        keys.forEach((key) => {
            if (this.isKey(bet, key)) {
                bet[key] = [];
            }
        });

        this.betTime = Manager.GameConfig.maxTurnBet;
    }

    getRewardByKey(bet: BetValueDetail, key: string): string {
        if (this.isKey(bet, key)) {
            if (bet[key].length > 0) {
                const reward = bet[key].reduce((m: number, p: number) => m + p, 0);
                return `+${reward}`;
            }
        }
        return "";
    }

    isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
        return k in x;
    }

    onShake() {
        if (this.gameState.state == StateIndex.ReadyToShake) {
            // reset coin pool
            this.coinPoolUIContainer.removeChildren();
            // dim components
            this.topContainer.visible = true;
            this.topContainer.alpha = .7;
            this.topContainer.interactiveChildren = false;

            this.bottomContainer.visible = true;
            this.bottomContainer.resetPosition();
            this.bottomContainer.resetChildAlpha(.7);
            this.bottomContainer.interactiveChildren = false;

            this.centerContainer.hideResultText();
            // hide instruction
            this.instruction.visible = false;
            this.centerContainer.showInstruct2(false);
            // vibrate
            this.tryVibrate();
            // shake bowl
            const tl = gsap.timeline();
            this.centerContainer.bowl.position.set(0, -300);
            this.centerContainer.bowl.visible = true;
            this.centerContainer.bowl.interactive = false;
            tl.to(this.centerContainer.bowl, {
                x: 0,
                y: -40,
                duration: 0.5,
                ease: "back.in",
                onComplete: () => {
                    sfx.play("dice_sound");
                }
            });
            tl.to(this.centerContainer.shakingContainer, {
                duration: 0.1,
                x: `+=${5}`,
                y: `+=${20}`,
                repeat: 10, // Number of shakes
                yoyo: true, // Returns to original position
                ease: "sine.inOut",
                onComplete: () => {

                    this.centerContainer.returnDefaultPosition()
                    // show coin selection bar
                    this.topContainer.alpha = 1;
                    this.topContainer.interactiveChildren = true;
                    // show bet places
                    this.bottomContainer.resetChildAlpha(1);
                    this.bottomContainer.interactiveChildren = true;
                    this.centerContainer.showBetTime(true);
                    sfx.stop("dice_sound");

                    this.showTutorial1();
                },
            });
            
            this.gameState.state = StateIndex.Betting;
        }
    }

    canOpenBowl() {
        if (this.gameState.state == StateIndex.MakeFirstBet) {
            return true;
        }
        return false;
    }

    addCurrentCoin() {
        const coinContainer = new Container();

        const bg = new Graphics().rect(0, 0, 110, 25).fill("#453003");
        bg.position.set(20, 3);

        const iconCoin = Sprite.from("currency");
        iconCoin.width = 30;
        iconCoin.height = 30;

        this.userValueUI = new Text({
            text: Manager.PlayerData.gold.toLocaleString(),
            style: {
                fontSize: 15,
                fill: "white",
                fontFamily: "Archia Medium",
                align: "right",
            },
        });
        this.userValueUI.anchor.set(1, 0);
        this.userValueUI.position.set(115, 5);

        const addGold = new PrimaryButton({
            width: 25,
            height: 25,
            // text: "Add",
            texture: "add_coin_btn",
            onClick: () => {
                // open shope request
                sfx.play("click");
                Manager.changeScreen(new ShopScreen());
            },
        });
        addGold.position.set(128, 15);

        coinContainer.addChild(bg);
        coinContainer.addChild(iconCoin);
        coinContainer.addChild(this.userValueUI);
        coinContainer.addChild(addGold);
        this.addChild(coinContainer);
        coinContainer.position.set(Manager.width - 200, 15);
        this.coinTarget = iconCoin.getGlobalPosition();

    }

    addSettingButton() {
        const setting = new PrimaryButton({
            width: 30,
            height: 30,
            texture: "setting_btn",
            onClick: () => {
                sfx.play("click");
                Manager.toggleSetting(true);
            }
        });
        setting.position.set(Manager.width - 30, 30);
        this.addChild(setting);
    }

    addHeader() {
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

    blur(): void {
        this.filters = [new BlurFilter()];
    }

    focus(): void {
        this.filters = []
    }

    showTutorial1() {
        if (Manager.PlayerData.isNew) {
            
        }
        const _point = this.topContainer.values[2].getGlobalPosition();
        Manager.showTutorial("Chọn XU", "Bạn có thể tùy chỉnh số lượng xu ở đây", "Tiếp tục", _point, () => {
            this.showTutorial2();
        });
    }

    showTutorial2() {
        const _point = this.bottomContainer.bet_bau.getGlobalPosition();
        Manager.showTutorial("Chọn linh vật", "Tới lúc kiểm tra nhân phẩm rồi! Hãy chọn linh vật bạn muốn nhé.", "OK", _point, ()=> {
            Manager.closeTutorial();
        });
    }
}
