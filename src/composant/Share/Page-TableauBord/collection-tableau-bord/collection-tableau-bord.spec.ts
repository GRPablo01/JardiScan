import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTableauBord } from './collection-tableau-bord';

describe('CollectionTableauBord', () => {
  let component: CollectionTableauBord;
  let fixture: ComponentFixture<CollectionTableauBord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionTableauBord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionTableauBord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
