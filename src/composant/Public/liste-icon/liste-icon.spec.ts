import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeIcon } from './liste-icon';

describe('ListeIcon', () => {
  let component: ListeIcon;
  let fixture: ComponentFixture<ListeIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
