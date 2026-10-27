import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rechercher } from './rechercher';

describe('Rechercher', () => {
  let component: Rechercher;
  let fixture: ComponentFixture<Rechercher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rechercher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rechercher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
