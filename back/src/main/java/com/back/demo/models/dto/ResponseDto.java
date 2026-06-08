package com.back.demo.models.dto;

public record ResponseDto<T>(String mensaje, Integer codigo ,T body) {
    
}
