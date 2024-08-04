export class InteractableObject {
  functionTrigger?: Function | null;
  x: number;
  y: number;
  width: number;
  height: number;
  canInteract: boolean;
  spriteImages?: HTMLImageElement[] | null;
  changeSpriteAfterFrames?: number | null;

  private lastSpriteIndex = 0;
  private frameCount = 0;

  constructor(x: number, y: number, width: number, height: number, canInteract?: boolean, functionTrigger?: Function, spriteImages?: HTMLImageElement[], changeSpriteAfterFrames?: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.canInteract = canInteract || true;
    this.functionTrigger = functionTrigger || null;
    this.spriteImages = spriteImages || null;
    this.changeSpriteAfterFrames = changeSpriteAfterFrames || null;
  }

  public resetAnimation(): void {
    this.lastSpriteIndex = 0;
    this.frameCount = 0;
  }

  public getSpriteImage(): HTMLImageElement {
    const image = this.spriteImages![this.lastSpriteIndex];
    this.frameCount++;
    if (this.changeSpriteAfterFrames !== null && this.frameCount >= this.changeSpriteAfterFrames!) {
      this.lastSpriteIndex = (this.lastSpriteIndex + 1) % this.spriteImages!.length;
      this.frameCount = 0;
    }
    return image;
  }

  public hasSpriteImages(): boolean {
    return this.spriteImages !== null;
  }
}
