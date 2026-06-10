import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, CategoryService } from '../../services/api.service';
import { Product, ProductRequest, Category } from '../../models';

@Component({ selector: 'app-produtos', imports: [CommonModule, FormsModule], templateUrl: './produtos.html' })
export class ProdutosComponent implements OnInit {
  products: Product[] = []; categories: Category[] = [];
  filtered: Product[] = []; search = '';
  showModal = false; editId: number | null = null;
  form: ProductRequest = { name:'', description:'', price:0, quantity:0, minStock:0, categoryName:'' };
  error = ''; success = '';

  constructor(private svc: ProductService, private catSvc: CategoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); this.loadCategories(); }

  load() { 
    this.svc.getAll().subscribe({ 
      next: p => { this.products = [...p]; this.applyFilter(); this.cdr.detectChanges(); },
      error: err => { this.error = 'Erro ao carregar produtos: ' + err.status; this.cdr.detectChanges(); }
    }); 
  }

  loadCategories() { 
    this.catSvc.getAll().subscribe({ 
      next: c => { this.categories = [...c]; this.cdr.detectChanges(); },
      error: () => this.error = 'Erro ao carregar categorias.'
    }); 
  }

  applyFilter() {
    this.filtered = this.search 
      ? this.products.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase())) 
      : [...this.products];
  }

  openCreate() { this.editId = null; this.form = { name:'', description:'', price:0, quantity:0, minStock:0, categoryName:'' }; this.error = ''; this.showModal = true; }

  openEdit(p: Product) {
    this.editId = p.id;
    this.form = { name: p.name, description: p.description, price: p.price, quantity: p.quantity, minStock: p.minStock, categoryName: p.categoryName };
    this.error = ''; this.showModal = true;
  }

  save() {
    this.error = '';
    const obs = this.editId ? this.svc.update(this.editId, this.form) : this.svc.create(this.form);
    obs.subscribe({ 
      next: () => { this.showModal = false; this.load(); this.success = 'Salvo com sucesso!'; setTimeout(() => this.success = '', 3000); }, 
      error: (err) => {
        if (err.error?.errors) { this.error = err.error.errors.map((e: any) => e.defaultMessage).join(' | '); }
        else { this.error = err.error?.message || 'Erro ao salvar.'; }
        this.cdr.detectChanges();
      }
    });
  }

  delete(id: number) {
    if (!confirm('Excluir produto?')) return;
    this.svc.delete(id).subscribe({ next: () => this.load(), error: () => this.error = 'Erro ao excluir.' });
  }
}