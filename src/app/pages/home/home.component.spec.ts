import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { mockPlaylist } from 'src/app/shared/mock/mock.playlist';
import { Audio } from 'src/app/shared/models/audio';
import { BypassPipe } from 'src/app/shared/pipes/bypass.pipe';
import { PlaylistService } from 'src/app/shared/services/playlist.service';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PageObject } from './page-object';

describe('HomeComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        BypassPipe
      ],
      imports: [
        CommonModule,
        HttpClientModule,
        HomeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ScrollingModule,
        NzListModule,
        NzFormModule,
        NzButtonModule,
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        NzInputModule,
        NzCheckboxModule,
        NzNotificationModule,
        BrowserAnimationsModule
      ],
      providers: [
        PlaylistService
      ]
    }).compileComponents();
  }));

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let playlist: Audio[] = [];
  let page: PageObject;

  beforeEach(waitForAsync(inject([PlaylistService], (mockService: PlaylistService) => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.debugElement.componentInstance;

    playlist = mockPlaylist;
    mockService['playlist'] = playlist;

    page = new PageObject(fixture);
  })));

  it('should show empty form when new audio is created', fakeAsync(() => {
    page.createNewAudio();
    expect(page.getAudioForm()).toBeTruthy('Expected to find form when new audio is created');
    flush();
  }));

  it('should list all playlist', waitForAsync(inject([PlaylistService], (mockService: PlaylistService) => {
    expect(component.playlist.length).toEqual(page.getPlaylist().length, '.audio elements displayed does not match playlist list');
  })));

  it('should select audio when clicked (add `active` class)', fakeAsync(inject([PlaylistService], (mockService: PlaylistService) => {
    const audio = page.selectListAudio();
    expect(audio.nativeElement.classList).toContain('active', 'Selected audio element should have class `active`');
    flush();
  })));

  it('should populate inputs with selected audio`s title and text', fakeAsync(() => {
    const index = 1;
    page.selectListAudio(index);
    const formData = page.getFormData(['title', 'soundcloud_code', 'color']);
    const audio = playlist[index];
    expect(formData['title']).toEqual(audio['title'], 'Title field doesn`t reflect selected audio');
    expect(formData['soundcloud_code']).toEqual(audio['soundcloud_code'], 'SoundCloud field doesn`t reflect selected audio');
    expect(formData['color']).toEqual(audio['color'], 'Color field doesn`t reflect selected audio');
    flush();
  }));

  it('should save audio when Save button is clicked', fakeAsync(() => {
    page.createNewAudio();
    page.fillAudioForm({ title: 'Lorem ipsum', soundcloud_code: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/254976254&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"></iframe>' });
    spyOn(component, 'saveAudio');
    page.saveAudioForm();
    expect(component.saveAudio).toHaveBeenCalled();
    flush();
  }));

  it('should save audio using PlaylistService when form is submitted', fakeAsync(inject([PlaylistService], (mockService: PlaylistService) => {
    spyOn(mockService, 'saveAudio');
    component.saveAudio(playlist[1] as Audio);
    expect(mockService.saveAudio).toHaveBeenCalledWith(playlist[1]);
    flush();
  })));

  it('should disable save button when required fields are empty', fakeAsync(() => {
    page.selectListAudio();
    const titleField = page.getFormField('title');
    expect(titleField.nativeElement.attributes['required']).toBeDefined(' missing `required` attribute on title input');
    page.fillAudioForm({ title: '', soundcloud_code: '' });
    expect(page.getSaveBtn().nativeElement.disabled).toBeTruthy('Save button should be disabled on form errors');
    flush();
  }));

  it('should remove field`s error message when field has no errors', fakeAsync(() => {
    page.selectListAudio();
    const titleField = page.getFormField('title');
    expect(titleField.nativeElement.attributes['required']).toBeDefined(' missing `required` attribute on title input');

    let formError = titleField.nativeElement.parentElement.querySelector('.form-error');
    expect(formError && formError.offsetParent).toBeFalsy('There should be no error when field is valid');

    page.fillAudioForm({ title: '', soundcloud_code: '' });

    formError = titleField.nativeElement.parentElement.querySelector('.form-error');
    expect(formError && formError.offsetParent).toBeTruthy('There should be error when field is isvalid');
    flush();
  }));

  // Saving copy
  it('should not change audio on list until its saved', fakeAsync(inject([PlaylistService], (mockService: PlaylistService) => {
    const index = 1;
    page.selectListAudio(index);
    const changedValue = 'Lorem ipsum';

    page.fillAudioForm({
      title: changedValue
    });

    const formData = page.getFormData(['title', 'soundcloud_code']);
    expect(formData['title']).toEqual(changedValue);

    const list = page.getPlaylist();
    expect(list[index].nativeElement.textContent).not.toContain(changedValue, 'List should not be updated before save button is pressed');
    flush();
  })));

  it('should keep audio selected after its saved', fakeAsync(() => {
    page.selectListAudio(2);

    const formData = {
      title: 'Lorem ipsum',
      soundcloud_code: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/254976254&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"></iframe>',
    };

    page.fillAudioForm(formData);
    page.saveAudioForm();

    const audio = page.selectListAudio(2);
    expect(audio.nativeElement.classList).toContain('active', 'After audio is saved it should be selected on the list');
    expect(audio.nativeElement.textContent).toContain(formData.title, 'After audio is saved it should be selected on the list');
    flush();
  }));

  // Favorite Audios
  it('should make audio list item font 16px when audio is favorite', fakeAsync(() => {
    let audio = page.selectListAudio(1);
    page.fillAudioForm({
      favorite: true
    });
    page.saveAudioForm();
    audio = page.selectListAudio(1);
    expect(window.getComputedStyle(audio.nativeElement).fontSize).toBe('16px', 'When audio is marked favorite its font size should be 16px');
    flush();
  }));

  // Audios Colors
  it('should set font color on the list item audio color', fakeAsync(() => {
    let audio = page.selectListAudio(1);
    page.fillAudioForm({
      color: '#00ff00'
    });
    page.saveAudioForm();
    audio = page.selectListAudio(1);
    expect(audio.nativeElement.style.color).toBe('rgb(0, 255, 0)', 'Audio font color should match audio.color value');
    flush();
  }));
});
