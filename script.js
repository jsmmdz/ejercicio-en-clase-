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
    let ibc = (salario + comisiones + totalHorasExtras) * 0.7;
    let calculoAuxilioTransporte = salario <= (2 * salarioMinimo) ? auxilioTransporte : 0;
    let calculoSalud = ibc * porcentajeSalud;
    let calculoFondoSolidaridad = ibc * porcentajeFondoSolidaridad;
    let calculoPension = ibc >= (4 * salarioMinimo) 
        ? (ibc * porcentajePension) + calculoFondoSolidaridad 
        : ibc * porcentajePension;
    let calculoArl = Tarifas_ARL[nivelRiesgo] ? ibc * Tarifas_ARL[nivelRiesgo] : 0;

    return {
        ibc,
        calculoAuxilioTransporte,
        calculoSalud,
        calculoFondoSolidaridad,
        calculoPension,
        calculoArl
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
        <p><strong>Colaborador:</strong> ${nombre}</p>
        <p><strong>Documento:</strong> ${tipoDocumento} ${numeroDocumento}</p>
        <p><strong>Ingreso Base de Cotización (IBC):</strong> ${formatoMoneda.format(resultadosCalculo.ibc)}</p>
        <p><strong>Auxilio de Transporte:</strong> ${formatoMoneda.format(resultadosCalculo.calculoAuxilioTransporte)}</p>
        <p><strong>Deducción Salud:</strong> ${formatoMoneda.format(resultadosCalculo.calculoSalud)}</p>
        <p><strong>Deducción Pensión:</strong> ${formatoMoneda.format(resultadosCalculo.calculoPension)}</p>
        <p><strong>Fondo de Solidaridad:</strong> ${formatoMoneda.format(resultadosCalculo.calculoFondoSolidaridad)}</p>
        <p><strong>Cotización ARL (Pagado por empleador):</strong> ${formatoMoneda.format(resultadosCalculo.calculoArl)}</p>
    `;

    divResultados.classList.add("mostrar-resultados");
}