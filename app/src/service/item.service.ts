import {Injectable} from "@angular/core";
import {Item} from "../entities/items";

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  private currentDisplayItem: string = ''
  private playerItems: Item[] = [];

  private playerBerryCount: number = 0;

  public setDisplayItem(item: Item) {
    this.currentDisplayItem = item;
  }

  public isDisplayItemSet(): boolean {
    return this.currentDisplayItem !== '';
  }

  public playerCollectItem(item: Item) {
    this.playerItems.push(item);
  }

  public playerHasItem(item: Item): boolean {
    return this.playerItems.includes(item);
  }

  public increasePlayerBerryCount() {
    this.playerBerryCount++;
  }

  public getPlayerBerryCount(): number {
    return this.playerBerryCount;
  }

  public getCurrentDisplayItem(): string {
    return this.currentDisplayItem;
  }

  public clearDisplayItem() {
    this.currentDisplayItem = '';
  }

  public getHeartShardItemPaths(): string[] {
    return [
      'assets/items/shard_one.png',
      'assets/items/shard_two.png',
      'assets/items/shard_three.png',
      'assets/items/shard_four.png',
      'assets/items/shard_five.png',
    ];
  }
}
