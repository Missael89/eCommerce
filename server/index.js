const hapi = require('@hapi/hapi');
const config = require('./config/config.json')
let datos = require('./db.json');

const init = async () => {
    const server = hapi.server({
        port: config.port,
        host: config.host,
        routes: {
            cors: true
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (req, res) => {
            return "API Gapsi eCommerce"
        }
    });

    /* Obtener el Mensaje de Bienevenida */
    server.route({
        method: 'GET',
        path: '/msj',
        handler: (req, res) => {
            return "Bienvenido Candidato 01"
        }
    });

    /* Obtener la Version de la API */
    server.route({
        method: 'GET',
        path: '/version',
        handler: (req, res) => {
            return "1.0.0"
        }
    });

    /* REST de Proveedores */
    /* Obtener lista de proveedores */
    server.route({
        method: 'GET',
        path: '/proveedores',
        handler: (req, res) => {
            return datos
        }
    });
    /* Agregar proveedor */
    server.route({
        method: ['PUT', 'POST'],
        path: '/proveedores',
        handler: (req, res) => {

            /* Agregar proveedor si existe */
            const existProveedor = datos.filter((el) => {
                return el.nombre === req.payload.nombre
            });

            if (existProveedor.length == 0) {
                return datos.push({
                    id: req.payload.id,
                    nombre: req.payload.nombre,
                    razonSocial: req.payload.razonSocial,
                    direccion: req.payload.direccion
                });
            }               
            
            return 'Ya existe el proveedor.'
        }
    });
    /* Eliminar proveedor */
    server.route({
        method: 'DELETE',
        path: '/proveedores/{id}',
        handler: (req, res) => {

            /* Eliminar proveedor por id */
            datos.forEach((currentValue, index, arr) => {
                if (datos[index].id == req.params.id) {
                    datos.splice(index, index);
                }
            });

            return datos
        }
    });

    await server.start();
    console.log('Servidor activo %s', server.info.uri);
}

process.on('unhandledRejection', (error) => {
    console.log(error);
    process.exit(1);
});

init();