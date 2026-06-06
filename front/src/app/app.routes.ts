import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'facturas',
  },
  {
    path: 'facturas',
    loadComponent: () =>
      import('./components/lista-facturas/lista-facturas').then((m) => m.ListaFacturas),
  },
  {
    path: 'factura/:id',
    loadComponent: () =>
      import('./components/vista-factura/vista-factura').then((m) => m.VistaFactura),
  },
];
