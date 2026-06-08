import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FacturaService } from '../../services/factura.service';
import { Factura } from '../../models/factura';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-lista-facturas',
  imports: [MatTableModule, MatButtonModule, CurrencyPipe],
  templateUrl: './lista-facturas.html',
  styleUrl: './lista-facturas.css',
})
export class ListaFacturas implements OnInit {
  displayedColumns: string[] = ['numero', 'cliente', 'estado', 'total', 'acciones'];
  public datasource = signal<Factura[]>([]);

  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private facturaService = inject(FacturaService);

  ngOnInit(): void {
    this.facturaService.listarFacturas().subscribe({
      next: (r) => {
        this.datasource.set(r.body);
        this.snackBar.open(r.mensaje, 'cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (e) => {
          this.snackBar.open(e.error.mensaje || e.message, 'cerrar', {
          duration : 2500,
          horizontalPosition : 'center',
          verticalPosition : 'top'
        });
      },
    });
  }

  verFactura(id: number) {
    this.router.navigate([`/factura/${id}`]);
  }
}
