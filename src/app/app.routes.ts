import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'produtos', loadComponent: () => import('./pages/produtos/produtos').then(m => m.ProdutosComponent) },
      { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias').then(m => m.CategoriasComponent) },
      { path: 'inventario', loadComponent: () => import('./pages/inventario/inventario').then(m => m.InventarioComponent) },
      { path: 'movimentacoes', loadComponent: () => import('./pages/movimentacoes/movimentacoes').then(m => m.MovimentacoesComponent) },
      { path: 'admin', loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent) },
    ]
  }
];
