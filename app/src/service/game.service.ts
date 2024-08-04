import {Injectable} from '@angular/core';
import {MapImages} from "../entities/map-images";

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private mapImages = this.getMapImages();
  private currentMap = this.mapImages.mapStart;
  private fluteLocked = false;

  private isGameEnd = false;


  constructor() {

  }

  public isGameEnded(): boolean {
    return this.isGameEnd;
  }

  public setGameEnd() {
    this.isGameEnd = true;
  }

  public swapToStoneMap() {
    this.currentMap = this.mapImages.mapStone;
  }

  public swapToBridgeMap() {
    this.currentMap = this.mapImages.mapBridge;
  }

  public swapToLogMap() {
    this.currentMap = this.mapImages.mapLog;
  }

  getCurrentMapImage(): HTMLImageElement {
    return this.currentMap;
  }

  public isFluteLock(): boolean {
    return this.fluteLocked;
  }

  public setFluteLock(milliseconds: number) {
    this.fluteLocked = true;
    setTimeout(() => {
      this.fluteLocked = false;
    }, milliseconds);
  }

  public setPermanentLock() {
    this.fluteLocked = true;
  }

  private getMapImages(): MapImages {
    const mapImages: MapImages = {
      mapStart: new Image(),
      mapLog: new Image(),
      mapBridge: new Image(),
      mapStone: new Image(),
    }
    mapImages.mapStart.src = 'assets/map.png';
    mapImages.mapLog.src = 'assets/map_log.png';
    mapImages.mapBridge.src = 'assets/map_bridge.png';
    mapImages.mapStone.src = 'assets/map_rock.png';
    return mapImages;
  }
}
