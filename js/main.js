/* theme boot */
let th;try{th=localStorage.getItem(KEY+"-theme")}catch(e){}
document.documentElement.dataset.theme=th||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");
render();
