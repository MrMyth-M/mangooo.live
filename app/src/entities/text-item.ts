import {Item} from "./items";

export class TextItem {
  text: string;
  itemDisplay: Item | null;

  constructor(text: string, itemDisplay: Item | null) {
    this.text = text;
    this.itemDisplay = itemDisplay;
  }
}
