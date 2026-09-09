import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutonBienvenue } from './bouton-bienvenue';

describe('BoutonBienvenue', () => {
  let component: BoutonBienvenue;
  let fixture: ComponentFixture<BoutonBienvenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutonBienvenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutonBienvenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
