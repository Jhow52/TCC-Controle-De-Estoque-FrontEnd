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

  constructor(private svc: MovementService, private prodSvc: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.svc.getAll().subscribe({ 
      next: m => { this.movements = [...m]; this.cdr.detectChanges(); },
      error: err => { this.error = 'Erro: ' + err.status; this.cdr.detectChanges(); }
    });
    this.prodSvc.getAll().subscribe({ 
      next: p => { this.products = [...p]; this.cdr.detectChanges(); },
      error: err => { this.error = 'Erro ao carregar produtos: ' + err.status; }
    });
  }

  submit() {
    this.error = '';
    const obs = this.type === 'ENTRADA' ? this.svc.entrada(this.form) : this.svc.saida(this.form);
    obs.subscribe({
      next: () => {
        this.svc.getAll().subscribe(m => { this.movements = [...m]; this.cdr.detectChanges(); });
        this.success = 'Movimentação registrada!';
        this.form = { productId: 0, quantity: 0, notes: '' };
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        if (err.error?.errors) { this.error = err.error.errors.map((e: any) => e.defaultMessage).join(' | '); }
        else { this.error = err.error?.message || 'Erro ao registrar.'; }
        this.cdr.detectChanges();
      }
    });
  }
}