const puppeteer = require('puppeteer');
const fs = require('fs');

// ================= CONFIGURACIÓN =================
const MAX_CONCURRENT_PRODUCTS = 5; // Reducir la concurrencia para evitar bloqueos
const MAX_PAGINAS = 5; // Máximo de páginas a procesar
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ================= FUNCIÓN DE EXTRACCIÓN =================
async function extraerDatosProducto(url, browser) {
    const productoData = {
        nombre: 'Sin nombre',
        precio: 'Sin precio',
        imagenURL: 'Sin imagen',
        marca: 'Sin marca',
        categoria: 'Sin categoría',
        caracteristicas: [],
        disponibilidad: 'Sin información'
    };

    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
        await delay(2000); // Dar tiempo extra a la carga

        productoData.nombre = await page.$eval('.page-title-wrapper.product', el => el.textContent.trim()).catch(() => 'Sin nombre');
        productoData.marca = await page.$eval('.brand-label', el => el.textContent.trim()).catch(() => 'Sin marca');
        productoData.imagenURL = await page.$eval('.gallery-placeholder img', img => img.src).catch(() => 'Sin imagen');

        // Disponibilidad y precio
        const stockInfo = await page.$('.stock.unavailable');
        if (stockInfo) {
            productoData.disponibilidad = 'Agotado';
            productoData.precio = 'Sin precio';
        } else {
            productoData.disponibilidad = 'En stock';
            productoData.precio = await page.$eval('span[data-price-type="finalPrice"]', el => {
                const precioLimpio = el.getAttribute('data-price-amount');
                return precioLimpio ? `S/ ${parseFloat(precioLimpio).toLocaleString('es-PE')}` : 'Sin precio';
            }).catch(() => 'Sin precio');
        }            

        // Obtener la categoría desde el breadcrumb
        productoData.categoria = await page.$eval('li.item.category strong', el => el.textContent.trim()).catch(() => 'Sin categoría');

        // Extraer características
        productoData.caracteristicas = await page.$$eval('.label-des.vnomobile ul li', elementos =>
            elementos.map(el => el.innerText.trim()).filter(Boolean)
        ).catch(() => []);

    } catch (error) {
        console.error(`❌ Error en ${url}: ${error.message}`);
    } finally {
        await page.close();
    }
    return productoData;
}

// ================= SCRAPER POR PAGINACIÓN =================
async function procesarPagina(baseUrl, browser) {
    const page = await browser.newPage();
    let productos = [];
    let pagina = 1;

    try {
        console.log(`🚀 Iniciando scraping de: ${baseUrl}`);
        
        while (pagina <= MAX_PAGINAS) { // Limitar a 5 páginas máximo
            const urlPagina = `${baseUrl}?p=${pagina}`;
            await page.goto(urlPagina, { waitUntil: 'networkidle2', timeout: 40000 });
            await delay(2000);

            // Extraer enlaces de productos
            const enlaces = await page.$$eval('.product-item-link', links => links.map(link => link.href)).catch(() => []);
            
            if (enlaces.length === 0) break; // Terminar si no hay más productos

            console.log(`🔍 Página ${pagina} - Encontrados ${enlaces.length} productos`);

            // Procesar productos en lotes para evitar sobrecarga
            for (let i = 0; i < enlaces.length; i += MAX_CONCURRENT_PRODUCTS) {
                const lote = enlaces.slice(i, i + MAX_CONCURRENT_PRODUCTS);
                const results = await Promise.all(lote.map(url => extraerDatosProducto(url, browser)));
                productos.push(...results.filter(p => p.nombre !== 'Sin nombre'));
                await delay(2000); // Pausa para evitar bloqueos
            }

            pagina++; // Pasar a la siguiente página
        }

        // Guardar datos en un archivo JSON
        const fileName = `productos.json`;
        fs.writeFileSync(fileName, JSON.stringify(productos, null, 2));
        console.log(`✅ Datos guardados en ${fileName}`);

    } catch (error) {
        console.error(`❌ Error en la extracción: ${error.message}`);
    } finally {
        await page.close();
    }
}

// ================= EJECUCIÓN PRINCIPAL =================
(async () => {
    const baseUrl = process.argv[2]; // Recibir la URL como argumento
    if (!baseUrl) {
        console.error('❌ Debes ingresar una URL de categoría como argumento.');
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        await procesarPagina(baseUrl, browser);
    } catch (error) {
        console.error(`❌ Error global: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`🏁 SCRAPING COMPLETADO`);
    }
})();
