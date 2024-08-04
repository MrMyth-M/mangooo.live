export class GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  spriteImage: HTMLImageElement | null;

  constructor(x: number, y: number, width: number, height: number, spriteImage?: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.spriteImage = spriteImage || null
  }
}
