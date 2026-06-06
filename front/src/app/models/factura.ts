export interface Factura {
    id : number;
    numero : string;
    cliente : string;
    usuario : string;
    estado : string;
    fechaCreacion : Date;
    subtotal : number;
    impuestos : number;
    total : number;
}
