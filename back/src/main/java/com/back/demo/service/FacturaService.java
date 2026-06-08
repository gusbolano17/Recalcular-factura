package com.back.demo.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

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
        BigDecimal diferencia = valorInicial.subtract(nuevoSubtotal).abs();

        Integer compare = nuevoSubtotal.compareTo(valorInicial);

        if (compare < 0) {
            recalcularProductos(factura.getDetallesFactura(), diferencia, true);
        } else {
            recalcularProductos(factura.getDetallesFactura(), diferencia, false);
        }

        BigDecimal impuestos = nuevoSubtotal.multiply(BigDecimal.valueOf(0.19));

        List<FacturaDetDto> detalles = factura.getDetallesFactura()
                .stream()
                .map(d -> new FacturaDetDto(d.getId(), d.getCantidad(), d.getPrecioUnitario(), d.getSubtotal()))
                .toList();

        return new FacturaResp(detalles, impuestos);
    }

    public Map<String, String> actualizarFactura(FacturaReq req) throws Exception {
        Factura factura = obtenerFacturaId(req.id());

        BigDecimal valorInicial = factura.getSubtotal();
        BigDecimal nuevoSubtotal = req.nuevoValor();

        BigDecimal diferencia = valorInicial.subtract(req.nuevoValor()).abs();
        BigDecimal porcentaje = diferencia.divide(valorInicial, 2, RoundingMode.HALF_EVEN);

        BigDecimal impuestos = nuevoSubtotal.multiply(BigDecimal.valueOf(0.19));
        BigDecimal valorTotal = nuevoSubtotal.add(impuestos);

        Integer compare = valorInicial.compareTo(factura.getSubtotal());

        if (compare < 0) {
            recalcularProductos(factura.getDetallesFactura(), porcentaje, true);
        } else {
            recalcularProductos(factura.getDetallesFactura(), porcentaje, true);
        }

        factura.setSubtotal(req.nuevoValor());
        factura.setImpuestos(impuestos);
        factura.setTotal(valorTotal);
        factura.setUsuario(req.usuario());

        facturaRepository.save(factura);

        return Map.of("message", "Factura actualizada correctamente");
    }

    private void recalcularProductos(List<DetalleFactura> detalleFactura, BigDecimal diferencia, Boolean esDescuento)
            throws Exception {
        detalleFactura.stream()
                .forEach(det -> {
                    BigDecimal valorProducto = det.getPrecioUnitario();
                    BigDecimal porcentaje = valorProducto.divide(det.getFactura().getSubtotal(), 3, RoundingMode.HALF_DOWN);
                    BigDecimal valorDistribuido = diferencia.multiply(porcentaje);

                    BigDecimal nuevoValor = esDescuento ? valorProducto.subtract(valorDistribuido)
                            : valorProducto.add(valorDistribuido);
                    
                    det.setPrecioUnitario(nuevoValor);
                    det.setSubtotal(nuevoValor.multiply(BigDecimal.valueOf(det.getCantidad())));
                });
    }

}
