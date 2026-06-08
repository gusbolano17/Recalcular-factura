package com.back.demo.models.dto;

import java.math.BigDecimal;

public record FacturaReq(Long id, String usuario ,BigDecimal nuevoValor) {
}
