package com.back.demo.models.dto;

import java.math.BigDecimal;
import java.util.List;


public record FacturaResp(List<FacturaDetDto> detalle, BigDecimal impuestos) {
    
}
