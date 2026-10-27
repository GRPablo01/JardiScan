import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Language2 } from './language';

describe('Language', () => {
  let component: Language2;
  let fixture: ComponentFixture<Language2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Language2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Language2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
