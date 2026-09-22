import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { UserRole } from '../../../core/models/models';

interface RecentCustomer {
  name: string;
  policyType: string;
  date: string;
  status: 'Active' | 'Pending';
}

interface AgentActivity {
  title: string;
  timestamp: string;
  icon: string;
  colorClass: 'green' | 'blue' | 'amber' | 'purple';
}

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.css'
})
export class AgentDashboardComponent {
  public authService = inject(AuthService);
  public insuranceService = inject(InsuranceService);

  showNotifications = signal<boolean>(false);
  showUserDropdown = signal<boolean>(false);

  selectedCustomerModal = signal<RecentCustomer | null>(null);
  showAddCustomerModal = signal<boolean>(false);
  showSellPolicyModal = signal<boolean>(false);
  showFollowupModal = signal<boolean>(false);

  newCustomerName = '';
  newCustomerEmail = '';

  recentCustomers: RecentCustomer[] = [
    { name: 'Rohan Mehta', policyType: 'Health Insurance', date: '12 Sep 2026', status: 'Active' },
    { name: 'Priya Sharma', policyType: 'Life Insurance', date: '10 Sep 2026', status: 'Active' },
    { name: 'Amit Verma', policyType: 'Vehicle Insurance', date: '08 Sep 2026', status: 'Pending' },
    { name: 'Neha Kapoor', policyType: 'Health Insurance', date: '05 Sep 2026', status: 'Active' }
  ];

  recentActivities: AgentActivity[] = [
    { title: 'Policy sold to Rohan Mehta', timestamp: '12 Sep 2026, 10:30 AM', icon: 'fa-regular fa-file-lines', colorClass: 'green' },
    { title: 'New customer added: Priya Sharma', timestamp: '10 Sep 2026, 02:15 PM', icon: 'fa-solid fa-user-plus', colorClass: 'blue' },
    { title: 'Claim request submitted for Amit Verma', timestamp: '08 Sep 2026, 11:20 AM', icon: 'fa-solid fa-shield-halved', colorClass: 'amber' },
    { title: 'Follow-up scheduled with Neha Kapoor', timestamp: '05 Sep 2026, 09:45 AM', icon: 'fa-regular fa-calendar-days', colorClass: 'purple' }
  ];

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closePopovers();
  }

  toggleNotifications(): void {
    this.showNotifications.update(val => !val);
    this.showUserDropdown.set(false);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(val => !val);
    this.showNotifications.set(false);
  }

  closePopovers(): void {
    this.showNotifications.set(false);
    this.showUserDropdown.set(false);
  }

  switchRole(role: UserRole): void {
    this.closePopovers();
    this.authService.switchPersona(role);
  }

  logout(): void {
    this.closePopovers();
    this.authService.logout();
  }

  viewCustomer(c: RecentCustomer): void {
    this.selectedCustomerModal.set(c);
  }

  openAddCustomerModal(): void {
    this.showAddCustomerModal.set(true);
  }

  openSellPolicyModal(): void {
    this.showSellPolicyModal.set(true);
  }

  openClaimModal(): void {
    alert('Assisting client with insurance claim. Opening claim filing engine...');
  }

  openFollowupModal(): void {
    this.showFollowupModal.set(true);
  }

  openProfileModal(): void {
    alert('Agent Profile: Suresh Patel | ID: #AGT-001 | Registered IRDAI Advisor');
  }

  openCommissionsModal(): void {
    alert('Total Agent Commissions: ₹48,500 across 15 active client policies.');
  }

  closeModals(): void {
    this.selectedCustomerModal.set(null);
    this.showAddCustomerModal.set(false);
    this.showSellPolicyModal.set(false);
    this.showFollowupModal.set(false);
  }

  addNewCustomer(): void {
    if (!this.newCustomerName.trim()) {
      alert('Please enter client name.');
      return;
    }
    this.recentCustomers.unshift({
      name: this.newCustomerName,
      policyType: 'Pending Enrollment',
      date: 'Today',
      status: 'Pending'
    });
    this.recentActivities.unshift({
      title: `New customer added: ${this.newCustomerName}`,
      timestamp: 'Just now',
      icon: 'fa-solid fa-user-plus',
      colorClass: 'blue'
    });
    alert(`Customer ${this.newCustomerName} successfully onboarded.`);
    this.newCustomerName = '';
    this.newCustomerEmail = '';
    this.closeModals();
  }

  sellPolicySuccess(): void {
    this.recentActivities.unshift({
      title: 'Policy sale processed successfully',
      timestamp: 'Just now',
      icon: 'fa-regular fa-file-lines',
      colorClass: 'green'
    });
    alert('Policy sold! 10% commission credited to your agent payout wallet.');
    this.closeModals();
  }

  scheduleFollowupSuccess(): void {
    this.recentActivities.unshift({
      title: 'Follow-up appointment booked',
      timestamp: 'Just now',
      icon: 'fa-regular fa-calendar-days',
      colorClass: 'purple'
    });
    alert('Follow-up scheduled with client. Reminder email dispatched.');
    this.closeModals();
  }
}
