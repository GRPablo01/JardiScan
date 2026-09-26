import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilMesPlant } from './profil-mes-plant';

describe('ProfilMesPlant', () => {
  let component: ProfilMesPlant;
  let fixture: ComponentFixture<ProfilMesPlant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilMesPlant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilMesPlant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
