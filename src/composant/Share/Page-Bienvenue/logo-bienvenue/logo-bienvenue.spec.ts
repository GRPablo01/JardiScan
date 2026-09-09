import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoBienvenue } from './logo-bienvenue';

describe('LogoBienvenue', () => {
  let component: LogoBienvenue;
  let fixture: ComponentFixture<LogoBienvenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoBienvenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoBienvenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
