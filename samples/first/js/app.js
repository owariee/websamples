// Storage key for products
const STORAGE_KEY = 'autoparts_products';

// DOM Elements
const form = document.getElementById('productForm');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const productList = document.getElementById('productList');
const productCount = document.getElementById('productCount');
const codigoInput = document.getElementById('codigo');
const descricaoInput = document.getElementById('descricao');
const marcaInput = document.getElementById('marca');
const aplicacaoInput = document.getElementById('aplicacao');

// State
let products = [];
let editingId = null;

/**
 * Load products from localStorage
 */
function loadProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    products = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    products = [];
  }
}

/**
 * Save products to localStorage
 */
function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

/**
 * Clear form inputs
 */
function clearForm() {
  form.reset();
  editingId = null;
  submitBtn.textContent = 'Adicionar Peça';
  submitBtn.classList.remove('btn-warning');
  submitBtn.classList.add('btn-primary');
  cancelBtn.style.display = 'none';
}

/**
 * Handle form submission (add or edit)
 */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const codigo = codigoInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const marca = marcaInput.value.trim();
  const aplicacao = aplicacaoInput.value.trim();

  // Validation
  if (!codigo || !descricao || !marca || !aplicacao) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  if (editingId) {
    // Update existing product
    const product = products.find((p) => p.id === editingId);
    if (product) {
      product.codigo = codigo;
      product.descricao = descricao;
      product.marca = marca;
      product.aplicacao = aplicacao;
      product.updatedAt = new Date().toISOString();
    }
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      codigo,
      descricao,
      marca,
      aplicacao,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
  }

  saveProducts();
  clearForm();
  render();
});

/**
 * Cancel edit mode
 */
cancelBtn.addEventListener('click', () => {
  clearForm();
});

/**
 * Edit a product
 */
function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  editingId = id;
  codigoInput.value = product.codigo;
  descricaoInput.value = product.descricao;
  marcaInput.value = product.marca;
  aplicacaoInput.value = product.aplicacao;

  submitBtn.textContent = 'Salvar Alterações';
  submitBtn.classList.remove('btn-primary');
  submitBtn.classList.add('btn-warning');
  cancelBtn.style.display = 'block';

  // Scroll to form
  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  codigoInput.focus();
}

/**
 * Delete a product
 */
function deleteProduct(id) {
  if (
    confirm(
      'Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.'
    )
  ) {
    products = products.filter((p) => p.id !== id);
    if (editingId === id) clearForm();
    saveProducts();
    render();
  }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Render product list
 */
function render() {
  // Update count
  productCount.textContent = products.length;

  if (products.length === 0) {
    productList.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma peça cadastrada ainda.</p>
        <p class="text-muted">Adicione a primeira peça usando o formulário acima.</p>
      </div>
    `;
    return;
  }

  productList.innerHTML = products
    .map((product, index) => {
      return `
        <article class="product-card" style="animation-delay: ${index * 0.05}s">
          <div class="product-header">
            <span class="product-code">${escapeHtml(product.codigo)}</span>
            <div class="product-actions">
              <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})" title="Editar">
                ✏️ Editar
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})" title="Deletar">
                🗑️ Deletar
              </button>
            </div>
          </div>

          <div class="product-body">
            <div class="product-field">
              <div class="product-field-label">Descrição</div>
              <div class="product-field-value">${escapeHtml(product.descricao)}</div>
            </div>
            <div class="product-field">
              <div class="product-field-label">Marca</div>
              <div class="product-field-value">${escapeHtml(product.marca)}</div>
            </div>
            <div class="product-field">
              <div class="product-field-label">Aplicação</div>
              <div class="product-field-value">${escapeHtml(product.aplicacao)}</div>
            </div>
          </div>

          <div class="product-footer">
            <div class="text-muted" style="font-size: 0.8rem">
              Criado: ${formatDate(product.createdAt)}
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Initialize app
 */
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  render();
});
