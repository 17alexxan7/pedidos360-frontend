import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';

import {
  loginRequest,
  redirectUri
} from './auth-config';

import { PedidoService } from './pedido.service';
import { Pedido } from './pedido.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  title = 'Pedidos360';
  usuario: AccountInfo | null = null;
  cargando = true;
  mensajeError = '';

  pedidos: Pedido[] = [];
  cargandoPedidos = false;
  errorPedidos = '';

  constructor(
    private readonly authService: MsalService,
    private readonly pedidoService: PedidoService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.authService.instance.initialize();

      const resultado =
        await this.authService.instance.handleRedirectPromise();

      if (resultado?.account) {
        this.authService.instance.setActiveAccount(resultado.account);
      }

      this.actualizarUsuario();
    } catch (error) {
      console.error('Error al inicializar MSAL:', error);

      this.mensajeError =
        'No fue posible inicializar la autenticación.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }

    this.cargarPedidos();
  }

  iniciarSesion(): void {
    this.mensajeError = '';

    this.authService.loginRedirect(loginRequest).subscribe({
      error: (error) => {
        console.error('Error al iniciar sesión:', error);

        this.mensajeError =
          'No fue posible iniciar sesión con Microsoft.';

        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logoutRedirect({
      account: this.usuario ?? undefined,
      postLogoutRedirectUri: redirectUri
    }).subscribe({
      error: (error) => {
        console.error('Error al cerrar sesión:', error);

        this.mensajeError =
          'No fue posible cerrar la sesión.';

        this.cdr.detectChanges();
      }
    });
  }

  cargarPedidos(): void {
    this.cargandoPedidos = true;
    this.errorPedidos = '';

    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener pedidos:', error);
        this.errorPedidos =
          'No fue posible cargar los pedidos desde el backend.';
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      }
    });
  }

  private actualizarUsuario(): void {
    const cuentaActiva =
      this.authService.instance.getActiveAccount();

    const cuentas =
      this.authService.instance.getAllAccounts();

    this.usuario = cuentaActiva ?? cuentas[0] ?? null;

    if (this.usuario && !cuentaActiva) {
      this.authService.instance.setActiveAccount(this.usuario);
    }
  }
}
