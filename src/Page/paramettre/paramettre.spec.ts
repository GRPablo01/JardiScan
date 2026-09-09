import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paramettre } from './paramettre';

describe('Paramettre', () => {
  let component: Paramettre;
  let fixture: ComponentFixture<Paramettre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paramettre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paramettre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
