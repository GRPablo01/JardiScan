import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTableauBord } from './header-tableau-bord';

describe('HeaderTableauBord', () => {
  let component: HeaderTableauBord;
  let fixture: ComponentFixture<HeaderTableauBord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTableauBord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTableauBord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
