import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tableaubord } from './tableaubord';

describe('Tableaubord', () => {
  let component: Tableaubord;
  let fixture: ComponentFixture<Tableaubord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tableaubord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tableaubord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
