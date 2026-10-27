import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRecherche } from './widget-recherche';

describe('WidgetRecherche', () => {
  let component: WidgetRecherche;
  let fixture: ComponentFixture<WidgetRecherche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetRecherche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetRecherche);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
