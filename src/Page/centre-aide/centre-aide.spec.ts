import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreAide } from './centre-aide';

describe('CentreAide', () => {
  let component: CentreAide;
  let fixture: ComponentFixture<CentreAide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentreAide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreAide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
