import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Diagnostiquer } from './diagnostiquer';

describe('Diagnostiquer', () => {
  let component: Diagnostiquer;
  let fixture: ComponentFixture<Diagnostiquer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diagnostiquer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Diagnostiquer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
