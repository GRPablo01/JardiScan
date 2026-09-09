import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMyPlants } from './widget-my-plants';

describe('WidgetMyPlants', () => {
  let component: WidgetMyPlants;
  let fixture: ComponentFixture<WidgetMyPlants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetMyPlants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetMyPlants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
