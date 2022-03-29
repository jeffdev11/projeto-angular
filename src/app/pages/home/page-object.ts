import { DebugElement } from '@angular/core';
import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';

export class PageObject {

  constructor(private fixture: ComponentFixture<HomeComponent>) {
    this.fixture.detectChanges();
  }

  getPlaylist() {
    return this.fixture.debugElement.queryAll(By.css('.audio'));
  }

  selectListAudio(index = 0) {
    const playlist = this.getPlaylist();
    const audio = playlist[index];
    audio.triggerEventHandler('click', {});
    this.fixture.detectChanges();
    tick();
    return audio;
  }

  getLastListAudio() {
    const playlist = this.getPlaylist();
    return playlist[playlist.length - 1];
  }

  createNewAudio() {
    const newBtn = this.fixture.debugElement.query(By.css('.audio-new'));
    newBtn.triggerEventHandler('click', {});
    this.fixture.detectChanges();
  }

  getAudioForm() {
    return this.fixture.debugElement.query(By.css('form'));
  }

  getSaveBtn() {
    return this.fixture.debugElement.query(By.css('.audio-save'));
  }

  saveAudioForm() {
    const saveBtn = this.getSaveBtn();
    saveBtn.nativeElement.click();
    this.fixture.detectChanges();
    tick();
  }

  getFormField(name: string): DebugElement {
    const selector = `form [name=${name}]`;
    const field = this.fixture.debugElement.query(By.css(selector));
    if (!(field && field.nativeElement)) {
      throw Error('Can`t find element matching CSS selector: ' + selector);
    }
    return field;
  }

  getFormData(fields: string[]) {
    const data: any = {};
    for (const name of fields) {
      const field = this.getFormField(name);
      if (['checkbox', 'radio'].indexOf(field.nativeElement.type) > -1 && field.nativeElement.checked) {
        data[name] = field.nativeElement.value;
      } else {
        data[name] = field.nativeElement.value;
      }
    }
    return data;
  }

  fillAudioForm(data: any) {
    this.fixture.detectChanges();
    tick();

    for (const name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      const field = this.getFormField(name);
      if (['checkbox', 'radio'].indexOf(field.nativeElement.type) > -1) {
        field.nativeElement.checked = data[name];
        field.triggerEventHandler('change', { target: field.nativeElement });
        continue;
      }

      if ('undefined' !== typeof data[name]) {
        field.nativeElement.value = data[name];
        field.triggerEventHandler('input', { target: field.nativeElement });
        continue;
      }
    }
    this.fixture.detectChanges();
    tick();
  }
}
