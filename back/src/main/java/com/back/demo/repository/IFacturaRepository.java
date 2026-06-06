package com.back.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.demo.models.Factura;


@Repository
public interface IFacturaRepository extends JpaRepository<Factura, Long>{
    
}
