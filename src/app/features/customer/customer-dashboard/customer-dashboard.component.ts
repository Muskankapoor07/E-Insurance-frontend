import { Component, inject, computed, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { Policy, UserRole } from '../../../core/models/models';

interface ActivityItem {
  title: string;
  timestamp: string;
  icon: string;
  colorClass: 'green' | 'purple' | 'blue' | 'pink';
}

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent {
  public authService = inject(AuthService);
  private insuranceService = inject(InsuranceService);

  // User details
  customerName = computed(() => {
    const full = this.authService.currentUser()?.fullName || 'Muskan';
    return full.split(' ')[0];
  });
  customerId = computed(() => this.authService.currentUser()?.customerId || 1);

  // Policies and metrics
  myPolicies = computed(() => this.insuranceService.getCustomerPolicies(this.customerId()));
  myPayments = computed(() => this.insuranceService.getPaymentsByCustomer(this.customerId()));

  activePoliciesCount = computed(() => {
    const total = this.myPolicies().length;
    return total > 0 ? total : 3;
  });

  pendingClaimsCount = signal<number>(1);

  totalPremiumPaid = computed(() => {
    const paid = this.myPayments().reduce((sum, p) => sum + (p.amount || 0), 0);
    return paid > 0 ? paid : 12500;
  });

  // Search filter
  searchQuery: string = '';
  displayedPolicies = computed(() => {
    const query = this.searchQuery.trim().toLowerCase();
    const all = this.myPolicies();
    if (!query) return all;

    return all.filter(p =>
      `pol${p.policyId}`.toLowerCase().includes(query) ||
      (p.scheme?.schemeName || '').toLowerCase().includes(query) ||
      (p.status || '').toLowerCase().includes(query)
    );
  });

  // Popovers and Dropdowns
  showNotifications = signal<boolean>(false);
  showUserDropdown = signal<boolean>(false);

  // Modals
  selectedPolicyModal = signal<Policy | null>(null);
  showClaimModal = signal<boolean>(false);
  showSupportModal = signal<boolean>(false);
  showDocumentsModal = signal<boolean>(false);
  showProfileModal = signal<boolean>(false);

  // Claim Form State
  claimForm = {
    policyId: 12345,
    type: 'Health / Hospitalization',
    amount: null as number | null,
    description: ''
  };

  // Support Form State
  supportForm = {
    topic: 'Policy Question',
    message: ''
  };

  // Recent Activities
  recentActivities: ActivityItem[] = [
    {
      title: 'Payment of ₹5,000 completed',
      timestamp: '12 Sep 2026, 10:30 AM',
      icon: 'fa-regular fa-credit-card',
      colorClass: 'green'
    },
    {
      title: 'Claim request submitted',
      timestamp: '10 Sep 2026, 02:15 PM',
      icon: 'fa-regular fa-file-lines',
      colorClass: 'purple'
    },
    {
      title: 'Policy renewed',
      timestamp: '05 Sep 2026, 11:20 AM',
      icon: 'fa-solid fa-rotate',
      colorClass: 'blue'
    },
    {
      title: 'Profile updated',
      timestamp: '01 Sep 2026, 09:45 AM',
      icon: 'fa-regular fa-user',
      colorClass: 'pink'
    }
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

  filterPolicies(): void {
    // Computed displayedPolicies updates automatically
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  switchRole(role: UserRole): void {
    this.closePopovers();
    this.authService.switchPersona(role);
  }

  logout(): void {
    this.closePopovers();
    this.authService.logout();
  }

  // Friendly Plan Type Name helper matching mockup ("Health Insurance", "Vehicle Insurance", "Life Insurance")
  getPlanTypeName(policy?: Policy | null): string {
    if (!policy) return 'Insurance Plan';
    const scheme = policy.scheme?.schemeName?.toLowerCase() || '';
    const details = (policy.policyDetails || '').toLowerCase();

    if (scheme.includes('health') || details.includes('health')) {
      return 'Health Insurance';
    }
    if (scheme.includes('motor') || scheme.includes('vehicle') || details.includes('vehicle') || details.includes('car')) {
      return 'Vehicle Insurance';
    }
    if (scheme.includes('term') || scheme.includes('life') || scheme.includes('pension') || details.includes('life')) {
      return 'Life Insurance';
    }
    return policy.scheme?.schemeName || 'Insurance Scheme';
  }

  // Format date helper: "2026-01-01" -> "01 Jan 2026"
  formatDate(dateStr?: string): string {
    if (!dateStr) return '01 Jan 2026';
    try {
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parts[2].padStart(2, '0');
        return `${day} ${months[monthIndex] || 'Jan'} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  // Modal actions
  viewPolicy(policy: Policy): void {
    this.selectedPolicyModal.set(policy);
  }

  openClaimModal(): void {
    const policies = this.myPolicies();
    if (policies.length > 0) {
      this.claimForm.policyId = policies[0].policyId;
    }
    this.showClaimModal.set(true);
  }

  openSupportModal(): void {
    this.showSupportModal.set(true);
  }

  openDocumentsModal(): void {
    this.showDocumentsModal.set(true);
  }

  openProfileModal(): void {
    this.showProfileModal.set(true);
  }

  closeModals(): void {
    this.selectedPolicyModal.set(null);
    this.showClaimModal.set(false);
    this.showSupportModal.set(false);
    this.showDocumentsModal.set(false);
    this.showProfileModal.set(false);
  }

  submitClaim(): void {
    if (!this.claimForm.amount || this.claimForm.amount <= 0) {
      alert('Please enter a valid claim amount.');
      return;
    }

    // Add to activity list
    const newActivity: ActivityItem = {
      title: `Claim of ₹${this.claimForm.amount.toLocaleString()} submitted for POL${this.claimForm.policyId}`,
      timestamp: 'Just now',
      icon: 'fa-regular fa-file-lines',
      colorClass: 'purple'
    };
    this.recentActivities.unshift(newActivity);
    this.pendingClaimsCount.update(c => c + 1);

    alert(`Claim submitted successfully for Policy #POL${this.claimForm.policyId}. Reference ID: CLM-${Math.floor(1000 + Math.random() * 9000)}. Our audit team will review it shortly.`);

    this.claimForm.amount = null;
    this.claimForm.description = '';
    this.closeModals();
  }

  sendSupportMessage(): void {
    if (!this.supportForm.message.trim()) {
      alert('Please enter your query message.');
      return;
    }

    alert('Your query has been submitted to E-Insurance Customer Care. An executive will get back to you within 2 business hours.');
    this.supportForm.message = '';
    this.closeModals();
  }

  downloadCertificate(): void {
    alert('Downloading verified policy certificate (PDF)...');
  }
}
