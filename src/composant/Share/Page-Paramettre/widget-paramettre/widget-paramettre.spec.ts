import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetParamettre } from './widget-paramettre';

describe('WidgetParamettre', () => {
  let component: WidgetParamettre;
  let fixture: ComponentFixture<WidgetParamettre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetParamettre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetParamettre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
