import { Routes } from '@angular/router';
import { Sidebar } from './core/layout/sidebar/sidebar';
import { DashboardComponent } from './features/dashboard-component/dashboard-component';
import { ConfigComponent } from './features/config-component/config-component';
import { ModuleComponent } from './features/module-component/module-component';
import { ModuleFormComponent } from './features/module-component/module-form-component/module-form-component';
import { PricingOptionsComponent } from './features/pricing-options-component/pricing-options-component';
import { PricingOptionFormComponent } from './features/pricing-options-component/pricing-option-component/pricing-option-form-component';
import { CompanyForm } from './features/company-component/company-form/company-form';
import { RolesComponent } from './features/roles-component/roles-component';
import { UserForm } from './features/user-component/user-form/user-form';
import { publicGuard } from './core/guards/public.guard';
import { passwordChangeGuard } from './core/guards/passwordChange.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login-component/login-component';
import { ForgotPasswordComponent } from './features/auth/forgot-password-component/forgot-password-component';
import { ForcePasswordChangeComponent } from './features/auth/force-password-change-component/force-password-change-component';
import { UserComponent } from './features/user-component/user-component';
import { LicenseTypeComponent } from './features/license-type-component/license-type-component';
import { PermissionComponent } from './features/permission-component/permission-component';
import { CompanyComponent } from './features/company-component/company-component';
import { PermissionFormComponent } from './features/permission-component/permission-form-component/permission-form-component';
import { LicenseFormComponent } from './features/license-type-component/license-form-component/license-form-component';
import { SubscriptionsComponent } from './features/subscriptions-component/subscriptions-component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [publicGuard] },
    { path: 'admin', component: Sidebar },
    { path: 'force-password-change', component: ForcePasswordChangeComponent, canActivate: [passwordChangeGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard] },
    { path: 'config', component: ConfigComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
    { path: 'licenses/page/:page', component: LicenseTypeComponent },
    { path: 'licenses/form', component: LicenseFormComponent },
    { path: 'licenses/form/:id', component: LicenseFormComponent },
    { path: 'modules/page/:page', component: ModuleComponent, runGuardsAndResolvers: 'always' },
    { path: 'modules/form', component: ModuleFormComponent },
    { path: 'modules/form/:id', component: ModuleFormComponent },
    { path: 'pricing/page/:page', component: PricingOptionsComponent },
    { path: 'pricing/form/:id', component: PricingOptionFormComponent },
    { path: 'pricing/form', component: PricingOptionFormComponent },
    { path: 'companies/page/:page', component: CompanyComponent },
    { path: 'companies/form', component: CompanyForm },
    { path: 'companies/form/:id', component: CompanyForm },
    { path: 'permissions/page/:page', component: PermissionComponent },
    { path: 'permissions/form', component: PermissionFormComponent },
    { path: 'permissions/form/:id', component: PermissionFormComponent },
    { path: 'roles/page/:page', component: RolesComponent },
    { path: 'users/page/:page', component: UserComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
    { path: 'users/form/:id', component: UserForm, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
    { path: 'users/form', component: UserForm, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
    { path: 'subscriptions/page/:page', component: SubscriptionsComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];


