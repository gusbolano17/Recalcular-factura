import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DetalleFactura } from '../../models/detalle-factura';

@Component({
  selector: 'app-vista-factura',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './vista-factura.html',
  styleUrl: './vista-factura.css',
})
export class VistaFactura {

  displayedColumns: string[] = ['producto', 'cantidad', 'precioUnitario', 'total'];

  datasource : DetalleFactura[] = [
    {
      id : 1,
      producto : 'Producto 1',
      cantidad : 2,
      precioUnitario : 50000,
      total : 100000,
      factura : {
        id : 1,
        numero : '0001',
        cliente : 'Jorge segura',
        usuario : 'super',
        estado : 'activa',
        fechaCreacion : new Date(),
        subtotal : 80000,
        impuestos : 15200,
        total : 95200
      }
    }
  ];



}
