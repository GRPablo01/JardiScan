import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PourquoiRecherche } from './pourquoi-recherche';

describe('PourquoiRecherche', () => {
  let component: PourquoiRecherche;
  let fixture: ComponentFixture<PourquoiRecherche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PourquoiRecherche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PourquoiRecherche);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
