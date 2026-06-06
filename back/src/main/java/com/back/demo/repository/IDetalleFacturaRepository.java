package com.back.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.demo.models.DetalleFactura;

@Repository
public interface IDetalleFacturaRepository extends JpaRepository<DetalleFactura, Long> {
    
}
