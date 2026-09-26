import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDianostique } from './widget-dianostique';

describe('WidgetDianostique', () => {
  let component: WidgetDianostique;
  let fixture: ComponentFixture<WidgetDianostique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetDianostique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetDianostique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
