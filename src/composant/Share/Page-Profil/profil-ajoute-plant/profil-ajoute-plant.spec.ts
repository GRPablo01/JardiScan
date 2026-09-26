import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilAjoutePlant } from './profil-ajoute-plant';

describe('ProfilAjoutePlant', () => {
  let component: ProfilAjoutePlant;
  let fixture: ComponentFixture<ProfilAjoutePlant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilAjoutePlant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilAjoutePlant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
