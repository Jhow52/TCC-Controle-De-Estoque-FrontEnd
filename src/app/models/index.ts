export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { message: string; token: string; }
export interface RegisterRequest { name: string; email: string; password: string; }

export interface Category { id: number; name: string; description: string; }
export interface CategoryRequest { name: string; description: string; } // ← tem description!

export interface Product {
  id: number; name: string; description: string;
  price: number; quantity: number; minStock: number;
  categoryName: string; lowStock: boolean;
}
export interface ProductRequest {
  name: string; description: string; price: number;
  quantity: number; minStock: number; categoryName: string; // ← categoryName, não categoryId
}

export interface Inventory {
  id: number;
  productName: string;
  quantity: number;
  minStock: number;
  categoryName: string;
  lowStock: boolean;    // ← agora tem
  date: string;         // ← agora tem (LocalDateTime vira string no JSON)
}

export interface StockMovement {
  id: number;
  productName: string;
  quantity: number;
  movementType: 'IN' | 'OUT'; // ← era "type", e os valores são IN/OUT
  currentStock: number;
  date: string;
  notes: string;
}
export interface StockMovementRequest {
  productId: number;
  quantity: number;
  notes: string; // ← não tem type nem dateTime, são rotas separadas
}

export interface User {
  id: number; name: string; email: string; roles: string[];
}