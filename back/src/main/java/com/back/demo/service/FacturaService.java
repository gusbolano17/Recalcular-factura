package com.back.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.back.demo.models.Factura;
import com.back.demo.repository.IFacturaRepository;

@Service
public class FacturaService {

    @Autowired
    private IFacturaRepository facturaRepository;

    public List<Factura> listarFacturas() throws Exception {
        return facturaRepository.findAll();
    }
    
}
