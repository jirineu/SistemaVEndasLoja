// DADOS DE BACKUP INTEGRADOS (CUSTO KG) - MANTIDOS ORIGINAIS
const backupInicial = [
    { "id": 101, "nome": "Paparica picante", "custo": 12.00, "gramas": 100, "venda": 5.00, "estoque": 0, "obs": "" },
    { "id": 102, "nome": "Paparica doce", "custo": 12.00, "gramas": 100, "venda": 5.00, "estoque": 0, "obs": "" },
    { "id": 103, "nome": "Paparica defumada", "custo": 12.00, "gramas": 100, "venda": 5.00, "estoque": 1, "obs": "" },
    { "id": 104, "nome": "Colorau", "custo": 25.00, "gramas": 50, "venda": 3.50, "estoque": 10, "obs": "" },
    { "id": 105, "nome": "Chimi - churi", "custo": 28.20, "gramas": 50, "venda": 3.50, "estoque": 3, "obs": "" },
    { "id": 106, "nome": "Edu Guedes", "custo": 26.70, "gramas": 50, "venda": 3.50, "estoque": 1, "obs": "" },
    { "id": 107, "nome": "Ana Maria", "custo": 19.90, "gramas": 50, "venda": 3.50, "estoque": 6, "obs": "" },
    { "id": 108, "nome": "Lemon Pepper", "custo": 24.00, "gramas": 50, "venda": 3.50, "estoque": 4, "obs": "" },
    { "id": 109, "nome": "Alho frito", "custo": 25.50, "gramas": 100, "venda": 6.00, "estoque": 5, "obs": "" },
    { "id": 110, "nome": "Têmpera tudo", "custo": 27.00, "gramas": 50, "venda": 3.50, "estoque": 0, "obs": "" },
    { "id": 111, "nome": "Tempero baiano", "custo": 26.50, "gramas": 100, "venda": 5.00, "estoque": 4, "obs": "" },
    { "id": 112, "nome": "Tempero baiano S/", "custo": 20.00, "gramas": 100, "venda": 5.00, "estoque": 2, "obs": "" },
    { "id": 113, "nome": "Tempero mineiro", "custo": 21.00, "gramas": 50, "venda": 3.50, "estoque": 4, "obs": "" },
    { "id": 114, "nome": "Vinagrete", "custo": 34.70, "gramas": 50, "venda": 3.50, "estoque": 5, "obs": "" },
    { "id": 115, "nome": "Salsa cebola e alho", "custo": 31.60, "gramas": 50, "venda": 3.50, "estoque": 4, "obs": "" },
    { "id": 116, "nome": "Coentro inteiro", "custo": 9.00, "gramas": 50, "venda": 2.00, "estoque": 3, "obs": "" },
    { "id": 117, "nome": "Orégano", "custo": 0, "gramas": 25, "venda": 2.00, "estoque": 0, "obs": "" },
    { "id": 118, "nome": "Folhas de Louro", "custo": 36.50, "gramas": 25, "venda": 3.50, "estoque": 0, "obs": "" },
    { "id": 119, "nome": "Chá de especiarias", "custo": 29.90, "gramas": 100, "venda": 7.00, "estoque": 0, "obs": "" },
    { "id": 120, "nome": "Chá camomila", "custo": 34.90, "gramas": 100, "venda": 7.00, "estoque": 0, "obs": "" },
    { "id": 121, "nome": "Chá erva doce", "custo": 24.99, "gramas": 50, "venda": 5.00, "estoque": 0, "obs": "" },
    { "id": 122, "nome": "Chá capim", "custo": 0, "gramas": 100, "venda": 5.00, "estoque": 0, "obs": "" },
    { "id": 123, "nome": "Castanhas", "custo": 61.00, "gramas": 100, "venda": 9.99, "estoque": 0, "obs": "" }
];

let produtos = JSON.parse(localStorage.getItem('sp_prods')) || backupInicial;
let vendas = JSON.parse(localStorage.getItem('sp_vendas')) || [];
let configs = JSON.parse(localStorage.getItem('sp_cfgs')) || { valorFixo: 0 };
let listaCompras = JSON.parse(localStorage.getItem('sp_lista')) || [];
let carrinho = [];
let chart = null;

// Funções de Utilidade
function notify(title, text, icon) {
    Swal.fire({ title, text, icon, confirmButtonColor: '#e67e22' });
}

// Navegação de Telas
function showScreen(id, btn) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('screen-' + id).classList.add('active');
    
    if(!btn) {
        const map = { 'dash':0, 'lista':1, 'estoque':2, 'vendas':3, 'config':4 };
        btn = document.querySelectorAll('.nav-item')[map[id]];
    }
    if(btn) btn.classList.add('active');

    if(id === 'add') aplicarPrecoPadrao();
    if(id === 'estoque') listarEstoque();
    if(id === 'vendas') listarVendas();
    if(id === 'dash') atualizarDash();
    if(id === 'lista') abrirListaCompras();
    if(id === 'config') document.getElementById('cfg-valor-fixo').value = configs.valorFixo;
}

// Lógica de Configurações
function salvarConfig() {
    configs.valorFixo = document.getElementById('cfg-valor-fixo').value;
    localStorage.setItem('sp_cfgs', JSON.stringify(configs));
    notify("Sucesso!", "Preço padrão de venda atualizado!", "success");
}

function aplicarPrecoPadrao() {
    if(!document.getElementById('p-id').value) {
        const v = parseFloat(configs.valorFixo) || 0;
        document.getElementById('p-venda').value = v.toFixed(2);
        document.getElementById('p-sugerido').innerText = `R$ ${v.toFixed(2)}`;
    }
}

// Gestão da Lista de Compras
function abrirListaCompras() {
    const sel = document.getElementById('li-produto-select');
    sel.innerHTML = produtos.map(p => `<option value="${p.id}">${p.nome} (${p.gramas}g/un)</option>`).join('');
    renderizarLista();
}

function adicionarNaLista() {
    const id = parseInt(document.getElementById('li-produto-select').value);
    const gramasInformadas = parseFloat(document.getElementById('li-qtd-gramas').value);
    if(!gramasInformadas) return notify("Atenção", "Insira a quantidade total em gramas comprada!", "warning");
    
    const p = produtos.find(x => x.id === id);
    const unidadesConvertidas = Math.ceil(gramasInformadas / p.gramas);

    listaCompras.push({ 
        idLista: Date.now(), 
        idProd: id, 
        nome: p.nome, 
        gramasPedidas: gramasInformadas,
        qtdUnidades: unidadesConvertidas 
    });
    
    salvarLista();
    document.getElementById('li-qtd-gramas').value = '';
}

function renderizarLista() {
    const cont = document.getElementById('lista-compras-pendentes');
    cont.innerHTML = '';
    if(listaCompras.length === 0) {
        cont.innerHTML = '<p style="text-align:center; color:#95a5a6; margin-top:20px;">Nenhum item pendente.</p>';
        return;
    }
    listaCompras.forEach(i => {
        cont.innerHTML += `<div class="item-row">
            <div>
                <div class="info-main">${i.nome}</div>
                <div class="info-sub">${i.gramasPedidas}g comprados → <b>${i.qtdUnidades} potes</b></div>
            </div>
            <div style="display:flex; gap:5px;">
                <button class="btn-mini" style="background:var(--success)" onclick="confirmarCompra(${i.idLista})">✅ Confirmar</button>
                <button class="btn-mini" style="background:var(--danger)" onclick="removerLista(${i.idLista})">✕</button>
            </div>
        </div>`;
    });
}

function confirmarCompra(idL) {
    const idx = listaCompras.findIndex(l => l.idLista === idL);
    const item = listaCompras[idx];
    const pIdx = produtos.findIndex(p => p.id === item.idProd);
    
    if(pIdx !== -1) {
        produtos[pIdx].estoque = (parseInt(produtos[pIdx].estoque) || 0) + item.qtdUnidades;
        listaCompras.splice(idx, 1);
        localStorage.setItem('sp_prods', JSON.stringify(produtos));
        salvarLista();
        notify("Estoque Atualizado", `${item.nome}: +${item.qtdUnidades} unidades adicionadas.`, "success");
    }
}

function removerLista(idL) {
    listaCompras = listaCompras.filter(l => l.idLista !== idL);
    salvarLista();
}

function salvarLista() {
    localStorage.setItem('sp_lista', JSON.stringify(listaCompras));
    renderizarLista();
}

// --- FUNÇÃO DE EXCLUSÃO ---
function excluirProduto(id) {
    Swal.fire({
        title: 'Excluir Produto?',
        text: "Esta ação é irreversível e removerá o item do estoque e dos relatórios!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sim, excluir permanentemente',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            produtos = produtos.filter(p => p.id != id);
            localStorage.setItem('sp_prods', JSON.stringify(produtos));
            notify("Excluído!", "O produto foi removido com sucesso.", "success");
            limparForm();
            showScreen('estoque');
        }
    });
}

// Gestão de Produtos e Estoque
function salvarProduto() {
    const id = document.getElementById('p-id').value;
    const nome = document.getElementById('p-nome').value;
    const custo = parseFloat(document.getElementById('p-custo').value) || 0;
    const gramas = parseFloat(document.getElementById('p-gramas').value) || 1;
    const venda = parseFloat(document.getElementById('p-venda').value) || 0;
    const obs = document.getElementById('p-obs').value;

    if(!nome) return notify("Erro", "O nome do produto é obrigatório!", "error");

    if(id) {
        const i = produtos.findIndex(p => p.id == id);
        produtos[i] = {...produtos[i], nome, custo, gramas, venda, obs};
    } else {
        produtos.push({ id: Date.now(), nome, custo, gramas, venda, estoque: 0, obs });
    }

    localStorage.setItem('sp_prods', JSON.stringify(produtos));
    limparForm();
    showScreen('estoque');
    notify("Sucesso", "Produto salvo no banco de dados!", "success");
}

function listarEstoque() {
    const cont = document.getElementById('lista-estoque');
    const busca = document.getElementById('busca-estoque').value.toLowerCase();
    cont.innerHTML = '';

    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(busca));
    
    if(filtrados.length === 0) {
        cont.innerHTML = '<p style="text-align:center; padding:20px;">Nenhum produto encontrado.</p>';
        return;
    }

    filtrados.forEach(p => {
        const statusCor = p.estoque < 1 ? 'color:var(--danger); font-weight:bold;' : '';
        cont.innerHTML += `
            <div class="item-row" style="${p.estoque < 1 ? 'border-left: 4px solid var(--danger)' : ''}">
                <div>
                    <div class="info-main">${p.nome}</div>
                    <div class="info-sub" style="${statusCor}">Qtd: ${p.estoque} un | R$ ${p.venda.toFixed(2)}</div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button onclick="movEstoque(${p.id}, -1)" class="btn-mini" style="background:var(--danger)">-1</button>
                    <button onclick="movEstoque(${p.id}, 1)" class="btn-mini" style="background:var(--success)">+1</button>
                    <button onclick="editarProduto(${p.id})" class="btn-mini" style="background:var(--dark)">✎</button>
                </div>
            </div>`;
    });
}

function movEstoque(id, qtd) {
    const i = produtos.findIndex(p => p.id == id);
    produtos[i].estoque = Math.max(0, (parseInt(produtos[i].estoque) || 0) + qtd);
    localStorage.setItem('sp_prods', JSON.stringify(produtos));
    listarEstoque();
}

function editarProduto(id) {
    const p = produtos.find(p => p.id == id);
    if (!p) return;

    document.getElementById('p-id').value = p.id;
    document.getElementById('p-nome').value = p.nome;
    document.getElementById('p-custo').value = p.custo;
    document.getElementById('p-gramas').value = p.gramas;
    document.getElementById('p-venda').value = p.venda;
    document.getElementById('p-obs').value = p.obs || '';
    document.getElementById('titulo-form').innerText = "✎ Editar Produto";
    document.getElementById('btn-cancelar').style.display = 'block';

    let btnExcluir = document.getElementById('btn-excluir-dinamico');
    if (!btnExcluir) {
        btnExcluir = document.createElement('button');
        btnExcluir.id = 'btn-excluir-dinamico';
        btnExcluir.className = 'btn';
        btnExcluir.style.backgroundColor = 'var(--danger)';
        btnExcluir.style.color = 'white';
        btnExcluir.style.marginTop = '10px';
        document.querySelector('.form-card').appendChild(btnExcluir);
    }
    
    btnExcluir.style.display = 'block';
    btnExcluir.innerHTML = `🗑️ Excluir ${p.nome}`;
    btnExcluir.onclick = () => excluirProduto(p.id);

    showScreen('add');
}

function limparForm() {
    document.getElementById('p-id').value = '';
    document.getElementById('p-nome').value = '';
    document.getElementById('p-custo').value = '';
    document.getElementById('p-gramas').value = '';
    document.getElementById('p-venda').value = '';
    document.getElementById('p-obs').value = '';
    document.getElementById('titulo-form').innerText = "➕ Novo Produto";
    document.getElementById('btn-cancelar').style.display = 'none';

    const btnExcluir = document.getElementById('btn-excluir-dinamico');
    if (btnExcluir) btnExcluir.style.display = 'none';
}

function cancelarEdicao() {
    limparForm();
    showScreen('estoque');
}

function abrirPainelInventario() {
    const sel = document.getElementById('inv-produto-select');
    sel.innerHTML = produtos.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    showScreen('inventario');
}

function salvarInventario() {
    const id = parseInt(document.getElementById('inv-produto-select').value);
    const novaQtd = parseInt(document.getElementById('inv-nova-qtd').value);
    if(isNaN(novaQtd)) return notify("Ops", "Informe um valor numérico para o estoque", "info");
    const i = produtos.findIndex(p => p.id === id);
    produtos[i].estoque = novaQtd;
    localStorage.setItem('sp_prods', JSON.stringify(produtos));
    showScreen('estoque');
    notify("Inventário Atualizado", "Contagem de estoque corrigida.", "success");
}

// Geração de Relatório PDF
function gerarRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const dataRef = new Date().toLocaleString('pt-BR');

    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text("Relatório Geral de Estoque - SpiceManager", 14, 20);
    doc.setFontSize(10);
    doc.text(`Data de Emissão: ${dataRef}`, 14, 28);

    let totalCustoGeral = 0;
    let totalVendaGeral = 0;

    const corpoTabela = produtos.map(p => {
        const custoUnit = (p.custo / 1000) * p.gramas;
        const custoTotal = custoUnit * p.estoque;
        const vendaTotal = p.venda * p.estoque;
        totalCustoGeral += custoTotal;
        totalVendaGeral += vendaTotal;

        return [
            p.nome,
            p.estoque,
            `R$ ${custoUnit.toFixed(2)}`,
            `R$ ${custoTotal.toFixed(2)}`,
            `R$ ${p.venda.toFixed(2)}`,
            `R$ ${vendaTotal.toFixed(2)}`
        ];
    });

    doc.autoTable({
        startY: 35,
        head: [['Produto', 'Qtd', 'Custo Un.', 'Total Custo', 'Venda Un.', 'Total Venda']],
        body: corpoTabela,
        theme: 'striped',
        styles: { fontSize: 8, halign: 'center' },
        headStyles: { fillColor: [230, 126, 34] }
    });

    let finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    doc.text(`Total Investido (Custo): R$ ${totalCustoGeral.toFixed(2)}`, 14, finalY);
    doc.text(`Expectativa de Receita (Venda): R$ ${totalVendaGeral.toFixed(2)}`, 14, finalY + 7);
    doc.setTextColor(39, 174, 96);
    doc.text(`Lucro Estimado: R$ ${(totalVendaGeral - totalCustoGeral).toFixed(2)}`, 14, finalY + 14);

    doc.save(`relatorio_${new Date().getTime()}.pdf`);
}

// Sistema de Vendas e Carrinho
function abrirNovaVenda() {
    carrinho = [];
    document.getElementById('v-cliente-nome').value = '';
    const sel = document.getElementById('v-produto-select');
    sel.innerHTML = produtos.map(p => `<option value="${p.id}">${p.nome} (Disponível: ${p.estoque})</option>`).join('');
    atualizarCarrinhoUI();
    showScreen('nova-venda');
}

function adicionarAoCarrinho() {
    const id = parseInt(document.getElementById('v-produto-select').value);
    const qtd = parseInt(document.getElementById('v-qtd').value);
    const p = produtos.find(p => p.id === id);

    if(!p || qtd <= 0) return;
    if(qtd > p.estoque) return notify("Estoque insuficiente", `Você só tem ${p.estoque} unidades no estoque.`, "error");
    
    const itemExistente = carrinho.find(c => c.id === id);
    if(itemExistente) {
        if((itemExistente.qtd + qtd) > p.estoque) return notify("Erro", "Soma excede o estoque disponível.", "error");
        itemExistente.qtd += qtd;
    } else {
        carrinho.push({ id: p.id, nome: p.nome, qtd, preco: p.venda });
    }
    
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const cont = document.getElementById('carrinho-itens');
    cont.innerHTML = '';
    let total = 0;
    carrinho.forEach((c, index) => {
        const sub = c.qtd * c.preco;
        total += sub;
        cont.innerHTML += `
            <div class="item-row">
                <span>${c.qtd}x ${c.nome}</span>
                <span>R$ ${sub.toFixed(2)} <button onclick="removerDoCarrinho(${index})" style="color:var(--danger); background:none; border:none; margin-left:10px; cursor:pointer">✕</button></span>
            </div>`;
    });
    document.getElementById('v-total-carrinho').innerText = `R$ ${total.toFixed(2)}`;
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinhoUI();
}

function finalizarVenda() {
    if(carrinho.length === 0) return notify("Carrinho Vazio", "Adicione produtos antes de finalizar.", "warning");
    
    const total = carrinho.reduce((a,b) => a + (b.qtd * b.preco), 0);
    const venda = {
        id: Date.now(),
        dataISO: new Date().toISOString(),
        cliente: document.getElementById('v-cliente-nome').value || "Cliente Geral",
        itens: [...carrinho],
        total: total
    };

    carrinho.forEach(c => {
        const i = produtos.findIndex(p => p.id === c.id);
        if(i !== -1) produtos[i].estoque -= c.qtd;
    });

    vendas.push(venda);
    localStorage.setItem('sp_prods', JSON.stringify(produtos));
    localStorage.setItem('sp_vendas', JSON.stringify(vendas));
    
    notify("Venda Finalizada", `Total de R$ ${total.toFixed(2)} registrado!`, "success");
    showScreen('vendas');
}

function listarVendas() {
    const cont = document.getElementById('lista-vendas-realizadas');
    const busca = document.getElementById('busca-venda').value.toLowerCase();
    cont.innerHTML = '';

    const filtradas = vendas.slice().reverse().filter(v => 
        v.cliente.toLowerCase().includes(busca) || v.dataISO.includes(busca)
    );

    if(filtradas.length === 0) {
        cont.innerHTML = '<p style="text-align:center; padding:20px;">Nenhuma venda encontrada.</p>';
        return;
    }

    filtradas.forEach(v => {
        const dataF = new Date(v.dataISO).toLocaleString('pt-BR');
        cont.innerHTML += `
            <div class="item-row">
                <div>
                    <div class="info-main">${v.cliente}</div>
                    <div class="info-sub">${dataF} | <b>Total: R$ ${v.total.toFixed(2)}</b></div>
                </div>
                <button class="btn-estorno" onclick="estornarVenda(${v.id})">Estornar</button>
            </div>`;
    });
}

function estornarVenda(id) {
    Swal.fire({
        title: 'Estornar Venda?',
        text: "O valor será removido e os produtos voltarão ao estoque.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e67e22',
        confirmButtonText: 'Sim, estornar!',
        cancelButtonText: 'Manter'
    }).then((result) => {
        if (result.isConfirmed) {
            const idx = vendas.findIndex(v => v.id === id);
            if(idx !== -1) {
                vendas[idx].itens.forEach(i => {
                    const pIdx = produtos.findIndex(p => p.id === i.id);
                    if(pIdx !== -1) produtos[pIdx].estoque += i.qtd;
                });
                vendas.splice(idx, 1);
                localStorage.setItem('sp_prods', JSON.stringify(produtos));
                localStorage.setItem('sp_vendas', JSON.stringify(vendas));
                listarVendas();
                notify("Estorno Concluído", "Venda removida e estoque devolvido.", "success");
            }
        }
    });
}

// DASHBOARD AVANÇADO ATUALIZADO
function atualizarDash() {
    const periodo = parseInt(document.getElementById('dash-periodo').value);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - periodo);

    const vendasPeriodo = vendas.filter(v => new Date(v.dataISO) >= dataLimite);
    
    const totalVendasPeriodo = vendasPeriodo.reduce((a,b) => a + b.total, 0);
    document.getElementById('dash-vendas-total').innerText = `R$ ${totalVendasPeriodo.toFixed(2)}`;
    document.getElementById('dash-itens-total').innerText = produtos.length;

    // --- NOVOS CÁLCULOS FINANCEIROS (ESTOQUE ATUAL) ---
    let totalCustoEstoque = 0;
    let totalVendaEstoque = 0;

    produtos.forEach(p => {
        const custoUnitario = (p.custo / 1000) * p.gramas; 
        totalCustoEstoque += custoUnitario * (p.estoque || 0);
        totalVendaEstoque += p.venda * (p.estoque || 0);
    });

    const lucroPrevisto = totalVendaEstoque - totalCustoEstoque;

    // ATUALIZAÇÃO DA UI FINANCEIRA
    document.getElementById('dash-custo-estoque').innerText = `R$ ${totalCustoEstoque.toFixed(2)}`;
    document.getElementById('dash-venda-estoque').innerText = `R$ ${totalVendaEstoque.toFixed(2)}`;
    document.getElementById('dash-lucro-previsto').innerText = `R$ ${lucroPrevisto.toFixed(2)}`;
    // --------------------------------------------------

    const rankingProdutos = {};
    vendasPeriodo.forEach(v => {
        v.itens.forEach(item => {
            rankingProdutos[item.nome] = (rankingProdutos[item.nome] || 0) + item.qtd;
        });
    });
    const topProd = Object.entries(rankingProdutos).sort((a,b) => b[1] - a[1])[0];
    document.getElementById('dash-prod-top').innerText = topProd ? `${topProd[0]} (${topProd[1]} un)` : "Sem dados";

    const rankingClientes = {};
    vendas.forEach(v => {
        rankingClientes[v.cliente] = (rankingClientes[v.cliente] || 0) + v.total;
    });
    const topCliente = Object.entries(rankingClientes).sort((a,b) => b[1] - a[1])[0];
    document.getElementById('dash-cliente-top').innerText = topCliente ? `${topCliente[0]} (R$ ${topCliente[1].toFixed(2)})` : "Nenhum cliente";

    const abaixoDeUm = produtos.filter(p => p.estoque < 1).length;
    document.getElementById('dash-estoque-critico').innerText = `${abaixoDeUm} esgotados`;

    const movimentacao = produtos.map(p => {
        const vendasProd = vendasPeriodo.reduce((acc, v) => {
            const item = v.itens.find(i => i.id === p.id);
            return acc + (item ? item.qtd : 0);
        }, 0);
        return { nome: p.nome, qtd: vendasProd };
    });
    const top5Menos = movimentacao.sort((a,b) => a.qtd - b.qtd).slice(0, 5);
    document.getElementById('dash-menos-movimentados').innerHTML = top5Menos.map(m => `• ${m.nome} (${m.qtd} un)`).join('<br>');

    const ctx = document.getElementById('meuGrafico').getContext('2d');
    if(chart) chart.destroy();
    
    const labelsDias = [];
    const valoresDias = [];
    
    for(let i = periodo; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const diaFormatado = d.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'});
        labelsDias.push(diaFormatado);
        
        const totalDoDia = vendasPeriodo
            .filter(v => new Date(v.dataISO).toLocaleDateString() === d.toLocaleDateString())
            .reduce((a,b) => a + b.total, 0);
        valoresDias.push(totalDoDia);
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsDias,
            datasets: [{
                label: 'Vendas (R$)',
                data: valoresDias,
                borderColor: '#e67e22',
                backgroundColor: 'rgba(230, 126, 34, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
    });
}

// Sistema de Backup
function exportarBackup() {
    const dadosBackup = {
        produtos, vendas, configs, listaCompras,
        dataExportacao: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dadosBackup, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `spice_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

function importarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const d = JSON.parse(e.target.result);
            Swal.fire({
                title: 'Importar Backup?',
                text: "Isso substituirá todos os seus dados atuais!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, substituir'
            }).then((result) => {
                if (result.isConfirmed) {
                    produtos = d.produtos || []; 
                    vendas = d.vendas || []; 
                    configs = d.configs || { valorFixo: 0 };
                    listaCompras = d.listaCompras || [];
                    localStorage.setItem('sp_prods', JSON.stringify(produtos));
                    localStorage.setItem('sp_vendas', JSON.stringify(vendas));
                    localStorage.setItem('sp_cfgs', JSON.stringify(configs));
                    localStorage.setItem('sp_lista', JSON.stringify(listaCompras));
                    location.reload();
                }
            });
        } catch (err) { 
            notify("Erro de Importação", "Arquivo JSON inválido.", "error"); 
        }
    };
    reader.readAsText(file);
}

// Inicialização
window.onload = () => {
    if(!localStorage.getItem('sp_prods')) {
        localStorage.setItem('sp_prods', JSON.stringify(backupInicial));
    }
    atualizarDash();
};