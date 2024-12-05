import { Manager } from "./Manager";
import { LoadingScreen } from "./screens/LoadingScreen";

(async () => {
    // init config and pixi app
    await Manager.initialize(0x1099bb);
    // open loading screen for load assets
    Manager.changeScreen(new LoadingScreen({isReconnect: false}));
})();