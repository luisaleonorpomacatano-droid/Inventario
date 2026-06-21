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

        // Cargar script de Supabase de CDN
        await this.loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');

        const url = 'https://jsyvxgztrpotexsfqpji.supabase.co';
        let key = localStorage.getItem('supabase_anon_key');

        if (!key) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    swal({
                        title: 'Conexión a Supabase',
                        text: 'Ingresa tu anon public key para sincronizar el inventario en la nube de Supabase:',
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

    // Semillero automático si la base de datos está vacía
    async checkAndSeed() {
        try {
            const client = this.client;
            
            // Verificar si hay categorías
            const { count, error } = await client.from('categorias').select('*', { count: 'exact', head: true });
            if (error) return; // Si hay error, las tablas tal vez no estén creadas aún
            
            if (count === 0) {
                // Insertar Categorías
                const { data: cats } = await client.from('categorias').insert([
                    { codigo: 'CAT01', nombre: 'Laptop' },
                    { codigo: 'CAT02', nombre: 'Servidor' },
                    { codigo: 'CAT03', nombre: 'Impresora' },
                    { codigo: 'CAT04', nombre: 'Monitor' },
                    { codigo: 'CAT05', nombre: 'Switch / Router' },
                    { codigo: 'CAT06', nombre: 'Accesorio (Teclado/Mouse)' }
                ]).select();

                // Insertar Proveedores
                const { data: provs } = await client.from('proveedores').insert([
                    { ruc: '20100045612', nombre: 'Deltron S.A.', telefono: '999888777', correo: 'ventas@deltron.com.pe', direccion: 'Av. Aramburú 546, Surquillo' },
                    { ruc: '20300456891', nombre: 'Ingram Micro', telefono: '944555666', correo: 'corporativo@ingram.com', direccion: 'Av. El Derby 250, Santiago de Surco' },
                    { ruc: '20500123456', nombre: 'Lenovo Perú', telefono: '988777666', correo: 'soporte@lenovo.com', direccion: 'San Isidro, Lima' }
                ]).select();

                // Insertar Colaboradores
                const { data: emps } = await client.from('colaboradores').insert([
                    { dni: '45781290', nombre: 'Juan', apellidos: 'Pérez', correo: 'juan.perez@empresa.com', telefono: '912345678', area: 'Administración', ubicacion: 'Oficina San Borja' },
                    { dni: '70213456', nombre: 'María', apellidos: 'López', correo: 'maria.lopez@empresa.com', telefono: '987654321', area: 'Comercial', ubicacion: 'Oficina San Borja' },
                    { dni: '09876543', nombre: 'Carlos', apellidos: 'Gómez', correo: 'carlos.gomez@empresa.com', telefono: '933444555', area: 'Soporte TI', location: 'Oficina Miraflores' },
                    { dni: '41235678', nombre: 'Ana', apellidos: 'Rodríguez', correo: 'ana.rodriguez@empresa.com', telefono: '922888777', area: 'Recursos Humanos', ubicacion: 'Oficina San Borja' }
                ]).select();

                if (provs && provs.length > 0) {
                    // Insertar Activos
                    await client.from('activos').insert([
                        { codigo_activo: 'LAP-001', tipo_activo: 'Laptop', marca: 'Lenovo', modelo: 'ThinkPad E14', numero_serie: 'LNV8947592', id_proveedor: provs[2].id, fecha_compra: '2025-04-10', meses_garantia: 12, estado: 'Disponible', ubicacion: 'Oficina San Borja', observaciones: 'Con cargador y mouse inalámbrico.' },
                        { codigo_activo: 'LAP-002', tipo_activo: 'Laptop', marca: 'Dell', modelo: 'Latitude 3420', numero_serie: 'DLL7834521', id_proveedor: provs[0].id, fecha_compra: '2025-08-15', meses_garantia: 24, estado: 'Disponible', ubicacion: 'Oficina San Borja', observaciones: 'Operativo, recién formateado.' },
                        { codigo_activo: 'SRV-001', tipo_activo: 'Servidor', marca: 'HP', modelo: 'ProLiant DL360', numero_serie: 'HPG934521', id_proveedor: provs[1].id, fecha_compra: '2024-01-05', meses_garantia: 36, estado: 'Disponible', ubicacion: 'Oficina Miraflores', observaciones: 'Servidor de base de datos local.' },
                        { codigo_activo: 'MON-001', tipo_activo: 'Monitor', marca: 'LG', modelo: 'Ultragear 24"', numero_serie: 'LGM984312', id_proveedor: provs[0].id, fecha_compra: '2025-05-12', meses_garantia: 12, estado: 'En mantenimiento', ubicacion: 'Oficina San Borja', observaciones: 'Pantalla parpadea intermitentemente.' }
                    ]);
                }
            }
        } catch (e) {
            console.log('Error en semillero:', e);
        }
    },

    // Mappers
    mapRowToAsset(r) {
        return {
            id: r.id.toString(),
            code: r.codigo_activo,
            type: r.tipo_activo,
            brand: r.marca,
            model: r.modelo,
            serie: r.numero_serie,
            providerId: r.id_proveedor ? r.id_proveedor.toString() : '',
            purchaseDate: r.fecha_compra || '',
            warrantyMonths: r.meses_garantia || 12,
            status: r.estado,
            employeeId: r.id_colaborador ? r.id_colaborador.toString() : '',
            area: r.area || '',
            location: r.ubicacion || '',
            observations: r.observaciones || ''
        };
    },

    mapAssetToRow(a) {
        return {
            codigo_activo: a.code,
            tipo_activo: a.type,
            marca: a.brand,
            modelo: a.model,
            numero_serie: a.serie,
            id_proveedor: a.providerId ? parseInt(a.providerId) : null,
            fecha_compra: a.purchaseDate || null,
            meses_garantia: parseInt(a.warrantyMonths) || 12,
            estado: a.status,
            id_colaborador: a.employeeId ? parseInt(a.employeeId) : null,
            area: a.area || null,
            ubicacion: a.location || null,
            observaciones: a.observations || null
        };
    },

    mapRowToAssignment(r) {
        return {
            id: r.id.toString(),
            assetId: r.id_activo ? r.id_activo.toString() : '',
            employeeId: r.id_colaborador ? r.id_colaborador.toString() : '',
            date: r.fecha_asignacion,
            status: r.estado,
            observations: r.observaciones || '',
            docRef: r.documento_acta,
            devolutionDate: r.fecha_devolucion || '',
            devolutionNotes: r.notas_devolucion || ''
        };
    },

    mapAssignmentToRow(asg) {
        return {
            id_activo: asg.assetId ? parseInt(asg.assetId) : null,
            id_colaborador: asg.employeeId ? parseInt(asg.employeeId) : null,
            fecha_asignacion: asg.date,
            estado: asg.status,
            observaciones: asg.observations || null,
            documento_acta: asg.docRef,
            fecha_devolucion: asg.devolutionDate || null,
            notas_devolucion: asg.devolutionNotes || null
        };
    },

    mapRowToMaint(r) {
        return {
            id: r.id.toString(),
            assetId: r.id_activo ? r.id_activo.toString() : '',
            type: r.tipo_mantenimiento,
            description: r.descripcion || '',
            startDate: r.fecha_inicio,
            endDate: r.fecha_fin || '',
            technician: r.tecnico_responsable || '',
            statusFinal: r.estado_final
        };
    },

    mapMaintToRow(m) {
        return {
            id_activo: m.assetId ? parseInt(m.assetId) : null,
            tipo_mantenimiento: m.type,
            descripcion: m.description || null,
            fecha_inicio: m.startDate,
            fecha_fin: m.endDate || null,
            tecnico_responsable: m.technician || null,
            estado_final: m.statusFinal
        };
    },

    mapRowToRequest(r) {
        return {
            id: r.id.toString(),
            employeeId: r.id_colaborador ? r.id_colaborador.toString() : '',
            type: r.tipo_equipo,
            reason: r.motivo || '',
            date: r.fecha_solicitud,
            status: r.estado,
            approvedBy: r.aprobado_por || ''
        };
    },

    mapRequestToRow(req) {
        return {
            id_colaborador: req.employeeId ? parseInt(req.employeeId) : null,
            tipo_equipo: req.type,
            motivo: req.reason || null,
            fecha_solicitud: req.date,
            estado: req.status,
            aprobado_por: req.approvedBy || null
        };
    },

    // ==========================================
    // MÉTODOS DE LA API (SUPABASE)
    // ==========================================

    // Categorías
    async getCategories() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('categorias').select('*').order('id', { ascending: true });
        return data || [];
    },

    async saveCategory(cat) {
        const client = await this.getClient();
        if (!client) return null;
        const { data } = await client.from('categorias').insert([{ codigo: cat.code, nombre: cat.name }]).select();
        return data ? data[0] : null;
    },

    async deleteCategory(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('categorias').delete().eq('id', id);
    },

    // Proveedores
    async getProviders() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('proveedores').select('*').order('id', { ascending: true });
        return data || [];
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
        return data ? data[0] : null;
    },

    async deleteProvider(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('proveedores').delete().eq('id', id);
    },

    // Colaboradores
    async getEmployees() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('colaboradores').select('*').order('id', { ascending: true });
        return data || [];
    },

    async saveEmployee(emp) {
        const client = await this.getClient();
        if (!client) return null;
        const { data } = await client.from('colaboradores').insert([{
            dni: emp.dni,
            nombre: emp.name,
            apellidos: emp.lastname,
            correo: emp.email,
            telefono: emp.phone,
            area: emp.area,
            ubicacion: emp.location
        }]).select();
        return data ? data[0] : null;
    },

    async deleteEmployee(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('colaboradores').delete().eq('id', id);
    },

    // Activos
    async getAssets() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('activos').select('*').order('id', { ascending: true });
        return (data || []).map(r => this.mapRowToAsset(r));
    },

    async saveAsset(asset) {
        const client = await this.getClient();
        if (!client) return null;
        const row = this.mapAssetToRow(asset);
        const { data } = await client.from('activos').insert([row]).select();
        return data ? this.mapRowToAsset(data[0]) : null;
    },

    async updateAsset(asset) {
        const client = await this.getClient();
        if (!client) return;
        const row = this.mapAssetToRow(asset);
        await client.from('activos').update(row).eq('id', asset.id);
    },

    async deleteAsset(id) {
        const client = await this.getClient();
        if (!client) return;
        await client.from('activos').delete().eq('id', id);
    },

    // Asignaciones
    async getAssignments() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('asignaciones').select('*').order('id', { ascending: true });
        return (data || []).map(r => this.mapRowToAssignment(r));
    },

    async saveAssignment(asg) {
        const client = await this.getClient();
        if (!client) return null;
        const row = this.mapAssignmentToRow(asg);
        const { data } = await client.from('asignaciones').insert([row]).select();
        
        // Actualizar el estado del activo a "Asignado"
        const { data: assetData } = await client.from('activos').select('*').eq('id', asg.assetId).single();
        if (assetData) {
            const asset = this.mapRowToAsset(assetData);
            asset.status = 'Asignado';
            asset.employeeId = asg.employeeId;
            
            const emps = await this.getEmployees();
            const emp = emps.find(e => e.id === asg.employeeId);
            if (emp) {
                asset.area = emp.area;
                asset.location = emp.location;
            }
            await this.updateAsset(asset);
        }

        return data ? this.mapRowToAssignment(data[0]) : null;
    },

    async releaseAsset(assetId, devolutionDetails) {
        const client = await this.getClient();
        if (!client) return;

        // Actualizar estado del activo
        const { data: assetData } = await client.from('activos').select('*').eq('id', assetId).single();
        if (assetData) {
            const asset = this.mapRowToAsset(assetData);
            asset.status = devolutionDetails.status; // Disponible, Mantenimiento, Baja
            asset.employeeId = '';
            asset.area = '';
            await this.updateAsset(asset);
        }

        // Obtener asignación activa y actualizarla
        const { data: asgData } = await client.from('asignaciones').select('*').eq('id_activo', assetId).eq('estado', 'Activa').single();
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
        return (data || []).map(r => this.mapRowToMaint(r));
    },

    async saveMaintenance(maint) {
        const client = await this.getClient();
        if (!client) return null;
        const row = this.mapMaintToRow(maint);
        const { data } = await client.from('mantenimientos').insert([row]).select();

        // Cambiar estado de activo a Mantenimiento
        const { data: assetData } = await client.from('activos').select('*').eq('id', maint.assetId).single();
        if (assetData) {
            const asset = this.mapRowToAsset(assetData);
            asset.status = 'En mantenimiento';
            await this.updateAsset(asset);
        }

        return data ? this.mapRowToMaint(data[0]) : null;
    },

    async finalizeMaintenance(maintId, endDate, statusFinal, observations) {
        const client = await this.getClient();
        if (!client) return;

        const { data: maintData } = await client.from('mantenimientos').update({
            fecha_fin: endDate,
            estado_final: 'Completado',
            descripcion: observations // o notas correspondientes
        }).eq('id', maintId).select().single();

        if (maintData) {
            const { data: assetData } = await client.from('activos').select('*').eq('id', maintData.id_activo).single();
            if (assetData) {
                const asset = this.mapRowToAsset(assetData);
                asset.status = statusFinal; // Disponible, Dado de baja
                await this.updateAsset(asset);
            }
        }
    },

    // Solicitudes
    async getRequests() {
        const client = await this.getClient();
        if (!client) return [];
        const { data } = await client.from('solicitudes').select('*').order('id', { ascending: true });
        return (data || []).map(r => this.mapRowToRequest(r));
    },

    async saveRequest(req) {
        const client = await this.getClient();
        if (!client) return null;
        const row = this.mapRequestToRow(req);
        row.estado = 'Pendiente';
        const { data } = await client.from('solicitudes').insert([row]).select();
        return data ? this.mapRowToRequest(data[0]) : null;
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
