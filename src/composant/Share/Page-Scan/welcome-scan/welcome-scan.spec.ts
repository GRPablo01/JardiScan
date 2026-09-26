import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeScan } from './welcome-scan';

describe('WelcomeScan', () => {
  let component: WelcomeScan;
  let fixture: ComponentFixture<WelcomeScan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeScan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeScan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
