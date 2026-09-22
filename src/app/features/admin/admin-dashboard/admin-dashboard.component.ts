import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { UserRole } from '../../../core/models/models';

interface RecentUser {
  name: string;
  email: string;
  role: 'Customer' | 'Agent' | 'Employee' | 'Admin';
  joinedDate: string;
  status: 'Active' | 'Inactive';
}

interface PendingClaim {
  claimId: string;
  customer: string;
  type: string;
  amount: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  public authService = inject(AuthService);
  public insuranceService = inject(InsuranceService);

  showNotifications = signal<boolean>(false);
  showUserDropdown = signal<boolean>(false);

  selectedUserModal = signal<RecentUser | null>(null);
  showClaimsModal = signal<boolean>(false);
  showReportsModal = signal<boolean>(false);
  showProfileModal = signal<boolean>(false);

  recentUsers: RecentUser[] = [
    { name: 'Rohan Sharma', email: 'rohan@example.com', role: 'Customer', joinedDate: '01 Sep 2026', status: 'Active' },
    { name: 'Priya Verma', email: 'priya@example.com', role: 'Agent', joinedDate: '28 Aug 2026', status: 'Active' },
    { name: 'Amit Kumar', email: 'amit@example.com', role: 'Customer', joinedDate: '25 Aug 2026', status: 'Active' },
    { name: 'Neha Singh', email: 'neha@example.com', role: 'Customer', joinedDate: '20 Aug 2026', status: 'Inactive' },
    { name: 'Simran Kaur', email: 'simran@example.com', role: 'Agent', joinedDate: '12 Aug 2026', status: 'Active' }
  ];

  pendingClaims: PendingClaim[] = [
    { claimId: 'CLM-8102', customer: 'Rohan Sharma', type: 'Health Reimbursement', amount: 25000 },
    { claimId: 'CLM-7901', customer: 'Amit Kumar', type: 'Accidental Vehicle Repair', amount: 18500 },
    { claimId: 'CLM-7430', customer: 'Sneha Kulkarni', type: 'Daycare Surgery', amount: 42000 }
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

  viewUserDetails(u: RecentUser): void {
    this.selectedUserModal.set(u);
  }

  toggleUserStatus(): void {
    const current = this.selectedUserModal();
    if (!current) return;
    current.status = current.status === 'Active' ? 'Inactive' : 'Active';
    alert(`Status updated for ${current.name} to ${current.status}`);
  }

  openClaimsModal(): void {
    this.showClaimsModal.set(true);
  }

  openReportsModal(): void {
    this.showReportsModal.set(true);
  }

  openProfileModal(): void {
    this.showProfileModal.set(true);
  }

  closeModals(): void {
    this.selectedUserModal.set(null);
    this.showClaimsModal.set(false);
    this.showReportsModal.set(false);
    this.showProfileModal.set(false);
  }

  approveClaim(claimId: string): void {
    this.pendingClaims = this.pendingClaims.filter(c => c.claimId !== claimId);
    alert(`Claim #${claimId} approved and sent for settlement.`);
    if (this.pendingClaims.length === 0) {
      this.closeModals();
    }
  }
}
