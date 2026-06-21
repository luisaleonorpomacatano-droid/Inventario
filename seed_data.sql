-- =========================================================================
-- SCTA: Script de Carga de Datos de Prueba (Seeding) para Supabase
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase para
-- cargar un inventario inicial realista de datos.
-- =========================================================================

-- 0. Ajustes y preparación de tablas para desarrollo (Desactivar RLS)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ubicacion VARCHAR(150);

ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_activos DISABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE activos_tecnologicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE mantenimientos DISABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes DISABLE ROW LEVEL SECURITY;
ALTER TABLE historial_activos DISABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_activos DISABLE ROW LEVEL SECURITY;

-- 1. Insertar Áreas (si no existen)
INSERT INTO areas (nombre) VALUES 
('Soporte TI'), 
('Administración'), 
('Comercial'), 
('Recursos Humanos'), 
('Finanzas'),
('Operaciones'),
('Marketing'),
('Legal')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Insertar Categorías de Activos (si no existen)
INSERT INTO categorias_activos (codigo, nombre) VALUES 
('CAT01', 'Laptop'), 
('CAT02', 'Servidor'), 
('CAT03', 'Impresora'), 
('CAT04', 'Monitor'), 
('CAT05', 'Switch / Router'), 
('CAT06', 'Teclado / Mouse')
ON CONFLICT (codigo) DO NOTHING;

-- 3. Insertar Proveedores
INSERT INTO proveedores (ruc, nombre, telefono, correo, direccion) VALUES 
('20100045612', 'Deltron S.A.', '999888777', 'ventas@deltron.com.pe', 'Av. Aramburú 546, Surquillo, Lima'),
('20300456891', 'Ingram Micro Perú', '944555666', 'corporativo@ingram.com', 'Av. El Derby 250, Santiago de Surco, Lima'),
('20500123456', 'Lenovo Perú', '988777666', 'soporte@lenovo.com', 'Av. Canaval y Moreyra 480, San Isidro, Lima'),
('20600128954', 'HP Inc. Perú', '955444333', 'contacto@hp.com.pe', 'Av. Víctor Andrés Belaúnde 147, San Isidro, Lima'),
('20450912384', 'Importaciones Compumax', '912345678', 'ventas@compumax.com', 'Av. Garcilaso de la Vega 1250, Lima Centro')
ON CONFLICT (ruc) DO NOTHING;

-- 4. Insertar Usuarios / Colaboradores
-- Se obtienen los IDs de rol y área correspondientes en las subconsultas
INSERT INTO usuarios (dni, nombres, apellidos, correo, telefono, contrasena, id_rol, id_area, estado, ubicacion) VALUES 
('12345678', 'Administrador', 'Soporte TI', 'soporte.admin@empresa.com', '999999999', 'admin123', 1, (SELECT id FROM areas WHERE nombre='Soporte TI' LIMIT 1), 'Activo', 'Oficina San Borja'),
('45781290', 'Juan', 'Pérez', 'juan.perez@empresa.com', '912345678', 'juan123', 4, (SELECT id FROM areas WHERE nombre='Administración' LIMIT 1), 'Activo', 'Oficina San Borja'),
('70213456', 'María', 'López', 'maria.lopez@empresa.com', '987654321', 'maria123', 4, (SELECT id FROM areas WHERE nombre='Comercial' LIMIT 1), 'Activo', 'Oficina San Borja'),
('89765432', 'Carlos', 'Gómez', 'carlos.gomez@empresa.com', '933444555', 'carlos123', 4, (SELECT id FROM areas WHERE nombre='Recursos Humanos' LIMIT 1), 'Activo', 'Oficina Miraflores'),
('41235678', 'Ana', 'Rodríguez', 'ana.rodriguez@empresa.com', '922888777', 'ana123', 4, (SELECT id FROM areas WHERE nombre='Finanzas' LIMIT 1), 'Activo', 'Sede Arequipa'),
('71829384', 'Luis', 'Torres', 'luis.torres@empresa.com', '944833211', 'luis123', 4, (SELECT id FROM areas WHERE nombre='Operaciones' LIMIT 1), 'Activo', 'Teletrabajo / Remoto'),
('09283746', 'Diana', 'Cabrera', 'diana.cabrera@empresa.com', '988273645', 'diana123', 4, (SELECT id FROM areas WHERE nombre='Marketing' LIMIT 1), 'Activo', 'Oficina Miraflores'),
('40293847', 'Pedro', 'Morales', 'pedro.morales@empresa.com', '911223344', 'pedro123', 4, (SELECT id FROM areas WHERE nombre='Legal' LIMIT 1), 'Activo', 'Oficina San Borja'),
('18273645', 'Sofía', 'Vega', 'sofia.vega@empresa.com', '955667788', 'sofia123', 4, (SELECT id FROM areas WHERE nombre='Finanzas' LIMIT 1), 'Activo', 'Teletrabajo / Remoto'),
('29384756', 'Miguel', 'Ángel', 'miguel.angel@empresa.com', '966778899', 'miguel123', 4, (SELECT id FROM areas WHERE nombre='Operaciones' LIMIT 1), 'Activo', 'Sede Arequipa')
ON CONFLICT (dni) DO NOTHING;

-- 5. Insertar Activos Tecnológicos
INSERT INTO activos_tecnologicos (codigo_activo, id_categoria, marca, modelo, numero_serie, id_proveedor, fecha_compra, fecha_fin_garantia, estado, ubicacion, observaciones) VALUES 
('LAP-001', (SELECT id FROM categorias_activos WHERE nombre='Laptop' LIMIT 1), 'Lenovo', 'ThinkPad E14 Gen 4', 'LNV8947592', (SELECT id FROM proveedores WHERE nombre='Lenovo Perú' LIMIT 1), '2025-04-10', '2026-04-10', 'Disponible', 'Oficina San Borja', 'Con cargador y mouse inalámbrico.'),
('LAP-002', (SELECT id FROM categorias_activos WHERE nombre='Laptop' LIMIT 1), 'Dell', 'Latitude 3420', 'DLL7834521', (SELECT id FROM proveedores WHERE nombre='Deltron S.A.' LIMIT 1), '2025-08-15', '2027-08-15', 'Asignado', 'Oficina San Borja', 'Operativo, recién formateado.'),
('LAP-003', (SELECT id FROM categorias_activos WHERE nombre='Laptop' LIMIT 1), 'HP', 'ProBook 440 G9', 'HP9872352', (SELECT id FROM proveedores WHERE nombre='HP Inc. Perú' LIMIT 1), '2025-10-01', '2026-10-01', 'Disponible', 'Oficina Miraflores', 'Equipo de alta performance, 16GB RAM.'),
('LAP-004', (SELECT id FROM categorias_activos WHERE nombre='Laptop' LIMIT 1), 'Apple', 'MacBook Air M2', 'APL9834721', (SELECT id FROM proveedores WHERE nombre='Ingram Micro Perú' LIMIT 1), '2025-06-20', '2026-06-20', 'Asignado', 'Teletrabajo / Remoto', 'Asignado a diseño/marketing.'),
('SRV-001', (SELECT id FROM categorias_activos WHERE nombre='Servidor' LIMIT 1), 'HP', 'ProLiant DL360 Gen10', 'HPG934521', (SELECT id FROM proveedores WHERE nombre='Ingram Micro Perú' LIMIT 1), '2024-01-05', '2027-01-05', 'Disponible', 'Oficina Miraflores', 'Servidor de base de datos local.'),
('SRV-002', (SELECT id FROM categorias_activos WHERE nombre='Servidor' LIMIT 1), 'Dell', 'PowerEdge R750', 'DLLE983452', (SELECT id FROM proveedores WHERE nombre='Deltron S.A.' LIMIT 1), '2024-06-12', '2027-06-12', 'Disponible', 'Oficina Miraflores', 'Servidor de virtualización.'),
('MON-001', (SELECT id FROM categorias_activos WHERE nombre='Monitor' LIMIT 1), 'LG', 'Ultragear 24"', 'LGM984312', (SELECT id FROM proveedores WHERE nombre='Deltron S.A.' LIMIT 1), '2025-05-12', '2026-05-12', 'En mantenimiento', 'Oficina San Borja', 'Pantalla parpadea intermitentemente.'),
('MON-002', (SELECT id FROM categorias_activos WHERE nombre='Monitor' LIMIT 1), 'Samsung', 'Curvo 27"', 'SAM874392', (SELECT id FROM proveedores WHERE nombre='Importaciones Compumax' LIMIT 1), '2025-11-18', '2026-11-18', 'Asignado', 'Oficina San Borja', 'Perfecto estado, sin rayaduras.'),
('MON-003', (SELECT id FROM categorias_activos WHERE nombre='Monitor' LIMIT 1), 'Dell', 'P2422H', 'DLLM734891', (SELECT id FROM proveedores WHERE nombre='Deltron S.A.' LIMIT 1), '2025-02-14', '2028-02-14', 'Disponible', 'Oficina Miraflores', 'Monitor para oficina estándar.'),
('IMP-001', (SELECT id FROM categorias_activos WHERE nombre='Impresora' LIMIT 1), 'Epson', 'Ecotank L3250', 'EPS8273641', (SELECT id FROM proveedores WHERE nombre='Importaciones Compumax' LIMIT 1), '2025-03-01', '2026-03-01', 'Disponible', 'Oficina San Borja', 'Multifuncional con sistema continuo.'),
('IMP-002', (SELECT id FROM categorias_activos WHERE nombre='Impresora' LIMIT 1), 'HP', 'LaserJet Pro M404dw', 'HPIP837492', (SELECT id FROM proveedores WHERE nombre='HP Inc. Perú' LIMIT 1), '2024-11-10', '2025-11-10', 'Disponible', 'Oficina Miraflores', 'Impresora láser blanco y negro, red/wifi.'),
('SWT-001', (SELECT id FROM categorias_activos WHERE nombre='Switch / Router' LIMIT 1), 'Cisco', 'Catalyst 2960-L', 'CSCO837492', (SELECT id FROM proveedores WHERE nombre='Ingram Micro Perú' LIMIT 1), '2024-08-01', '2027-08-01', 'Disponible', 'Oficina San Borja', 'Switch administrable de 24 puertos.'),
('SWT-002', (SELECT id FROM categorias_activos WHERE nombre='Switch / Router' LIMIT 1), 'TP-Link', 'TL-SG1024D', 'TPL7384920', (SELECT id FROM proveedores WHERE nombre='Importaciones Compumax' LIMIT 1), '2025-01-20', '2027-01-20', 'Disponible', 'Oficina Miraflores', 'Switch no administrable de 24 puertos.'),
('ACC-001', (SELECT id FROM categorias_activos WHERE nombre='Teclado / Mouse' LIMIT 1), 'Logitech', 'Combo MK235 Wireless', 'LOG9834729', (SELECT id FROM proveedores WHERE nombre='Importaciones Compumax' LIMIT 1), '2025-05-01', '2026-05-01', 'Asignado', 'Oficina San Borja', 'Teclado y mouse inalámbricos.'),
('ACC-002', (SELECT id FROM categorias_activos WHERE nombre='Teclado / Mouse' LIMIT 1), 'Microsoft', 'Wired Desktop 600', 'MSF7384912', (SELECT id FROM proveedores WHERE nombre='Deltron S.A.' LIMIT 1), '2025-09-10', '2026-09-10', 'Disponible', 'Oficina Miraflores', 'Combo USB alámbrico.')
ON CONFLICT (codigo_activo) DO NOTHING;

-- 6. Insertar Asignaciones Activas
-- Nota: Para que el sistema funcione correctamente, enlazamos el activo con el usuario.
INSERT INTO asignaciones (id_activo, id_usuario, fecha_asignacion, estado, observaciones, documento_acta) VALUES 
((SELECT id FROM activos_tecnologicos WHERE codigo_activo='LAP-002' LIMIT 1), (SELECT id FROM usuarios WHERE dni='45781290' LIMIT 1), '2025-08-16', 'Activa', 'Entregado con cargador original, mochila de transporte y mouse.', 'ACTA-TI-734892'),
((SELECT id FROM activos_tecnologicos WHERE codigo_activo='LAP-004' LIMIT 1), (SELECT id FROM usuarios WHERE dni='09283746' LIMIT 1), '2025-06-21', 'Activa', 'Apple MacBook Air para diseño gráfico. Licencia Adobe activa.', 'ACTA-TI-183492'),
((SELECT id FROM activos_tecnologicos WHERE codigo_activo='MON-002' LIMIT 1), (SELECT id FROM usuarios WHERE dni='45781290' LIMIT 1), '2025-11-19', 'Activa', 'Monitor complementario para desarrollo.', 'ACTA-TI-903482'),
((SELECT id FROM activos_tecnologicos WHERE codigo_activo='ACC-001' LIMIT 1), (SELECT id FROM usuarios WHERE dni='45781290' LIMIT 1), '2025-08-16', 'Activa', 'Entregado con pilas AA nuevas.', 'ACTA-TI-734893')
ON CONFLICT (documento_acta) DO NOTHING;

-- 7. Insertar Historial de Mantenimientos
INSERT INTO mantenimientos (id_activo, tipo_mantenimiento, descripcion, fecha_inicio, tecnico_responsable, estado_final) VALUES 
((SELECT id FROM activos_tecnologicos WHERE codigo_activo='MON-001' LIMIT 1), 'Correctivo', 'Pantalla parpadea intermitentemente al encender.', '2026-06-15', 'Julio Silva - Técnico Deltron', 'En proceso'),
((SELECT id FROM activos_tecnologicos WHERE codigo_activo='LAP-001' LIMIT 1), 'Preventivo', 'Mantenimiento preventivo anual, limpieza de ventiladores y cambio de pasta térmica.', '2026-05-10', 'Diego Salas - Soporte TI', 'Completado'),
((SELECT id FROM activos_tecnologicos WHERE codigo_activo='LAP-003' LIMIT 1), 'Preventivo', 'Optimización de software y actualización a Windows 11.', '2026-04-05', 'Diego Salas - Soporte TI', 'Completado')
ON CONFLICT (id) DO NOTHING;

-- Actualizar fecha_fin y estado final de los mantenimientos completados
UPDATE mantenimientos SET fecha_fin = '2026-05-11', estado_final = 'Completado' WHERE id_activo = (SELECT id FROM activos_tecnologicos WHERE codigo_activo='LAP-001' LIMIT 1);
UPDATE mantenimientos SET fecha_fin = '2026-04-05', estado_final = 'Completado' WHERE id_activo = (SELECT id FROM activos_tecnologicos WHERE codigo_activo='LAP-003' LIMIT 1);

-- 8. Insertar Solicitudes de Equipos
INSERT INTO solicitudes (id_usuario, tipo_equipo, motivo, fecha_solicitud, estado, aprobado_por) VALUES 
((SELECT id FROM usuarios WHERE dni='89765432' LIMIT 1), 'Laptop', 'Laptop actual Lenovo tiene fallas constantes en el teclado.', '2026-06-18', 'Pendiente', NULL),
((SELECT id FROM usuarios WHERE dni='41235678' LIMIT 1), 'Monitor', 'Requiere un segundo monitor para cuadres de caja y Excel.', '2026-06-14', 'Aprobada', 'Jefe de Finanzas'),
((SELECT id FROM usuarios WHERE dni='71829384' LIMIT 1), 'Teclado / Mouse', 'Mouse actual dañado por derrame de líquido.', '2026-06-10', 'Rechazada', 'Soporte TI Admin')
ON CONFLICT (id) DO NOTHING;
