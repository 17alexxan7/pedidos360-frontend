export interface Pedido {
  id: number;
  cliente: string;
  producto: string;
  cantidad: number;
  estado: string;
  fechaCreacion: string; // LocalDateTime de Java llega como string ISO (ej: "2026-09-10T14:30:00")
}