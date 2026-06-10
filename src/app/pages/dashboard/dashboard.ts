import { Component, OnInit } from '@angular/core';
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

  constructor(private productSvc: ProductService, private movSvc: MovementService) {}

  ngOnInit() {
    this.productSvc.getAll().subscribe(p => this.products = p);
    this.movSvc.getAll().subscribe(m => this.movements = m.slice(0, 5));
  }

  get lowStockProducts() { return this.products.filter(p => p.lowStock); }
  get totalProducts() { return this.products.length; }
  get totalMovements() { return this.movements.length; }
}
