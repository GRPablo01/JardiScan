import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaCollection } from './ma-collection';

describe('MaCollection', () => {
  let component: MaCollection;
  let fixture: ComponentFixture<MaCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
