import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Decouvrir } from './decouvrir';

describe('Decouvrir', () => {
  let component: Decouvrir;
  let fixture: ComponentFixture<Decouvrir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Decouvrir]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Decouvrir);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
