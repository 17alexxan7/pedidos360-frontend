import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from './pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'https://hpii3rnjq6.execute-api.us-east-1.amazonaws.com/api/pedidos';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }
}