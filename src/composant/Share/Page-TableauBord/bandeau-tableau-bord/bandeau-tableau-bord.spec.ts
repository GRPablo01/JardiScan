import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandeauTableauBord } from './bandeau-tableau-bord';

describe('BandeauTableauBord', () => {
  let component: BandeauTableauBord;
  let fixture: ComponentFixture<BandeauTableauBord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandeauTableauBord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BandeauTableauBord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
