package com.back.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.back.demo.models.dto.FacturaReq;
import com.back.demo.service.FacturaService;



@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/factura")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @GetMapping("/listar-factura")
    public ResponseEntity<?> listarFacturas() throws Exception {
        return ResponseEntity.ok(facturaService.listarFacturas());
    }

    @GetMapping("/obtener-factura/{id}")
    public ResponseEntity<?> obtenerFacturaId(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok(facturaService.obtenerFacturaId(id));
    }
    
    @PostMapping("/recalcular")
    public ResponseEntity<?> recalcularFactura(@RequestBody FacturaReq req) throws Exception{
        return ResponseEntity.ok(facturaService.recalcularFactura(req));
    }
    
    
}
