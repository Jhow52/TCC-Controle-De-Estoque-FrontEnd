import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/api.service';
import { Category } from '../../models';

@Component({ selector: 'app-categorias', imports: [CommonModule, FormsModule], templateUrl: './categorias.html' })
export class CategoriasComponent implements OnInit {
  categories: Category[] = []; showModal = false; editId: number | null = null;
  form = { name: '', description: '' }; error = ''; success = '';
  fieldErrors: Record<string, string> = {};
  searchNome = ''; searchId = '';

  constructor(private svc: CategoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.svc.getAll().subscribe({
      next: c => { this.categories = [...c]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.cdr.detectChanges(); }
    });
  }

  buscarPorNome() {
    if (!this.searchNome) { this.load(); return; }
    this.svc.getByName(this.searchNome).subscribe({
      next: c => { this.categories = [...c]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.categories = []; this.cdr.detectChanges(); }
    });
  }

  buscarPorId() {
    if (!this.searchId) { this.load(); return; }
    this.svc.getById(Number(this.searchId)).subscribe({
      next: c => { this.categories = [c]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.categories = []; this.cdr.detectChanges(); }
    });
  }

  openCreate() { this.editId = null; this.form = { name: '', description: '' }; this.error = ''; this.fieldErrors = {}; this.showModal = true; }
  openEdit(c: Category) { this.editId = c.id; this.form = { name: c.name, description: c.description }; this.error = ''; this.fieldErrors = {}; this.showModal = true; }

  save() {
    this.error = ''; this.fieldErrors = {};
    const obs = this.editId ? this.svc.update(this.editId, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: () => { this.showModal = false; this.load(); this.success = 'Salvo!'; setTimeout(() => this.success = '', 3000); },
      error: (err) => {
        const body = err.error;
        if (body?.message) { this.error = body.message; }
        else if (typeof body === 'object') { this.fieldErrors = body; }
        else { this.error = 'Erro ao salvar.'; }
        this.cdr.detectChanges();
      }
    });
  }

  delete(id: number) {
    if (!confirm('Excluir categoria?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.load(); this.success = 'Categoria removida!'; setTimeout(() => this.success = '', 3000); },
      error: err => { this.error = this.extractError(err); this.cdr.detectChanges(); }
    });
  }

  // método padrão para extrair mensagem de erro do backend
  extractError(err: any): string {
    if (err.error?.message) return err.error.message;
    if (err.error?.error) return err.error.error;
    if (typeof err.error === 'object') return Object.values(err.error).join(' | ');
    return 'Erro inesperado. Tente novamente.';
  }
}