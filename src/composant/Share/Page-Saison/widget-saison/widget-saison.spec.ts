import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSaison } from './widget-saison';

describe('WidgetSaison', () => {
  let component: WidgetSaison;
  let fixture: ComponentFixture<WidgetSaison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetSaison]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetSaison);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
