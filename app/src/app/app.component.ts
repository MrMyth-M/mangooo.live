import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Player} from '../entities/player/player';
import {GameObject} from "../entities/game-object";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app';
  private SPEED = 2.5;

  @ViewChild('canvas', {static: true})
  // @ts-ignore
  private canvas: ElementRef<HTMLCanvasElement>;
  private gameObjects: GameObject[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private player = new Player(0, 0, 50, 50);

  private keys: { [key: string]: boolean } = {};

  constructor() {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    if (!this.ctx) {
      return;
    }

    window.addEventListener('keydown', (event) => {
      this.keys[event.key.toUpperCase()] = true;
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.key.toUpperCase()] = false;
    });

    this.startGameLoop();
    this.gameObjects.push(this.player);
    // add movement listener by initializing it in a separate method here
    this.updateMovement();
  }

  private startGameLoop() {
    setInterval(() => {
      this.update();
      this.render();
    }, 1000 / 60);
  }

  private update() {
    this.updateMovement();
  }

  private render() {
    this.drawBackground();
    this.drawGameObjects();
  }

  private drawGameObjects() {
    for (const gameObject of this.gameObjects) {
      this.ctx!.fillStyle = 'black';
      this.ctx?.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height);
    }
  }

  private drawBackground() {
    this.ctx!.fillStyle = 'white';
    this.ctx?.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  private updateMovement() {
    if (this.keys['W']) {
      this.player.y -= this.SPEED;
    }
    if (this.keys['S']) {
      this.player.y += this.SPEED;
    }
    if (this.keys['A']) {
      this.player.x -= this.SPEED;
    }
    if (this.keys['D']) {
      this.player.x += this.SPEED;
    }
  }
}
