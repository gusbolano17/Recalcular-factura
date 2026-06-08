import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { FacturaReqDto, FacturaRespDto } from '../models/factura-dto';
import { ResponseDto } from '../models/response-dto';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {

  private urlApi = 'http://localhost:8080/api/factura';
  private http = inject(HttpClient);

  listarFacturas() : Observable<ResponseDto<Factura[]>>{
    return this.http.get<ResponseDto<Factura[]>>(`${this.urlApi}/listar-factura`);
  }

  obtenerFacturaId(id : number) : Observable<ResponseDto<Factura>>{
    return this.http.get<ResponseDto<Factura>>(`${this.urlApi}/obtener-factura/${id}`);
  }

  recalcularFactura(body : FacturaReqDto) : Observable<ResponseDto<FacturaRespDto>>{
    return this.http.post<ResponseDto<FacturaRespDto>>(`${this.urlApi}/recalcular`, body);
  }

  actualizarFactura(body : Factura) : Observable<ResponseDto<Factura>> {
    return this.http.put<any>(`${this.urlApi}/actualizar`, body);
  }

}
