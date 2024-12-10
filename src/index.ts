import { Manager } from "./Manager";
import { LoadingScreen } from "./screens/LoadingScreen";

(async () => {
    // init config and pixi app
    await Manager.initialize(0xffffff);
    // open loading screen for load assets
    Manager.changeScreen(new LoadingScreen({isReconnect: false}));
})();