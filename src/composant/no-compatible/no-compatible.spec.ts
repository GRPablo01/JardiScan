import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCompatible } from './no-compatible';

describe('NoCompatible', () => {
  let component: NoCompatible;
  let fixture: ComponentFixture<NoCompatible>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoCompatible]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCompatible);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
