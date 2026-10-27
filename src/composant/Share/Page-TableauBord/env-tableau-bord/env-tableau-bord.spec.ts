import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvTableauBord } from './env-tableau-bord';

describe('EnvTableauBord', () => {
  let component: EnvTableauBord;
  let fixture: ComponentFixture<EnvTableauBord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvTableauBord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvTableauBord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
