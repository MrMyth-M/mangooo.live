import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class SoundService {
  private musicAudio: HTMLAudioElement = new Audio();
  private footstepsAudio: HTMLAudioElement[] = [];
  private talkingAudios: HTMLAudioElement[] = [];
  private effectsAudio: HTMLAudioElement = new Audio();

  private songPaths: string[] = [
    'assets/music/sherrys_theme.mp3',
    'assets/music/oot.mp3',
    'assets/music/fortune.mp3',
    'assets/music/hut.mp3',
    'assets/music/mischief.mp3',
    'assets/music/zelda.mp3',
  ];

  private currentFootstepIndex = 0;
  private currentSongIndex = 0;

  private userInteracted = false;

  constructor() {
    this.loadFootstepSounds();
    this.loadTalkingSounds();
  }

  public clearAllSounds() {
    this.musicAudio.pause();
    this.effectsAudio.pause();
    this.footstepsAudio.forEach(audio => {
      audio.pause();
    });
    this.talkingAudios.forEach(audio => {
      audio.pause();
    });
  }

  // Initialize audio after user interaction
  public initializeAudio() {
    this.userInteracted = true;
    this.initSongLoop();
  }

  // Play a random song from the list and loop through the songs randomly
  private initSongLoop() {
    if (this.userInteracted) {
      this.currentSongIndex = Math.floor(Math.random() * this.songPaths.length);
      this.playSongWithIndex(this.currentSongIndex);
      this.musicAudio.onended = () => {
        this.currentSongIndex++;
        if (this.currentSongIndex == this.songPaths.length) {
          this.currentSongIndex = 0;
        }
        this.playSongWithIndex(this.currentSongIndex);
      };
    }
  }

  private playSongWithIndex(index: number) {
    this.musicAudio.src = this.songPaths[index];
    this.musicAudio.volume = 0.1;
    this.musicAudio.load();
    this.musicAudio.play();
  }


  public playFinalFlute() {
    setTimeout(() => {
      this.fadeOutMusic();
    }, 500);
    setTimeout(() => {
      this.effectsAudio.src = 'assets/sounds/flute_final.mp3';
      this.effectsAudio.volume = 0.5;
      this.effectsAudio.play();
    }, 3000);
    setTimeout(() => {
      this.fadeInMusic();
    }, 16000);
  }

  public playInitialFlute() {
    setTimeout(() => {
      this.fadeOutMusic();
    }, 1000);
    setTimeout(() => {
      this.effectsAudio.src = 'assets/sounds/flute_initial.mp3';
      this.effectsAudio.volume = 0.5;
      this.effectsAudio.play();
    }, 4000);
    setTimeout(() => {
      this.fadeInMusic();
    }, 13000);
  }

  private fadeInMusic() {
    let volume = 0;
    const fadeIn = setInterval(() => {
      if (volume < 0.15) {
        volume = parseFloat((volume + 0.01).toFixed(2));
        this.musicAudio.volume = volume;
      } else {
        clearInterval(fadeIn);
      }
    }, 200);
  }

  private fadeOutMusic() {
    let volume = 0.15;
    const fadeOut = setInterval(() => {
      if (volume > 0) {
        volume = parseFloat((volume - 0.01).toFixed(2));
        this.musicAudio.volume = volume;
      } else {
        clearInterval(fadeOut);
      }
    }, 200);
  }

  public playBallBounceSound() {
    this.effectsAudio.src = 'assets/sounds/ball.mp3';
    this.effectsAudio.volume = 0.5;
    this.effectsAudio.play();
  }

  public playRockCrushSound() {
    this.effectsAudio.src = 'assets/sounds/rock.mp3';
    this.effectsAudio.volume = 0.3;
    this.effectsAudio.play();
  }

  public playWoodChopSound() {
    this.effectsAudio.src = 'assets/sounds/woodchop.mp3';
    this.effectsAudio.volume = 0.25;
    this.effectsAudio.play();
  }

  public playUnlockDoorSound() {
    this.effectsAudio.src = 'assets/sounds/door.mp3';
    this.effectsAudio.volume = 0.5;
    this.effectsAudio.play();
  }

  // Footstep sound
  public playFootstep() {
    const audio = this.footstepsAudio[this.currentFootstepIndex]
    if (audio) {
      audio.currentTime = 0; // Reset to start if previously played
      audio.volume = 0.6;
      audio.play();
      this.currentFootstepIndex++;
      if (this.currentFootstepIndex == this.footstepsAudio.length) {
        this.currentFootstepIndex = 0;
      }
    } else {
      console.warn(`Footstep sound not found: assets/sounds/footsteps/footstep${this.currentFootstepIndex}.mp3`);
    }
  }

  // Talking sound
  public playTalkingSound() {
    const audio = this.talkingAudios[Math.floor(Math.random() * this.talkingAudios.length)];
    if (audio) {
      audio.currentTime = 0; // Reset to start if previously played
      audio.volume = 0.15;
      audio.play();
    } else {
      console.warn(`Footstep sound not found: assets/sounds/footsteps/footstep${this.currentFootstepIndex}.mp3`);
    }
  }


  private loadFootstepSounds() {
    const footStepPaths = []
    for (let i = 1; i <= 13; i++) {
      footStepPaths.push(`assets/sounds/footsteps/footstep${i}.mp3`);
    }
    footStepPaths.forEach(path => {
      const audio = new Audio(path);
      audio.volume = 0.5;
      this.footstepsAudio.push(audio);
    });
  }

  private loadTalkingSounds() {
    const talkingSoundPaths = []
    for (let i = 1; i <= 7; i++) {
      talkingSoundPaths.push(`assets/sounds/talking/talk${i}.mp3`);
    }
    talkingSoundPaths.forEach(path => {
      const audio = new Audio(path);
      audio.volume = 0.5;
      this.talkingAudios.push(audio);
    });
  }
}
