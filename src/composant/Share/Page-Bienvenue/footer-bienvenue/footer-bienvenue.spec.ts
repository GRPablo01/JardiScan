import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBienvenue } from './footer-bienvenue';

describe('FooterBienvenue', () => {
  let component: FooterBienvenue;
  let fixture: ComponentFixture<FooterBienvenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterBienvenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterBienvenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
