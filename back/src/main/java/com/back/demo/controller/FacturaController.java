package com.back.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.back.demo.models.Factura;
import com.back.demo.models.dto.FacturaReq;
import com.back.demo.models.dto.FacturaResp;
import com.back.demo.models.dto.ResponseDto;
import com.back.demo.service.FacturaService;




@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/factura")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @GetMapping("/listar-factura")
    public ResponseEntity<ResponseDto<List<Factura>>> listarFacturas() throws Exception {
        return facturaService.listarFacturas();
    }

    @GetMapping("/obtener-factura/{id}")
    public ResponseEntity<ResponseDto<Factura>> obtenerFacturaId(@PathVariable Long id) throws Exception{
        return facturaService.obtenerFacturaId(id);
    }
    
    @PostMapping("/recalcular")
    public ResponseEntity<ResponseDto<FacturaResp>> recalcularFactura(@RequestBody FacturaReq req) throws Exception{
        return facturaService.recalcularFactura(req);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<ResponseDto<Factura>> actualizarFactura(@RequestBody Factura body) throws Exception {
        return facturaService.actualizarFactura(body);
    }
    
    
}
