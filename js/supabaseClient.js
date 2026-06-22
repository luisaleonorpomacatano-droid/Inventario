/**
 * supabaseClient.js
 * ─────────────────────────────────────────────────────────────
 * Inicialización centralizada del cliente Supabase para SCTA.
 *
 * Proyecto  : Sistema de Control de Activos Tecnológicos (SCTA)
 * Supabase  : https://jsyvxgztrpotexsfqpji.supabase.co
 *
 * Tablas conectadas:
 *  - roles                 (catálogo de roles de usuario)
 *  - areas                 (áreas / departamentos)
 *  - usuarios              (colaboradores y administradores)
 *  - proveedores           (proveedores de activos)
 *  - categorias_activos    (tipos de activo tecnológico)
 *  - activos_tecnologicos  (inventario principal)
 *  - solicitudes           (solicitudes de equipo)
 *  - asignaciones          (control de entregas / actas)
 *  - mantenimientos        (registro de mantenimientos)
 *  - historial_activos     (trazabilidad de activos)
 *  - documentos_activos    (documentos adjuntos)
 *
 * Uso (desde cualquier HTML de la app):
 *   <!-- 1. Cargar Supabase desde CDN -->
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <!-- 2. Cargar este archivo -->
 *   <script src="js/supabaseClient.js"></script>
 *   <!-- 3. Usar el cliente global -->
 *   <script>
 *     const { data } = await SupabaseClient.from('activos_tecnologicos').select('*');
 *   </script>
 * ─────────────────────────────────────────────────────────────
 */

(function (global) {
  'use strict';

  // ── Credenciales ────────────────────────────────────────────
  // Leídas desde config/config.json en tiempo de ejecución.
  // Coinciden con las variables definidas en .env:
  //   NEXT_PUBLIC_SUPABASE_URL  → SUPABASE_URL
  //   NEXT_PUBLIC_SUPABASE_ANON_KEY → SUPABASE_ANON_KEY
  const SUPABASE_URL      = 'https:example.co'; // Reemplaza con tu URL real pru
  const SUPABASE_ANON_KEY = 'eyJhbGc';// Reemplaza con tu clave anónima real

  // ── Mapa de tablas ─────────────────────────────────────────
  // Referencia rápida a todos los nombres de tabla del esquema.
  const TABLES = Object.freeze({
    roles              : 'roles',
    areas              : 'areas',
    usuarios           : 'usuarios',
    proveedores        : 'proveedores',
    categorias         : 'categorias_activos',
    activos            : 'activos_tecnologicos',
    solicitudes        : 'solicitudes',
    asignaciones       : 'asignaciones',
    mantenimientos     : 'mantenimientos',
    historial          : 'historial_activos',
    documentos         : 'documentos_activos',
  });

  // ── Creación del cliente ───────────────────────────────────
  let _client = null;

  /**
   * Devuelve el cliente Supabase singleton.
   * Requiere que `window.supabase` esté disponible (CDN cargado).
   * @returns {import('@supabase/supabase-js').SupabaseClient}
   */
  function getClient() {
    if (_client) return _client;

    if (!global.supabase || typeof global.supabase.createClient !== 'function') {
      throw new Error(
        '[supabaseClient] La librería @supabase/supabase-js no está cargada. ' +
        'Asegúrate de incluir el script CDN antes de este archivo.'
      );
    }

    _client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: { 'x-app-name': 'SCTA-Inventario' },
      },
    });

    console.info('[SCTA] Cliente Supabase inicializado → ' + SUPABASE_URL);
    return _client;
  }

  // ── API pública ────────────────────────────────────────────
  global.SupabaseClient = getClient();
  global.SCTA_TABLES    = TABLES;

  // Alias de conveniencia: permite usar SupabaseClient igual que el
  // cliente nativo (ej: SupabaseClient.from('activos_tecnologicos').select('*'))
  console.info('[SCTA] Tablas disponibles:', Object.values(TABLES).join(', '));

})(window);
