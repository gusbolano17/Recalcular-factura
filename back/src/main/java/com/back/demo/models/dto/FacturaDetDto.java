package com.back.demo.models.dto;

import java.math.BigDecimal;

public record FacturaDetDto(Long id, Long cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
    
}
