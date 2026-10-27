import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeAction } from './welcome-action';

describe('WelcomeAction', () => {
  let component: WelcomeAction;
  let fixture: ComponentFixture<WelcomeAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
