import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryRequest, Product, ProductRequest, Inventory, StockMovement, StockMovementRequest, User } from '../models';

const BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Category[]> { return this.http.get<Category[]>(`${BASE}/v1/category`); }
  getByName(nome: string): Observable<Category[]> { return this.http.get<Category[]>(`${BASE}/v1/category/nome?nome=${nome}`); }
  getById(id: number): Observable<Category> { return this.http.get<Category>(`${BASE}/v1/category/${id}`); }
  create(data: CategoryRequest): Observable<Category> { return this.http.post<Category>(`${BASE}/v1/admin/category`, data); }
  update(id: number, data: CategoryRequest): Observable<Category> { return this.http.put<Category>(`${BASE}/v1/admin/category/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${BASE}/v1/admin/category/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Product[]> { return this.http.get<Product[]>(`${BASE}/v1/produto`); }
  getById(id: number): Observable<Product> { return this.http.get<Product>(`${BASE}/v1/produto/${id}`); }
  getByName(nome: string): Observable<Product[]> { return this.http.get<Product[]>(`${BASE}/v1/produto/nome?nome=${nome}`); }
  create(data: ProductRequest): Observable<Product> { return this.http.post<Product>(`${BASE}/v1/admin/produto`, data); }
  update(id: number, data: ProductRequest): Observable<Product> { return this.http.put<Product>(`${BASE}/v1/admin/produto/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/v1/admin/produto/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Inventory[]> { return this.http.get<Inventory[]>(`${BASE}/v1/inventario`); }
  getByName(nome: string): Observable<Inventory[]> { return this.http.get<Inventory[]>(`${BASE}/v1/inventario/nome?nome=${nome}`); }
  getByCategory(categoria: string): Observable<Inventory[]> { return this.http.get<Inventory[]>(`${BASE}/v1/inventario/categoria?categoria=${categoria}`); }
  getLowStock(): Observable<Inventory[]> { return this.http.get<Inventory[]>(`${BASE}/v1/inventario/estoqueBaixo`); }
}

@Injectable({ providedIn: 'root' })
export class MovementService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<StockMovement[]> { return this.http.get<StockMovement[]>(`${BASE}/v1/movimentacao-estoque`); }
  getById(id: number): Observable<StockMovement> { return this.http.get<StockMovement>(`${BASE}/v1/movimentacao-estoque/${id}`); }
  getByProduct(productName: string): Observable<StockMovement[]> { return this.http.get<StockMovement[]>(`${BASE}/v1/movimentacao-estoque/produto?productName=${productName}`); }
  entrada(data: StockMovementRequest): Observable<StockMovement> { return this.http.post<StockMovement>(`${BASE}/v1/admin/movimentacao-estoque/entrada`, data); }
  saida(data: StockMovementRequest): Observable<StockMovement> { return this.http.post<StockMovement>(`${BASE}/v1/admin/movimentacao-estoque/saida`, data); }
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> { return this.http.get<User[]>(`${BASE}/v1/admin/user`); }
  getById(id: number): Observable<User> { return this.http.get<User>(`${BASE}/v1/admin/user/${id}`); }
  promoteToAdmin(id: number): Observable<any> { return this.http.put(`${BASE}/v1/admin/promover/${id}`, {}); }
  removeAdmin(id: number): Observable<any> { return this.http.put(`${BASE}/v1/admin/remover/${id}`, {}); }
}