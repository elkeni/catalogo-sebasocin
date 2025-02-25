document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");
    const searchBox = document.getElementById("search");

    try {
        // Cargar productos desde el archivo JSON
        const response = await fetch("products.json");
        const products = await response.json();

        // Función para mostrar productos
        const renderProducts = (filteredProducts) => {
            productList.innerHTML = ""; // Limpiar lista antes de renderizar

            filteredProducts.forEach((product) => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                productCard.innerHTML = `
                    <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
                    <h3>${product.nombre}</h3>
                    <p>${product.precio}</p>
                    <a href="${product.link}" target="_blank">Ver producto</a>
                `;

                productList.appendChild(productCard);
            });
        };

        // Mostrar todos los productos al inicio
        renderProducts(products);

        // Filtrar productos en tiempo real
        searchBox.addEventListener("input", () => {
            const searchTerm = searchBox.value.toLowerCase();
            const filtered = products.filter(product => 
                product.nombre.toLowerCase().includes(searchTerm)
            );
            renderProducts(filtered);
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
});
