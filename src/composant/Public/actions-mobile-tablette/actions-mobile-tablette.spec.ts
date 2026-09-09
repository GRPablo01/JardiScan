import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsMobileTablette } from './actions-mobile-tablette';

describe('ActionsMobileTablette', () => {
  let component: ActionsMobileTablette;
  let fixture: ComponentFixture<ActionsMobileTablette>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsMobileTablette]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsMobileTablette);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
