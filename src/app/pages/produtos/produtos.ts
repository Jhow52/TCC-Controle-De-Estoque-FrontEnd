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
  searchNome = ''; searchId = '';
  fieldErrors: Record<string, string> = {};

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
  if (!this.search) {
    this.filtered = [...this.products];
    return;
  }
  // chama o backend que já normaliza o texto
  this.svc.getByName(this.search).subscribe({
    next: p => { this.filtered = [...p]; this.cdr.detectChanges(); },
    error: () => { this.filtered = []; } // se não achar, lista vazia
  });
}

buscarPorNome() {
  this.searchId = '';
  if (!this.searchNome) { this.load(); return; }
  this.svc.getByName(this.searchNome).subscribe({
    next: p => { this.filtered = [...p]; this.cdr.detectChanges(); },
    error: err => { this.error = this.extractError(err); this.filtered = []; this.cdr.detectChanges(); }
  });
}

buscarPorId() {
  this.searchNome = '';
  if (!this.searchId) { this.load(); return; }
  this.svc.getById(Number(this.searchId)).subscribe({
    next: p => { this.filtered = [p]; this.cdr.detectChanges(); },
    error: err => { this.error = this.extractError(err); this.filtered = []; this.cdr.detectChanges(); }
  });
}

  openCreate() { 
  this.editId = null; 
  this.form = { name:'', description:'', price:0, quantity:0, minStock:0, categoryName:'' }; 
  this.error = ''; this.fieldErrors = {};
  this.showModal = true; 
  }
  openEdit(p: Product) {
  this.editId = p.id;
  this.form = { name: p.name, description: p.description, price: p.price, quantity: p.quantity, minStock: p.minStock, categoryName: p.categoryName };
  this.error = ''; this.fieldErrors = {};
  this.showModal = true;
}

  save() {
  this.error = ''; this.fieldErrors = {};
  const obs = this.editId ? this.svc.update(this.editId, this.form) : this.svc.create(this.form);
  obs.subscribe({ 
    next: () => { this.showModal = false; this.load(); this.success = 'Salvo com sucesso!'; setTimeout(() => this.success = '', 3000); }, 
    error: (err) => {
      const body = err.error;
      if (body?.message) {
        this.error = body.message; // erro de negócio (geral)
      } else if (typeof body === 'object') {
        this.fieldErrors = body; // erro de validação por campo
      } else {
        this.error = 'Erro ao salvar.';
      }
      this.cdr.detectChanges();
    }
  });
}

  delete(id: number) {
    if (!confirm('Excluir produto?')) return;
    this.svc.delete(id).subscribe({ next: () => this.load(), error: () => this.error = 'Erro ao excluir.' });
  }

  extractError(err: any): string {
  if (err.error?.message) return err.error.message;
  if (err.error?.error) return err.error.error;
  if (typeof err.error === 'object') return Object.values(err.error).join(' | ');
  return 'Erro inesperado.';
}
}