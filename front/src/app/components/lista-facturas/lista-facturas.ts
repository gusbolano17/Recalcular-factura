import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FacturaService } from '../../services/factura.service';
import { Factura } from '../../models/factura';

@Component({
  selector: 'app-lista-facturas',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './lista-facturas.html',
  styleUrl: './lista-facturas.css',
})
export class ListaFacturas implements OnInit{
  displayedColumns: string[] = ['numero', 'cliente', 'estado', 'total', 'acciones'];
  public datasource = signal<Factura[]>([]);

  private router = inject(Router);
  private facturaService = inject(FacturaService);

  ngOnInit(): void {
    this.facturaService.listarFacturas().subscribe({
      next: (r) => this.datasource.set(r),
      error: (e) => console.error(e)
    })
  }

  verFactura(id: number) {
    this.router.navigate([`/factura/${id}`]);
  }
}
