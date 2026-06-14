import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/api.service';
import { Inventory } from '../../models';

@Component({ selector: 'app-inventario', imports: [CommonModule, FormsModule], templateUrl: './inventario.html' })
export class InventarioComponent implements OnInit {
  inventory: Inventory[] = []; allInventory: Inventory[] = [];
  error = ''; searchNome = ''; searchCategoria = ''; filtroEstoqueBaixo = false;

  constructor(private svc: InventoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.svc.getAll().subscribe({
      next: i => { this.allInventory = [...i]; this.inventory = [...i]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.cdr.detectChanges(); }
    });
  }

  buscarPorNome() {
    this.searchCategoria = ''; this.filtroEstoqueBaixo = false;
    if (!this.searchNome) { this.load(); return; }
    this.svc.getByName(this.searchNome).subscribe({
      next: i => { this.inventory = [...i]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.inventory = []; this.cdr.detectChanges(); }
    });
  }

  buscarPorCategoria() {
    this.searchNome = ''; this.filtroEstoqueBaixo = false;
    if (!this.searchCategoria) { this.load(); return; }
    this.svc.getByCategory(this.searchCategoria).subscribe({
      next: i => { this.inventory = [...i]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.inventory = []; this.cdr.detectChanges(); }
    });
  }

  verEstoqueBaixo() {
    this.searchNome = ''; this.searchCategoria = '';
    if (this.filtroEstoqueBaixo) {
      this.svc.getLowStock().subscribe({
        next: i => { this.inventory = [...i]; this.cdr.detectChanges(); },
        error: err => { this.error = this.extractError(err); this.inventory = []; this.cdr.detectChanges(); }
      });
    } else {
      this.load();
    }
  }

  get lowCount() { return this.allInventory.filter(i => i.lowStock).length; }

  extractError(err: any): string {
    if (err.error?.message) return err.error.message;
    if (err.error?.error) return err.error.error;
    return 'Erro inesperado.';
  }
}