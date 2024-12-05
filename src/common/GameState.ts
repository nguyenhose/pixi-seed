export interface GameConfig {
    chipList: number[],

    closeTime: Date,
    endTime: Date,
    startTime: Date,

    dailyGold: [],
    giftTimeGold: number,
    giftTimeSecond: number

    gameBgImagePath: string,
    homeBgImagePath: string,

    isPublic: boolean,
    leaderBoardId: string,

    luckySpinDaily: number,
    luckySpintData: [],

    maxTurnBet: number,
    shop: [],
    rankRewards: [],
}

export interface AudioConfig {
    sfxOn: boolean,
    bgmOn: boolean
}

export interface PlayerData {
    displayName: string,
    gold: number,
    leaderboardId: string,
    luckySpinTurn: number,
    remainingGiftTime: number,
    userId: string,
    getDataTime: Date,
    isNew?: boolean
}
