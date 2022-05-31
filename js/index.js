const d = document;
const btn_calculadora = d.getElementById('btn-calcular');
const input_calculadora = d.getElementById('input_horaEstudiada');
const resultado_element = d.getElementById('resultado');


// Evento cuando presionen el btn de calcular
btn_calculadora.addEventListener('click' , async ()=>{
    let input_value = input_calculadora.value + "";
    input_value = input_value.split(':');
    let horas = input_value[0] * 60;
    let minutos = input_value[1];
    let minutosEstudiado = parseInt(horas) + parseInt(minutos);
    let nota_promedio = await calcularNotaPromedio(minutosEstudiado);
    let tipoMensaje = 'alert-danger';
    let mensaje = '<strong>ERROR: </strong> El campo esta vacio. Por favor selecciona un valor valido.';

    resultado_element.classList.remove('d-none');
    resultado_element.classList.remove('alert-danger');
    
    if (input_value != '') {
        tipoMensaje = 'alert-info';
        mensaje = '<strong>Resultado: </strong> La nota promedio estimado es: ' + nota_promedio.toPrecision(4);
    }

    resultado_element.classList.add(tipoMensaje);
    resultado_element.innerHTML = mensaje;

});

// Funcion para obtener los datos de la encuesta
async function getData() {
    let data = await axios.get('https://luisvasquez23.github.io/regresion/');
    let datos = data.data;
    return datos;
}

// Calcular la sumatoria de X
async function sumatoriaX() {
    let suma = 0;
    let datos = await getData();

    datos.forEach(dato => {
        suma += dato.x;
    });

    return suma;
}

// Calcular el promedio de X
async function promedioX(){
    let sumatoria_X = await sumatoriaX();
    return sumatoria_X/50;
}

// Calcular la sumatoria de Y
async function sumatoriaY() {
    let suma = 0;
    let datos = await getData();

    datos.forEach(dato => {
        suma += dato.y;
    });

    return suma;
}

// Calcular el promedio de Y
async function promedioY(){
    let sumatoria_Y = await sumatoriaY();
    return sumatoria_Y/50;
}

// Varianza muestral
async function varianzaMuestralX() {
    let suma = 0;
    let datos = await getData();
    let promedio = await promedioX();

    datos.forEach(dato => {
        suma += (dato.x - promedio);
    });

    return (suma^2) / 50;
}

// Covarianza muestral entre x e y 
async function covarianzaMuestral(){
    let suma = 0;
    let datos = await getData();
    let promedio_X = await promedioX();
    let promedio_Y = await promedioY();

    datos.forEach(dato => {
        let x = dato.x - promedio_X;
        let y = dato.y - promedio_Y;

        suma += x*y;
    });

    return suma/ 50;
}

async function calcularB(){
    let varianzaMuestral_X = await varianzaMuestralX();
    let covarianza_muestral = await covarianzaMuestral();

    return  varianzaMuestral_X/ covarianza_muestral;
}

async function calcularA(){
    let promedio_Y = await promedioY();
    let b = await calcularB();
    b = b.toPrecision(2);
    let promedio_X = await promedioX();

    console.log("Formula "+ promedio_Y +"-"+b +"*" +promedio_X);
    return promedio_Y - (b * promedio_X);
}

async function calcularNotaPromedio(tiempo) {
    let a = await calcularA();
    let b = await calcularB();

    return a + (b*tiempo);
}

