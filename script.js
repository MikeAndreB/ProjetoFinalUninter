/* Dados ficticios para teste de login */
const USUARIOS = [
  { nome: 'Maria José', email: 'maria@norte.com',  senha: '123456',     tel: '(11) 99123-4567', end: 'Rua da Fumaça, 10 — São-Paulo, SP',          pedidos: [], pontos: 7 },
  { nome: 'João Cembrasso',    email: 'joao@paranaense.com', senha: 'sertao2026', tel: '(41) 98765-4321', end: 'Av. Curitiba, 500 — Curitiba, PR',    pedidos: [], pontos: 10 },
  { nome: 'Cintia Ago',   email: 'cintia@email.com',  senha: 'baiao123',   tel: '(21) 99001-2233', end: 'Travessa das Palmeiras, 7 — Rio de Janeiro, RJ', pedidos: [], pontos: 3 },
];

const PROMOCOES = [
  { id: 'pr1', emoji: '🫕', nome: 'Baião de Dois', badge: 'prato',
    precoOriginal: 38.90, preco: 28.90,
    desc: 'Arroz com feijão-de-corda, carne-seca e queijo coalho. Hoje com desconto especial!', imagem:'baiao.png', promo: true },
  { id: 'pr2', emoji: '🥭', nome: 'Cajuína Artesanal', badge: 'bebida',
    precoOriginal: 10.00, preco: 6.50,
    desc: 'Suco de caju clarificado. Leve 2 e pague menos — promoção do dia!', imagem:'cajuina.png', promo: true },
  { id: 'pr3', emoji: '🍌', nome: 'Cartola', badge: 'sobremesa',
    precoOriginal: 18.00, preco: 12.00,
    desc: 'Banana frita com queijo coalho e canela. Sobremesa da semana com 33% off!', imagem:'cartola.png', promo: true },
];

const CARDAPIO = {
  pratos: [
    { id: 'p1', emoji: '🫕', nome: 'Baião de Dois',             preco: 38.90, badge: 'prato',     desc: 'Arroz com feijão-de-corda, carne-seca desfiada, queijo coalho e manteiga de garrafa.', imagem:'baiao.png' },
    { id: 'p2', emoji: '🥘', nome: 'Carne de Sol com Macaxeira', preco: 45.00, badge: 'prato',     desc: 'Carne de sol na brasa com macaxeira cozida, manteiga de garrafa e pimenta bode.', imagem:'carnesol.png' },
    { id: 'p3', emoji: '🍲', nome: 'Buchada de Bode',            preco: 42.00, badge: 'prato',     desc: 'Miúdos de bode temperados com coentro, alho e especiarias, cozidos em panela de barro.', imagem:'buchada.png' },
    { id: 'p4', emoji: '🌽', nome: 'Cuscuz Nordestino',          preco: 29.90, badge: 'prato',     desc: 'Cuscuz de milho com ovo caipira, manteiga, queijo coalho e charque.', imagem:'cuzcuz.png' },
    { id: 'p5', emoji: '🍛', nome: 'Moqueca de Camarão',         preco: 54.90, badge: 'prato',     desc: 'Camarões frescos no leite de coco, dendê, tomate, cebola e coentro.', imagem:'moqueca.png' },
  ],
  sobremesas: [
    { id: 's1', emoji: '🍌', nome: 'Cartola',          preco: 18.00, badge: 'sobremesa', desc: 'Banana frita na manteiga coberta com queijo coalho derretido, açúcar e canela.', imagem:'cartola.png' },
    { id: 's2', emoji: '🍮', nome: 'Canjica com Coco', preco: 15.00, badge: 'sobremesa', desc: 'Milho branco cozido no leite de coco com açúcar, cravo e canela.', imagem:'canjica.png' },
    { id: 's3', emoji: '🎂', nome: 'Bolo de Rolo',     preco: 14.00, badge: 'sobremesa', desc: 'Fino bolo de massa enrolado com goiabada. Ícone pernambucano.', imagem:'bolorolo.png' },
  ],
  bebidas: [
    { id: 'b1', emoji: '🟤', nome: 'Umbuzada',           preco: 12.00, badge: 'bebida', desc: 'Suco cremoso de umbu com leite e açúcar. Fruta nativa da Caatinga.', imagem:'umbunzada.png' },
    { id: 'b2', emoji: '🥭', nome: 'Cajuína Artesanal',  preco: 10.00, badge: 'bebida', desc: 'Suco de caju clarificado e levemente adocicado. Piauí no copo.', imagem:'cajuina.png' },
    { id: 'b3', emoji: '🩷', nome: 'Guaraná Jesus',      preco:  9.00, badge: 'bebida', desc: 'O refrigerante rosinha do Maranhão! Sabor único com toque de cravo e canela.', imagem:'guarana.png' },
  ],
};

const STATUS_CLASSES = {
  confirmado: 'status-confirmado', preparando: 'status-preparando',
  pronto: 'status-pronto', entregue: 'status-entregue', cancelado: 'status-cancelado'
};

/* Status GLOBAL */
let usuarios      = USUARIOS.map(u => ({ ...u, pedidos: [], pontos: u.pontos }));
let usuarioLogado = null;   // conta completa
let visitante     = null;   // { nome, cel } sem conta
let lgpdAceito    = localStorage.getItem('lgpd_aceito') === 'true';

let carrinho      = [];
let itemAtual     = null;
let qtdAtual      = 1;
let editandoIdx   = -1;
let qtdEditando   = 1;

document.addEventListener('DOMContentLoaded', () => {
  renderCardapio();
  if (!lgpdAceito) setTimeout(() => abrirPopup('popup-lgpd'), 700);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const t = document.querySelector('.tela.ativa')?.id;
    if (t === 'tela-login')    fazerLogin();
    if (t === 'tela-cadastro') criarConta();
  });
});

function ir(telaId) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  document.getElementById(telaId).classList.add('ativa');
  window.scrollTo(0, 0);
}

function irLogin() {
  if (!lgpdAceito) abrirPopup('popup-lgpd');
  ir('tela-login');
}

/* Botão "Ver Cardápio / Pedir" vai direto ao cardápio sem pedir dados */

function iniciarPedidoOuCardapio() {
  ir('tela-cardapio');
} 

function abrirFormVisitante() {
  abrirPopup('popup-visitante');
}
/* Função para confirmar visitante e disponibilizar pagamento */
function confirmarVisitante() {
  const nome = document.getElementById('vis-nome').value.trim();
  const cel  = document.getElementById('vis-cel').value.trim();
  const end  = document.getElementById('vis-end').value.trim();
  const err  = document.getElementById('visitante-erro');
  err.style.display = 'none';
  if (!nome || !cel || !end) { mostrarErro(err, 'Preencha nome, celular e endereço.'); return; }
  visitante = { nome, cel, end, pedidos: [] };
  fecharPopup('popup-visitante');
  // Se já estava no cardápio, só atualiza a barra e vai para pagamento
  document.getElementById('nome-usuario').textContent = nome.split(' ')[0];
  document.getElementById('barra-bv').style.display   = 'block';
  document.getElementById('bv-pontos').style.display  = 'none';
  document.getElementById('botao-perfil-nav').style.display = 'none';
  // retoma o fluxo de pagamento diretamente
  irParaPagamento();
}

/* Ir a tela de pedidos */
function irPedidos() {
  renderPedidos();
  ir('tela-pedidos');
}
/* Ir a tela de perfil */
function irPerfil() {
  if (!usuarioLogado) return;
  renderPerfil();
  ir('tela-perfil');
}
/* função sair e voltar a tela inicial */
function sair() {
  usuarioLogado = null;
  visitante     = null;
  carrinho      = [];
  atualizarBadgeCarrinho();
  ir('tela-home');
}

/* LGPD */
function aceitarLGPD() {
  lgpdAceito = true;
  localStorage.setItem('lgpd_aceito', 'true');
  fecharPopup('popup-lgpd');
}
function recusarLGPD() {
  fecharPopup('popup-lgpd');
  ir('tela-home');
}

/* Autenticação de login */
function fazerLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const senha = document.getElementById('login-senha').value;
  const err   = document.getElementById('login-erro');
  err.style.display = 'none';
  if (!email || !senha) { mostrarErro(err, 'Preencha e-mail e senha.'); return; }
  const user = usuarios.find(u => u.email.toLowerCase() === email && u.senha === senha);
  if (!user) {
    mostrarErro(err, 'E-mail ou senha incorretos. Tente novamente.');
    document.getElementById('login-senha').value = '';
    return;
  }
  logar(user);
}

function logar(user) {
  usuarioLogado = user;
  visitante     = null;
  document.getElementById('nome-usuario').textContent = user.nome.split(' ')[0];
  document.getElementById('barra-bv').style.display   = 'block';
  document.getElementById('bv-pontos').style.display  = 'inline';
  document.getElementById('bv-pontos-val').textContent = user.pontos || 0;
  document.getElementById('botao-perfil-nav').style.display = 'inline-flex';
  ir('tela-cardapio');
}

/*Autenticação de cadastro*/
function criarConta() {
  const nome  = document.getElementById('cad-nome').value.trim();
  const email = document.getElementById('cad-email').value.trim().toLowerCase();
  const tel   = document.getElementById('cad-tel').value.trim();
  const end   = document.getElementById('cad-end').value.trim();
  const senha = document.getElementById('cad-senha').value;
  const err   = document.getElementById('cadastro-erro');
  const suc   = document.getElementById('cadastro-sucesso');
  err.style.display = 'none'; suc.style.display = 'none';
  if (!nome || !email || !tel || !end || !senha) { mostrarErro(err, 'Preencha todos os campos.'); return; }
  if (senha.length < 6) { mostrarErro(err, 'Senha deve ter ao menos 6 caracteres.'); return; }
  if (usuarios.find(u => u.email.toLowerCase() === email)) { mostrarErro(err, 'E-mail já cadastrado.'); return; }
  const novoUser = { nome, email, senha, tel, end, pedidos: [], pontos: 0 };
  usuarios.push(novoUser);
  suc.style.display = 'block';
  setTimeout(() => {
    ['cad-nome','cad-email','cad-tel','cad-end','cad-senha'].forEach(id => document.getElementById(id).value = '');
    suc.style.display = 'none';
    logar(novoUser);
  }, 1400);
}

/*Renderiza o cardápio*/
function renderCardapio() {
  renderGradePromo('grade-promocoes', PROMOCOES);
  renderGrade('grade-pratos',     CARDAPIO.pratos);
  renderGrade('grade-sobremesas', CARDAPIO.sobremesas);
  renderGrade('grade-bebidas',    CARDAPIO.bebidas);
}

function cardHTML(item, isPromo) {
  const visual = item.imagem
    ? `<img src="${item.imagem}" alt="${item.nome}" class="prato-img" onerror="this.parentElement.innerHTML='${item.emoji}'">`
    : item.emoji;
  const precoHTML = isPromo
    ? `<span class="preco-original">${fmt(item.precoOriginal)}</span> <span class="prato-preco preco-promo">${fmt(item.preco)}</span>`
    : `<span class="prato-preco">${fmt(item.preco)}</span>`;
  const promoRibbon = isPromo ? `<div class="promo-ribbon">🔥 OFERTA</div>` : '';
  return `
    <div class="card-prato${isPromo ? ' card-promo' : ''}">
      ${promoRibbon}
      <div class="prato-emoji">${visual}</div>
      <div class="prato-info">
        <p class="prato-nome">${item.nome}</p>
        <p class="prato-desc">${item.desc}</p>
        <div class="prato-rodape">
          <div class="preco-wrap">${precoHTML}</div>
          <span class="badge-tipo badge-${item.badge}">${item.badge}</span>
        </div>
        <button class="botao-add-carrinho" onclick="abrirPopupItem('${item.id}')">🛒 Adicionar</button>
      </div>
    </div>`;
}

function renderGrade(containerId, itens) {
  document.getElementById(containerId).innerHTML = itens.map(i => cardHTML(i, false)).join('');
}

function renderGradePromo(containerId, itens) {
  document.getElementById(containerId).innerHTML = itens.map(i => cardHTML(i, true)).join('');
}

/*Itens*/
function abrirPopupItem(itemId) {
  const item = buscarItem(itemId);
  if (!item) return;
  itemAtual = item;
  qtdAtual  = 1;
  document.getElementById('item-emoji').textContent = item.emoji;
  document.getElementById('item-nome').textContent  = item.nome;
  document.getElementById('item-desc').textContent  = item.desc;
  const promoTag = document.getElementById('item-promo-tag');
  promoTag.style.display = item.promo ? 'block' : 'none';
  atualizarPopupItem();
  abrirPopup('popup-item');
}

function alterarQtd(delta) {
  qtdAtual = Math.max(1, Math.min(99, qtdAtual + delta));
  atualizarPopupItem();
}

function atualizarPopupItem() {
  if (!itemAtual) return;
  document.getElementById('qtd-val').textContent       = qtdAtual;
  document.getElementById('item-preco').textContent    = fmt(itemAtual.preco);
  document.getElementById('item-subtotal').textContent = `Subtotal: ${fmt(itemAtual.preco * qtdAtual)}`;
}

function adicionarAoCarrinho() {
  if (!itemAtual) return;
  const idx = carrinho.findIndex(c => c.item.id === itemAtual.id);
  if (idx >= 0) carrinho[idx].qtd += qtdAtual;
  else carrinho.push({ item: itemAtual, qtd: qtdAtual });
  atualizarBadgeCarrinho();
  fecharPopup('popup-item');
  flashBadge();
}

/*Carrinho*/
function atualizarBadgeCarrinho() {
  const total = carrinho.reduce((s, c) => s + c.qtd, 0);
  const badge = document.getElementById('carrinho-badge');
  badge.textContent   = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function flashBadge() {
  const btn = document.getElementById('botao-carrinho');
  btn.style.transform = 'scale(1.18)';
  setTimeout(() => { btn.style.transform = ''; }, 220);
}

function abrirCarrinho() { renderCarrinho(); abrirPopup('popup-carrinho-tela'); }

function renderCarrinho() {
  const lista  = document.getElementById('carrinho-lista-items');
  const btnFin = document.getElementById('botao-finalizar');
  const barTot = document.getElementById('carrinho-total-bar');

  if (carrinho.length === 0) {
    lista.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio 🛒</div>';
    barTot.style.display = 'none'; btnFin.style.display = 'none'; return;
  }

  barTot.style.display = 'flex'; btnFin.style.display = 'block';
  let total = 0;
  lista.innerHTML = carrinho.map((c, idx) => {
    const sub = c.item.preco * c.qtd; total += sub;
    return `
      <div class="carrinho-item-row">
        <span class="ci-emoji">${c.item.emoji}</span>
        <div class="ci-info">
          <p class="ci-nome">${c.item.nome}${c.item.promo ? ' <span class="ci-promo-tag">PROMO</span>' : ''}</p>
          <p class="ci-qtd">${c.qtd}× ${fmt(c.item.preco)}</p>
        </div>
        <span class="ci-preco">${fmt(sub)}</span>
        <div class="ci-acoes">
          <button class="ci-btn" onclick="editarItemCarrinho(${idx})">✏️</button>
          <button class="ci-btn del" onclick="removerItemCarrinho(${idx})">🗑️</button>
        </div>
      </div>`;
  }).join('');
  document.getElementById('carrinho-total-valor').textContent = fmt(total);
}

function removerItemCarrinho(idx) {
  carrinho.splice(idx, 1);
  atualizarBadgeCarrinho();
  renderCarrinho();
}

function editarItemCarrinho(idx) {
  editandoIdx = idx; qtdEditando = carrinho[idx].qtd;
  const item  = carrinho[idx].item;
  document.getElementById('editar-emoji').textContent = item.emoji;
  document.getElementById('editar-nome').textContent  = item.nome;
  atualizarPopupEditar();
  fecharPopup('popup-carrinho-tela');
  abrirPopup('popup-editar');
}

function alterarQtdEditar(delta) {
  qtdEditando = Math.max(1, Math.min(99, qtdEditando + delta));
  atualizarPopupEditar();
}

function atualizarPopupEditar() {
  const item = carrinho[editandoIdx]?.item; if (!item) return;
  document.getElementById('editar-qtd-val').textContent  = qtdEditando;
  document.getElementById('editar-preco').textContent    = fmt(item.preco);
  document.getElementById('editar-subtotal').textContent = `Subtotal: ${fmt(item.preco * qtdEditando)}`;
}

function salvarEdicao() {
  if (editandoIdx < 0) return;
  carrinho[editandoIdx].qtd = qtdEditando;
  atualizarBadgeCarrinho();
  fecharPopup('popup-editar');
  abrirCarrinho();
}

/*Função para pagamento*/
function irParaPagamento() {
  if (carrinho.length === 0) return;

  // Se não há sessão ativa, pede identificação antes de pagar
  if (!usuarioLogado && !visitante) {
    fecharPopup('popup-carrinho-tela');
    abrirPopup('popup-convite');
    return;
  }

  const total = carrinho.reduce((s, c) => s + c.item.preco * c.qtd, 0);
  // aplica desconto se usuário tem 10+ pontos
  
  const desc = (usuarioLogado && (usuarioLogado.pontos || 0) >= 10);
  const totalFinal = desc ? total * 0.9 : total;
  document.getElementById('pg-total').innerHTML = desc
    ? `<span style="text-decoration:line-through;color:#aaa;font-size:.9em">${fmt(total)}</span> <span style="color:var(--verde)">${fmt(totalFinal)}</span> <span style="font-size:.75em;background:#d4edda;color:#276749;padding:.1rem .4rem;border-radius:8px">10% OFF fidelidade</span>`
    : fmt(total);
  fecharPopup('popup-carrinho-tela');
  abrirPopup('popup-pagamento');
}

function processarPagamento(aprovado) {
  const formaPg    = document.querySelector('input[name="pagamento"]:checked')?.value || 'pix';
  const totalBruto = carrinho.reduce((s, c) => s + c.item.preco * c.qtd, 0);
  const desc       = aprovado && (usuarioLogado && (usuarioLogado.pontos || 0) >= 10);
  const total      = desc ? totalBruto * 0.9 : totalBruto;
  const pedido     = {
    id: gerarId(), data: new Date().toLocaleString('pt-BR'),
    itens: [...carrinho], total, pagamento: formaPg,
    status: aprovado ? 'confirmado' : 'cancelado', aprovado,
    desconto: desc,
  };

  fecharPopup('popup-pagamento');

  const icone  = document.getElementById('resultado-icone');
  const titulo = document.getElementById('resultado-titulo');
  const msg    = document.getElementById('resultado-msg');
  const btn    = document.getElementById('resultado-btn');

  if (aprovado) {
    icone.textContent  = '✔'; icone.className = 'resultado-icone';
    titulo.textContent = 'Pagamento Aprovado!';

    // salvar pedido
    const sessao = usuarioLogado || visitante;
    if (sessao) { if (!sessao.pedidos) sessao.pedidos = []; sessao.pedidos.unshift(pedido); }

    // fidelidade
    let pontosMsg = '';
    if (usuarioLogado) {
      if (desc) {
        // consumiu os 10 pontos
        usuarioLogado.pontos = Math.max(0, (usuarioLogado.pontos || 0) - 10);
      }
      usuarioLogado.pontos = (usuarioLogado.pontos || 0) + 1;
      document.getElementById('bv-pontos-val').textContent = usuarioLogado.pontos;
      const restam = 10 - usuarioLogado.pontos;
      pontosMsg = usuarioLogado.pontos >= 10
        ? ' 🎉 Você atingiu 10 pontos! Seu próximo pedido tem 10% de desconto!'
        : ` ⭐ +1 ponto de fidelidade! Faltam ${restam} para seu desconto.`;
    }

    msg.textContent = `Pedido #${pedido.id} confirmado e está sendo preparado.${pontosMsg}`;
    btn.textContent = 'Ver Meus Pedidos';
    btn.onclick     = () => { fecharPopup('popup-resultado'); irPedidos(); };

    carrinho = [];
    atualizarBadgeCarrinho();
  } else {
    icone.textContent  = '✕'; icone.className = 'resultado-icone erro';
    titulo.textContent = 'Pagamento Recusado';
    msg.textContent    = 'Não foi possível processar o pagamento. Verifique seus dados e tente novamente.';
    btn.textContent    = 'Tentar Novamente';
    btn.onclick        = () => { fecharPopup('popup-resultado'); abrirCarrinho(); };
  }

  abrirPopup('popup-resultado');
}

/*Tela de Pedidos*/
function renderPedidos() {
  const lista   = document.getElementById('pedidos-lista');
  const sessao  = usuarioLogado || visitante;
  const pedidos = sessao?.pedidos || [];

  if (!sessao) {
    lista.innerHTML = `<div class="pedidos-vazio"><span>🔒</span>Faça login ou informe seus dados para ver pedidos.</div>`;
    return;
  }

  if (pedidos.length === 0) {
    lista.innerHTML = `<div class="pedidos-vazio"><span>📋</span>Nenhum pedido ainda.<br>Explore o cardápio!</div>`;
    return;
  }

  const pgLabel = { pix:'PIX', credito:'Crédito', debito:'Débito', dinheiro:'Dinheiro' };
  lista.innerHTML = pedidos.map(p => {
    const itensStr = p.itens.map(c => `${c.qtd}× ${c.item.nome}`).join(', ');
    return `
      <div class="pedido-card">
        <div class="pedido-header">
          <div><p class="pedido-id">Pedido #${p.id}</p><p class="pedido-data">${p.data}</p></div>
          <span class="pedido-status ${STATUS_CLASSES[p.status] || ''}">${p.status}</span>
        </div>
        <p class="pedido-itens">${itensStr}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.4rem">
          <span class="pedido-total">${fmt(p.total)}${p.desconto ? ' <span class="ci-promo-tag">10% OFF</span>' : ''}</span>
          <span class="pedido-pagamento">via ${pgLabel[p.pagamento] || p.pagamento}</span>
        </div>
      </div>`;
  }).join('');
}

/*Tela do perfil com informação de fidelidade*/
function renderPerfil() {
  if (!usuarioLogado) return;
  const u       = usuarioLogado;
  const iniciais = u.nome.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase();
  const pedidos  = u.pedidos || [];
  const gasto    = pedidos.filter(p => p.aprovado).reduce((s, p) => s + p.total, 0);
  const pontos   = Math.min(u.pontos || 0, 10);

  // avatar e dados
  document.getElementById('perfil-avatar').textContent = iniciais;
  document.getElementById('p-nome').textContent  = u.nome;
  document.getElementById('p-email').textContent = u.email;
  document.getElementById('p-tel').textContent   = u.tel;
  document.getElementById('p-end').textContent   = u.end;
  document.getElementById('stat-pedidos').textContent = pedidos.length;
  document.getElementById('stat-gasto').textContent   = fmt(gasto);

  // fidelidade
  document.getElementById('fid-pontos').textContent = pontos;
  const pct = (pontos / 10) * 100;
  document.getElementById('fid-barra').style.width = pct + '%';

  const infoEl = document.getElementById('fid-info');
  if (pontos >= 10) {
    infoEl.innerHTML = '🎉 <strong>Parabéns!</strong> Você tem 10 pontos — seu próximo pedido ganha <strong>10% de desconto automático</strong>!';
    document.getElementById('fid-barra').classList.add('barra-cheia');
  } else {
    const restam = 10 - pontos;
    infoEl.innerHTML = `A cada pedido aprovado você ganha 1 ponto. Faltam <strong>${restam} ponto${restam > 1 ? 's' : ''}</strong> para ganhar <strong>10% de desconto</strong> no próximo pedido!`;
    document.getElementById('fid-barra').classList.remove('barra-cheia');
  }
}

function abrirPopup(id) {
  document.getElementById('overlay-fundo').classList.add('ativo');
  const el = document.getElementById(id);
  el.style.display = 'block';
  requestAnimationFrame(() => el.classList.add('ativo'));
}

function fecharPopup(id) {
  const el = document.getElementById(id);
  el.classList.remove('ativo');
  setTimeout(() => {
    el.style.display = 'none';
    if (!document.querySelector('.popup.ativo'))
      document.getElementById('overlay-fundo').classList.remove('ativo');
  }, 260);
}

function fecharTodosPopups() {
  document.querySelectorAll('.popup.ativo').forEach(p => fecharPopup(p.id));
}

function buscarItem(id) {
  return [...PROMOCOES, ...CARDAPIO.pratos, ...CARDAPIO.sobremesas, ...CARDAPIO.bebidas].find(i => i.id === id);
}
function fmt(v) { return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); }
function gerarId() { return Math.random().toString(36).substr(2,6).toUpperCase(); }
function mostrarErro(el, msg) { el.textContent = msg; el.style.display = 'block'; }
