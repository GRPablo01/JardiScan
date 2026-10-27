import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesFigma } from './guides-figma';

describe('GuidesFigma', () => {
  let component: GuidesFigma;
  let fixture: ComponentFixture<GuidesFigma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidesFigma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuidesFigma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
