import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeLogo } from './welcome-logo';

describe('WelcomeLogo', () => {
  let component: WelcomeLogo;
  let fixture: ComponentFixture<WelcomeLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeLogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeLogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
