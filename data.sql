INSERT INTO FACTURA(cliente,numero,total,estado,fecha_creacion,impuestos,subtotal,usuario)
VALUES('Maribel Ramirez', '0002', 178500.00, 'activa', '2026-06-07 00:00:00', 28500.00, 150000.00, 'operador'),
('Jorge Segura', '0001', 95200.00, 'activa', '2026-06-06 00:00:00',15200.00,80000.00,'supervisor');

INSERT INTO DETALLE_FACTURA(cantidad,precio_unitario, producto,subtotal,factura_id)
VALUES(2 ,30000.00,Blusa manga corta, 60000.00, 2)
  (2 ,45000.00,Falda de jean larga, 90000.00, 2)
  (1 ,50000.00,camisa manga larga, 50000.00, 1)
  (1 ,30000.00,pantalon clasico, 30000.00, 1);



  