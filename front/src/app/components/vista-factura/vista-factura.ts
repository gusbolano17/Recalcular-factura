import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DetalleFactura } from '../../models/detalle-factura';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from '../../services/factura.service';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vista-factura',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vista-factura.html',
  styleUrl: './vista-factura.css',
})
export class VistaFactura implements OnInit {
  public displayedColumns: string[] = ['producto', 'cantidad', 'precioUnitario', 'total'];

  public datasource = signal<DetalleFactura[]>([]);

  public tiposUsuarios = [
    { value: 'operador', viewValue: 'Tipo A' },
    { value: 'supervisor', viewValue: 'Tipo B' },
  ];

  valorInicial = signal<number>(0);

  private activateRoute = inject(ActivatedRoute);
  private facturaService = inject(FacturaService);
  private fb = inject(FormBuilder);

  public form = this.fb.group({
    numero: new FormControl({ value: '', disabled: true }),
    cliente: new FormControl({ value: '', disabled: true }),
    fechaCreacion: new FormControl({ value: new Date(), disabled: true }),
    tipoUsuario: new FormControl(''),
    estado: new FormControl({ value: '', disabled: true }),
    subtotal: new FormControl(0),
    impuesto: new FormControl({ value: 0, disabled: true }),
    total: new FormControl({ value: 0, disabled: true }),
  });

  ngOnInit(): void {
    const id = parseInt(this.activateRoute.snapshot.paramMap.get('id') || '');
    this.facturaService.obtenerFacturaId(id).subscribe({
      next: (r) => {
        this.form.patchValue({
          numero: r.numero,
          cliente: r.cliente,
          fechaCreacion: r.fechaCreacion,
          tipoUsuario: r.usuario,
          estado: r.estado,
          subtotal: r.subtotal,
          impuesto: r.impuestos,
          total: r.total,
        });
        this.datasource.set(r.detallesFactura);
        this.valorInicial.set(r.subtotal);
      },
      error: (e) => console.error(e),
    });
  }

  recalcularFactura() {
    const nuevoSubtotal = this.form.get('subtotal')?.value ?? 0;
    const porcentaje = Math.abs(this.valorInicial() - nuevoSubtotal) / this.valorInicial();
    for (let d of this.datasource()) {
      if (nuevoSubtotal < this.valorInicial()) {
        d.precioUnitario = d.precioUnitario * (1 - porcentaje);
      } else {
        d.precioUnitario = d.precioUnitario * (1 + porcentaje);
      }
      d.subtotal = d.precioUnitario * d.cantidad;
    }

    const impuestos = (this.form.get('subtotal')?.value ?? 0) * 0.19;
    const total = nuevoSubtotal + impuestos;
    this.form.patchValue({ impuesto: impuestos, total });

    this.valorInicial.set(nuevoSubtotal);
  }
}
