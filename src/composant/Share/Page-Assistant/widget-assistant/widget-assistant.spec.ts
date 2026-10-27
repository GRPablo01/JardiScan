import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAssistant } from './widget-assistant';

describe('WidgetAssistant', () => {
  let component: WidgetAssistant;
  let fixture: ComponentFixture<WidgetAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
