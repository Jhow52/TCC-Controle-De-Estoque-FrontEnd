import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/api.service';
import { Category } from '../../models';

@Component({ selector: 'app-categorias', imports: [CommonModule, FormsModule], templateUrl: './categorias.html' })
export class CategoriasComponent implements OnInit {
  categories: Category[] = []; showModal = false; editId: number | null = null;
  form = { name: '', description: '' }; error = ''; success = '';

  constructor(private svc: CategoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() { 
    this.svc.getAll().subscribe({ 
      next: c => { this.categories = [...c]; this.cdr.detectChanges(); },
      error: err => { this.error = 'Erro: ' + err.status; this.cdr.detectChanges(); }
    }); 
  }

  openCreate() { this.editId = null; this.form = { name: '', description: '' }; this.error = ''; this.showModal = true; }
  openEdit(c: Category) { this.editId = c.id; this.form = { name: c.name, description: c.description }; this.error = ''; this.showModal = true; }

  save() {
    this.error = '';
    const obs = this.editId ? this.svc.update(this.editId, this.form) : this.svc.create(this.form);
    obs.subscribe({ 
      next: () => { this.showModal = false; this.load(); this.success = 'Salvo!'; setTimeout(() => this.success = '', 3000); }, 
      error: (err) => {
        if (err.error?.errors) { this.error = err.error.errors.map((e: any) => e.defaultMessage).join(' | '); }
        else { this.error = err.error?.message || 'Erro ao salvar.'; }
        this.cdr.detectChanges();
      }
    });
  }

  delete(id: number) {
    if (!confirm('Excluir categoria?')) return;
    this.svc.delete(id).subscribe({ next: () => this.load(), error: () => this.error = 'Erro ao excluir.' });
  }
}