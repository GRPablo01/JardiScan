import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCarte } from './widget-carte';

describe('WidgetCarte', () => {
  let component: WidgetCarte;
  let fixture: ComponentFixture<WidgetCarte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetCarte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetCarte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
