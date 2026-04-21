// 1. Constantes//
const salarioMinimo = 1750905;
const salarioMinimoIntegral = 22761765;
const auxilioTransporte = 249095;
const porcentajePension = 0.04;
const porcentajeSalud = 0.04;
const porcentajeFondoSolidaridad = 0.01;

//CONEXIÓN CON EL HTML//

const formDatosGenerales = document.getElementById("datosGenerales");

// 3. VARIABLES PARA LOS DATOS DEL USUARIO

let nombre = "";
let edad = 0;
let tipoDocumento = "";
let numeroDocumento = "";
let salario = 0;
let comisiones = 0;
let totalHorasExtras = 0;
let nivelRiesgo = "1";