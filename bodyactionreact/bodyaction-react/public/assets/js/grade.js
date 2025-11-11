// ====== DADOS DA GRADE (edite os horários livremente) ======
const GRADE = {
  "07:00": {
    "Segunda": [{ nome:"Funcional", acesso:"livre" }],
    "Terça":   [{ nome:"Spinning",  acesso:"livre" }],
    "Quarta":  [{ nome:"Yoga",      acesso:"avulso" }],
    "Quinta":  [{ nome:"Pilates",   acesso:"avulso" }],
    "Sexta":   [{ nome:"Funcional", acesso:"livre" }],
    "Sábado":  [{ nome:"Muay Thai", acesso:"avulso" }],
  },
  "08:00": {
    "Segunda": [{ nome:"Zumba",     acesso:"livre" }],
    "Terça":   [{ nome:"Pilates",   acesso:"avulso" }],
    "Quarta":  [{ nome:"Spinning",  acesso:"livre" }],
    "Quinta":  [{ nome:"Yoga",      acesso:"avulso" }],
    "Sexta":   [{ nome:"Zumba",     acesso:"livre" }],
    "Sábado":  [{ nome:"Box",       acesso:"avulso" }],
  },
  "09:00": {
    "Segunda": [{ nome:"Pilates",   acesso:"avulso" }],
    "Terça":   [{ nome:"Funcional", acesso:"livre" }],
    "Quarta":  [{ nome:"Zumba",     acesso:"livre" }],
    "Quinta":  [{ nome:"Jiu-jitsu", acesso:"avulso" }],
    "Sexta":   [{ nome:"Spinning",  acesso:"livre" }],
    "Sábado":  [{ nome:"Natação",   acesso:"avulso" }],
  },
  "18:00": {
    "Segunda": [{ nome:"Muay Thai", acesso:"avulso" }],
    "Terça":   [{ nome:"Box",       acesso:"avulso" }],
    "Quarta":  [{ nome:"Funcional", acesso:"livre" }],
    "Quinta":  [{ nome:"Zumba",     acesso:"livre" }],
    "Sexta":   [{ nome:"Jiu-jitsu", acesso:"avulso" }],
    "Sábado":  []
  },
  "19:00": {
    "Segunda": [{ nome:"Jiu-jitsu", acesso:"avulso" }],
    "Terça":   [{ nome:"Yoga",      acesso:"avulso" }],
    "Quarta":  [{ nome:"Box",       acesso:"avulso" }],
    "Quinta":  [{ nome:"Spinning",  acesso:"livre" }],
    "Sexta":   [{ nome:"Muay Thai", acesso:"avulso" }],
    "Sábado":  []
  }
};

// ====== RENDER ======
const dias = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const container = document.getElementById("gradeContainer");
const filtroDia = document.getElementById("filtroDia");
const filtroModalidade = document.getElementById("filtroModalidade");

function cria(el, cls, html){ const e=document.createElement(el); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }

function renderSemana(modalidade){
  container.innerHTML = "";
  const grid = cria("div","week");
  // coluna horários
  grid.appendChild(cria("div","cell--head","Horários"));
  dias.forEach(d=>grid.appendChild(cria("div","cell--head",d)));

  const horas = Object.keys(GRADE);
  horas.forEach(h=>{
    // coluna da hora
    const timeCol = cria("div","time-col");
    timeCol.appendChild(cria("div","time",h));
    grid.appendChild(timeCol);

    // para cada dia, um slot
    dias.forEach(dia=>{
      const slotCol = cria("div","slot-col");
      const aulas = (GRADE[h][dia]||[]).filter(a => modalidade==="todas" || a.nome===modalidade);
      if(aulas.length===0){
        slotCol.appendChild(cria("div","slot","—"));
      }else{
        aulas.forEach(a=>{
          const slot = cria("div","slot");
          slot.innerHTML = `<span class="name">${a.nome}</span>
            <span class="badge ${a.acesso==='livre'?'badge--livre':'badge--avulso'}">${a.acesso==='livre'?'Ilimitado':'Avulso/Restrito'}</span>`;
          slotCol.appendChild(slot);
        });
      }
      grid.appendChild(slotCol);
    });
  });

  container.appendChild(grid);
}

function renderDia(dia, modalidade){
  container.innerHTML = "";
  const list = cria("div","day-list");
  Object.keys(GRADE).forEach(h=>{
    const aulas = (GRADE[h][dia]||[]).filter(a => modalidade==="todas" || a.nome===modalidade);
    if(aulas.length){
      aulas.forEach(a=>{
        const row = cria("div","day-row");
        row.appendChild(cria("div","time",h));
        const slot = cria("div","slot");
        slot.innerHTML = `<span class="name">${a.nome}</span>
          <span class="badge ${a.acesso==='livre'?'badge--livre':'badge--avulso'}">${a.acesso==='livre'?'Ilimitado':'Avulso/Restrito'}</span>`;
        row.appendChild(slot);
        list.appendChild(row);
      });
    }
  });
  if(!list.childElementCount) list.innerHTML = `<p>Sem aulas para este filtro.</p>`;
  container.appendChild(list);
}

function render(){
  const dia = filtroDia.value;
  const mod = filtroModalidade.value;
  if(dia==="semana" || window.matchMedia("(max-width:700px)").matches){
    renderSemana(mod);
  }else{
    renderDia(dia, mod);
  }
}

filtroDia.addEventListener("change", render);
filtroModalidade.addEventListener("change", render);
window.addEventListener("resize", ()=>{ if(filtroDia.value==="semana") render(); });

render();
