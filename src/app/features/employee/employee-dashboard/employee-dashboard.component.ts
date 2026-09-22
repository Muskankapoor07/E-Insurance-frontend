import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { UserRole } from '../../../core/models/models';

interface EmployeeTask {
  task: string;
  customerName: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface EmployeeActivity {
  title: string;
  timestamp: string;
  icon: string;
  colorClass: 'green' | 'blue' | 'amber' | 'purple';
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {
  public authService = inject(AuthService);
  public insuranceService = inject(InsuranceService);

  showNotifications = signal<boolean>(false);
  showUserDropdown = signal<boolean>(false);

  selectedTaskModal = signal<EmployeeTask | null>(null);
  showProcessClaimModal = signal<boolean>(false);
  showContactAdminModal = signal<boolean>(false);

  myTasks: EmployeeTask[] = [
    { task: 'Verify Documents', customerName: 'Rohan Sharma', dueDate: '12 Sep 2026', status: 'Pending' },
    { task: 'Process Claim', customerName: 'Priya Verma', dueDate: '13 Sep 2026', status: 'In Progress' },
    { task: 'Update Policy Details', customerName: 'Amit Kumar', dueDate: '15 Sep 2026', status: 'Pending' },
    { task: 'Customer Follow-up', customerName: 'Neha Singh', dueDate: '16 Sep 2026', status: 'Completed' }
  ];

  recentActivities: EmployeeActivity[] = [
    { title: 'Policy verified for Rohan Sharma', timestamp: '12 Sep 2026, 10:30 AM', icon: 'fa-regular fa-file-lines', colorClass: 'green' },
    { title: 'Claim processed for Priya Verma', timestamp: '11 Sep 2026, 02:15 PM', icon: 'fa-solid fa-shield-halved', colorClass: 'blue' },
    { title: 'Customer query resolved for Amit Kumar', timestamp: '10 Sep 2026, 11:20 AM', icon: 'fa-regular fa-user', colorClass: 'amber' },
    { title: 'Policy details updated for Neha Singh', timestamp: '09 Sep 2026, 04:45 PM', icon: 'fa-regular fa-file-lines', colorClass: 'purple' }
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

  viewTask(t: EmployeeTask): void {
    this.selectedTaskModal.set(t);
  }

  markTaskDone(t: EmployeeTask | null): void {
    if (!t) return;
    t.status = 'Completed';
    this.recentActivities.unshift({
      title: `Task completed: ${t.task} (${t.customerName})`,
      timestamp: 'Just now',
      icon: 'fa-solid fa-clipboard-check',
      colorClass: 'green'
    });
    alert(`Task '${t.task}' marked as Completed.`);
    this.closeModals();
  }

  openProcessClaimModal(): void {
    this.showProcessClaimModal.set(true);
  }

  openSearchCustomerModal(): void {
    alert('Search Customer: Lookup customer KYC, active policies and claim audit status.');
  }

  openUpdatePolicyModal(): void {
    alert('Update Policy: Policy tenure endorsement and rider addition wizard opened.');
  }

  openSendNotificationModal(): void {
    alert('Notification dispatched to selected customer inbox and SMS gateway.');
  }

  openTasksModal(): void {
    alert('Operational Queue: 3 tasks pending, 1 in-progress, 1 completed today.');
  }

  openProfileModal(): void {
    alert('Employee Profile: Vikram Singh | Operations Underwriting Specialist | Employee #EMP-001');
  }

  openContactAdminModal(): void {
    this.showContactAdminModal.set(true);
  }

  closeModals(): void {
    this.selectedTaskModal.set(null);
    this.showProcessClaimModal.set(false);
    this.showContactAdminModal.set(false);
  }

  approveClaimSuccess(): void {
    this.recentActivities.unshift({
      title: 'Claim underwritten and approved for Priya Verma',
      timestamp: 'Just now',
      icon: 'fa-solid fa-shield-halved',
      colorClass: 'blue'
    });
    alert('Claim approved! Forwarded to finance desk for disbursement.');
    this.closeModals();
  }

  sendAdminMessage(): void {
    alert('Escalation message transmitted to Super Admin console.');
    this.closeModals();
  }
}
