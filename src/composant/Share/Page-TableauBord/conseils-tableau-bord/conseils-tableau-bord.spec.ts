import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConseilsTableauBord } from './conseils-tableau-bord';

describe('ConseilsTableauBord', () => {
  let component: ConseilsTableauBord;
  let fixture: ComponentFixture<ConseilsTableauBord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConseilsTableauBord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConseilsTableauBord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
