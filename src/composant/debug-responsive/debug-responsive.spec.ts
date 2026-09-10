import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugResponsive } from './debug-responsive';

describe('DebugResponsive', () => {
  let component: DebugResponsive;
  let fixture: ComponentFixture<DebugResponsive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugResponsive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugResponsive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
