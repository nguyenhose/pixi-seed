import { ColorSource } from "pixi.js";
import { BetCoins } from "./BetCoin";

export interface BetValueData {
    value: number,
    label: string,
    currency?: string,
    icon?: string,
    color?: ColorSource
}

export interface BetValueDetail {
    nai: number[],
    bau: number[],
    ga: number[],
    ca: number[],
    cua: number[],
    tom: number[]
}

export interface CoinPool {
    nai: BetCoins[],
    bau: BetCoins[],
    ga: BetCoins[],
    ca: BetCoins[],
    cua: BetCoins[],
    tom: BetCoins[] 
}

export enum StateIndex {
    ReadyToShake,
    MakeFirstBet,
    Betting,
    OpeningBet,
    ShowResult, 
    Closed
}

export interface GameState {
    state: StateIndex,
    userValue: number,
    selectedValue: number,
    betDetail: BetValueDetail,
    result: string[],
    coinPool: CoinPool
}

export type BetPlaceConstant = 'nai' | 'bau' | 'ga' | 'ca' | 'cua' | 'tom';
