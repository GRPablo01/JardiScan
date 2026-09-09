import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanerPlante } from './scaner-plante';

describe('ScanerPlante', () => {
  let component: ScanerPlante;
  let fixture: ComponentFixture<ScanerPlante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanerPlante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanerPlante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
