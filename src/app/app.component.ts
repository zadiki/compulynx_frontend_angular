import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule, NgIf } from '@angular/common';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, NgIf, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'compulynx-angular';
  loaderService = inject(LoaderService);
  isLoading$: any;
  ngOnInit() {
    this.isLoading$ = this.loaderService.isLoading$;
  }
}
