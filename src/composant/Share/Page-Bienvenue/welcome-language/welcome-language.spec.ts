import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeLanguage } from './welcome-language';

describe('WelcomeLanguage', () => {
  let component: WelcomeLanguage;
  let fixture: ComponentFixture<WelcomeLanguage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeLanguage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeLanguage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
