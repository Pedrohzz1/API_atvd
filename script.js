const API_URL = 'https://api-mural.onrender.com/recados'; 
const listaEl = document.getElementById('mural-lista');
const mensagemErro = document.getElementById('mensagem-erro');

let recados = []; 

function formataData(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', {
      day:'2-digit', month:'2-digit', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    });
  } catch(e){
    return iso;
  }
}

function escapeHtml(str){
  return String(str || '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

function criaCard(recado, idx){
  const li = document.createElement('li');
  li.className = 'card';
  
  if(idx % 2 === 0) li.classList.add('alt');
  const r = idx % 4;
  if(r === 1) li.classList.add('rot1');
  if(r === 2) li.classList.add('rot2');
  if(r === 3) li.classList.add('rot3');

  li.innerHTML = `
    <div class="autor">${escapeHtml(recado.autor || 'Desconhecido')}</div>
    <div class="data">${formataData(recado.data_criacao || '')}</div>
    <div class="mensagem">${escapeHtml(recado.mensagem || '')}</div>
  `;
  return li;
}

function render(){
  listaEl.innerHTML = '';
  if(!recados || recados.length === 0){
    listaEl.innerHTML = '<p>Nenhum recado encontrado.</p>';
    return;
  }
  const frag = document.createDocumentFragment();
  recados.forEach((r,i) => frag.appendChild(criaCard(r,i)));
  listaEl.appendChild(frag);
}

function ordenarPorAutor(){
  recados.sort((a,b) => {
    const A = (a.autor || '').toLowerCase();
    const B = (b.autor || '').toLowerCase();
    if(A < B) return -1;
    if(A > B) return 1;
    return 0;
  });
  render();
}

function embaralhar(){
  for(let i = recados.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [recados[i], recados[j]] = [recados[j], recados[i]];
  }
  render();
}

async function carregarRecados(){
  mensagemErro.hidden = true;
  try{
    if(!API_URL || API_URL.includes('https://api-mural.onrender.com/recados')){
    }
    const resp = await fetch(API_URL, { method: 'GET' });
    if(!resp.ok) throw new Error(`Erro na requisição: ${resp.status}`);
    const data = await resp.json();
    if(!Array.isArray(data)) throw new Error('Resposta inesperada (esperado array).');
    recados = data;
    render();
  } catch (err){
    mensagemErro.hidden = false;
    render();
  }
}

carregarRecados();
