import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Saison } from './saison';

describe('Saison', () => {
  let component: Saison;
  let fixture: ComponentFixture<Saison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Saison]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Saison);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
