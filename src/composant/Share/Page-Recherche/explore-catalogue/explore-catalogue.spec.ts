import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreCatalogue } from './explore-catalogue';

describe('ExploreCatalogue', () => {
  let component: ExploreCatalogue;
  let fixture: ComponentFixture<ExploreCatalogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreCatalogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreCatalogue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
