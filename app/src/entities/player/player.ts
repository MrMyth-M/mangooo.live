import {GameObject} from "../game-object";

export class Player extends GameObject {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
}
