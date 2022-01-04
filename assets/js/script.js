
$(function () {
    $('#buscar').click(() => { //selecciono el boton con la id="buscar" del index html y le asigno el evento click y le vinculo la funcion  buscar Personaje
        buscarPersonaje()
    })
    $(document).keypress(e => { // le agrego al presionar la tecla enter la funcion de buscar personaje.
        if (e.which == 13) {
            buscarPersonaje()
        }
    })
});

function buscarPersonaje() {
    let id_SuperHero = $('#input_busqueda').val() // seleciono el valor (.val en caso de jquery ) del  input del html con el id='input_busqueda' y lo guardo en la variable local id_personaje
    //guardia
    if (validacion(id_SuperHero) == false) {
        errorInput()// se invoca funcion errorInput() cuando la validacion sea falsa, funcion  creada mas abajo.
        return; // escapo de la funcion buscarPersonaje()
    }
    //si el guardia anterior no se queja se ejecuta la funcion getPersonaje(id_SuperHero )
    getPersonaje(id_SuperHero)
}

function validacion(id) {// funcion que recibe un id  y se invoca en function buscarPersonaje() 
    let expression = /^\d{1,3}$/;// se crea una expresion  que acepte solo  3 digitos y se guarda en let expression
    if (expression.test(id)) {// if para evaluar la exprecion anterior ,espera un true para retornarlo
        return true // si el id es un digito, retorna un true y me saca de la funcion.
    }
    return false //si no se cumple en if anterior, retorna un false , escrito de forma mas larga seria ( else { return false} )
}

function errorInput() { // funcion de lanzar un alert cuando el input sea false, con el focus me deja el cursor en el mismo lugar 
    alert('Input invalido');
    $("#input_busqueda").focus();// con jquery selecciono el input de clase "#input_busqueda" y me deja el punto en el input de busqueda.
}

function getPersonaje(id) { // funcion encargada de traer el personaje, el id enlazado de la funcion buscarPersonaje() / let id_personaje
    $.ajax({
        type: "GET",
        url: `https://superheroapi.com/api.php/10159625067423750/${id}`,
        success: function (response) {
            console.log(response)
            //console.log(generarCard(response))
            $("#cards").empty();// para obtener un card por cada vez que se busca.
            $("#cards").append(generarCard(response)) // *****selecciono el input del html  con id="cards" y lo inyecto con append los datos generados con la funcion (generarCard(response)) response se enlaza con personaje.*****
            $("#grafico").empty();
            $("#grafico").append(generarGrafico(response))
            $('#input_busqueda').val("")//deja el input html en vacio luego de hacer una busqueda.
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function checkPowerstats(powerstats) {
    for (let stat in powerstats) {
        if (powerstats[stat] == "null")
            return false
    }
    return true
}

function limpiar() {
    $('#cards').empty();// se limpia el div html que tenga el id='cards'
    $('#input_busqueda').focus();
}

function generarCard(superHero) { // funcion para crear el card con las clases de boostrap y se interpola la infomacion dinamicamente.
    let card = `
        <div class="col-sm-12 col-md-12">
            <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-5">
            <img src="${superHero.image.url}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-7">
            <div class="card-body">
                <h5 class="card-title"> NOMBRE: ${superHero.name} </h5>
                <hr>
                <p class="card-text"><small class="text-muted"> Conexiones: ${superHero.connections['group-affiliation']} </small></p>
                
                <p class="card-text"><small class="text-muted"> Publicado Por: ${superHero.biography.publisher}</small></p>
                <hr>
                <p class="card-text"><small class="text-muted"> Ocupación: ${superHero.work.occupation} </small></p>
                <hr>
                <p class="card-text"><small class="text-muted"> Primera Aparicion: ${superHero.biography['first-appearance']}</small></p>
                <hr>
                <p class="card-text"><small class="text-muted"> Altura: ${superHero.appearance.height}</small></p>
                <hr>
                <p class="card-text"><small class="text-muted"> Peso: ${superHero.appearance.weight} </small></p>
                <hr>
                <p class="card-text"><small class="text-muted"> Alianzas: ${superHero.biography.aliases} </small></p>
            </div>
        </div>
        </div>
        </div>`
    return card;// se retorna la card generada por la funcion 
}

function generarGrafico(superHero) {
    let options = {
        title: {
            text: `Estadisticas de Poder Para ${superHero.name}`,
        },
        data: [{
            type: "pie",
            startAngle: 25,
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: [
                { y: `${superHero.powerstats.intelligence}`, label: "intelligence" },
                { y: `${superHero.powerstats.strength}`, label: "strength" },
                { y: `${superHero.powerstats.speed}`, label: "speed" },
                { y: `${superHero.powerstats.durability}`, label: "durability" },
                { y: `${superHero.powerstats.power}`, label: "power" },
                { y: `${superHero.powerstats.combat}`, label: "combat" }
            ]
        }]
    }
    if (checkPowerstats(superHero.powerstats)) {

        $('#grafico').CanvasJSChart(options)
    }
    else {
        $('#grafico').html("<h1> Datos de Grafico no Disponible</h1>")
    }

}











