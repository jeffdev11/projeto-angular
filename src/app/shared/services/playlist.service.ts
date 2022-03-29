import { Injectable } from '@angular/core';

import { Audio } from '../models/audio';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlist: Audio[] = [];
  private currentId = 4;

  constructor() { }

  getAudios(): Audio[] {
    // must return a copy of the array because the original array is mutable and the virtual scroll would not be affected
    return [...this.playlist];
  }

  getAudio(id: number): Audio {
    return this.playlist[this.getAudioIndex(id)];
  }

  saveAudio(audio: Audio): Audio {
    if (audio.id) {
      const index = this.getAudioIndex(audio.id);
      this.playlist.splice(index, 1, audio);
    } else {
      audio.id = this.generateId();
      this.playlist.push(audio);
    }
    return audio;
  }

  private getAudioIndex(id: number) {
    return this.playlist.findIndex((audio) => id === audio.id);
  }

  private generateId() {
    return this.currentId++;
  }

}
