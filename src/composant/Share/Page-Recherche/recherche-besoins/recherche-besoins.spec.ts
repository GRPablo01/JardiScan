import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheBesoins } from './recherche-besoins';

describe('RechercheBesoins', () => {
  let component: RechercheBesoins;
  let fixture: ComponentFixture<RechercheBesoins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercheBesoins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechercheBesoins);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
