export interface FacturaReqDto{
    id : number;
    nuevoValor : number;
}

export interface FacturaRespDto{
    impuestos : number;
    detalle : DetalleDto[]
}

interface DetalleDto{
    id : number;
    cantidad : number;
    precioUnitario : number;
    subtotal : number;
}