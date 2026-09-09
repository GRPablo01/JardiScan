import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBienvenue } from './header-bienvenue';

describe('HeaderBienvenue', () => {
  let component: HeaderBienvenue;
  let fixture: ComponentFixture<HeaderBienvenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBienvenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBienvenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
