import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotAssistant } from './bot-assistant';

describe('BotAssistant', () => {
  let component: BotAssistant;
  let fixture: ComponentFixture<BotAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
