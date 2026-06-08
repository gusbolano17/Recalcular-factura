package com.back.demo.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.back.demo.models.DetalleFactura;
import com.back.demo.models.Factura;
import com.back.demo.models.dto.FacturaDetDto;
import com.back.demo.models.dto.FacturaReq;
import com.back.demo.models.dto.FacturaResp;
import com.back.demo.models.dto.ResponseDto;
import com.back.demo.repository.IDetalleFacturaRepository;
import com.back.demo.repository.IFacturaRepository;

@Service
public class FacturaService {

    @Autowired
    private IFacturaRepository facturaRepository;
    @Autowired
    private IDetalleFacturaRepository detalleFacturaRepository;

    public ResponseEntity<ResponseDto<List<Factura>>> listarFacturas() throws Exception {
        try {
            List<Factura> listaFacturas = facturaRepository.findAll();

            if (!listaFacturas.isEmpty()) {
                return ResponseEntity.ok(
                        new ResponseDto<>("Facturas encontradas exitosamente", 200, listaFacturas));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ResponseDto<>(e.getMessage(), 500, new ArrayList<>()));
        }
    }

    public ResponseEntity<ResponseDto<Factura>> obtenerFacturaId(Long id) throws Exception {
        try {
            Optional<Factura> factura = facturaRepository.findById(id);

            if (factura.isPresent()) {
                return ResponseEntity.ok(
                        new ResponseDto<>("Factura encontrada exitosamente", 200, factura.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ResponseDto<>(e.getMessage(), 500, null));
        }
    }

    public ResponseEntity<ResponseDto<FacturaResp>> recalcularFactura(FacturaReq req) throws Exception {
        try {
            Factura factura = obtenerFacturaId(req.id()).getBody().body();

            BigDecimal valorInicial = factura.getSubtotal();
            BigDecimal nuevoSubtotal = req.nuevoValor();
            BigDecimal diferencia = valorInicial.subtract(nuevoSubtotal).abs();

            Integer compare = nuevoSubtotal.compareTo(valorInicial);

            if (compare < 0) {
                recalcularProductos(factura.getDetallesFactura(), diferencia, true);
            } else if (compare > 0) {
                Integer compareDiff;

                if (req.usuario().equals("operador")) {
                    compareDiff = diferencia.compareTo(BigDecimal.valueOf(20000));
                } else {
                    compareDiff = diferencia.compareTo(BigDecimal.valueOf(50000));
                }

                if (compareDiff > 0) {
                    return ResponseEntity.badRequest()
                            .body(new ResponseDto<>("El usuario asignado no debe superar el tope maximo", 400, null));
                }

                recalcularProductos(factura.getDetallesFactura(), diferencia, false);
            } else {
                return ResponseEntity.badRequest()
                        .body(new ResponseDto<>("El valor que estas ingresando es el mismo", 400, null));
            }

            BigDecimal impuestos = nuevoSubtotal.multiply(BigDecimal.valueOf(0.19));

            List<FacturaDetDto> detalles = factura.getDetallesFactura()
                    .stream()
                    .map(d -> new FacturaDetDto(d.getId(), d.getCantidad(), d.getPrecioUnitario(), d.getSubtotal()))
                    .toList();

            return ResponseEntity.ok(
                    new ResponseDto<>("Factura recalculada exitosamente", 201, new FacturaResp(detalles, impuestos)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ResponseDto<>(e.getMessage(), 500, null));
        }
    }

    public ResponseEntity<ResponseDto<Factura>> actualizarFactura(Factura body) throws Exception {

        try {

            Factura facturaSave = facturaRepository.save(body);

            body.getDetallesFactura().forEach(p -> {
                detalleFacturaRepository.save(p);
            });

            return ResponseEntity.ok(new ResponseDto<>("Factura actualizada correctamente ", 200, facturaSave));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ResponseDto<>(e.getMessage(), 500, null));
        }

    }

    private void recalcularProductos(List<DetalleFactura> detalleFactura, BigDecimal diferencia, Boolean esDescuento)
            throws Exception {
        detalleFactura.stream()
                .forEach(det -> {
                    BigDecimal valorProducto = det.getPrecioUnitario();
                    BigDecimal porcentaje = valorProducto.divide(det.getFactura().getSubtotal(), 3,
                            RoundingMode.HALF_DOWN);
                    BigDecimal valorDistribuido = diferencia.multiply(porcentaje);

                    BigDecimal nuevoValor = esDescuento ? valorProducto.subtract(valorDistribuido)
                            : valorProducto.add(valorDistribuido);

                    det.setPrecioUnitario(nuevoValor);
                    det.setSubtotal(nuevoValor.multiply(BigDecimal.valueOf(det.getCantidad())));
                });
    }

}
