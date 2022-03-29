import { TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { BypassPipe } from './bypass.pipe';

describe('BypassPipe', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  }));

  it('create an instance', () => {
    const domSanitizer = TestBed.inject(DomSanitizer);
    const pipe = new BypassPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });
});
