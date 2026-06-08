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
import { FacturaReqDto } from '../../models/factura-dto';

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

  private id: number = 0;

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
    this.id = parseInt(this.activateRoute.snapshot.paramMap.get('id') || '');
    this.facturaService.obtenerFacturaId(this.id).subscribe({
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
    const body: FacturaReqDto = {
      id: this.id,
      nuevoValor: this.form.get('subtotal')?.value ?? 0,
    };

    this.facturaService.recalcularFactura(body).subscribe({
      next: (r) => {
        this.form.patchValue({
          impuesto: r.impuestos,
          total: (this.form.get('subtotal')?.value ?? 0) + r.impuestos,
        });

        for (const det of this.datasource()) {
          const precioUnitario = r.detalle.find((d) => d.id === det.id)?.precioUnitario;
          const subtotal = r.detalle.find((d) => d.id === det.id)?.subtotal;
          const cantidad = r.detalle.find((d) => d.id === det.id)?.cantidad;

          if (precioUnitario !== undefined && subtotal !== undefined && cantidad !== undefined) {
            det.precioUnitario = precioUnitario;
            det.subtotal = subtotal;
            det.cantidad = cantidad;
          }
        }
      },
      error: (e) => console.error(e),
    });
  }

  actualizarFactura() {
    const body: FacturaReqDto = {
      id: this.id,
      nuevoValor: this.form.get('subtotal')?.value ?? 0,
    };

    this.facturaService.actualizarFactura(body).subscribe({
      next: (r) => console.log('Factura actualizada'),
      error: (e) => console.error(e),
    })
  }
}
