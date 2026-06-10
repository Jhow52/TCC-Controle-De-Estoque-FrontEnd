import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/api.service';
import { Inventory } from '../../models';

@Component({ selector: 'app-inventario', imports: [CommonModule], templateUrl: './inventario.html' })
export class InventarioComponent implements OnInit {
  inventory: Inventory[] = [];
  error = '';

  constructor(private svc: InventoryService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { 
    this.svc.getAll().subscribe({ 
      next: i => { 
        this.inventory = [...i]; // ← spread força novo array
        this.cdr.detectChanges(); // ← força Angular a re-renderizar
      },
      error: err => { 
        this.error = 'Erro: ' + err.status;
        this.cdr.detectChanges();
      }
    }); 
  }

  get lowCount() { return this.inventory.filter(i => i.lowStock).length; }
}