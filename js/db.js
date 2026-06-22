// Sistema de Control de Activos Tecnológicos - Motor Supabase API REST
const DB = {
    client: null,
    
    async loadScript(url) {
        return new Promise((resolve, reject) => {
            if (window.supabase) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    async getClient() {
        if (this.client) return this.client;

        // ── Prioridad 1: usar el cliente centralizado de supabaseClient.js ──
        if (window.SupabaseClient) {
            console.info('[DB] Usando cliente Supabase de supabaseClient.js');
            this.client = window.SupabaseClient;
            this.checkAndSeed();
            return this.client;
        }

        // ── Prioridad 2: cargar Supabase desde CDN y leer config.json ────
        await this.loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');

        let url = 'https://jsyvxgztrpotexsfqpji.supabase.co';
        let key = localStorage.getItem('supabase_anon_key');

        // Intentar cargar la Anon Key desde config/config.json
        try {
            const response = await fetch('config/config.json');
            if (response.ok) {
                const config = await response.json();
                if (config.supabaseAnonKey && config.supabaseAnonKey !== 'TU_SUPABASE_ANON_KEY_AQUI') {
                    key = config.supabaseAnonKey.trim();
                    url = (config.supabaseUrl || url).replace(/\/rest\/v1\/?$/, '');
                }
            }
        } catch (e) {
            console.log('No se pudo cargar la configuración de config/config.json, usando almacenamiento local:', e);
        }

        // ── Prioridad 3: solicitar clave al usuario ──────────────────────
        if (!key) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    swal({
                        title: 'Conexión a Supabase',
                        text: 'Ingresa tu anon public key para sincronizar el inventario en la nube de Supabase (o configúrala en config/config.json):',
                        type: 'input',
                        showCancelButton: false,
                        closeOnConfirm: true,
                        inputPlaceholder: 'Pega tu anon public key aquí...'
                    }, function(inputValue) {
                        if (inputValue) {
                            localStorage.setItem('supabase_anon_key', inputValue.trim());
                            location.reload();
                        }
                    });
                }, 500);
            });
            return null;
        }

        this.client = window.supabase.createClient(url, key);

        // Ejecutar semillero automático en segundo plano si las tablas están vacías
        this.checkAndSeed();

        return this.client;
    },

    // Helper para obtener o crear un área por nombre
    async getOrCreateArea(areaName) {
        const client = await this.getClient();
        if (!client) return null;
        
        const { data: existing } = await client.from('areas').select('id').eq('nombre', areaName).maybeSingle();
        if (existing) return existing.id;
        
        const { data: inserted, error } = await client.from('areas').insert([{ nombre: areaName }]).select('id').single();
        if (error) {
            console.error('Error creating area:', error);
            return null;
        }
        return inserted.id;
    },

    // Helper para obtener o crear una categoría por nombre
    async getOrCreateCategory(catName) {
        const client = await this.getClient();
        if (!client) return null;
        
        const { data: existing } = await client.from('categorias_activos').select('id').eq('nombre', catName).maybeSingle();
        if (existing) return existing.id;
        
        const code = 'CAT' + Math.floor(1000 + Math.random() * 9000);
        const { data: inserted, error } = await client.from('categorias_activos').insert([{ codigo: code, nombre: catName }]).select('id').single();
        if (error) {
            console.error('Error creating category:', error);
            return null;
        }
        return inserted.id;
    },

    calculateWarrantyMonths(purchaseDate, expiryDate) {
        if (!purchaseDate || !expiryDate) return 12;
        const start = new Date(purchaseDate);
        const end = new Date(expiryDate);
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return Math.max(0, diffMonths);
    },

    calculateExpiryDate(purchaseDate, warrantyMonths) {
        if (!purchaseDate) return null;
        const date = new Date(purchaseDate);
        date.setMonth(date.getMonth() + (parseInt(warrantyMonths) || 12));
        return date.toISOString().split('T')[0];
    },

    // Semillero automático si la base de datos está vacía
    async checkAndSeed() {
        try {
            const client = this.client;
            
            // Verificar si hay categorías
            const { count, error } = await client.from('categorias_activos').select('*', { count: 'exact', head: true });
            if (error) {
                console.log('Error al verificar categorias_activos (¿no existen las tablas?):', error);
                return;
            }
            
            if (count === 0) {
                // Insertar Categorías
                const { data: cats } = await client.from('categorias_activos').insert([
                    { codigo: 'CAT01', nombre: 'Laptop' },
                    { codigo: 'CAT02', nombre: 'Servidor' },
                    { codigo: 'CAT03', nombre: 'Impresora' },
                    { codigo: 'CAT04', nombre: 'Monitor' },
                    { codigo: 'CAT05', nombre: 'Switch / Router' },
                    { codigo: 'CAT06', nombre: 'Teclado / Mouse' }
                ]).select();

                // Insertar Proveedores
                const { data: provs } = await client.from('proveedores').insert([
                    { ruc: '20100045612', nombre: 'Deltron S.A.', telefono: '999888777', correo: 'ventas@deltron.com.pe', direccion: 'Av. Aramburú 546, Surquillo' },
                    { ruc: '20300456891', nombre: 'Ingram Micro', telefono: '944555666', correo: 'corporativo@ingram.com', direccion: 'Av. El Derby 250, Santiago de Surco' },
                    { ruc: '20500123456', nombre: 'Lenovo Perú', telefono: '988777666', correo: 'soporte@lenovo.com', direccion: 'San Isidro, Lima' }
                ]).select();

                // Insertar Roles por defecto si no existen
                await client.from('roles').insert([
                    { id: 1, nombre: 'Administrador' },
                    { id: 2, nombre: 'Soporte TI' },
                    { id: 3, nombre: 'Jefe de Area' },
                    { id: 4, nombre: 'Colaborador' }
                ]).select();

                const idAreaAdmin = await this.getOrCreateArea('Soporte TI');
                const idAreaAdminDept = await this.getOrCreateArea('Administración');
                const idAreaCom = await this.getOrCreateArea('Comercial');

                // Insertar Usuarios
                const { data: emps } = await client.from('usuarios').insert([
                    { dni: '45781290', nombres: 'Juan', apellidos: 'Pérez', correo: 'juan.perez@empresa.com', telefono: '912345678', id_area: idAreaAdminDept, id_rol: 4, estado: 'Activo', ubicacion: 'Oficina San Borja' },
                    { dni: '70213456', nombres: 'María', apellidos: 'López', correo: 'maria.lopez@empresa.com', telefono: '987654321', id_area: idAreaCom, id_rol: 4, estado: 'Activo', ubicacion: 'Oficina San Borja' }
                ]).select();

                if (cats && cats.length > 0 && provs && provs.length > 0) {
                    const catLaptop = cats.find(c => c.nombre === 'Laptop') || cats[0];
                    const catServer = cats.find(c => c.nombre === 'Servidor') || cats[0];
                    const catMonitor = cats.find(c => c.nombre === 'Monitor') || cats[0];

                    // Insertar Activos
                    await client.from('activos_tecnologicos').insert([
                        { codigo_activo: 'LAP-001', id_categoria: catLaptop.id, marca: 'Lenovo', modelo: 'ThinkPad E14', numero_serie: 'LNV8947592', id_proveedor: provs[2].id, fecha_compra: '2025-04-10', fecha_fin_garantia: '2026-04-10', estado: 'Disponible', ubicacion: 'Oficina San Borja', observaciones: 'Con cargador y mouse inalámbrico.' },
                        { codigo_activo: 'LAP-002', id_categoria: catLaptop.id, marca: 'Dell', modelo: 'Latitude 3420', numero_serie: 'DLL7834521', id_proveedor: provs[0].id, fecha_compra: '2025-08-15', fecha_fin_garantia: '2027-08-15', estado: 'Disponible', ubicacion: 'Oficina San Borja', observaciones: 'Operativo, recién formateado.' },
                        { codigo_activo: 'SRV-001', id_categoria: catServer.id, marca: 'HP', modelo: 'ProLiant DL360', numero_serie: 'HPG934521', id_proveedor: provs[1].id, fecha_compra: '2024-01-05', fecha_fin_garantia: '2027-01-05', estado: 'Disponible', ubicacion: 'Oficina Miraflores', observaciones: 'Servidor de base de datos local.' },
                        { codigo_activo: 'MON-001', id_categoria: catMonitor.id, marca: 'LG', modelo: 'Ultragear 24"', numero_serie: 'LGM984312', id_proveedor: provs[0].id, fecha_compra: '2025-05-12', fecha_fin_garantia: '2026-05-12', estado: 'En mantenimiento', ubicacion: 'Oficina San Borja', observaciones: 'Pantalla parpadea intermitentemente.' }
                    ]);
                }
            }
        } catch (e) {
            console.log('Error en semillero:', e);
        }
    },

    // ==========================================
    // MÉTODOS DE LA API (SUPABASE)
    // ==========================================

    // Categorías
    async getCategories() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('categorias_activos').select('*').order('id', { ascending: true });
        return (data || []).map(r => ({
            id: r.id.toString(),
            code: r.codigo,
            name: r.nombre
        }));
    },

    async saveCategory(cat) {
        const client = await this.getClient();
        if (!client) return null;
        const { data } = await client.from('categorias_activos').insert([{ codigo: cat.code, nombre: cat.name }]).select();
        return data ? { id: data[0].id.toString(), code: data[0].codigo, name: data[0].nombre } : null;
    },

    async deleteCategory(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('categorias_activos').delete().eq('id', id);
    },

    // Proveedores
    async getProviders() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('proveedores').select('*').order('id', { ascending: true });
        return (data || []).map(r => ({
            id: r.id.toString(),
            ruc: r.ruc,
            name: r.nombre,
            phone: r.telefono || '',
            email: r.correo || '',
            address: r.direccion || ''
        }));
    },

    async saveProvider(prov) {
        const client = await this.getClient();
        if (!client) return null;
        const { data } = await client.from('proveedores').insert([{
            ruc: prov.ruc,
            nombre: prov.name,
            telefono: prov.phone,
            correo: prov.email,
            direccion: prov.address
        }]).select();
        
        if (!data) return null;
        const r = data[0];
        return {
            id: r.id.toString(),
            ruc: r.ruc,
            name: r.nombre,
            phone: r.telefono || '',
            email: r.correo || '',
            address: r.direccion || ''
        };
    },

    async deleteProvider(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('proveedores').delete().eq('id', id);
    },

    // Colaboradores (Usuarios)
    async getEmployees() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('usuarios').select('*, areas(nombre)').order('id', { ascending: true });
        return (data || []).map(r => ({
            id: r.id.toString(),
            dni: r.dni,
            name: r.nombres,
            lastname: r.apellidos,
            email: r.correo,
            phone: r.telefono || '',
            area: r.areas ? r.areas.nombre : '',
            location: r.ubicacion || ''
        }));
    },

    async saveEmployee(emp) {
        const client = await this.getClient();
        if (!client) return null;
        const areaId = await this.getOrCreateArea(emp.area);
        const { data } = await client.from('usuarios').insert([{
            dni: emp.dni,
            nombres: emp.name,
            apellidos: emp.lastname,
            correo: emp.email,
            telefono: emp.phone,
            id_area: areaId,
            ubicacion: emp.location,
            id_rol: 4, // Colaborador por defecto
            estado: 'Activo'
        }]).select('*, areas(nombre)');
        
        if (!data) return null;
        const r = data[0];
        return {
            id: r.id.toString(),
            dni: r.dni,
            name: r.nombres,
            lastname: r.apellidos,
            email: r.correo,
            phone: r.telefono || '',
            area: r.areas ? r.areas.nombre : '',
            location: r.ubicacion || ''
        };
    },

    async deleteEmployee(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('usuarios').delete().eq('id', id);
    },

    // Activos
    async getAssets() {
        const client = await this.getClient();
        if (!client) return [];
        
        // Obtener activos con categoría
        const { data: assetsData } = await client.from('activos_tecnologicos').select('*, categorias_activos(nombre)').order('id', { ascending: true });
        // Obtener asignaciones activas con usuario y su área asociada
        const { data: assignmentsData } = await client.from('asignaciones').select('*, usuarios(*, areas(nombre))').eq('estado', 'Activa');
        
        return (assetsData || []).map(r => {
            const activeAsg = (assignmentsData || []).find(asg => asg.id_activo === r.id);
            const empArea = activeAsg && activeAsg.usuarios && activeAsg.usuarios.areas ? activeAsg.usuarios.areas.nombre : '';
            return {
                id: r.id.toString(),
                code: r.codigo_activo,
                type: r.categorias_activos ? r.categorias_activos.nombre : '',
                brand: r.marca,
                model: r.modelo,
                serie: r.numero_serie,
                providerId: r.id_proveedor ? r.id_proveedor.toString() : '',
                purchaseDate: r.fecha_compra || '',
                warrantyMonths: this.calculateWarrantyMonths(r.fecha_compra, r.fecha_fin_garantia),
                status: r.estado,
                employeeId: activeAsg ? activeAsg.id_usuario.toString() : '',
                area: empArea,
                location: r.ubicacion || '',
                observations: r.observaciones || ''
            };
        });
    },

    async saveAsset(asset) {
        const client = await this.getClient();
        if (!client) return null;
        const catId = await this.getOrCreateCategory(asset.type);
        const expiryDate = this.calculateExpiryDate(asset.purchaseDate, asset.warrantyMonths);
        const { data } = await client.from('activos_tecnologicos').insert([{
            codigo_activo: asset.code,
            id_categoria: catId,
            marca: asset.brand,
            modelo: asset.model,
            numero_serie: asset.serie,
            id_proveedor: asset.providerId ? parseInt(asset.providerId) : null,
            fecha_compra: asset.purchaseDate || null,
            fecha_fin_garantia: expiryDate,
            estado: asset.status,
            ubicacion: asset.location,
            observaciones: asset.observations
        }]).select('*, categorias_activos(nombre)');
        
        if (!data) return null;
        const r = data[0];
        return {
            id: r.id.toString(),
            code: r.codigo_activo,
            type: r.categorias_activos ? r.categorias_activos.nombre : '',
            brand: r.marca,
            model: r.modelo,
            serie: r.numero_serie,
            providerId: r.id_proveedor ? r.id_proveedor.toString() : '',
            purchaseDate: r.fecha_compra || '',
            warrantyMonths: asset.warrantyMonths,
            status: r.estado,
            employeeId: '',
            location: r.ubicacion || '',
            observations: r.observaciones || ''
        };
    },

    async updateAsset(asset) {
        const client = await this.getClient();
        if (!client) return;
        const catId = await this.getOrCreateCategory(asset.type);
        const expiryDate = this.calculateExpiryDate(asset.purchaseDate, asset.warrantyMonths);
        await client.from('activos_tecnologicos').update({
            codigo_activo: asset.code,
            id_categoria: catId,
            marca: asset.brand,
            modelo: asset.model,
            numero_serie: asset.serie,
            id_proveedor: asset.providerId ? parseInt(asset.providerId) : null,
            fecha_compra: asset.purchaseDate || null,
            fecha_fin_garantia: expiryDate,
            estado: asset.status,
            ubicacion: asset.location,
            observaciones: asset.observations
        }).eq('id', asset.id);
    },

    async deleteAsset(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('activos_tecnologicos').delete().eq('id', id);
    },

    // Asignaciones
    async getAssignments() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('asignaciones').select('*').order('id', { ascending: true });
        return (data || []).map(r => ({
            id: r.id.toString(),
            assetId: r.id_activo ? r.id_activo.toString() : '',
            employeeId: r.id_usuario ? r.id_usuario.toString() : '',
            date: r.fecha_asignacion || '',
            status: r.estado,
            observations: r.observaciones || '',
            docRef: r.documento_acta || '',
            devolutionDate: r.fecha_devolucion || '',
            devolutionNotes: r.notas_devolucion || ''
        }));
    },

    async saveAssignment(asg) {
        const client = await this.getClient();
        if (!client) return null;
        const { data } = await client.from('asignaciones').insert([{
            id_activo: asg.assetId ? parseInt(asg.assetId) : null,
            id_usuario: asg.employeeId ? parseInt(asg.employeeId) : null,
            fecha_asignacion: asg.date,
            estado: asg.status || 'Activa',
            observaciones: asg.observations || null,
            documento_acta: asg.docRef || null
        }]).select();

        // Cambiar estado de activo a Asignado
        if (asg.assetId) {
            await client.from('activos_tecnologicos').update({ estado: 'Asignado' }).eq('id', asg.assetId);
        }
        
        return data ? data[0] : null;
    },

    async releaseAsset(assetId, devolutionDetails) {
        const client = await this.getClient();
        if (!client) return;

        // 1. Actualizar estado del activo
        await client.from('activos_tecnologicos').update({ estado: devolutionDetails.status }).eq('id', assetId);

        // 2. Obtener asignación activa y actualizarla
        const { data: asgData } = await client.from('asignaciones').select('*').eq('id_activo', assetId).eq('estado', 'Activa').maybeSingle();
        if (asgData) {
            await client.from('asignaciones').update({
                estado: 'Devuelto',
                fecha_devolucion: devolutionDetails.date,
                notas_devolucion: devolutionDetails.notes
            }).eq('id', asgData.id);
        }
    },

    // Mantenimiento
    async getMaintenance() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('mantenimientos').select('*').order('id', { ascending: true });
        return (data || []).map(r => ({
            id: r.id.toString(),
            assetId: r.id_activo ? r.id_activo.toString() : '',
            type: r.tipo_mantenimiento || '',
            description: r.descripcion || '',
            startDate: r.fecha_inicio || '',
            endDate: r.fecha_fin || '',
            technician: r.tecnico_responsable || '',
            statusFinal: r.estado_final || 'Pendiente'
        }));
    },

    async saveMaintenance(maint) {
        const client = await this.getClient();
        if (!client) return null;
        const { data } = await client.from('mantenimientos').insert([{
            id_activo: maint.assetId ? parseInt(maint.assetId) : null,
            tipo_mantenimiento: maint.type,
            descripcion: maint.description || null,
            fecha_inicio: maint.startDate,
            tecnico_responsable: maint.technician || null,
            estado_final: 'En proceso'
        }]).select();

        // Cambiar estado de activo a En mantenimiento
        if (maint.assetId) {
            await client.from('activos_tecnologicos').update({ estado: 'En mantenimiento' }).eq('id', maint.assetId);
        }
        
        return data ? data[0] : null;
    },

    async finalizeMaintenance(maintId, endDate, statusFinal, observations) {
        const client = await this.getClient();
        if (!client) return;

        const { data: maintData } = await client.from('mantenimientos').update({
            fecha_fin: endDate,
            estado_final: 'Completado',
            descripcion: observations
        }).eq('id', maintId).select().single();

        if (maintData && maintData.id_activo) {
            await client.from('activos_tecnologicos').update({ estado: statusFinal }).eq('id', maintData.id_activo);
        }
    },

    // Solicitudes
    async getRequests() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('solicitudes').select('*').order('id', { ascending: true });
        return (data || []).map(r => ({
            id: r.id.toString(),
            employeeId: r.id_usuario ? r.id_usuario.toString() : '',
            type: r.tipo_equipo,
            reason: r.motivo || '',
            date: r.fecha_solicitud || '',
            status: r.estado,
            approvedBy: r.aprobado_por || ''
        }));
    },

    async saveRequest(req) {
        const client = await this.getClient();
        if (!client) return null;
        const { data } = await client.from('solicitudes').insert([{
            id_usuario: req.employeeId ? parseInt(req.employeeId) : null,
            tipo_equipo: req.type,
            motivo: req.reason || null,
            fecha_solicitud: req.date,
            estado: 'Pendiente'
        }]).select();
        return data ? data[0] : null;
    },

    async updateRequestStatus(reqId, status, approvedBy) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('solicitudes').update({
            estado: status,
            aprobado_por: approvedBy
        }).eq('id', reqId);
    },

    // Estadísticas
    async getStats() {
        const assets = await this.getAssets();
        const warranties = await this.getWarrantyStats();
        const requests = await this.getRequests();

        return {
            total: assets.length,
            assigned: assets.filter(a => a.status === 'Asignado').length,
            available: assets.filter(a => a.status === 'Disponible').length,
            maintenance: assets.filter(a => a.status === 'En mantenimiento').length,
            retired: assets.filter(a => a.status === 'Dado de baja').length,
            warrantiesExpired: warranties.expired,
            warrantiesToExpire: warranties.toExpire,
            pendingRequests: requests.filter(r => r.status === 'Pendiente').length
        };
    },

    async getWarrantyStats() {
        const assets = await this.getAssets();
        const now = new Date();
        let expired = 0;
        let toExpire = 0;

        assets.forEach(asset => {
            if (!asset.purchaseDate) return;
            const pDate = new Date(asset.purchaseDate);
            const wMonths = parseInt(asset.warrantyMonths) || 0;
            const wDate = new Date(pDate.setMonth(pDate.getMonth() + wMonths));
            
            const diffTime = wDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                expired++;
            } else if (diffDays <= 60) {
                toExpire++;
            }
        });

        return { expired, toExpire };
    }
};
