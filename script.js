//Nombre: [Junior Smith Mejia Mendez] - Documento: [1014477792]//


// Constantes//
const salarioMinimo = 1750905;
const salarioMinimoIntegral = 22761765;
const auxilioTransporte = 249095;
const porcentajePension = 0.04;
const porcentajeSalud = 0.04;
const porcentajeFondoSolidaridad = 0.01;
const UVT = 52370;
const Tarifas_ARL = { 
    1: 0.00522, // Riesgo I (Mínimo)
    2: 0.01044, // Riesgo II (Bajo)
    3: 0.02436, // Riesgo III (Medio)
    4: 0.04350, // Riesgo IV (Alto)
    5: 0.06960  // Riesgo V (Máximo)
};

//CONEXIÓN CON EL DOM//

 // Formulario principal
const formDatosGenerales = document.getElementById("datosGenerales");
const divResultados = document.getElementById("resultados"); // NUEVO

 // Inputs de Información Básica
const inputNombre = document.getElementById("nombreCompleto");
const inputEdad = document.getElementById("edad");
const selectTipoDoc = document.getElementById("tipoDocumento");
const inputNumeroDoc = document.getElementById("numeroDocumento");

 // Inputs de Información Salarial
const inputSalario = document.getElementById("salario");
const inputComisiones = document.getElementById("comisiones");
const inputHorasExtras = document.getElementById("horasExtras");
const selectNivelRiesgo = document.getElementById("nivelRiesgo");

// VARIABLES PARA LOS DATOS DEL USUARIO//

let nombre = "";
let edad = 0;
let tipoDocumento = "";
let numeroDocumento = "";
let salario = 0;
let comisiones = 0;
let totalHorasExtras = 0;
let nivelRiesgo = "1";

//VALIDACION DE DATOS//
function validar(edadUsuario) {
    if (edadUsuario < 18) {
        alert("eres menor de edad no es posible continuar"); 
        return false; 
    } 
    else if (edadUsuario >= 18 && edadUsuario < 25) 
        {alert("usuario beneficiario por cotizante");
        return false;
    } 
    else if (edadUsuario >= 60) 
        {alert("solo se calculara el pago de la pension");
        return true; 
    } 
    
    return true; 
}

// FUNCIONES UTILITARIAS//
function calcularPorcentaje(base, porcentaje) {
    let resultado = base * porcentaje;
    return resultado;
}


// LÓGICA DE NEGOCIO Y CÁLCULOS//

function calcularNomina() {
    let ingresosFormula = salario + comisiones + totalHorasExtras;
    let ibc = ingresosFormula * 0.7;
    let calculoAuxilioTransporte = salario <= (2 * salarioMinimo) ? auxilioTransporte : 0;
    
    let calculoSalud = 0, calculoPension = 0, calculoFondoSolidaridad = 0, calculoArl = 0, retefuente = 0;

    if (edad >= 60) {
        calculoPension = ibc * porcentajePension;
    } 
    else if (salario >= (2 * salarioMinimo)) {
        calculoSalud = ibc * porcentajeSalud;
        calculoFondoSolidaridad = (ibc >= (4 * salarioMinimo)) ? ibc * porcentajeFondoSolidaridad : 0;
        calculoPension = (ibc * porcentajePension) + calculoFondoSolidaridad;
        calculoArl = Tarifas_ARL[nivelRiesgo] ? ibc * Tarifas_ARL[nivelRiesgo] : 0;

        let ingresoUVT = (ingresosFormula - calculoSalud - calculoPension) / UVT;
        if (ingresoUVT > 95 && ingresoUVT <= 150) retefuente = (ingresoUVT - 95) * 0.19 * UVT;
        else if (ingresoUVT > 150 && ingresoUVT <= 360) retefuente = ((ingresoUVT - 150) * 0.28 + 10) * UVT;
        else if (ingresoUVT > 360 && ingresoUVT <= 640) retefuente = ((ingresoUVT - 360) * 0.33 + 69) * UVT;
        else if (ingresoUVT > 640 && ingresoUVT <= 945) retefuente = ((ingresoUVT - 640) * 0.35 + 162) * UVT;
        else if (ingresoUVT > 945 && ingresoUVT <= 2300) retefuente = ((ingresoUVT - 945) * 0.37 + 268) * UVT;
        else if (ingresoUVT > 2300) retefuente = ((ingresoUVT - 2300) * 0.39 + 770) * UVT;
    }

    let totalIngresos = ingresosFormula + calculoAuxilioTransporte;
    let totalDeducciones = calculoSalud + calculoPension + calculoFondoSolidaridad + calculoArl + retefuente;

    return {
        salarioBase: salario, ibc, totalIngresos, calculoSalud, calculoPension,
        calculoFondoSolidaridad, calculoArl, retefuente, totalDeducciones,
        totalPagar: totalIngresos - totalDeducciones
    };
}


// LÓGICA DE RESULTADOS // 

formDatosGenerales.addEventListener("submit", function(evento) {
    evento.preventDefault(); 

    nombre = inputNombre.value;
    edad = parseInt(inputEdad.value);
    tipoDocumento = selectTipoDoc.value;
    numeroDocumento = inputNumeroDoc.value;
    
    salario = parseFloat(inputSalario.value) || 0;
    comisiones = parseFloat(inputComisiones.value) || 0;
    totalHorasExtras = parseFloat(inputHorasExtras.value) || 0;
    nivelRiesgo = selectNivelRiesgo.value;

   if (validar(edad)) {
        salarioCalculo();
    }
});

function salarioCalculo() {
    const resultadosCalculo = calcularNomina();

    const formatoMoneda = new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP',
        maximumFractionDigits: 0 
    });

    divResultados.innerHTML = `
        <h2 class="section-title">Resultados de la Simulación</h2>
        <p><strong>Colaborador:</strong> ${nombre} - ${tipoDocumento} ${numeroDocumento}</p>
        <br>
        <p><strong>Salario:</strong> ${formatoMoneda.format(resultadosCalculo.salarioBase)}</p>
        <p><strong>Ingreso Base de Cotización (IBC):</strong> ${formatoMoneda.format(resultadosCalculo.ibc)}</p>
        <br>
        <p><strong>Fórmula (Salario + Auxilio de transporte + Comisiones + Horas extra):</strong> ${formatoMoneda.format(resultadosCalculo.totalIngresos)}</p>
        <p><strong>Deducibles (Salud + Pensión + Fondo + ARL + Retefuente):</strong> ${formatoMoneda.format(resultadosCalculo.totalDeducciones)}</p>
        
        <ul style="list-style: none; padding-left: 20px; margin-bottom: 15px; font-size: 15px;">
            <li>- Salud: ${formatoMoneda.format(resultadosCalculo.calculoSalud)}</li>
            <li>- Pensión: ${formatoMoneda.format(resultadosCalculo.calculoPension)}</li>
            <li>- Fondo de Solidaridad Pensional: ${formatoMoneda.format(resultadosCalculo.calculoFondoSolidaridad)}</li>
            <li>- ARL: ${formatoMoneda.format(resultadosCalculo.calculoArl)}</li>
            <li>- Retención en la Fuente: ${formatoMoneda.format(resultadosCalculo.retefuente)}</li>
        </ul>

        <h3 style="color: var(--color-primario); border-top: 2px solid var(--color-borde); padding-top: 15px; margin-top: 10px;">
            Total (Ingresos - Deducciones): ${formatoMoneda.format(resultadosCalculo.totalPagar)}
        </h3>
    `;

    divResultados.classList.add("mostrar-resultados");
}