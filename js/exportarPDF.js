const btnExportar = document.getElementById("exportar")
const btnVolver = document.getElementById("volver")
const btnExcel = document.getElementById("excel")
btnExportar.addEventListener("click",()=>{
    btnExportar.style.display = "none";
    btnVolver.style.display = "none";
    btnExcel.style.display = "none";
    exportar();
    
    setTimeout(()=>{
        btnExportar.style.display = "block";
        btnVolver.style.display = "block";
        btnExcel.style.display = "block";
    },1000)
    
    
});

btnExcel.addEventListener("click",()=>{
    // Obtener la tabla HTML
    var tabla = document.getElementById("Detalle_Cotizacion");
    
    // Convertir la tabla a un archivo de hoja de cálculo
    var wb = XLSX.utils.table_to_book(tabla, {sheet: "Hoja1"});
    
    // Obtener la primera hoja del libro de trabajo
    var ws = wb.Sheets["Hoja1"];

    // Exportar el archivo Excel
    XLSX.writeFile(wb, `Cotizacion_${localStorage.getItem("IdCotizacion")}.xlsx`);
    
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
