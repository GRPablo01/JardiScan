import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSearch } from './widget-search';

describe('WidgetSearch', () => {
  let component: WidgetSearch;
  let fixture: ComponentFixture<WidgetSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
