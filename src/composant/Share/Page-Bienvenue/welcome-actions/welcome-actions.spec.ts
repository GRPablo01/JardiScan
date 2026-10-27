import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeActions } from './welcome-actions';

describe('WelcomeActions', () => {
  let component: WelcomeActions;
  let fixture: ComponentFixture<WelcomeActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
