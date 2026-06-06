import { Factura } from "./factura";

export interface DetalleFactura{
    id : number;
    producto : string;
    cantidad : number;
    precioUnitario : number;
    total : number;
    factura : Factura;
}