const properties=[
{id:1,title:'Apartamento aconchegante',type:'Apartamento',area:'Centro',price:1450,rooms:2,baths:1,size:68,tag:'Destaque',image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85',description:'Apartamento bem iluminado, com ambientes funcionais e acesso fácil a comércios e serviços.'},
{id:2,title:'Casa com quintal',type:'Casa',area:'Jardim',price:2200,rooms:3,baths:2,size:120,tag:'Ótima opção',image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85',description:'Casa espaçosa com quintal, ideal para quem busca mais espaço e tranquilidade.'},
{id:3,title:'Kitnet moderna',type:'Kitnet',area:'Centro',price:1100,rooms:1,baths:1,size:38,tag:'Compacto',image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85',description:'Kitnet compacta e moderna, uma opção prática para morar perto da região central.'},
{id:4,title:'Apartamento familiar',type:'Apartamento',area:'Planalto',price:1850,rooms:3,baths:2,size:92,tag:'Novo',image:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=85',description:'Apartamento confortável com três quartos e espaço para toda a família.'},
{id:5,title:'Casa perto de tudo',type:'Casa',area:'Centro',price:2700,rooms:3,baths:2,size:135,tag:'Espaçosa',image:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=85',description:'Casa com boa distribuição dos cômodos e localização conveniente para o dia a dia.'},
{id:6,title:'Apartamento com varanda',type:'Apartamento',area:'Jardim',price:1650,rooms:2,baths:2,size:75,tag:'Varanda',image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85',description:'Apartamento com varanda e ambientes agradáveis para relaxar depois de um dia cheio.'}
];
const $=s=>document.querySelector(s),favorites=new Set();let onlyFavorites=false,selectedArea='',limit=6,timer;
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
function getList(){const q=$('#searchInput').value.trim().toLocaleLowerCase('pt-BR'),type=$('#typeFilter').value,max=Number($('#priceFilter').value||Infinity);let list=properties.filter(p=>`${p.title} ${p.area} ${p.type} Patos de Minas`.toLocaleLowerCase('pt-BR').includes(q)&&(!type||p.type===type)&&p.price<=max&&(!selectedArea||p.area===selectedArea)&&(!onlyFavorites||favorites.has(p.id)));const sort=$('#sortFilter').value;if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);return list;}
function render(){const list=getList();$('#resultCount').textContent=list.length;$('#favoriteCount').textContent=favorites.size;$('#favoritesToggle').innerHTML=`${onlyFavorites?'♥':'♡'} Favoritos <span id="favoriteCount">${favorites.size}</span>`;$('#propertyGrid').innerHTML=list.slice(0,limit).map(p=>`<article class="card"><div class="photo"><img src="${p.image}" alt="Foto ilustrativa: ${p.title}" loading="lazy"><span class="tag">${p.tag}</span><button class="fav ${favorites.has(p.id)?'on':''}" data-fav="${p.id}" aria-label="Alternar favorito">${favorites.has(p.id)?'♥':'♡'}</button></div><div class="cardbody"><div class="location">⌖ ${p.area}, Patos de Minas</div><h3>${p.title}</h3><div class="features"><span>▦ ${p.rooms} quarto(s)</span><span>◈ ${p.baths} banheiro(s)</span><span>↔ ${p.size} m²</span></div><div class="bottom"><div class="price">${money(p.price)} <small>/ mês</small></div><button class="details" data-details="${p.id}">Ver detalhes</button></div></div></article>`).join('')||'<div class="empty"><h3>Nenhum imóvel encontrado</h3><p>Tente mudar os filtros ou limpar a busca.</p><button class="outline" id="resetFilters">Limpar filtros</button></div>';document.querySelectorAll('.pin').forEach(b=>b.classList.toggle('selected',b.dataset.area===selectedArea));}
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('show'),2500)}
function details(id){const p=properties.find(x=>x.id===Number(id));if(!p)return;$('#dialogContent').innerHTML=`<img class="dialogphoto" src="${p.image}" alt="Foto ilustrativa: ${p.title}"><div class="dialogbody"><div class="eyebrow">${p.type.toUpperCase()} · ${p.area.toUpperCase()}</div><h2>${p.title}</h2><p>⌖ ${p.area}, Patos de Minas</p><div class="features">${p.rooms} quarto(s) · ${p.baths} banheiro(s) · ${p.size} m²</div><div class="dialogprice">${money(p.price)} <small>/ mês</small></div><p>${p.description}</p><button class="primary" id="interestBtn" data-id="${p.id}">Tenho interesse</button></div>`;$('#propertyDialog').showModal();$('#interestBtn').addEventListener('click',()=>{
    const p=properties.find(x=>x.id===Number($('#interestBtn').dataset.id));
    if(!p)return;

    $('#dialogContent').innerHTML=`
        <div class="dialogbody">
            <h2>Tenho interesse</h2>
            <p>Imóvel: ${p.title}</p>

            <form id="interestForm">
                <label for="interestName">Seu nome:</label>
                <input id="interestName" type="text" required placeholder="Digite seu nome">

                <label for="interestPhone">Seu telefone:</label>
                <input id="interestPhone" type="tel" required placeholder="Digite seu telefone">

                <button class="primary" type="submit">Enviar interesse</button>
            </form>
        </div>
    `;

    $('#interestForm').addEventListener('submit',e=>{
        e.preventDefault();
        toast('Formulário demonstrativo: o contato ainda não foi enviado.');
        $('#propertyDialog').close();
    });
});}
$('#searchForm').addEventListener('submit',e=>{
e.preventDefault();
limit=6;
render();
const total=getList().length;
toast('Busca concluída: '+total+' imóvel(is) encontrado(s).');
$('#propertyGrid').scrollIntoView({behavior:'smooth',block:'start'});
});
['typeFilter','priceFilter','sortFilter'].forEach(id=>$('#'+id).addEventListener('change',()=>{limit=6;render()}));$('#searchInput').addEventListener('input',()=>{limit=6;render()});$('#propertyGrid').addEventListener('click',e=>{const f=e.target.closest('[data-fav]'),d=e.target.closest('[data-details]');if(f){const id=Number(f.dataset.fav);favorites.has(id)?favorites.delete(id):favorites.add(id);render()}if(d)details(d.dataset.details);if(e.target.closest('#resetFilters')){$('#searchInput').value='';$('#typeFilter').value='';$('#priceFilter').value='';selectedArea='';onlyFavorites=false;render()}});$('#favoritesToggle').addEventListener('click',()=>{onlyFavorites=!onlyFavorites;render();toast(onlyFavorites?'Exibindo favoritos.':'Exibindo todos os imóveis.')});document.querySelectorAll('.pin').forEach(b=>b.addEventListener('click',()=>{selectedArea=selectedArea===b.dataset.area?'':b.dataset.area;onlyFavorites=false;render();toast(selectedArea?'Região selecionada: '+selectedArea:'Filtro de região removido.')}));$('#clearAreaBtn').addEventListener('click',()=>{selectedArea='';render();toast('Filtro de região removido.')});$('#showAllBtn').addEventListener('click',()=>{limit=properties.length;render();toast('Todos os imóveis estão sendo exibidos.')});$('#closeDialog').addEventListener('click',()=>$('#propertyDialog').close());$('#propertyDialog').addEventListener('click',e=>{if(e.target===$('#propertyDialog'))$('#propertyDialog').close()});render();
$('#dicasLink').addEventListener('click',e=>{
    e.preventDefault();
    $('#dicas').scrollIntoView({
        behavior:'smooth',
        block:'center'
    });
});
