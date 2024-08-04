import {Injectable} from "@angular/core";
import {GameObject} from "../entities/game-object";

@Injectable({
  providedIn: 'root'
})
export class TempColliderService {
  private tempColliderMap = new Map<string, GameObject>();


  constructor() {
    this.tempColliderMap.set('bridge', new GameObject(830, 970, 10, 120));
    this.tempColliderMap.set('log', new GameObject(730, 585, 90, 10));
    this.tempColliderMap.set('rock', new GameObject(810, 60, 30, 30));
  }

  public removeTempCollider(key: string) {
    this.tempColliderMap.delete(key);
  }

  public getTemporaryColliders(): GameObject[] {
    const tempColliderArray: GameObject[] = [];
    this.tempColliderMap.forEach((value) => {
      tempColliderArray.push(value);
    });
    return tempColliderArray;
  }
}
