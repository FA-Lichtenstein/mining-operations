import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SyntheticDataDisclaimerComponent } from './shared/synthetic-data-disclaimer/synthetic-data-disclaimer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SyntheticDataDisclaimerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
