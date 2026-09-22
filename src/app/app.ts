import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('E-Insurance Portal');
  private router = inject(Router);

  private currentUrlSignal = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  isDashboardView = computed(() => {
    const url = this.currentUrlSignal() || '';
    return (
      url.includes('/customer/dashboard') ||
      url.includes('/admin/dashboard') ||
      url.includes('/agent/dashboard') ||
      url.includes('/employee/dashboard') ||
      url === '/' ||
      url === ''
    );
  });
}
