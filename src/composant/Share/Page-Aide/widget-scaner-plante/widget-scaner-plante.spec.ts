import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetScanerPlante } from './widget-scaner-plante';

describe('WidgetScanerPlante', () => {
  let component: WidgetScanerPlante;
  let fixture: ComponentFixture<WidgetScanerPlante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetScanerPlante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetScanerPlante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
