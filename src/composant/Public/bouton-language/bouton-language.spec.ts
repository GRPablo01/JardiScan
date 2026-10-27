import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutonLanguage } from './bouton-language';

describe('BoutonLanguage', () => {
  let component: BoutonLanguage;
  let fixture: ComponentFixture<BoutonLanguage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutonLanguage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutonLanguage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
