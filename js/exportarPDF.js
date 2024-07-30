const btnExportar = document.getElementById("exportar")
const btnVolver = document.getElementById("volver")
btnExportar.addEventListener("click",()=>{
    btnExportar.style.display = "none";
    btnVolver.style.display = "none";
    exportar();
    
    setTimeout(()=>{
        btnExportar.style.display = "block";
        btnVolver.style.display = "block";
    },1000)
    
    
});


btnVolver.addEventListener("click",()=>{
    
    window.location.href = "../pages/menu.html";
    
});

function exportar(){
    const elemento = document.getElementById("elementoExportar");
        html2pdf()
            .from(elemento)
            .set({
                margin: 1,
                filename: `Cotizacion_${localStorage.getItem("IdCotizacion")}.pdf`,
                html2canvas: { scale: 1.5 },
                jsPDF: {
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                    compressPDF: true
                },
                avoidPageSplit: true
            })
            .save();
}
