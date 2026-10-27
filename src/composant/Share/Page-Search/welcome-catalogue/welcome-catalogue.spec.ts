import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeCatalogue } from './welcome-catalogue';

describe('WelcomeCatalogue', () => {
  let component: WelcomeCatalogue;
  let fixture: ComponentFixture<WelcomeCatalogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeCatalogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeCatalogue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
