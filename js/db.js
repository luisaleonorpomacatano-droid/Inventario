// Sistema de Control de Activos Tecnológicos - Base de Datos Local (localStorage)
const DB = {
    init() {
        if (!localStorage.getItem('it_categories')) {
            const defaultCategories = [
                { id: '1', code: 'CAT01', name: 'Laptop' },
                { id: '2', code: 'CAT02', name: 'Servidor' },
                { id: '3', code: 'CAT03', name: 'Impresora' },
                { id: '4', code: 'CAT04', name: 'Monitor' },
                { id: '5', code: 'CAT05', name: 'Switch / Router' },
                { id: '6', code: 'CAT06', name: 'Accesorio (Teclado/Mouse)' }
            ];
            localStorage.setItem('it_categories', JSON.stringify(defaultCategories));
        }

        if (!localStorage.getItem('it_providers')) {
            const defaultProviders = [
                { id: '1', name: 'Deltron S.A.', ruc: '20100045612', phone: '999888777', email: 'ventas@deltron.com.pe', address: 'Av. Aramburú 546, Surquillo' },
                { id: '2', name: 'Ingram Micro', ruc: '20300456891', phone: '944555666', email: 'corporativo@ingram.com', address: 'Av. El Derby 250, Santiago de Surco' },
                { id: '3', name: 'Lenovo Perú', ruc: '20500123456', phone: '988777666', email: 'soporte@lenovo.com', address: 'San Isidro, Lima' }
            ];
            localStorage.setItem('it_providers', JSON.stringify(defaultProviders));
        }

        if (!localStorage.getItem('it_employees')) {
            const defaultEmployees = [
                { id: '1', name: 'Juan', lastname: 'Pérez', dni: '45781290', email: 'juan.perez@empresa.com', phone: '912345678', area: 'Administración', location: 'Oficina San Borja' },
                { id: '2', name: 'María', lastname: 'López', dni: '70213456', email: 'maria.lopez@empresa.com', phone: '987654321', area: 'Comercial', location: 'Oficina San Borja' },
                { id: '3', name: 'Carlos', lastname: 'Gómez', dni: '09876543', email: 'carlos.gomez@empresa.com', phone: '933444555', area: 'Soporte TI', location: 'Oficina Miraflores' },
                { id: '4', name: 'Ana', lastname: 'Rodríguez', dni: '41235678', email: 'ana.rodriguez@empresa.com', phone: '922888777', area: 'Recursos Humanos', location: 'Oficina San Borja' }
            ];
            localStorage.setItem('it_employees', JSON.stringify(defaultEmployees));
        }

        if (!localStorage.getItem('it_assets')) {
            const defaultAssets = [
                { id: '1', code: 'LAP-001', type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad E14', serie: 'LNV8947592', providerId: '3', purchaseDate: '2025-04-10', warrantyMonths: 12, status: 'Asignado', employeeId: '2', area: 'Comercial', location: 'Oficina San Borja', observations: 'Con cargador y mouse inalámbrico.' },
                { id: '2', code: 'LAP-002', type: 'Laptop', brand: 'Dell', model: 'Latitude 3420', serie: 'DLL7834521', providerId: '1', purchaseDate: '2025-08-15', warrantyMonths: 24, status: 'Disponible', employeeId: '', area: '', location: 'Oficina San Borja', observations: 'Operativo, recién formateado.' },
                { id: '3', code: 'SRV-001', type: 'Servidor', brand: 'HP', model: 'ProLiant DL360', serie: 'HPG934521', providerId: '2', purchaseDate: '2024-01-05', warrantyMonths: 36, status: 'Asignado', employeeId: '3', area: 'Soporte TI', location: 'Oficina Miraflores', observations: 'Servidor de base de datos local.' },
                { id: '4', code: 'MON-001', type: 'Monitor', brand: 'LG', model: 'Ultragear 24"', serie: 'LGM984312', providerId: '1', purchaseDate: '2025-05-12', warrantyMonths: 12, status: 'En mantenimiento', employeeId: '', area: '', location: 'Oficina San Borja', observations: 'Pantalla parpadea intermitentemente.' },
                { id: '5', code: 'LAP-003', type: 'Laptop', brand: 'Lenovo', model: 'ThinkPad L15', serie: 'LNV7438921', providerId: '3', purchaseDate: '2026-02-18', warrantyMonths: 12, status: 'Disponible', employeeId: '', area: '', location: 'Oficina Miraflores', observations: 'Nuevo en caja.' },
                { id: '6', code: 'IMP-001', type: 'Impresora', brand: 'Epson', model: 'L3210', serie: 'EPS342190', providerId: '1', purchaseDate: '2023-11-20', warrantyMonths: 12, status: 'Dado de baja', employeeId: '', area: '', location: 'Oficina San Borja', observations: 'Cabezal dañado, reparación no costeable.' }
            ];
            localStorage.setItem('it_assets', JSON.stringify(defaultAssets));
        }

        if (!localStorage.getItem('it_assignments')) {
            const defaultAssignments = [
                { id: '1', assetId: '1', employeeId: '2', date: '2025-04-15', status: 'Activa', observations: 'Entregado con maletín y accesorios', docRef: 'ACTA-2025-001' },
                { id: '2', assetId: '3', employeeId: '3', date: '2024-01-10', status: 'Activa', observations: 'Instalado en rack de TI', docRef: 'ACTA-2024-004' }
            ];
            localStorage.setItem('it_assignments', JSON.stringify(defaultAssignments));
        }

        if (!localStorage.getItem('it_maintenance')) {
            const defaultMaintenance = [
                { id: '1', assetId: '4', type: 'Correctivo', description: 'Falla en condensadores de fuente o luz de retroiluminación', startDate: '2026-06-18', endDate: '', technician: 'Soporte Externo LG', statusFinal: 'En proceso' },
                { id: '2', assetId: '1', type: 'Preventivo', description: 'Limpieza física de ventilador y cambio de pasta térmica', startDate: '2026-05-10', endDate: '2026-05-10', technician: 'Mesa de ayuda TI', statusFinal: 'Completado' }
            ];
            localStorage.setItem('it_maintenance', JSON.stringify(defaultMaintenance));
        }

        if (!localStorage.getItem('it_requests')) {
            const defaultRequests = [
                { id: '1', employeeId: '1', type: 'Laptop', reason: 'Renovación de equipo lento', date: '2026-06-19', status: 'Pendiente', approvedBy: '' },
                { id: '2', employeeId: '4', type: 'Monitor', reason: 'Nuevo ingreso de personal', date: '2026-06-20', status: 'Aprobada', approvedBy: 'Jefe RRHH' }
            ];
            localStorage.setItem('it_requests', JSON.stringify(defaultRequests));
        }
    },

    getData(key) {
        this.init();
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Métodos para Categorías
    getCategories() { return this.getData('it_categories'); },
    saveCategory(cat) {
        const categories = this.getCategories();
        cat.id = Date.now().toString();
        categories.push(cat);
        this.setData('it_categories', categories);
        return cat;
    },

    // Métodos para Proveedores
    getProviders() { return this.getData('it_providers'); },
    saveProvider(prov) {
        const providers = this.getProviders();
        prov.id = Date.now().toString();
        providers.push(prov);
        this.setData('it_providers', providers);
        return prov;
    },

    // Métodos para Colaboradores
    getEmployees() { return this.getData('it_employees'); },
    saveEmployee(emp) {
        const employees = this.getEmployees();
        emp.id = Date.now().toString();
        employees.push(emp);
        this.setData('it_employees', employees);
        return emp;
    },

    // Métodos para Activos
    getAssets() { return this.getData('it_assets'); },
    saveAsset(asset) {
        const assets = this.getAssets();
        asset.id = Date.now().toString();
        asset.employeeId = asset.employeeId || '';
        asset.area = asset.area || '';
        asset.location = asset.location || '';
        assets.push(asset);
        this.setData('it_assets', assets);
        return asset;
    },
    updateAsset(updatedAsset) {
        let assets = this.getAssets();
        assets = assets.map(a => a.id === updatedAsset.id ? updatedAsset : a);
        this.setData('it_assets', assets);
    },

    // Métodos para Asignaciones
    getAssignments() { return this.getData('it_assignments'); },
    saveAssignment(asg) {
        const assignments = this.getAssignments();
        asg.id = Date.now().toString();
        assignments.push(asg);
        this.setData('it_assignments', assignments);

        // Actualizar estado del activo
        const assets = this.getAssets();
        const asset = assets.find(a => a.id === asg.assetId);
        if (asset) {
            asset.status = 'Asignado';
            asset.employeeId = asg.employeeId;
            const emp = this.getEmployees().find(e => e.id === asg.employeeId);
            if (emp) {
                asset.area = emp.area;
                asset.location = emp.location;
            }
            this.updateAsset(asset);
        }
        return asg;
    },
    releaseAsset(assetId, devolutionDetails) {
        const assets = this.getAssets();
        const asset = assets.find(a => a.id === assetId);
        if (asset) {
            asset.status = devolutionDetails.status; // Disponible, Mantenimiento, Baja
            asset.employeeId = '';
            asset.area = '';
            // Mantener ubicación física
            this.updateAsset(asset);

            // Cerrar asignación activa
            let assignments = this.getAssignments();
            assignments = assignments.map(asg => {
                if (asg.assetId === assetId && asg.status === 'Activa') {
                    asg.status = 'Devuelto';
                    asg.devolutionDate = devolutionDetails.date;
                    asg.devolutionNotes = devolutionDetails.notes;
                }
                return asg;
            });
            this.setData('it_assignments', assignments);
        }
    },

    // Métodos para Mantenimiento
    getMaintenance() { return this.getData('it_maintenance'); },
    saveMaintenance(maint) {
        const maintenance = this.getMaintenance();
        maint.id = Date.now().toString();
        maintenance.push(maint);
        this.setData('it_maintenance', maintenance);

        // Actualizar estado del activo a mantenimiento
        const assets = this.getAssets();
        const asset = assets.find(a => a.id === maint.assetId);
        if (asset) {
            asset.status = 'En mantenimiento';
            this.updateAsset(asset);
        }
        return maint;
    },
    finalizeMaintenance(maintId, endDate, statusFinal, observations) {
        let maintenance = this.getMaintenance();
        const maint = maintenance.find(m => m.id === maintId);
        if (maint) {
            maint.endDate = endDate;
            maint.statusFinal = 'Completado';
            maint.notes = observations;
            this.setData('it_maintenance', maintenance);

            // Restaurar estado del activo a lo indicado
            const assets = this.getAssets();
            const asset = assets.find(a => a.id === maint.assetId);
            if (asset) {
                asset.status = statusFinal; // Disponible, Asignado, Dado de baja
                this.updateAsset(asset);
            }
        }
    },

    // Métodos para Solicitudes
    getRequests() { return this.getData('it_requests'); },
    saveRequest(req) {
        const requests = this.getRequests();
        req.id = Date.now().toString();
        req.status = 'Pendiente';
        requests.push(req);
        this.setData('it_requests', requests);
        return req;
    },
    updateRequestStatus(reqId, status, approvedBy) {
        let requests = this.getRequests();
        requests = requests.map(r => {
            if (r.id === reqId) {
                r.status = status;
                r.approvedBy = approvedBy;
            }
            return r;
        });
        this.setData('it_requests', requests);
    },

    // Estadísticas
    getStats() {
        const assets = this.getAssets();
        const warranties = this.getWarrantyStats();
        const requests = this.getRequests();

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

    getWarrantyStats() {
        const assets = this.getAssets();
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
            } else if (diffDays <= 60) { // Próximo a vencer en menos de 60 días
                toExpire++;
            }
        });

        return { expired, toExpire };
    }
};

// Inicializar base de datos
DB.init();
