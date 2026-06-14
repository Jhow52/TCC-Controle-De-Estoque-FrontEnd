import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, MovementService } from '../../services/api.service';
import { Product, StockMovement } from '../../models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  movements: StockMovement[] = [];
  today = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  constructor(private productSvc: ProductService, private movSvc: MovementService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.productSvc.getAll().subscribe({
      next: p => { this.products = [...p]; this.cdr.detectChanges(); },
      error: err => console.log('Erro produtos:', err)
    });
    this.movSvc.getAll().subscribe({
      next: m => { this.movements = [...m].slice(0, 5); this.cdr.detectChanges(); },
      error: err => console.log('Erro movimentos:', err)
    });
  }

  get lowStockProducts() { return this.products.filter(p => p.lowStock); }
  get totalProducts() { return this.products.length; }
  get totalMovements() { return this.movements.length; }
}