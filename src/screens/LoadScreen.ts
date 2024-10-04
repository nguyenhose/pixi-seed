import { Container, Text } from 'pixi.js';
import gsap from 'gsap';
import { app } from '../main';
import { i18n } from '../utils/i18n';
import { SmokeCloud } from '../ui/SmokeCloud';

/** Screen shown while loading assets */
export class LoadScreen extends Container {
    /** Assets bundles required by this screen */
    public static assetBundles = ['preload'];
    /** The cloud animation at the top */
    private cloud: SmokeCloud;
    /** LThe loading message display */
    private message: Text;

    constructor() {
        super();

        this.message = new Text({
            text: i18n.loadingMessage,
            style: {
                fill: 0x5c5c5c,
                fontFamily: 'Verdana',
                align: 'center',
            },
        });
        this.message.anchor.set(0.5);
        this.addChild(this.message);

        this.cloud = new SmokeCloud();
        this.cloud.height = 100;
        this.addChild(this.cloud);
    }

    /** Resize the screen, fired whenever window size changes  */
    public resize(width: number, height: number) {
    
        this.message.x = width * 0.5;
        this.message.y = height * 0.75;
        
        this.cloud.y = 0;
        this.cloud.width = width;
    }

    /** Show screen with animations */
    public async show() {
        gsap.killTweensOf(this.message);
        this.message.alpha = 1;
    }

    /** Hide screen with animations */
    public async hide() {
        // Change then hide the loading message
        this.message.text = i18n.loadingDone;
        gsap.killTweensOf(this.message);
        gsap.to(this.message, {
            alpha: 0,
            duration: 0.3,
            ease: 'linear',
            delay: 0.5,
        });

        // Make the cloud cover the entire screen in a flat colour
        gsap.killTweensOf(this.cloud);
        await gsap.to(this.cloud, {
            height: app.renderer.height,
            duration: 1,
            ease: 'quad.in',
            delay: 0.5,
        });
    }
}
