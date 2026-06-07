package com.back.demo.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.back.demo.models.DetalleFactura;
import com.back.demo.models.Factura;
import com.back.demo.models.dto.FacturaDetDto;
import com.back.demo.models.dto.FacturaReq;
import com.back.demo.models.dto.FacturaResp;
import com.back.demo.repository.IFacturaRepository;

@Service
public class FacturaService {

    @Autowired
    private IFacturaRepository facturaRepository;

    public List<Factura> listarFacturas() throws Exception {
        return facturaRepository.findAll();
    }

    public Factura obtenerFacturaId(Long id) throws Exception {
        return facturaRepository.findById(id).orElseThrow(() -> new Exception("Factura no encontrada"));
    }

    public FacturaResp recalcularFactura(FacturaReq req) throws Exception {

        Factura factura = obtenerFacturaId(req.id());

        BigDecimal valorInicial = factura.getSubtotal();
        BigDecimal nuevoSubtotal = req.nuevoValor();
        BigDecimal diferencia = valorInicial.subtract(nuevoSubtotal);
        BigDecimal porcentaje = diferencia.divide(valorInicial, 2, RoundingMode.HALF_DOWN);

        Integer compare = nuevoSubtotal.compareTo(valorInicial);
        
        if (compare < 0){
            recalcularProductos(factura.getDetallesFactura(), porcentaje, true);
        }else{
            recalcularProductos(factura.getDetallesFactura(), porcentaje, true);
        }

        BigDecimal impuestos = nuevoSubtotal.multiply(BigDecimal.valueOf(0.19));

        List<FacturaDetDto> detalles = factura.getDetallesFactura()
                                            .stream()
                                            .map(d -> 
                                                new FacturaDetDto(d.getId(), d.getCantidad(), d.getPrecioUnitario(), d.getSubtotal())
                                            ).toList();

        return new FacturaResp(detalles,impuestos);
    }

    private void recalcularProductos(List<DetalleFactura> detalleFactura, BigDecimal porcentaje, Boolean esDescuento) throws Exception{
        detalleFactura.stream()
        .forEach(det -> {
            BigDecimal valorProducto = det.getPrecioUnitario();
            BigDecimal nuevoValor = esDescuento ? valorProducto.subtract(valorProducto.multiply(porcentaje)) : valorProducto.add(valorProducto.multiply(porcentaje));
            det.setPrecioUnitario(nuevoValor);
            det.setSubtotal(nuevoValor.multiply(BigDecimal.valueOf(det.getCantidad())));
        });
    }

}
