import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDesktop } from './language-desktop';

describe('LanguageDesktop', () => {
  let component: LanguageDesktop;
  let fixture: ComponentFixture<LanguageDesktop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageDesktop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
