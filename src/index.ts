import {  taptap3 } from "./components/utils/theme";
import { Manager } from "./Manager";
import { LoadingScreen } from "./screens/LoadingScreen";

(async () => {
    // init config and pixi app
    await Manager.initialize(taptap3[0]);
    // open loading screen for load assets
    Manager.changeScreen(new LoadingScreen({isReconnect: false}));
})();