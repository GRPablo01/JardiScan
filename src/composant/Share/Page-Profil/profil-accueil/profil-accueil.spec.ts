import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilAccueil } from './profil-accueil';

describe('ProfilAccueil', () => {
  let component: ProfilAccueil;
  let fixture: ComponentFixture<ProfilAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilAccueil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilAccueil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
