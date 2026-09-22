import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService } from '../../../core/services/insurance.service';
import { Customer, InsuranceAgent, Employee, Admin, UserRole } from '../../../core/models/models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-users-gear text-primary"></i> User Management (Admin)
          </h1>
          <p class="page-subtitle">Full CRUD controls for Customers, Insurance Agents, Employees, and Admin profiles.</p>
        </div>
        <button class="btn btn-primary" (click)="openAddUserModal()">
          <i class="fa-solid fa-user-plus"></i> Add New User
        </button>
      </div>

      <!-- Tab Switcher -->
      <div class="user-tabs mb-4">
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'CUSTOMERS'"
          (click)="activeTab.set('CUSTOMERS')">
          <i class="fa-solid fa-user"></i> Customers ({{ customers().length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'AGENTS'"
          (click)="activeTab.set('AGENTS')">
          <i class="fa-solid fa-user-tie"></i> Insurance Agents ({{ agents().length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'EMPLOYEES'"
          (click)="activeTab.set('EMPLOYEES')">
          <i class="fa-solid fa-id-card"></i> Company Employees ({{ employees().length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'ADMINS'"
          (click)="activeTab.set('ADMINS')">
          <i class="fa-solid fa-user-shield"></i> Admins ({{ admins().length }})
        </button>
      </div>

      <!-- Search bar -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            class="search-input"
            [(ngModel)]="searchQuery"
            placeholder="Filter users by name or email..." />
        </div>
      </div>

      <!-- CUSTOMERS TABLE -->
      <div class="card" *ngIf="activeTab() === 'CUSTOMERS'">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Assigned Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filteredCustomers()">
                <td><strong>#CUST-{{ c.customerId }}</strong></td>
                <td class="font-bold">{{ c.fullName }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.phone }}</td>
                <td>{{ c.dateOfBirth }}</td>
                <td>
                  <span class="badge badge-info" *ngIf="c.agentId; else noAgentBadge">
                    {{ getAgentName(c.agentId) }}
                  </span>
                  <ng-template #noAgentBadge>
                    <span class="badge badge-neutral">Direct</span>
                  </ng-template>
                </td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline" (click)="editCustomer(c)">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteCustomer(c.customerId)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- AGENTS TABLE -->
      <div class="card" *ngIf="activeTab() === 'AGENTS'">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Total Earned</th>
                <th>Assigned Clients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of filteredAgents()">
                <td><strong>#AGT-{{ a.agentId }}</strong></td>
                <td><code>{{ a.username }}</code></td>
                <td class="font-bold">{{ a.fullName }}</td>
                <td>{{ a.email }}</td>
                <td class="text-teal font-bold">₹{{ a.totalCommissions || 35000 | number }}</td>
                <td>
                  <span class="badge badge-primary">
                    {{ getAgentClientsCount(a.agentId) }} Clients
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-danger" (click)="deleteAgent(a.agentId)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- EMPLOYEES TABLE -->
      <div class="card" *ngIf="activeTab() === 'EMPLOYEES'">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department / Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of filteredEmployees()">
                <td><strong>#EMP-{{ e.employeeId }}</strong></td>
                <td><code>{{ e.username }}</code></td>
                <td class="font-bold">{{ e.fullName }}</td>
                <td>{{ e.email }}</td>
                <td><span class="badge badge-info">{{ e.role }}</span></td>
                <td>
                  <button class="btn btn-sm btn-danger" (click)="deleteEmployee(e.employeeId)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ADMINS TABLE -->
      <div class="card" *ngIf="activeTab() === 'ADMINS'">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Admin ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role Authority</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let adm of admins()">
                <td><strong>#ADM-{{ adm.adminId }}</strong></td>
                <td><code>{{ adm.username }}</code></td>
                <td class="font-bold">{{ adm.fullName }}</td>
                <td>{{ adm.email }}</td>
                <td><span class="badge badge-active">SUPER ADMIN</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ADD / EDIT USER MODAL -->
      <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa-solid fa-user-gear text-primary"></i>
              {{ editMode() ? 'Edit User' : 'Create New User' }}
            </h3>
            <button class="modal-close" (click)="closeModal()">&times;</button>
          </div>

          <div class="modal-body">
            <div class="form-group" *ngIf="!editMode()">
              <label class="form-label">User Category</label>
              <select class="form-select" [(ngModel)]="newUser.role">
                <option value="CUSTOMER">Customer</option>
                <option value="AGENT">Insurance Agent</option>
                <option value="EMPLOYEE">Company Employee</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="newUser.fullName" required placeholder="e.g. Ramesh Kumar" />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" [(ngModel)]="newUser.email" required placeholder="e.g. ramesh@example.com" />
            </div>

            <div class="form-group" *ngIf="newUser.role === 'CUSTOMER'">
              <label class="form-label">Phone Number</label>
              <input type="text" class="form-control" [(ngModel)]="newUser.phone" placeholder="+91 98765 43210" />
            </div>

            <div class="form-group" *ngIf="newUser.role === 'CUSTOMER'">
              <label class="form-label">Date of Birth</label>
              <input type="date" class="form-control" [(ngModel)]="newUser.dateOfBirth" />
            </div>

            <div class="form-group" *ngIf="newUser.role === 'CUSTOMER'">
              <label class="form-label">Assign to Insurance Agent</label>
              <select class="form-select" [(ngModel)]="newUser.agentId">
                <option [value]="null">Direct (No Agent)</option>
                <option *ngFor="let a of agents()" [value]="a.agentId">{{ a.fullName }}</option>
              </select>
            </div>

            <div class="form-group" *ngIf="newUser.role === 'EMPLOYEE'">
              <label class="form-label">Employee Role / Job Title</label>
              <input type="text" class="form-control" [(ngModel)]="newUser.jobRole" placeholder="e.g. Underwriter" />
            </div>

            <div class="form-group" *ngIf="newUser.role !== 'CUSTOMER'">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" [(ngModel)]="newUser.username" placeholder="e.g. ramesh_emp" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveUser()">
              <i class="fa-solid fa-check"></i> {{ editMode() ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary-600); }
    .text-teal { color: var(--teal-600); }

    .user-tabs {
      display: flex;
      gap: 0.5rem;
      background: #ffffff;
      padding: 0.5rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--slate-200);
      flex-wrap: wrap;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.1rem;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--slate-600);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: var(--slate-100);
      color: var(--slate-900);
    }

    .tab-btn.active {
      background: var(--primary-600);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.35);
    }

    .btn-group {
      display: flex;
      gap: 0.4rem;
    }
  `]
})
export class ManageUsersComponent {
  private insuranceService = inject(InsuranceService);

  customers = this.insuranceService.customers;
  agents = this.insuranceService.agents;
  employees = this.insuranceService.employees;
  admins = this.insuranceService.admins;

  activeTab = signal<'CUSTOMERS' | 'AGENTS' | 'EMPLOYEES' | 'ADMINS'>('CUSTOMERS');
  searchQuery = '';

  showModal = signal(false);
  editMode = signal(false);
  editingCustomerId = signal<number | null>(null);

  newUser = {
    role: 'CUSTOMER' as UserRole,
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '1995-01-01',
    agentId: null as number | null,
    jobRole: 'Underwriter',
    username: ''
  };

  filteredCustomers = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.customers();
    return this.customers().filter(c =>
      c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  });

  filteredAgents = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.agents();
    return this.agents().filter(a =>
      a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  });

  filteredEmployees = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.employees();
    return this.employees().filter(e =>
      e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
    );
  });

  getAgentName(agentId: number): string {
    return this.agents().find(a => a.agentId === agentId)?.fullName || 'Agent #' + agentId;
  }

  getAgentClientsCount(agentId: number): number {
    return this.insuranceService.getAgentCustomers(agentId).length;
  }

  openAddUserModal(): void {
    this.editMode.set(false);
    this.editingCustomerId.set(null);
    this.newUser = {
      role: 'CUSTOMER',
      fullName: '',
      email: '',
      phone: '+91 9',
      dateOfBirth: '1995-01-01',
      agentId: 1,
      jobRole: 'Underwriter',
      username: ''
    };
    this.showModal.set(true);
  }

  editCustomer(c: Customer): void {
    this.editMode.set(true);
    this.editingCustomerId.set(c.customerId);
    this.newUser.fullName = c.fullName;
    this.newUser.email = c.email;
    this.newUser.phone = c.phone;
    this.newUser.dateOfBirth = c.dateOfBirth;
    this.newUser.agentId = c.agentId || null;
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveUser(): void {
    if (!this.newUser.fullName || !this.newUser.email) {
      alert('Please provide Name and Email!');
      return;
    }

    if (this.editMode() && this.editingCustomerId()) {
      this.insuranceService.updateCustomer(this.editingCustomerId()!, {
        fullName: this.newUser.fullName,
        email: this.newUser.email,
        phone: this.newUser.phone,
        dateOfBirth: this.newUser.dateOfBirth,
        agentId: this.newUser.agentId
      });
    } else {
      if (this.newUser.role === 'CUSTOMER') {
        this.insuranceService.addCustomer({
          fullName: this.newUser.fullName,
          email: this.newUser.email,
          phone: this.newUser.phone,
          dateOfBirth: this.newUser.dateOfBirth,
          agentId: this.newUser.agentId
        });
      } else if (this.newUser.role === 'AGENT') {
        this.insuranceService.addAgent({
          fullName: this.newUser.fullName,
          email: this.newUser.email,
          username: this.newUser.username || this.newUser.email.split('@')[0],
          phone: this.newUser.phone
        });
      } else {
        this.insuranceService.addEmployee({
          fullName: this.newUser.fullName,
          email: this.newUser.email,
          username: this.newUser.username || this.newUser.email.split('@')[0],
          role: this.newUser.jobRole
        });
      }
    }

    this.closeModal();
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.insuranceService.deleteCustomer(id);
    }
  }

  deleteAgent(id: number): void {
    if (confirm('Are you sure you want to delete this agent?')) {
      this.insuranceService.deleteAgent(id);
    }
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.insuranceService.deleteEmployee(id);
    }
  }
}
