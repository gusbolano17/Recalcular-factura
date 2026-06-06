package com.back.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    
    
}
