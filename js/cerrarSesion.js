document.getElementById("logout").addEventListener("click",()=>{
    window.location.href = '../index.html';
    localStorage.removeItem("usuario");
})