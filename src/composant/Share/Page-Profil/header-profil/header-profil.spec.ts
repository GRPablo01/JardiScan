import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderProfil } from './header-profil';

describe('HeaderProfil', () => {
  let component: HeaderProfil;
  let fixture: ComponentFixture<HeaderProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
