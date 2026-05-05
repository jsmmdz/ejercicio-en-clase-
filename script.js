// Constantes//
const salarioMinimo = 1750905;
const salarioMinimoIntegral = 22761765;
const auxilioTransporte = 249095;
const porcentajePension = 0.04;
const porcentajeSalud = 0.04;
const porcentajeFondoSolidaridad = 0.01;
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

    if (edadUsuario < 18) 

        {alert("eres menor de edad no es posible continuar"); 
        return; } 

    else if (edadUsuario >= 18 && edadUsuario < 25) 

        {alert("usuario beneficiario por cotizante");} 

    else if (edadUsuario >= 60) 

        {alert("solo se calculara el pago de la pension");} 
        
    else 
        {salarioCalculo(); }
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
    
    //Se asegura de convertir el nivel de riesgo a entero y restar 1 para coincidir con el índice del array
    let indiceRiesgo = parseInt(nivelRiesgo) - 1;
    let calculoArl = indiceRiesgo >= 0 ? ibc * riesgos[indiceRiesgo] : 0;


    return {
        ibc,
        calculoAuxilioTransporte,
        calculoSalud,
        calculoFondoSolidaridad,
        calculoPension,
        calculoArl
    };
}