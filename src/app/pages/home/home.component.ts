import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Audio } from 'src/app/shared/models/audio';
import { PlaylistService } from 'src/app/shared/services/playlist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  playlist: Audio[] = [];

  constructor(public _sanitizer: DomSanitizer, public playlistService: PlaylistService, private notification: NzNotificationService) { }

  selected!: Partial<Audio>;

  @ViewChild('f') audioForm!: NgForm;

  ngOnInit() {
    this.loadAudios();
  }

  getAudios() {
    return this.playlist;
  }

  private loadAudios(): void {
    this.playlist = this.playlistService.getAudios();
  }

  selectAudio(audio: any) {
    this.selected = audio;
  }

  newAudio() {
    this.selected = {};
    this.audioForm?.reset();
  }

  saveAudio(audio: Audio) {
    this.selected = this.playlistService.saveAudio(Object.assign({ id: this.selected?.id }, audio) as Audio);
    this.loadAudios();
  }

}
