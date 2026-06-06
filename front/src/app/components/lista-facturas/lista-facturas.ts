import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Factura } from '../../models/factura';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-facturas',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './lista-facturas.html',
  styleUrl: './lista-facturas.css',
})
export class ListaFacturas {
  displayedColumns: string[] = ['numero', 'cliente', 'estado', 'total', 'acciones'];
  datasource: Factura[] = [
    {
      id: 1,
      numero: '0001',
      cliente: 'Jorge segura',
      estado: 'activa',
      fechaCreacion: new Date(),
      impuestos: 15200,
      subtotal: 80000,
      total: 95200,
      usuario: 'super',
    },
  ];

  private router = inject(Router);

  verFactura(id: number) {
    this.router.navigate([`/factura/${id}`]);
  }
}
