import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';

import { SettingsStore } from '../state/settings.store';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, MatIconModule, MatSlideToggleModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  readonly settingsStore = inject(SettingsStore);
}
