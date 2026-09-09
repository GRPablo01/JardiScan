import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailleEcran } from './taille-ecran';

describe('TailleEcran', () => {
  let component: TailleEcran;
  let fixture: ComponentFixture<TailleEcran>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailleEcran]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailleEcran);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
