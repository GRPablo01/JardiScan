import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeNavMobile } from './welcome-nav-mobile';

describe('WelcomeNavMobile', () => {
  let component: WelcomeNavMobile;
  let fixture: ComponentFixture<WelcomeNavMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeNavMobile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeNavMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
