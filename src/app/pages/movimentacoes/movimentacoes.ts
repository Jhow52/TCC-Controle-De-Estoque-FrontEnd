import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementService, ProductService } from '../../services/api.service';
import { StockMovement, StockMovementRequest, Product } from '../../models';

@Component({ selector: 'app-movimentacoes', imports: [CommonModule, FormsModule], templateUrl: './movimentacoes.html' })
export class MovimentacoesComponent implements OnInit {
  movements: StockMovement[] = []; products: Product[] = [];
  type: 'ENTRADA' | 'SAIDA' = 'ENTRADA';
  form: StockMovementRequest = { productId: 0, quantity: 0, notes: '' };
  error = ''; success = '';
  searchProduto = ''; searchId = '';
  fieldErrors: Record<string, string> = {};

  constructor(private svc: MovementService, private prodSvc: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadMovements();
    this.prodSvc.getAll().subscribe({ 
      next: p => { this.products = [...p]; this.cdr.detectChanges(); },
      error: err => { this.error = 'Erro ao carregar produtos: ' + err.status; }
    });
  }

  buscarPorProduto() {
  this.searchId = '';
  if (!this.searchProduto) { this.loadMovements(); return; }
  this.svc.getByProduct(this.searchProduto).subscribe({
    next: m => { this.movements = [...m]; this.cdr.detectChanges(); },
    error: err => { this.error = this.extractError(err); this.movements = []; this.cdr.detectChanges(); }
  });
}

buscarPorId() {
  this.searchProduto = '';
  if (!this.searchId) { this.loadMovements(); return; }
  this.svc.getById(Number(this.searchId)).subscribe({
    next: m => { this.movements = [m]; this.cdr.detectChanges(); },
    error: err => { this.error = this.extractError(err); this.movements = []; this.cdr.detectChanges(); }
  });
}

loadMovements() {
  this.svc.getAll().subscribe({
    next: m => { this.movements = [...m]; this.cdr.detectChanges(); },
    error: err => { this.error = this.extractError(err); }
  });
}

extractError(err: any): string {
  if (err.error?.message) return err.error.message;
  if (err.error?.error) return err.error.error;
  if (typeof err.error === 'object') return Object.values(err.error).join(' | ');
  return 'Erro inesperado.';
}

  submit() {
  this.error = ''; this.fieldErrors = {};
  const obs = this.type === 'ENTRADA' ? this.svc.entrada(this.form) : this.svc.saida(this.form);
  obs.subscribe({
    next: () => {
      this.svc.getAll().subscribe(m => { this.movements = [...m]; this.cdr.detectChanges(); });
      this.success = 'Movimentação registrada!';
      this.form = { productId: 0, quantity: 0, notes: '' };
      setTimeout(() => this.success = '', 3000);
    },
    error: (err) => {
      const body = err.error;
      if (body?.message) { this.error = body.message; }
      else if (typeof body === 'object') { this.fieldErrors = body; }
      else { this.error = 'Erro ao registrar.'; }
      this.cdr.detectChanges();
    }
  });
}
}