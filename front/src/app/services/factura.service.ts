import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {

  private urlApi = 'http://localhost:8080/api/factura';
  private http = inject(HttpClient);

  listarFacturas() : Observable<Factura[]>{
    return this.http.get<Factura[]>(`${this.urlApi}/listar-factura`);
  }

  obtenerFacturaId(id : number) : Observable<Factura>{
    return this.http.get<Factura>(`${this.urlApi}/obtener-factura/${id}`);
  }

}
