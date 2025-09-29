document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const productSearch = document.getElementById('product-search');
    const productListContainer = document.getElementById('product-list');
    const outputDataTextarea = document.getElementById('output-data');

    let productToUpdate = null; // Guardará el producto al que se le asignará la imagen
    let currentMenuData = JSON.parse(JSON.stringify(MENU_DATA)); // Deep copy

    function renderProductList(filter = '') {
        productListContainer.innerHTML = '';
        const normalizedFilter = filter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        currentMenuData.forEach(category => {
            category.productos.forEach(product => {
                const productNameNormalized = product.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (normalizedFilter && !productNameNormalized.includes(normalizedFilter)) {
                    return;
                }

                const listItem = document.createElement('div');
                listItem.className = 'product-list-item';
                listItem.dataset.productName = product.nombre;
                listItem.dataset.categoryName = category.categoria;

                if (product.img !== '/italia/images/productos/default.svg') {
                    listItem.classList.add('assigned');
                }

                listItem.innerHTML = `
                    <div>
                        <div class="name">${product.nombre}</div>
                        <div class="category">${category.categoria}</div>
                    </div>
                    <button class="assign-btn">Asignar Imagen</button>
                `;

                productListContainer.appendChild(listItem);
            });
        });

        document.querySelectorAll('.assign-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const listItem = event.target.closest('.product-list-item');
                productToUpdate = {
                    productName: listItem.dataset.productName,
                    categoryName: listItem.dataset.categoryName,
                    element: listItem
                };
                imageInput.click(); // Abre el selector de archivos
            });
        });
    }

    function updateOutputData() {
        const outputString = `const MENU_DATA = ${JSON.stringify(currentMenuData, null, 2)};`;
        outputDataTextarea.value = outputString;
    }

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && productToUpdate) {
            const imagePath = `/italia/images/productos/${file.name}`;

            // Actualizar el modelo de datos
            const category = currentMenuData.find(cat => cat.categoria === productToUpdate.categoryName);
            if (category) {
                const product = category.productos.find(prod => prod.nombre === productToUpdate.productName);
                if (product) {
                    product.img = imagePath;
                }
            }

            // Actualizar la UI
            productToUpdate.element.classList.add('assigned');
            updateOutputData();

            // Limpiar para la próxima asignación
            productToUpdate = null;
            imageInput.value = ''; // Permite seleccionar el mismo archivo de nuevo si es necesario
        }
    });

    productSearch.addEventListener('input', () => {
        renderProductList(productSearch.value);
    });

    // Initial render
    renderProductList();
    updateOutputData();
});