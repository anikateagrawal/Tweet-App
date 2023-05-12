const article=document.getElementsByClassName('arti');

const colors=['#F7C8E0','#DFFFD8','#B4E4FF','#95BDFF','#ECF2FF','#E3DFFD','#E5D1FA','#FFF4D2','#B9F3E4','#CDE990','#A5F1E9','#C3FF99'];

for(let a of article){
    var color=colors[Math.floor(Math.random()*colors.length)];
    a.style.backgroundColor=color;
}



