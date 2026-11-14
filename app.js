(function () {
  const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtData = (iso) => { const [a, m, d] = iso.split('-'); return `${d}/${m}/${a}`; };

  document.getElementById('ano').textContent = new Date().getFullYear();

  fetch('ofertas.json', { cache: 'no-store' })
    .then((r) => r.json())
    .then((dados) => {
      document.getElementById('data-atualizacao').textContent = fmtData(dados.atualizado);
      ligarLinks(dados.links || {});
      montarOfertas(dados.ofertas || []);
    })
    .catch(() => {
      document.getElementById('lista-ofertas').innerHTML = '<p class="muted">Não foi possível carregar as ofertas agora. Tente de novo em instantes.</p>';
    });

  function ligarLinks(links) {
    const set = (sel, url) => document.querySelectorAll(sel).forEach((a) => {
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
      else if (!a.closest('.topnav')) { a.classList.add('is-off'); a.title = 'Em breve'; }
    });
    set('.js-whats', links.whatsapp);
    set('.js-tele', links.telegram);

    const redes = [['Instagram', links.instagram], ['TikTok', links.tiktok], ['X (Twitter)', links.x]].filter(([, u]) => u);
    document.getElementById('redes').innerHTML = redes
      .map(([nome, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${nome}</a>`).join('');
  }


  function montarOfertas(ofertas) {
    const lista = document.getElementById('lista-ofertas');
    const filtros = document.getElementById('filtros');
    const cats = ['Todas', ...new Set(ofertas.map((o) => o.categoria))];

    const render = (cat) => {
      const itens = ofertas.filter((o) => cat === 'Todas' || o.categoria === cat);
      lista.innerHTML = itens.map((o) => {
        const desconto = o.preco_antigo > o.preco ? Math.round((1 - o.preco / o.preco_antigo) * 100) : 0;
        const badge = o.destaque ? '<span class="badge hot">Destaque</span>' : (desconto >= 10 ? `<span class="badge">-${desconto}%</span>` : '');
        return `
        <article class="card">
          <div class="card-img">${badge}<img src="${esc(o.imagem)}" alt="${esc(o.titulo)}" loading="lazy"></div>
          <div class="card-body">
            <span class="card-cat">${esc(o.categoria)}</span>
            <h3>${esc(o.titulo)}</h3>
            <div class="price">
              ${desconto ? `<div class="price-old">${brl(o.preco_antigo)}</div>` : ''}
              <div class="price-now">${brl(o.preco)}</div>
            </div>
            <div class="store">Vendido por ${esc(o.loja)}</div>
            ${o.obs ? `<div class="note">${esc(o.obs)}</div>` : ''}
            <a class="btn btn-green" href="${esc(o.link)}" target="_blank" rel="noopener sponsored">Ver oferta</a>
          </div>
        </article>`;
      }).join('') || '<p class="muted">Nenhuma oferta nessa categoria agora.</p>';
    };

    filtros.innerHTML = cats.map((c, i) => `<button class="chip" role="tab" aria-selected="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    filtros.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      filtros.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-selected', c === chip));
      render(chip.dataset.cat);
    });
    render('Todas');
  }
})();
