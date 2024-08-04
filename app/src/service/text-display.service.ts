import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ItemService} from "./item.service";
import {TextItem} from "../entities/text-item";

@Injectable({
  providedIn: 'root'
})
export class TextDisplayService {
  private queuedText = new BehaviorSubject<TextItem[]>([]);
  public queuedText$ = this.queuedText.asObservable();

  private textDisplay: string = '';

  constructor(private itemDisplayService: ItemService) {
  }

  public setTextDisplay(text: string) {
    this.textDisplay = text;
  }

  public getTextDisplay(): string {
    return this.textDisplay;
  }

  public isTextDisplaySet(): boolean {
    return this.textDisplay !== '';
  }

  public addPlainText(text: string) {
    this.addTextItem(new TextItem(text, null));
  }

  public addTextItem(textItem: TextItem) {
    this.queuedText.next([...this.queuedText.value, textItem])
  }

  public getQueuedText(): TextItem[] {
    return this.queuedText.value;
  }

  public shiftQueue() {
    if (this.itemDisplayService.isDisplayItemSet()) {
      this.itemDisplayService.clearDisplayItem();
    }

    const queue = this.queuedText.value;
    queue.shift();
    const queuedItem = queue[0];
    if (queuedItem && queuedItem.itemDisplay) {
      this.itemDisplayService.setDisplayItem(queuedItem.itemDisplay);
    }
    this.queuedText.next(queue);
  }

  public isTextQueued() {
    return this.queuedText.value.length > 0;
  }

  public isLastText() {
    return this.queuedText.value.length === 1;
  }
}
