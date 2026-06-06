package com.back.demo.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "factura")
@Getter
@Setter
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numero;
    private String cliente;
    private String usuario;
    private String estado;
    private BigDecimal subtotal;
    private BigDecimal impuestos;
    private BigDecimal total;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "factura")
    private List<DetalleFactura> detallesFactura;

}
