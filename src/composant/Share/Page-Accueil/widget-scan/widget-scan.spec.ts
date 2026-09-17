import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetScan } from './widget-scan';

describe('WidgetScan', () => {
  let component: WidgetScan;
  let fixture: ComponentFixture<WidgetScan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetScan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetScan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
