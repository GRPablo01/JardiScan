import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


@Component({
  selector: 'app-welcome-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome-notifications.html',
  styleUrl: './welcome-notifications.css'
})
export class WelcomeNotifications {
  @Input() nombreNotifications = 0;

  constructor(public themeService: ThemeService) {}
}