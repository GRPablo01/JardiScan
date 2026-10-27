import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocAnnoce } from './bloc-annoce';

describe('BlocAnnoce', () => {
  let component: BlocAnnoce;
  let fixture: ComponentFixture<BlocAnnoce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocAnnoce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocAnnoce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
