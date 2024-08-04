import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GameObject} from "../entities/game-object";
import {fixedObjects, player} from "../entities/object-definitions/fixed-objects";
import {PlayerImages} from "../entities/player-images";
import {TextDisplayService} from "../service/text-display.service";
import {GameService} from "../service/game.service";
import {InteractableObjectService} from "../service/interactable-object.service";
import {TempColliderService} from "../service/temp-collider.service";
import {InteractableObject} from "../entities/interactable-object";
import {ItemService} from "../service/item.service";
import {TextItem} from "../entities/text-item";
import {SoundService} from "../service/sound.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private animationFrames = 1;
  private framesPassed = 0
  private debug = false;

  protected password: string = '';
  protected unlocked: boolean = false;


  private SPEED = 2;
  private SPRINT_SPEED = this.debug ? 10 : 2
  private NORMAL_SPEED = 1;


  @ViewChild('canvas', {static: true})
  // @ts-ignore
  private canvas: ElementRef<HTMLCanvasElement>;
  private gameObjects: GameObject[] = [];
  private ctx: CanvasRenderingContext2D | null = null;

  private isWriting = false;

  private playerImages: PlayerImages = {
    down: [],
    up: [],
    left: [],
    right: [],
  };

  private camera = {x: 0, y: 0};

  private keys: { [key: string]: boolean } = {};

  constructor(protected textDisplayService: TextDisplayService,
              protected gameService: GameService,
              private soundService: SoundService,
              private interactableObjectService: InteractableObjectService,
              private tempColliderService: TempColliderService,
              protected itemDisplayService: ItemService) {
  }

  tooltips = [
    'Interactable Items are: Characters, Bushes, Tall Grass, some logs and rocks',
    'You need to solve 4 challenges to win the game',
    'The first character with a challenge is: Bush Turtle',
    'The second character with a challenge is: Beaver',
    'The third character with a challenge is: Beaver Wife',
    'The fourth character with a challenge is: Raccoon'];
  tooltipRevealed = new Array(this.tooltips.length).fill(false);

  toggleTooltip(index: number) {
    this.tooltipRevealed[index] = !this.tooltipRevealed[index];
  }

  protected unlock() {
    if (this.password === 'bianca') {
      this.unlocked = true;
    }
  }

  ngOnInit() {
    this.unlocked = false;
  }

  protected initiateGameLogic() {
    if (this.password !== 'bianca') {
      return;
    }

    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (!this.ctx) {
      return;
    }

    this.textDisplayService.queuedText$.subscribe((text: TextItem[]) => {
      this.onTextDisplayChange(text);
    });

    window.addEventListener('keydown', (event) => {
      this.keys[event.key.toUpperCase()] = true;
      if (event.key === 'e' && !this.gameService.isFluteLock()) {
        this.interact();
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.key.toUpperCase()] = false;
    });


    // Load additional sprites
    for (let i = 0; i < 4; i++) {
      this.playerImages.down[i] = new Image();
      this.playerImages.down[i].src = `assets/player/down/${i + 1}.png`;

      this.playerImages.up[i] = new Image();
      this.playerImages.up[i].src = `assets/player/up/${i + 1}.png`;

      this.playerImages.left[i] = new Image();
      this.playerImages.left[i].src = `assets/player/left/${i + 1}.png`;

      this.playerImages.right[i] = new Image();
      this.playerImages.right[i].src = `assets/player/right/${i + 1}.png`;
    }

    player.spriteImage = this.playerImages.down[0];
    // add movement listener by initializing it in a separate method here

    const textinput = document.getElementById('text-input') as HTMLInputElement;
    const button = document.getElementById('play-button') as HTMLButtonElement;
    button.classList.toggle('hidden');
    textinput.classList.toggle('hidden');
    this.soundService.initializeAudio();
    this.startGameLoop();
    this.gameObjects.push(player);
  }


  private startGameLoop() {
    const gameLoop = setInterval(() => {
      this.update();
      this.render();
      if (this.gameService.isGameEnded()) {
        clearInterval(gameLoop);
        this.soundService.clearAllSounds();
        this.gameService.setPermanentLock();
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        const video = document.getElementById('ending-video') as HTMLVideoElement;
        canvas.classList.add('hidden');
        video.classList.remove('hidden');
        video.play();
      }
    }, 1000 / 60);
  }

  private previousX: number = player.x;
  private previousY: number = player.y;
  private lastFootstepTime = 0;
  private FOOTSTEP_COOLDOWN = 500;

  private update() {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Calculate new player position for each direction separately

    this.previousX = player.x;
    this.previousY = player.y;

    let newX = player.x;
    let newY = player.y;

    if (!this.textDisplayService.isTextQueued()) {
      if (this.keys['W']) {
        newY -= this.SPEED;
        // Check if new player position would be within map bounds and would not collide with any fixed object
        if (newY >= 0 && !this.checkCollision(newX, newY)) {
          player.y = newY;
        }
        newY = player.y; // Reset newY for the next check
      }
      if (this.keys['S']) {
        newY += this.SPEED;
        if (newY <= this.gameService.getCurrentMapImage().height - player.height && !this.checkCollision(newX, newY)) {
          player.y = newY;
        }
        newY = player.y;
      }
      if (this.keys['A']) {
        newX -= this.SPEED;
        if (newX >= 0 && !this.checkCollision(newX, newY)) {
          player.x = newX;
        }
        newX = player.x;
      }
      if (this.keys['D']) {
        newX += this.SPEED;
        if (newX <= this.gameService.getCurrentMapImage().width - player.width && !this.checkCollision(newX, newY)) {
          player.x = newX;
        }
        newX = player.x;
      }
    }

    this.SPEED = this.keys['SHIFT'] ? this.SPRINT_SPEED : this.NORMAL_SPEED;
    this.FOOTSTEP_COOLDOWN = this.keys['SHIFT'] ? 300 : 400;

    if (newX >= 0 && newX <= this.gameService.getCurrentMapImage().width - player.width) {
      player.x = newX;
    }
    if (newY >= 0 && newY <= this.gameService.getCurrentMapImage().height - player.height) {
      player.y = newY;
    }

    // Calculate new camera position
    let newCameraX = this.camera.x;
    let newCameraY = this.camera.y;

    const cameraOffsetXValue = 0.30;
    const cameraOffsetYValue = 0.35;

    if (player.x - this.camera.x < canvasWidth * cameraOffsetXValue) {
      newCameraX = player.x - canvasWidth * cameraOffsetXValue;
    } else if (player.x - this.camera.x > canvasWidth * (1 - cameraOffsetXValue)) {
      newCameraX = player.x - canvasWidth * (1 - cameraOffsetXValue);
    }

    if (player.y - this.camera.y < canvasHeight * cameraOffsetYValue) {
      newCameraY = player.y - canvasHeight * cameraOffsetYValue;
    } else if (player.y - this.camera.y > canvasHeight * (1 - cameraOffsetYValue)) {
      newCameraY = player.y - canvasHeight * (1 - cameraOffsetYValue);
    }

    // Check if new camera position would be within map bounds
    if (newCameraX >= 0 && newCameraX <= this.gameService.getCurrentMapImage().width - canvasWidth) {
      this.camera.x = newCameraX;
    }
    if (newCameraY >= 0 && newCameraY <= this.gameService.getCurrentMapImage().height - canvasHeight) {
      this.camera.y = newCameraY;
    }

    if (player.x !== this.previousX || player.y !== this.previousY) {
      this.updatePlayerSprite();
      const currentTime = new Date().getTime();
      if (currentTime - this.lastFootstepTime >= this.FOOTSTEP_COOLDOWN) {
        this.soundService.playFootstep();
        this.lastFootstepTime = currentTime;
      }
    }
  }

  private interact() {
    if (this.textDisplayService.isTextQueued() && !this.isWriting && !this.gameService.isFluteLock()) {
      this.textDisplayService.setTextDisplay('');
      this.textDisplayService.shiftQueue();
    } else if (!this.textDisplayService.isTextQueued() && !this.isWriting && !this.gameService.isFluteLock()) {
      const inInteractionRange: InteractableObject[] = []
      for (const interactableObject of this.interactableObjectService.allInteractableObjects.filter(interactableObject => interactableObject.canInteract)) {
        if (player.x < interactableObject.x + interactableObject.width &&
          player.x + player.width > interactableObject.x &&
          player.y < interactableObject.y + interactableObject.height &&
          player.y + player.height > interactableObject.y) {
          if (interactableObject.canInteract) {
            inInteractionRange.push(interactableObject);
          }
        }
      }
      if (inInteractionRange.length > 0) {
        inInteractionRange[0].functionTrigger!(inInteractionRange[0]);
      }
    }
  }

  private checkCollision(newX: number, newY: number): boolean {
    for (const fixedObject of fixedObjects.concat(this.tempColliderService.getTemporaryColliders())) {
      if (newX < fixedObject.x + fixedObject.width &&
        newX + player.width > fixedObject.x &&
        newY < fixedObject.y + fixedObject.height &&
        newY + player.height > fixedObject.y) {
        return true;
      }
    }
    return false;
  }

  private render() {
    this.drawBackground();
    this.drawGameObjects();
  }

  private drawGameObjects() {
    for (const gameObject of this.gameObjects) {
      this.drawGameObject(gameObject);
    }

    for (const interactableObject of this.interactableObjectService.allInteractableObjects) {
      this.drawInteractableObject(interactableObject);
    }

    if (this.debug) {
      this.ctx!.globalAlpha = 0.5;

      for (const fixedObject of fixedObjects) {
        this.ctx!.fillStyle = 'red';
        this.ctx?.fillRect(fixedObject.x - this.camera.x, fixedObject.y - this.camera.y, fixedObject.width, fixedObject.height);
      }

      for (const collider of this.tempColliderService.getTemporaryColliders()) {
        this.ctx!.fillStyle = 'yellow';
        this.ctx?.fillRect(collider.x - this.camera.x, collider.y - this.camera.y, collider.width, collider.height
        );
      }

      this.ctx!.globalAlpha = 1;
    }
  }

  private drawInteractableObject(interactableObject: InteractableObject) {
    if (interactableObject.hasSpriteImages()) {
      this.ctx!.globalAlpha = 1;
      this.drawSprite(interactableObject.getSpriteImage(), interactableObject.x, interactableObject.y, interactableObject.width, interactableObject.height);
    }
    if (this.debug) {
      this.ctx!.globalAlpha = 0.2;
      this.ctx!.fillStyle = 'blue';
      this.ctx!.fillRect(interactableObject.x - this.camera.x, interactableObject.y - this.camera.y, interactableObject.width, interactableObject.height);
      this.ctx!.globalAlpha = 1;
    }
  }

  private drawGameObject(gameObject: GameObject) {
    if (gameObject.spriteImage) {
      this.drawSprite(gameObject.spriteImage, gameObject.x, gameObject.y, gameObject.width, gameObject.height);
    } else {
      this.ctx!.fillStyle = 'black';
      this.ctx?.fillRect(gameObject.x - this.camera.x, gameObject.y - this.camera.y, gameObject.width, gameObject.height);
    }
  }

  private drawSprite(sprite: HTMLImageElement, x: number, y: number, width: number, height: number) {
    this.ctx!.drawImage(sprite, x - this.camera.x, y - this.camera.y, width, height);
  }

  private drawBackground() {
    this.ctx!.drawImage(this.gameService.getCurrentMapImage(), -this.camera.x, -this.camera.y);
  }

  private updatePlayerSprite() {
    this.framesPassed++;
    if (this.framesPassed % 12 === 0) {
      this.framesPassed = 0;
      this.animationFrames++;
      if (this.animationFrames == 4) {
        this.animationFrames = 0;
      }
    }
    if (this.keys['W']) {
      player.spriteImage = this.playerImages.up[this.animationFrames];
    }
    if (this.keys['S']) {
      player.spriteImage = this.playerImages.down[this.animationFrames];
    }
    if (this.keys['A']) {
      player.spriteImage = this.playerImages.left[this.animationFrames];
    }
    if (this.keys['D']) {
      player.spriteImage = this.playerImages.right[this.animationFrames];
    }
  }

  private lastTalkingSoundTime = 0;
  private TALKING_SOUND_COOLDOWN = 80;

  private onTextDisplayChange(texts: TextItem[]) {
    if (!this.isWriting && texts.length > 0) {
      let i = 0;
      this.isWriting = true;
      const interval = setInterval(() => {
        if (i < texts[0].text.length) {
          this.textDisplayService.setTextDisplay(this.textDisplayService.getTextDisplay() + texts[0].text.charAt(i));
          const currentTime = new Date().getTime();
          if (currentTime - this.lastTalkingSoundTime >= this.TALKING_SOUND_COOLDOWN) {
            this.soundService.playTalkingSound();
            this.lastTalkingSoundTime = currentTime;
          }
          i++;
        } else {
          clearInterval(interval);
          this.isWriting = false;
        }
      }, this.debug ? 50 : 50);
    }

  }

}
