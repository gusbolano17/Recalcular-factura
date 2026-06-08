# Recalculo de Factura

Aplicación web para recalcular facturas con validación de topes según el tipo del usuario. Los **aumentos** están limitados a **20 000 para operador** y **50 000 para supervisor**; los **descuentos** no tienen restricción. El recálculo redistribuye proporcionalmente la diferencia entre las líneas de detalle y recalcula el impuesto (19 %).

## Stack tecnológico

| Capa      | Tecnología                                    |
| --------- | --------------------------------------------- |
| Frontend  | Angular 21 + Angular Material + Tailwind CSS 4 |
| Backend   | Spring Boot 4.0.6 + Java 21                   |
| BD        | PostgreSQL                                    |
| Contenedor| Docker (solo la base de datos)                |
| Build     | Maven (backend), npm (frontend)               |

## Prerrequisitos

- Docker(Desktop si estas en Windows o MacOS)
- Node.js 20+ y npm
- Java 21 JDK
- (Opcional) Cliente PostgreSQL como pgadmin, psql, etc.

## Estructura del proyecto

```
├── docker-compose.yml          # Servicio de PostgreSQL
├── back/                       # Spring Boot
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/back/demo/
│       │   ├── controller/     # FacturaController
│       │   ├── service/        # FacturaService
│       │   ├── models/         # Entidades y DTOs
│       │   └── repository/     # JPA repositories
│       └── resources/
│           ├── application.yaml
│           └── data.sql
└── front/                      # Angular
    ├── package.json
    └── src/app/
        ├── components/         # lista-facturas, vista-factura
        ├── services/           # factura.service
        └── models/             # Interfaces TypeScript
```

## Ejecución en desarrollo

### 1. Iniciar PostgreSQL

```bash
docker-compose up -d
```

Esto levanta un contenedor con PostgreSQL con el puerto expuesto incluido tambien el schema de la base de datos.

### 2. Ejecutar backend

```bash
cd back
./mvnw spring-boot:run
```

- El archivo `data.sql` se ejecuta automáticamente al arrancar Spring Boot (inserta con datos de prueba tanto en factura como en sus detalles).
- El backend queda disponible en `http://localhost:8080`.

### 3. Ejecutar frontend

```bash
cd front
npm install
ng serve
```

- El frontend queda disponible en `http://localhost:4200`.

## Lógica de recálculo

1. Se calcula la diferencia entre el subtotal actual y el nuevo subtotal solicitado.
2. Si el nuevo subtotal es **menor** (descuento): la diferencia se redistribuye proporcionalmente entre todos los items sin restricciones.
3. Si el nuevo subtotal es **mayor** (aumento): se valida que el incremento no supere el tope del rol:
   - `operador` → máximo **20 000** de aumento.
   - `supervisor` → máximo **50 000** de aumento.
   - Si supera el tope, se rechaza la operación.
4. Si pasa la validación, la diferencia se redistribuye proporcionalmente según el peso de cada ítem en el subtotal original.
5. El impuesto se recalcula usando el IVA sobre la base del subtotal.
