const puppeteer = require('puppeteer');
const fs = require('fs');

// ================= CONFIGURACIÓN =================
const CATEGORIAS = [
    'escolar',
    'oficina',
    'tecnologia',
    'arte-y-diseno',
    'universitario',
    'cuidado-personal-y-limpieza',
    'electrohogar',
    'mascotas',
    'outdoors-deporte',
    'belleza-y-regalos'
];

const MAX_CONCURRENT_PRODUCTS = 5; // Reducir la concurrencia para evitar bloqueos
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
            productoData.precio = await page.$eval('.price-wrapper[data-price-type="finalPrice"]', el => el.textContent.trim()).catch(() => 'Sin precio');
        }

        // Obtener la categoría desde el breadcrumb
        productoData.categoria = await page.$eval('li.item.category strong', el => el.textContent.trim()).catch(() => 'Sin categoría');

        // Extraer características
        productoData.caracteristicas = await page.$$eval('.label-des.vnomobile ul li', elementos =>
            elementos.map(el => el.innerText.trim()).filter(Boolean)
        ).catch(() => []);

    } catch (error) {
        console.error(`Error en ${url}: ${error.message}`);
    } finally {
        await page.close();
    }
    return productoData;
}

// ================= SCRAPER POR CATEGORÍA =================
async function procesarCategoria(categoria, browser) {
    const page = await browser.newPage();
    let productos = [];

    try {
        const urlCategoria = `https://www.tailoy.com.pe/${categoria}.html`;
        console.log(`🚀 Iniciando categoría: ${categoria.toUpperCase()}`);

        await page.goto(urlCategoria, { waitUntil: 'networkidle2', timeout: 40000 });
        await delay(2000);

        // Extraer enlaces de productos
        const enlaces = await page.$$eval('.product-item-link', links => links.map(link => link.href)).catch(() => []);

        console.log(`🔍 ${categoria.toUpperCase()} - Encontrados ${enlaces.length} productos`);

        // Procesar productos en lotes para evitar sobrecarga
        for (let i = 0; i < enlaces.length; i += MAX_CONCURRENT_PRODUCTS) {
            const lote = enlaces.slice(i, i + MAX_CONCURRENT_PRODUCTS);
            const results = await Promise.all(lote.map(url => extraerDatosProducto(url, browser)));
            productos.push(...results.filter(p => p.nombre !== 'Sin nombre'));
            await delay(2000); // Pausa para evitar bloqueos
        }

        // Guardar datos en un archivo JSON por categoría
        const fileName = `${categoria}.json`;
        fs.writeFileSync(fileName, JSON.stringify(productos, null, 2));
        console.log(`✅ ${categoria.toUpperCase()} - Guardado en ${fileName}`);

    } catch (error) {
        console.error(`❌ Error en categoría ${categoria}: ${error.message}`);
    } finally {
        await page.close();
    }
}

// ================= EJECUCIÓN PRINCIPAL =================
(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        for (const categoria of CATEGORIAS) {
            await procesarCategoria(categoria, browser);
            await delay(5000); // Mayor pausa entre categorías
        }
    } catch (error) {
        console.error(`❌ Error global: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`🏁 SCRAPING COMPLETADO`);
    }
})();
