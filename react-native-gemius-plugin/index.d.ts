/**
 * Duration used for live streams
 */
export declare const DURATION_LIVE_STREAM = -1;
export declare type GemiusParams = {
    [key: string]: string | number;
};
export default class Gemius {
    static setAppInfo(app: string, version: string, gemiusHitCollectorHost: string, gemiusPrismIdentifier: string): void;
    static setPlayerInfo(playerId: string, serverHost: string, accountId: string): void;
    static setProgramData(clipId: string, name: string, duration: number, isVideo: boolean): void;
    static sendPlay(clipId: string, offset: number): void;
    static sendPause(clipId: string, offset: number): void;
    static sendBuffer(clipId: string, offset: number): void;
    static sendStop(clipId: string, offset: number): void;
    static sendComplete(clipId: string, offset: number): void;
    static sendClose(clipId: string, offset: number): void;
    static sendSeek(clipId: string, offset: number): void;
    static sendPartialPageViewedEvent(gemiusPrismIdentifier: string, extraParameters?: GemiusParams): void;
    static sendPageViewedEvent(gemiusPrismIdentifier: string, extraParameters?: GemiusParams): void;
    static sendActionEvent(gemiusPrismIdentifier: string, extraParameters?: GemiusParams): void;
}
