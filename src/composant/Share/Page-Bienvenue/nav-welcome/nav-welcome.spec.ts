import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavWelcome } from './nav-welcome';

describe('NavWelcome', () => {
  let component: NavWelcome;
  let fixture: ComponentFixture<NavWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
