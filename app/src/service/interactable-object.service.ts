import {Injectable} from "@angular/core";
import {InteractableObject} from "../entities/interactable-object";
import {TextDisplayService} from "./text-display.service";
import {GameService} from "./game.service";
import {TempColliderService} from "./temp-collider.service";
import {BeaverState} from "../entities/states/beaver-state";
import {Item} from "../entities/items";
import {ItemService} from "./item.service";
import {BeaverWifeState} from "../entities/states/beaver-wife-state";
import {TurtleState} from "../entities/states/turtle-state";
import {TextItem} from "../entities/text-item";
import {RaccoonState} from "../entities/states/raccoon-state";
import {SoundService} from "./sound.service";

@Injectable({
  providedIn: 'root',
})
export class InteractableObjectService {

  private uniqueInteractableObjects = new Map<string, InteractableObject>();
  private interactableObjects: InteractableObject[] = [];

  private currentBeaverState = BeaverState.Initial;
  private currentBeaverWifeState = BeaverWifeState.Initial;
  private currentTurtleState = TurtleState.Initial;
  private currentRaccoonState = RaccoonState.Initial;

  private rockDiscovered = false;

  private turtleAwakeImage = new Image();
  private turtleAsleepImage = {
    one: new Image(),
    two: new Image(),
    three: new Image(),
    four: new Image(),
  }

  private raccoonHappySprite = {
    one: new Image(),
    two: new Image()
  }

  private raccoonSadSprite = {
    one: new Image(),
    two: new Image(),
    three: new Image(),
    four: new Image()
  }

  private turtleCharacter = new InteractableObject(401, 1060, 96, 77, true, this.turtleInteractionListener.bind(this), [this.turtleAwakeImage]);
  private raccoonCharacter = new InteractableObject(740, 10, 50, 64, true, this.raccoonInteraction.bind(this), [this.raccoonSadSprite.one, this.raccoonSadSprite.two, this.raccoonSadSprite.three, this.raccoonSadSprite.four], 16)

  private tallGrassTexts = [
    'The tall grass was empty.',
    'You found a bug in the tall grass.',
    'Just some tall grass.',
    'Ew, a spider!',
    'More tall grass.',
    'Nothing special besides some spiky stems, youch!',
    'You found a small rock.',
    'A gentle breeze rustles the tall grass.',
    'A hidden flower peeks through the tall grass.',
    'A butterfly flutters out from the tall grass.',
  ]

  // return both only value sets of uniqueInteractableObjects and interactableObjects as a subscription in the next line
  public get allInteractableObjects() {
    return [...this.uniqueInteractableObjects.values(), ...this.interactableObjects];
  }


  constructor(private soundService: SoundService, private textDisplayService: TextDisplayService, private gameService: GameService, private tempColliderService: TempColliderService, private itemService: ItemService) {
    this.populate();
  }

  private populate() {
    this.populateEmptyBushes();
    this.populateCharacters();
    this.populateTallGrass();
    this.uniqueInteractableObjects.set('door', new InteractableObject(185, 120, 30, 30, true, this.doorListener.bind(this)));
    this.uniqueInteractableObjects.set('log', new InteractableObject(730, 575, 90, 10, true, this.blockingLogListener.bind(this)));
    this.uniqueInteractableObjects.set('goldenLog', new InteractableObject(1055, 835, 60, 40, true, this.goldenLogListener.bind(this)));
    this.uniqueInteractableObjects.set('rock', new InteractableObject(800, 50, 50, 50, true, this.rockListener.bind(this)));
  }

  private populateTallGrass() {
    const tallGrassImage = new Image();
    tallGrassImage.src = 'assets/tall_grass.png';
    this.interactableObjects.push(new InteractableObject(1250, 500, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1300, 500, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1250, 550, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1300, 550, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1350, 550, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1250, 600, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1300, 600, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1350, 600, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1400, 625, 50, 50, true, this.beachBallFindListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1450, 625, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1250, 650, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1300, 650, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1350, 650, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1250, 700, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
    this.interactableObjects.push(new InteractableObject(1300, 700, 50, 50, true, this.tallGrassSearchListener.bind(this), [tallGrassImage]));
  }

  private populateCharacters() {
    const beaverImage = new Image();
    const beaverImage2 = new Image();
    const beaverWife = new Image();
    const beaverWife2 = new Image();
    const beaverKidOne = new Image();
    const beaverKidTwo = new Image();
    beaverImage.src = 'assets/characters/beaver/beaver1.png';
    beaverImage2.src = 'assets/characters/beaver/beaver2.png';
    beaverWife.src = 'assets/characters/beaver-wife/beaver_wife1.png';
    beaverWife2.src = 'assets/characters/beaver-wife/beaver_wife2.png';
    beaverKidOne.src = 'assets/characters/beaver-kids/beaver_kid1.png';
    beaverKidTwo.src = 'assets/characters/beaver-kids/beaver_kid2.png';
    this.turtleAwakeImage.src = 'assets/characters/turtle/turtle_awake.png';
    this.turtleAsleepImage.one.src = 'assets/characters/turtle/turtle_asleep1.png';
    this.turtleAsleepImage.two.src = 'assets/characters/turtle/turtle_asleep2.png';
    this.turtleAsleepImage.three.src = 'assets/characters/turtle/turtle_asleep3.png';
    this.turtleAsleepImage.four.src = 'assets/characters/turtle/turtle_asleep4.png';
    this.raccoonHappySprite.one.src = 'assets/characters/raccoon/raccoon_happy1.png';
    this.raccoonHappySprite.two.src = 'assets/characters/raccoon/raccoon_happy1.png';
    this.raccoonSadSprite.one.src = 'assets/characters/raccoon/raccoon_sad1.png';
    this.raccoonSadSprite.two.src = 'assets/characters/raccoon/raccoon_sad2.png';
    this.raccoonSadSprite.three.src = 'assets/characters/raccoon/raccoon_sad3.png';
    this.raccoonSadSprite.four.src = 'assets/characters/raccoon/raccoon_sad4.png';
    this.uniqueInteractableObjects.set('beaver', new InteractableObject(810, 950, 47, 64, true, this.beaverListener.bind(this), [beaverImage, beaverImage2], 16));
    this.uniqueInteractableObjects.set('beaverWife', new InteractableObject(1280, 900, 47, 64, true, this.beaverWifeListener.bind(this), [beaverWife, beaverWife2], 16));
    this.uniqueInteractableObjects.set('beaverKidOne', new InteractableObject(1360, 880, 37, 55, true, this.beaverKidListener.bind(this), [beaverKidOne]));
    this.uniqueInteractableObjects.set('beaverKidTwo', new InteractableObject(1400, 880, 37, 55, true, this.beaverKidListener.bind(this), [beaverKidTwo]));
  }

  private setTurtleAwake() {
    this.turtleCharacter.resetAnimation();
    this.turtleCharacter.spriteImages = [this.turtleAwakeImage];
    this.turtleCharacter.changeSpriteAfterFrames = null;
  }

  private setTurtleAsleep() {
    this.turtleCharacter.spriteImages = [this.turtleAsleepImage.one, this.turtleAsleepImage.two, this.turtleAsleepImage.three, this.turtleAsleepImage.four];
    this.turtleCharacter.changeSpriteAfterFrames = 15;
  }

  private populateEmptyBushes() {
    const berryRed = new Image();
    berryRed.src = 'assets/berries/berry_red.png';
    const berryPurple = new Image();
    berryPurple.src = 'assets/berries/berry_purple.png';
    const berryYellow = new Image();
    berryYellow.src = 'assets/berries/berry_yellow.png';
    const debugBerry = new Image();
    debugBerry.src = 'assets/berries/debug.png';
    this.interactableObjects.push(new InteractableObject(380, 35, 60, 60, true, this.emptyBushInteraction.bind(this), [berryRed]));
    this.interactableObjects.push(new InteractableObject(510, 130, 60, 60, true, this.emptyBushInteraction.bind(this), [berryPurple]));
    this.interactableObjects.push(new InteractableObject(860, 130, 50, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(895, 165, 50, 60, true, this.emptyBushInteraction.bind(this), [berryPurple]));
    this.interactableObjects.push(new InteractableObject(510, 255, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(480, 290, 60, 60, true, this.emptyBushInteraction.bind(this), [berryRed]));
    this.interactableObjects.push(new InteractableObject(730, 305, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(345, 325, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(690, 330, 60, 60, true, this.emptyBushInteraction.bind(this), [berryRed]));
    this.interactableObjects.push(new InteractableObject(1240, 360, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(1120, 480, 60, 60, true, this.findGoldenFlute.bind(this), [berryPurple]));
    this.interactableObjects.push(new InteractableObject(570, 515, 60, 60, true, this.emptyBushInteraction.bind(this), [berryRed]));
    this.interactableObjects.push(new InteractableObject(1085, 515, 60, 60, true, this.emptyBushInteraction.bind(this), [berryRed]));
    this.interactableObjects.push(new InteractableObject(955, 645, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(985, 675, 60, 60, true, this.emptyBushInteraction.bind(this), [berryRed]));
    this.interactableObjects.push(new InteractableObject(250, 705, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(700, 770, 60, 65, true, this.emptyBushInteraction.bind(this), [berryPurple]));
    this.interactableObjects.push(new InteractableObject(955, 800, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(760, 805, 60, 60, true, this.emptyBushInteraction.bind(this), [berryRed]));
    this.interactableObjects.push(new InteractableObject(380, 835, 60, 60, true, this.emptyBushInteraction.bind(this), [berryYellow]));
    this.interactableObjects.push(new InteractableObject(800, 835, 60, 65, true, this.emptyBushInteraction.bind(this), [berryPurple]));
    this.interactableObjects.push(new InteractableObject(925, 840, 60, 60, true, this.emptyBushInteraction.bind(this), [berryPurple]));
    this.interactableObjects.push(new InteractableObject(415, 1080, 60, 60, true, this.discoverTurtleListener.bind(this), [berryYellow]));
  }

  private raccoonInteraction() {
    if (this.currentRaccoonState === RaccoonState.Initial) {
      this.textDisplayService.addPlainText('*sobbing*');
      this.textDisplayService.addPlainText('O-oh.. hello..');
      this.textDisplayService.addPlainText('Sorry for acting like this... I will move away...');
      this.textDisplayService.addPlainText('(The raccoon seems to be sad... maybe something can cheer him up?)');
      this.currentRaccoonState = RaccoonState.TalkedTo;
    } else if (this.currentRaccoonState === RaccoonState.TalkedTo) {
      if (this.itemService.playerHasItem(Item.GOLDEN_FLUTE)) {
        this.currentRaccoonState = RaccoonState.FluteTriggered;
        this.textDisplayService.addPlainText('You play a tune on the flute you found');
        this.textDisplayService.addPlainText('(The raccoon seems to have enjoyed the soothing melody.)');
        this.soundService.playFinalFlute();
        this.gameService.setFluteLock(16000);
        setTimeout(() => {
          this.textDisplayService.setTextDisplay('');
          this.textDisplayService.shiftQueue();
          this.raccoonCharacter.resetAnimation();
          this.raccoonCharacter.spriteImages = [this.raccoonHappySprite.one, this.raccoonHappySprite.two];
          this.currentRaccoonState = RaccoonState.Final;
          this.textDisplayService.addPlainText('Thank you for playing that melody... it reminds me of better times.');
          this.textDisplayService.addTextItem(new TextItem('Here, let me hand you this... it is a personal gift.', Item.SHARD_FOUR));
          this.textDisplayService.addTextItem(new TextItem('Behind the shard, you find a key... it looks like a house key', Item.KEY));
          this.itemService.playerCollectItem(Item.SHARD_FOUR);
          this.itemService.playerCollectItem(Item.KEY);
        }, 16000);
      } else {
        this.textDisplayService.addPlainText('Maybe you can find something in the bushes?');
      }
    } else if (this.currentRaccoonState === RaccoonState.Final) {
      this.textDisplayService.addPlainText('Thank you for checking up on me... life isn\'t so bad after all.');
    }
  }

  private rockListener() {
    if (this.currentBeaverWifeState !== BeaverWifeState.BeachballGiven) {
      this.textDisplayService.addPlainText('You do not feel like hitting the rock right now.');
      this.textDisplayService.addPlainText('Maybe you should check up on the beaver family first.');
      return;
    }
    if (this.itemService.playerHasItem(Item.PICKAXE)) {
      if (!this.rockDiscovered) {
        this.textDisplayService.addPlainText('A rock is blocking the way.');
        this.textDisplayService.addPlainText('It sounds like someone is sobbing behind it.');
      }
      this.textDisplayService.addPlainText('You hit the rock with your pickaxe!');
      this.textDisplayService.addPlainText('The rock crumbles into pieces!');
      this.tempColliderService.removeTempCollider('rock');
      this.uniqueInteractableObjects.delete('rock');
      this.gameService.swapToStoneMap();
      this.soundService.playRockCrushSound();
      this.uniqueInteractableObjects.set('raccoon', this.raccoonCharacter);
    } else if (this.itemService.playerHasItem(Item.AXE)) {
      this.rockDiscovered = true;
      this.textDisplayService.addPlainText('A rock is blocking the way.');
      this.textDisplayService.addPlainText('It sounds like someone is sobbing behind it.');
      this.textDisplayService.addPlainText('You hit the rock with your axe!');
      this.textDisplayService.addPlainText('The rock cracks, but the axe is just not strong enough!');
    }
  }

  private discoverTurtleListener(interactedBush: InteractableObject) {
    this.setTurtleAsleep();
    this.interactableObjects.splice(this.interactableObjects.indexOf(interactedBush), 1);
    this.uniqueInteractableObjects.set('turtle', this.turtleCharacter);
    this.textDisplayService.addPlainText('H-huh, w-who\'s there?');
  }

  private turtleInteractionListener() {
    if (this.currentTurtleState === TurtleState.Initial) {
      this.setTurtleAwake();
      this.textDisplayService.addPlainText('... I am soooo tired ...');
      this.textDisplayService.addPlainText('... and hungry ...');
      this.textDisplayService.addPlainText('My stomach is growling.');
      this.textDisplayService.addPlainText('I could really use some berries ...');
      this.textDisplayService.addPlainText('but I am too tired to move ...');
      setTimeout(() => {
        this.setTurtleAsleep();
      }, 10000);
      this.currentTurtleState = TurtleState.TalkedTo;
    } else if (this.currentTurtleState === TurtleState.TalkedTo) {
      if (this.itemService.getPlayerBerryCount() >= 8) {
        this.setTurtleAwake();
        this.textDisplayService.addPlainText('You brought me some berries!');
        this.textDisplayService.addPlainText('You are such a kind soul!');
        this.textDisplayService.addPlainText('They are delicious!');
        this.textDisplayService.addPlainText('I feel so much better now!');
        this.textDisplayService.addPlainText('Take this, I want to thank you for your kindness!');
        this.textDisplayService.addTextItem(new TextItem('You have received: Pickaxe', Item.PICKAXE));
        this.itemService.playerCollectItem(Item.PICKAXE);
        this.textDisplayService.addPlainText('Attached to the Pickaxe handle is a small shard...');
        this.textDisplayService.addTextItem(new TextItem('You take it with you as well.', Item.SHARD_THREE));
        this.itemService.playerCollectItem(Item.SHARD_THREE);
        this.currentTurtleState = TurtleState.Final;
      } else {
        this.textDisplayService.addPlainText('... too tired ...');
        this.textDisplayService.addPlainText('need... berries... eight berries...');
      }
    } else if (this.currentTurtleState === TurtleState.Final) {
      this.textDisplayService.addPlainText('The berries were delicious!');
    }
  }

  private goldenLogListener() {
    if (this.itemService.playerHasItem(Item.AXE)) {
      this.textDisplayService.addPlainText('A golden log... it looks valuable!');
      this.textDisplayService.addPlainText('You took a swing at the log!');
      this.textDisplayService.addTextItem(new TextItem('You have received: Golden Stick', Item.GOLDEN_STICK));
      this.itemService.playerCollectItem(Item.GOLDEN_STICK);
      this.soundService.playWoodChopSound();
      this.uniqueInteractableObjects.delete('goldenLog');
    }
  }

  private findGoldenFlute(interactedBush: InteractableObject) {
    this.textDisplayService.addPlainText('There is a flute sticking out of the bush! You decide to play it.');
    this.textDisplayService.addTextItem(new TextItem('You have received: Golden Flute', Item.GOLDEN_FLUTE));
    this.itemService.playerCollectItem(Item.GOLDEN_FLUTE);
    this.soundService.playInitialFlute();
    this.gameService.setFluteLock(13000);
    this.interactableObjects.splice(this.interactableObjects.indexOf(interactedBush), 1);
  }

  private beachBallFindListener(beachBall: InteractableObject) {
    if (this.currentBeaverWifeState !== BeaverWifeState.TalkedTo) {
      this.textDisplayService.addPlainText('Some tall grass... no need to search it.');
      return;
    }
    this.textDisplayService.addPlainText('Something bounced out of the tall grass!');
    this.textDisplayService.addPlainText('You picked up the colorfully patterned ball.');
    this.textDisplayService.addTextItem(new TextItem('You have received: Beach Ball', Item.BEACHBALL));
    this.itemService.playerCollectItem(Item.BEACHBALL);
    this.soundService.playBallBounceSound();
    this.interactableObjects.splice(this.interactableObjects.indexOf(beachBall), 1);
  }

  private tallGrassSearchListener(interactedGrass: InteractableObject) {
    if (this.currentBeaverWifeState !== BeaverWifeState.TalkedTo) {
      this.textDisplayService.addPlainText('Some tall grass... no need to search it.');
      return;
    }
    this.interactableObjects.splice(this.interactableObjects.indexOf(interactedGrass), 1);
    this.textDisplayService.addPlainText(this.tallGrassTexts[Math.floor(Math.random() * this.tallGrassTexts.length)]);
  }

  private blockingLogListener() {
    if (this.currentBeaverState === BeaverState.Initial) {
      this.textDisplayService.addPlainText('The way is blocked ...');
      return;
    }
    if (this.itemService.playerHasItem(Item.AXE)) {
      this.textDisplayService.addPlainText('You chopped the log!');
      this.tempColliderService.removeTempCollider('log');
      this.uniqueInteractableObjects.delete('log');
      this.gameService.swapToLogMap();
      this.soundService.playWoodChopSound();
      this.currentBeaverState = BeaverState.LogBroken;
    } else {
      this.textDisplayService.addPlainText('The log is blocking the way!');
      this.textDisplayService.addPlainText('Maybe someone who chops wood can help you with that?');
      this.currentBeaverState = BeaverState.LogDiscovered;
    }
  }

  private beaverKidListener() {
    if (this.currentBeaverWifeState === BeaverWifeState.BeachballGiven) {
      this.textDisplayService.addPlainText('Thank you for finding our ball! You are so pretty!');
    } else {
      this.textDisplayService.addPlainText('*sobbing*');
    }
  }

  private beaverWifeListener() {
    if (this.currentBeaverState !== BeaverState.Final) {
      // return;
    }
    if (this.currentBeaverWifeState === BeaverWifeState.Initial) {
      this.textDisplayService.addPlainText('Oh, hello there! Have you met my husband?');
      this.textDisplayService.addPlainText('He is a hard worker, but on weekends he slacks off...');
      this.textDisplayService.addPlainText('I really like your outfit! It\'s so colorful!');
      this.textDisplayService.addPlainText('See those two little rascals? They are always up to something!');
      this.textDisplayService.addPlainText('Their favorite ball was also so colorful..., but they lost it somewhere.');
      this.textDisplayService.addPlainText('Last time I saw it, it was bouncing around in the tall grass.');
      this.textDisplayService.addPlainText('I hope they find it soon, they are so sad without it...');
      this.currentBeaverWifeState = BeaverWifeState.TalkedTo;
    } else if (this.currentBeaverWifeState === BeaverWifeState.TalkedTo) {
      if (this.itemService.playerHasItem(Item.BEACHBALL)) {
        this.textDisplayService.addPlainText('You found their ball! Thank you so much!');
        this.textDisplayService.addPlainText('*kids cheering in the background* Yippee!');
        this.textDisplayService.addPlainText('I do not know how to thank you... I don\'t have much...');
        this.textDisplayService.addPlainText('But as a token of my gratitude, I want you to have this!');
        this.textDisplayService.addTextItem(new TextItem('You have received a broken off shard... what could it be for?', Item.SHARD_TWO));
        this.itemService.playerCollectItem(Item.SHARD_TWO);
        this.currentBeaverWifeState = BeaverWifeState.BeachballGiven
      } else {
        this.textDisplayService.addPlainText('They lost the spark in their eyes ever since they lost their favorite toy...');
      }
    }
    if (this.currentBeaverWifeState === BeaverWifeState.BeachballGiven) {
      this.textDisplayService.addPlainText('Thank you so much for finding our ball!');
    }
  }

  private beaverListener() {
    if (this.currentBeaverState === BeaverState.Initial) {
      this.textDisplayService.addPlainText('Oh, hello there! Do you want to cross the river?');
      this.textDisplayService.addPlainText('I could build you a bridge, but you gotta pay me ...');
      this.currentBeaverState = BeaverState.TalkedTo;
    } else if (this.currentBeaverState === BeaverState.TalkedTo) {
      this.textDisplayService.addPlainText('Not working for free, you know?');
    } else if (this.currentBeaverState === BeaverState.LogDiscovered) {
      this.textDisplayService.addPlainText('I can help you with that log.');
      this.textDisplayService.addPlainText('But I don\'t want to do the work... take this instead!');
      this.textDisplayService.addTextItem(new TextItem('You have received: Axe', Item.AXE));
      this.itemService.playerCollectItem(Item.AXE);
      this.currentBeaverState = BeaverState.AxeReceived;
    } else if (this.currentBeaverState === BeaverState.AxeReceived) {
      this.textDisplayService.addPlainText('You have an axe now, right?');
      this.textDisplayService.addPlainText('Go chop that log!');
    } else if (this.currentBeaverState === BeaverState.LogBroken) {
      if (this.itemService.playerHasItem(Item.GOLDEN_STICK)) {
        this.textDisplayService.addPlainText('A golden stick?!');
        this.textDisplayService.addPlainText('You are a true hero!');
        this.textDisplayService.addPlainText('For that, I will build you a bridge!');
        this.textDisplayService.addPlainText('Also... I don\'t know what this is, but I found it in the riverbed!');
        this.textDisplayService.addPlainText('You can have it!');
        this.textDisplayService.addTextItem(new TextItem('You have received a small shard, is it from some pottery?', Item.SHARD_ONE));
        this.itemService.playerCollectItem(Item.SHARD_ONE);
        this.currentBeaverState = BeaverState.Final;
        this.activateBridge();
      } else {
        this.textDisplayService.addPlainText('You cleared the way, good job!');
        this.textDisplayService.addPlainText('But I really need something valuable to build you a bridge...');
      }
    } else if (this.currentBeaverState === BeaverState.Final) {
      this.textDisplayService.addPlainText('Thanks for the stick, hero!');
    }
  }

  private emptyBushInteraction(interactedBush: InteractableObject) {
    this.interactableObjects.splice(this.interactableObjects.indexOf(interactedBush), 1);
    this.textDisplayService.addPlainText('You picked some berries from the bush!');
    this.itemService.increasePlayerBerryCount();
  }

  private activateBridge() {
    this.gameService.swapToBridgeMap();
    this.uniqueInteractableObjects.delete('bridge');
    this.tempColliderService.removeTempCollider('bridge');
  }

  private doorListener() {
    if (this.itemService.playerHasItem(Item.KEY)) {
      this.soundService.playUnlockDoorSound();
      setTimeout(() => {
        this.gameService.setGameEnd();
      }, 3000);
    } else {
      this.textDisplayService.addPlainText('The door is locked.');
      this.textDisplayService.addPlainText('You try to open it, but it won\'t budge.');
    }
  }
}
