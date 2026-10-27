import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeProfile1 } from './welcome-profile1';

describe('WelcomeProfile1', () => {
  let component: WelcomeProfile1;
  let fixture: ComponentFixture<WelcomeProfile1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeProfile1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeProfile1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
