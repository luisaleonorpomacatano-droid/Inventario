-- =========================================================================
-- SCTA: Script de Creacion de Tablas para Supabase
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase.
-- =========================================================================

-- 1. Tabla de Roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Tabla de Áreas
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Tabla de Usuarios (Soporte TI, Jefes y Colaboradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(8) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(9),
    contrasena VARCHAR(255), -- Para inicio de sesión
    id_rol INT REFERENCES roles(id) ON DELETE SET NULL,
    id_area INT REFERENCES areas(id) ON DELETE SET NULL,
    estado VARCHAR(50) DEFAULT 'Activo', -- Activo / Inactivo
    ubicacion VARCHAR(150) -- Sede o ubicación del colaborador
);

-- 4. Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id SERIAL PRIMARY KEY,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    correo VARCHAR(100),
    direccion TEXT
);

-- 5. Tabla de Categorías de Activos
CREATE TABLE IF NOT EXISTS categorias_activos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL
);

-- 6. Tabla Principal: Activos Tecnológicos
CREATE TABLE IF NOT EXISTS activos_tecnologicos (
    id SERIAL PRIMARY KEY,
    codigo_activo VARCHAR(50) UNIQUE NOT NULL,
    id_categoria INT REFERENCES categorias_activos(id) ON DELETE RESTRICT,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(150) UNIQUE NOT NULL,
    id_proveedor INT REFERENCES proveedores(id) ON DELETE SET NULL,
    fecha_compra DATE,
    fecha_fin_garantia DATE,
    estado VARCHAR(50) DEFAULT 'Disponible', -- Disponible, Asignado, En mantenimiento, Dado de baja
    ubicacion VARCHAR(150),
    observaciones TEXT
);

-- 7. Tabla de Solicitudes de Equipos
CREATE TABLE IF NOT EXISTS solicitudes (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id) ON DELETE CASCADE, -- Solicitante
    tipo_equipo VARCHAR(100) NOT NULL, -- Categoria del equipo solicitado
    motivo TEXT,
    fecha_solicitud DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente', -- Pendiente, Aprobada, Rechazada
    aprobado_por VARCHAR(150) -- Nombre de quien autoriza
);

-- 8. Tabla de Asignaciones (Control de entregas y actas)
CREATE TABLE IF NOT EXISTS asignaciones (
    id SERIAL PRIMARY KEY,
    id_activo INT REFERENCES activos_tecnologicos(id) ON DELETE RESTRICT,
    id_usuario INT REFERENCES usuarios(id) ON DELETE RESTRICT, -- Colaborador custodio
    fecha_asignacion DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Activa', -- Activa / Devuelto
    observaciones TEXT,
    documento_acta VARCHAR(100) UNIQUE, -- Nro. de acta autogenerada
    fecha_devolucion DATE,
    notas_devolucion TEXT
);

-- 9. Tabla de Mantenimientos
CREATE TABLE IF NOT EXISTS mantenimientos (
    id SERIAL PRIMARY KEY,
    id_activo INT REFERENCES activos_tecnologicos(id) ON DELETE CASCADE,
    tipo_mantenimiento VARCHAR(50) NOT NULL, -- Preventivo / Correctivo / Garantía
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    tecnico_responsable VARCHAR(150),
    estado_final VARCHAR(50) -- Disponible, Dado de baja
);

-- 10. Tabla de Historial / Trazabilidad de Activos
CREATE TABLE IF NOT EXISTS historial_activos (
    id SERIAL PRIMARY KEY,
    id_activo INT REFERENCES activos_tecnologicos(id) ON DELETE CASCADE,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento VARCHAR(100) NOT NULL, -- Registro, Asignacion, Mantenimiento, Devolucion, Baja
    responsable VARCHAR(150), -- Usuario de Soporte que realiza el cambio
    observaciones TEXT
);

-- 11. Tabla de Documentos Asociados
CREATE TABLE IF NOT EXISTS documentos_activos (
    id SERIAL PRIMARY KEY,
    id_activo INT REFERENCES activos_tecnologicos(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(100) NOT NULL, -- Acta de entrega, Cargo, Factura, Baja
    nombre_archivo VARCHAR(255) NOT NULL,
    url_archivo TEXT NOT NULL,
    fecha_subida DATE DEFAULT CURRENT_DATE
);

-- =========================================================================
-- SEMILLA DE DATOS INICIALES (DEFAULT VALUES)
-- =========================================================================

-- Seed Roles
INSERT INTO roles (nombre) VALUES 
('Administrador'), 
('Soporte TI'), 
('Jefe de Area'), 
('Colaborador')
ON CONFLICT (nombre) DO NOTHING;

-- Seed Áreas
INSERT INTO areas (nombre) VALUES 
('Soporte TI'), 
('Administracion'), 
('Comercial'), 
('Recursos Humanos'), 
('Finanzas')
ON CONFLICT (nombre) DO NOTHING;

-- Seed Categorías de Activos
INSERT INTO categorias_activos (codigo, nombre) VALUES 
('CAT01', 'Laptop'), 
('CAT02', 'Servidor'), 
('CAT03', 'Impresora'), 
('CAT04', 'Monitor'), 
('CAT05', 'Switch / Router'), 
('CAT06', 'Teclado / Mouse')
ON CONFLICT (codigo) DO NOTHING;

-- Seed Proveedores
INSERT INTO proveedores (ruc, nombre, telefono, correo, direccion) VALUES 
('20100045612', 'Deltron S.A.', '999888777', 'ventas@deltron.com.pe', 'Av. Aramburú 546, Surquillo'),
('20300456891', 'Ingram Micro', '944555666', 'corporativo@ingram.com', 'Av. El Derby 250, Santiago de Surco'),
('20500123456', 'Lenovo Perú', '988777666', 'soporte@lenovo.com', 'San Isidro, Lima')
ON CONFLICT (ruc) DO NOTHING;

-- Seed Usuarios (Administrador por defecto)
-- Contrasena inicial simulada: admin123
INSERT INTO usuarios (dni, nombres, apellidos, correo, telefono, contrasena, id_rol, id_area) VALUES 
('12345678', 'Administrador', 'Soporte TI', 'soporte.admin@empresa.com', '999999999', 'admin123', 1, 1),
('45781290', 'Juan', 'Pérez', 'juan.perez@empresa.com', '912345678', 'juan123', 4, 2),
('70213456', 'María', 'López', 'maria.lopez@empresa.com', '987654321', 'maria123', 4, 3)
ON CONFLICT (dni) DO NOTHING;
