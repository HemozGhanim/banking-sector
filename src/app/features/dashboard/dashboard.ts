import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { LabelModule } from 'primeng/label';
import { SidebarCollapsible, SidebarSide, SidebarVariant } from 'primeng/types/sidebar';
import { Sidebar } from '@primeicons/angular/sidebar';
import { ChevronDown } from '@primeicons/angular/chevron-down';
import { EllipsisV } from '@primeicons/angular/ellipsis-v';
import { PIcon } from '@primeicons/angular/p-icon';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SignOut } from '@primeicons/angular';

interface NavItem {
  icon: string;
  label: string;
  isActive?: boolean;
  badge?: string;
  route?: string;
  subItems?: { label: string; isActive?: boolean }[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  imports: [
    AvatarModule,
    SelectModule,
    SelectButtonModule,
    ToggleSwitchModule,
    SidebarModule,
    ButtonModule,
    LabelModule,
    FormsModule,
    Sidebar,
    ChevronDown,
    EllipsisV,
    PIcon,
    RouterOutlet,
    RouterLink,
    SignOut,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  router = inject(Router);

  isMobile = signal(false);
  sidebarOpen = signal(true);
  userEmail = signal(localStorage.getItem('userEmail') || '');
  firstLetter = signal(this.userEmail().charAt(0).toUpperCase());

  variant: SidebarVariant = 'inset';

  collapsible = computed<SidebarCollapsible>(() => (this.isMobile() ? 'offcanvas' : 'icon'));

  side: SidebarSide = 'left';

  overlay = computed(() => this.isMobile());

  openOnHover: boolean = false;

  navGroups: NavGroup[] = [
    {
      label: 'Management',
      items: [
        { icon: 'users', label: 'Customers', isActive: true, route: '/dashboard/customers' },
        { icon: 'dollar', label: 'Transactions', route: '/dashboard/transactions' },
      ],
    },
  ];
  constructor() {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 1023px)');
    this.isMobile.set(mql.matches);
    this.sidebarOpen.set(!mql.matches);
    mql.addEventListener('change', (e) => {
      this.isMobile.set(e.matches);
      this.sidebarOpen.set(!e.matches);
    });
  }

  hasActiveSub(item: NavItem): boolean {
    return !!item.subItems?.some((s) => s.isActive);
  }
  logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/auth']);
  }
}
  