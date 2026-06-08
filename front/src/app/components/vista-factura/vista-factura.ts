import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DetalleFactura } from '../../models/detalle-factura';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from '../../services/factura.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FacturaReqDto } from '../../models/factura-dto';
import { Factura } from '../../models/factura';

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

  private snackBar = inject(MatSnackBar);
  private activateRoute = inject(ActivatedRoute);
  private facturaService = inject(FacturaService);
  private fb = inject(FormBuilder);

  private id: number = 0;

  public form = this.fb.group({
    numero: new FormControl({ value: '', disabled: true }),
    cliente: new FormControl({ value: '', disabled: true }),
    fechaCreacion: new FormControl({ value: new Date(), disabled: true }),
    tipoUsuario: new FormControl('', Validators.required),
    estado: new FormControl({ value: '', disabled: true }),
    subtotal: new FormControl(0, Validators.required),
    impuesto: new FormControl({ value: 0, disabled: true }),
    total: new FormControl({ value: 0, disabled: true }),
  });

  ngOnInit(): void {
    this.id = parseInt(this.activateRoute.snapshot.paramMap.get('id') || '');
    this.facturaService.obtenerFacturaId(this.id).subscribe({
      next: (r) => {
        const body = r.body;
        this.form.patchValue({
          numero: body.numero,
          cliente: body.cliente,
          fechaCreacion: body.fechaCreacion,
          tipoUsuario: body.usuario,
          estado: body.estado,
          subtotal: body.subtotal,
          impuesto: body.impuestos,
          total: body.total,
        });
        this.datasource.set(body.detallesFactura);
        this.valorInicial.set(body.subtotal);

        this.snackBar.open(r.mensaje, 'cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (e) => {
        this.snackBar.open(e.error.mensaje || e.message, 'cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }

  recalcularFactura() {
    const body: FacturaReqDto = {
      id: this.id,
      nuevoValor: this.form.get('subtotal')?.value ?? 0,
      usuario: this.form.get('tipoUsuario')?.value ?? ''
    };

    this.facturaService.recalcularFactura(body).subscribe({
      next: (r) => {
        const body = r.body;
        this.form.patchValue({
          impuesto: body.impuestos,
          total: (this.form.get('subtotal')?.value ?? 0) + body.impuestos,
        });

        for (const det of this.datasource()) {
          const precioUnitario = body.detalle.find((d) => d.id === det.id)?.precioUnitario;
          const subtotal = body.detalle.find((d) => d.id === det.id)?.subtotal;
          const cantidad = body.detalle.find((d) => d.id === det.id)?.cantidad;

          if (precioUnitario !== undefined && subtotal !== undefined && cantidad !== undefined) {
            det.precioUnitario = precioUnitario;
            det.subtotal = subtotal;
            det.cantidad = cantidad;
          }
        }

        this.snackBar.open(r.mensaje, 'cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (e) => {
        this.snackBar.open(e.error.mensaje || e.message, 'cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }

  actualizarFactura() {
    const body: Factura = {
      id: this.id,
      detallesFactura: this.datasource(),
      fechaCreacion: this.form.get('fechaCreacion')?.value ?? new Date(),
      cliente: this.form.get('cliente')?.value ?? '',
      estado: this.form.get('estado')?.value ?? '',
      numero: this.form.get('numero')?.value ?? '',
      subtotal: this.form.get('subtotal')?.value ?? 0,
      total: this.form.get('total')?.value ?? 0,
      impuestos: this.form.get('impuesto')?.value ?? 0,
      usuario: this.form.get('tipoUsuario')?.value ?? '',
    };

    this.facturaService.actualizarFactura(body).subscribe({
      next: (r) => {
        this.snackBar.open(r.mensaje, 'cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (e) => {
        this.snackBar.open(e.error.mensaje || e.message, 'cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
}
