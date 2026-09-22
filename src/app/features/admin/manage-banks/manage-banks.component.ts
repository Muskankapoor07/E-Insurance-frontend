import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService } from '../../../core/services/insurance.service';
import { Bank } from '../../../core/models/models';

@Component({
  selector: 'app-manage-banks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-building-columns text-primary"></i> Bank Account & Payout Gateway Management
          </h1>
          <p class="page-subtitle">Administer corporate banks, premium collection escrow accounts, and agent payout gateways.</p>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()">
          <i class="fa-solid fa-plus"></i> Add Partner Bank
        </button>
      </div>

      <!-- Bank Cards Grid -->
      <div class="grid-2 mb-4">
        <div class="card bank-card" *ngFor="let b of banks()">
          <div class="bank-top">
            <div class="bank-icon-box">
              <i class="fa-solid fa-building-columns"></i>
            </div>
            <div class="bank-title-box">
              <h3 class="bank-name">{{ b.bankName }}</h3>
              <span class="badge" [ngClass]="b.status === 'Active' ? 'badge-success' : 'badge-neutral'">
                {{ b.status }}
              </span>
            </div>
          </div>

          <div class="bank-specs">
            <div class="spec-row">
              <span class="spec-lbl">Account Number:</span>
              <code class="spec-val">{{ b.accountNumber }}</code>
            </div>
            <div class="spec-row">
              <span class="spec-lbl">IFSC Code:</span>
              <strong class="spec-val text-primary">{{ b.ifscCode }}</strong>
            </div>
            <div class="spec-row">
              <span class="spec-lbl">Branch Location:</span>
              <span class="spec-val">{{ b.branch }}</span>
            </div>
          </div>

          <div class="bank-actions mt-3">
            <button class="btn btn-sm btn-outline" (click)="editBank(b)">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button
              class="btn btn-sm"
              [ngClass]="b.status === 'Active' ? 'btn-secondary' : 'btn-teal'"
              (click)="toggleStatus(b)">
              {{ b.status === 'Active' ? 'Deactivate' : 'Activate' }}
            </button>
            <button class="btn btn-sm btn-danger" (click)="deleteBank(b.bankId)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- ADD / EDIT BANK MODAL -->
      <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa-solid fa-building-columns text-primary"></i>
              {{ isEditing() ? 'Edit Bank Account' : 'Register New Partner Bank' }}
            </h3>
            <button class="modal-close" (click)="closeModal()">&times;</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Bank Institution Name</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="bankForm.bankName"
                placeholder="e.g. State Bank of India"
                required />
            </div>

            <div class="form-group">
              <label class="form-label">Account Number</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="bankForm.accountNumber"
                placeholder="e.g. 30992817291"
                required />
            </div>

            <div class="form-group">
              <label class="form-label">IFSC Routing Code</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="bankForm.ifscCode"
                placeholder="e.g. SBIN0001824"
                required />
            </div>

            <div class="form-group">
              <label class="form-label">Branch City & Details</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="bankForm.branch"
                placeholder="e.g. MG Road Corporate Branch, Bengaluru" />
            </div>

            <div class="form-group">
              <label class="form-label">Account Operational Status</label>
              <select class="form-select" [(ngModel)]="bankForm.status">
                <option value="Active">Active (Accepting Collections & Payouts)</option>
                <option value="Inactive">Inactive (Maintenance)</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveBank()">
              <i class="fa-solid fa-check"></i> {{ isEditing() ? 'Update Account' : 'Save Account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-3 { margin-top: 1rem; }
    .text-primary { color: var(--primary-600); }

    .bank-card {
      border: 1px solid var(--slate-200);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .bank-top {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .bank-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--primary-50);
      color: var(--primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
    }

    .bank-title-box {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bank-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--slate-900);
    }

    .bank-specs {
      background: var(--slate-50);
      padding: 0.85rem;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }

    .spec-lbl {
      color: var(--slate-500);
    }

    .spec-val {
      font-weight: 600;
      color: var(--slate-800);
    }

    .bank-actions {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class ManageBanksComponent {
  private insuranceService = inject(InsuranceService);

  banks = this.insuranceService.banks;
  showModal = signal(false);
  isEditing = signal(false);
  editingBankId = signal<number | null>(null);

  bankForm = {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    status: 'Active' as 'Active' | 'Inactive'
  };

  openAddModal(): void {
    this.isEditing.set(false);
    this.editingBankId.set(null);
    this.bankForm = {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      status: 'Active'
    };
    this.showModal.set(true);
  }

  editBank(bank: Bank): void {
    this.isEditing.set(true);
    this.editingBankId.set(bank.bankId);
    this.bankForm = {
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      branch: bank.branch,
      status: bank.status
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveBank(): void {
    if (!this.bankForm.bankName || !this.bankForm.accountNumber || !this.bankForm.ifscCode) {
      alert('Please enter Bank Name, Account Number and IFSC Code!');
      return;
    }

    if (this.isEditing() && this.editingBankId()) {
      this.insuranceService.updateBank(this.editingBankId()!, this.bankForm);
    } else {
      this.insuranceService.addBank(this.bankForm);
    }

    this.closeModal();
  }

  toggleStatus(bank: Bank): void {
    const newStatus = bank.status === 'Active' ? 'Inactive' : 'Active';
    this.insuranceService.updateBank(bank.bankId, { status: newStatus });
  }

  deleteBank(bankId: number): void {
    if (confirm('Are you sure you want to remove this bank account?')) {
      this.insuranceService.deleteBank(bankId);
    }
  }
}
