import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pourquoi } from './pourquoi';

describe('Pourquoi', () => {
  let component: Pourquoi;
  let fixture: ComponentFixture<Pourquoi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pourquoi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pourquoi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
