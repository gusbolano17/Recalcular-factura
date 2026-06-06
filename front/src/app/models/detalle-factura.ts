import { Factura } from "./factura";

export interface DetalleFactura{
    id : number;
    producto : string;
    cantidad : number;
    precioUnitario : number;
    subtotal : number;
    factura : Factura;
}