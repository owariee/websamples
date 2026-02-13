const products = [
  { id:1, name:'Camiseta Minimal', price:79.9, img:'https://picsum.photos/seed/p1/400/300' },
  { id:2, name:'Tênis Urbano', price:249.0, img:'https://picsum.photos/seed/p2/400/300' },
  { id:3, name:'Relógio Clássico', price:399.5, img:'https://picsum.photos/seed/p3/400/300' },
  { id:4, name:'Mochila Compacta', price:129.0, img:'https://picsum.photos/seed/p4/400/300' },
  { id:5, name:'Óculos Aviador', price:199.99, img:'https://picsum.photos/seed/p5/400/300' },
  { id:6, name:'Jaqueta Tech', price:349.0, img:'https://picsum.photos/seed/p6/400/300' },
  { id:7, name:'Boné Sport', price:49.5, img:'https://picsum.photos/seed/p7/400/300' },
  { id:8, name:'Fone Wireless', price:299.9, img:'https://picsum.photos/seed/p8/400/300' },
  { id:9, name:'Cinto de Couro', price:89.0, img:'https://picsum.photos/seed/p9/400/300' }
];

const state = { query: '', sort: 'asc' };

const grid = document.getElementById('productGrid');
const search = document.getElementById('search');
const sortSelect = document.getElementById('sortSelect');

function formatPrice(v){
  return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

function render() {
  const q = state.query.trim().toLowerCase();
  let list = products.filter(p => p.name.toLowerCase().includes(q));
  list.sort((a,b) => state.sort === 'asc' ? a.price - b.price : b.price - a.price);

  grid.innerHTML = '';
  if(list.length === 0){
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = '<div style="padding:24px;color:var(--muted)">Nenhum produto encontrado</div>';
    grid.appendChild(el);
    return;
  }

  // animate with small stagger
  list.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.animation = `fadeUp .32s ease ${idx * 40}ms both`;

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.style.backgroundImage = `url(${p.img})`;

    const meta = document.createElement('div');
    meta.className = 'meta';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = p.name;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = formatPrice(p.price);

    meta.appendChild(name);
    meta.appendChild(price);

    card.appendChild(thumb);
    card.appendChild(meta);

    grid.appendChild(card);
  });
}

search.addEventListener('input', (e) => { state.query = e.target.value; render(); });
sortSelect.addEventListener('change', (e) => { state.sort = e.target.value; render(); });

// initial render
document.addEventListener('DOMContentLoaded', render);

// small animation keyframes injection
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes fadeUp{ from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
`;
document.head.appendChild(styleSheet);
