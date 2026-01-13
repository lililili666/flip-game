
if(localStorage.lastPlay===new Date().toDateString()){
  alert('今天已玩过');
  throw '';
}
fetch('/api/cards').then(r=>r.json()).then(cards=>{
  const box=document.getElementById('cards');
  cards.forEach(c=>{
    const d=document.createElement('div');
    d.className='card';
    d.ondblclick=()=>{
      d.innerHTML=c.image?`<img src="${c.image}" width="100%">`:c.text;
      localStorage.lastPlay=new Date().toDateString();
    };
    box.appendChild(d);
  });
});
