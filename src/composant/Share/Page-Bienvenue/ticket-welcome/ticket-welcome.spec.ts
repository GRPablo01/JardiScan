import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketWelcome } from './ticket-welcome';

describe('TicketWelcome', () => {
  let component: TicketWelcome;
  let fixture: ComponentFixture<TicketWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
