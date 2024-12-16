import { Assets } from "pixi.js";

export const manifest = {
    bundles: [
        {
            name: "common",
            assets: [
                {
                    alias: 'background_image',
                    src: './common/BG.png'
                },
                {
                    alias: 'coin_icon',
                    src: './common/coinIcon.png'
                },
                {
                    alias: 'setting_icon',
                    src: './common/settingsBtn.png'
                },
                {
                    alias: 'game_title',
                    src: './common/game_title.png'
                },
                {
                    alias: 'yellow_button',
                    src: './common/yellowRectNormal.png'
                },
                {
                    alias: 'back_button',
                    src: './common/backBtn.png'
                },
                {
                    alias: 'trophy_icon',
                    src: './common/trophyIcon.png'
                },
                {
                    alias: 'currency',
                    src: './common/coinIcon.png'
                },
                {
                    alias: 'round_avt',
                    src: './common/circle.png'
                },
                {
                    alias: 'toggleOff',
                    src: './common/toggleOff.png'
                },
                {
                    alias: 'toggleOn',
                    src: './common/toggleOn.png'
                },
                {
                    alias: "close_modal",
                    src: "./common/close_modal.png"
                },
                // font loading
                { alias: 'Archia Medium', src: './fonts/Archia-Medium.otf' },
                // sound
                {
                    alias: "click",
                    src: "./sound/SFX_UI_Button_Click_Select_1.wav"
                }
            ]
        },
        {
            name: "recap_1",
            assets: [
                {
                    alias: "BG",
                    src: "./recap/screen_1/BG.png"
                },
                {
                    alias: "LEMUCK",
                    src: "./recap/screen_1/LEMUCK.png"
                },
                {
                    alias: "FIREWORK_RIGHT",
                    src: "./recap/screen_1/FIREWORK_RIGHT.png"
                },
                {
                    alias: "FIREWORK_LEFT",
                    src: "./recap/screen_1/FIREWORK_LEFT.png"
                },
                {
                    alias: "GIFT",
                    src: "./recap/screen_1/GIFT.png"
                },
                {
                    alias: "2024",
                    src: "./recap/screen_1/2024.png"
                },
                {
                    alias: "explore_btn",
                    src: "./recap/screen_1/EXPLORE_BTN.png"
                }, 
             

            ]
        },
        {
            name: "recap_2",
            assets: [
                {
                    alias: "light",
                    src: "./recap/screen_2/LIGHT.png"
                },
                {
                    alias: "BG_2",
                    src: "./recap/screen_2/BG_2.png"
                },
                {
                    alias: "lemuck_2",
                    src: "./recap/screen_2/LEMUCK_2.png"
                },
                {
                    alias: "pink_plannet",
                    src: "./recap/screen_2/PINK.png"
                },
                {
                    alias: "spaceship",
                    src: "./recap/screen_2/SPACE.png"
                },
                {
                    alias: "star",
                    src: "./recap/screen_2/STAR.png"
                },
                {
                    alias: "gate",
                    src: "./recap/screen_2/GATE.png"
                },
                {
                    alias: "founded",
                    src: "./recap/screen_2/FOUNDED.png"
                },
            ]
        }
    ]
}