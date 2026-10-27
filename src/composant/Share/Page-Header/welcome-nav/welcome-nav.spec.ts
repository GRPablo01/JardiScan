import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeNav } from './welcome-nav';

describe('WelcomeNav', () => {
  let component: WelcomeNav;
  let fixture: ComponentFixture<WelcomeNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
