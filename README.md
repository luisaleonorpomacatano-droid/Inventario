# SCTA - Sistema de Control de Activos Tecnológicos

Este proyecto es una plataforma frontend premium en **Modo Oscuro** diseñada para centralizar, automatizar y auditar el ciclo de vida completo de los **Activos Tecnológicos (TI)** dentro de una organización (laptops, servidores, impresoras, switches, routers, periféricos y accesorios).

La aplicación resuelve de forma directa los problemas derivados de la gestión manual (hojas de cálculo dispersas, actas físicas independientes y coordinaciones verbales), proporcionando trazabilidad, control de garantías y automatización de la documentación de entrega.

---

## 💻 Características y Módulos del Sistema

El sistema está estructurado en módulos interactivos de alta fidelidad:

1. **Dashboard de Activos**: 
   - Indicadores estadísticos en tiempo real sobre activos totales, asignados, disponibles, en soporte técnico y alertas críticas de garantías.
   - Historial cronológico automatizado (Timeline) para auditar cada movimiento registrado de los equipos.
2. **Módulo de Activos Tecnológicos (`assets.html`)**:
   - Registro y catalogación de hardware (Marca, Modelo, Número de Serie, Código Patrimonial, Fecha de Compra, Duración de Garantía, Ubicación inicial y observaciones).
   - Listado interactivo con buscador y filtros rápidos por estado del activo.
3. **Módulo de Categorías (`categories.html`)**:
   - Clasificación de equipamiento (Laptops, Servidores, Impresoras, Monitores, Switches, etc.) para ordenar el inventario.
4. **Módulo de Colaboradores (`employees.html`)**:
   - Registro del personal corporativo elegible para recibir hardware, asociando su área (TI, Comercial, Administración) y sede física.
5. **Módulo de Proveedores (`providers.html`)**:
   - Directorio de proveedores de tecnología (RUC, Nombre, Teléfono, Correo) para gestionar compras y reclamos de soporte técnico.
6. **Módulo de Garantías (`warranties.html`)**:
   - Monitoreo del estado de garantía (Vigente / Por Vencer / Vencida) calculado automáticamente según la fecha de compra de cada activo.
7. **Módulo de Asignaciones (`assignments.html`)**:
   - Entrega formal de activos. Genera de forma automática un **Acta de Conformidad y Responsabilidad** optimizada para impresión física o guardado en PDF.
   - Retorno y devolución de equipos al stock disponible.
8. **Módulo de Mantenimiento (`maintenance.html`)**:
   - Registro de soporte preventivo y correctivo, asignando técnicos y registrando la solución aplicada antes de volver a habilitar los equipos.
9. **Módulo de Solicitudes (`requests.html`)**:
   - Flujo visual de aprobación de requerimientos de hardware para colaboradores de la empresa.
10. **Seguridad y Acceso (`index.html` & `admin.html`)**:
    - Inicio de sesión interactivo y administración de usuarios técnicos y roles (Administrador, Soporte TI, Jefe de TI).

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3**: Maquetación semántica y diseño visual personalizado con variables CSS (Temas HSL, Glassmorphism, animaciones suaves en hover y adaptabilidad responsiva completa).
- **JavaScript (ES6)**: Lógica interactiva en cliente.
- **Base de Datos Local (localStorage)**: Implementada en `js/db.js` para simular persistencia total de datos en tiempo real entre todas las páginas del sistema sin requerir base de datos externa.
- **jQuery (v1.11.2)**: Manipulación ágil de elementos del DOM.
- **SweetAlert2**: Ventanas emergentes y alertas estilizadas para confirmaciones interactivas (salidas, eliminaciones, devoluciones).
- **Material Design Lite (MDL)**: Estética basada en las guías de Material Design de Google.

---

## 🚀 Cómo Ejecutar el Proyecto

Dado que el proyecto es una aplicación web estática, no necesitas instalar dependencias de desarrollo complejas.

### Servidor Local HTTP (Recomendado)
Para evitar bloqueos de seguridad del navegador con archivos locales (`file://`), levanta un servidor HTTP local en la raíz del proyecto:

1. **Usando Python**:
   ```bash
   python -m http.server 8000
   ```
2. **Usando Node.js**:
   ```bash
   npx http-server -p 8000
   ```

Abre en tu navegador: **[http://localhost:8000](http://localhost:8000)**

### Credenciales de Prueba
Puedes iniciar sesión con cualquier dato, o bien usar las credenciales oficiales registradas en el sistema:
- **Usuario**: `admin`
- **Contraseña**: `admin123`
