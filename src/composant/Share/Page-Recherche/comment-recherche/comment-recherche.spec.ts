import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentRecherche } from './comment-recherche';

describe('CommentFonctionneSearch', () => {
  let component: CommentRecherche;
  let fixture: ComponentFixture<CommentRecherche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentRecherche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentRecherche);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
