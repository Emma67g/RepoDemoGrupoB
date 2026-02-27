/* const showMessage = () => {
    setTimeout(()=>{
        console.log("Hello");
    },3000);
}

showMessage();
console.log("Nuevo mensaje"); 

async function tarea() {
    return "Tarea asincrona";
}

async function ejecuta() {
    const respuesta= await tarea();
    console.log(respuesta);
}

ejecuta();

const promesa = new Promise( 
    (resolve,reject)=>{    
        const todobien= true;
        setTimeout(()=>{  
            if(todobien){
                resolve("Tamo bien")
            }else{
                reject("Todo mal")
            }
        },5000)
    }
);

promesa.then(
    (respuesta)=>{console.log(respuesta)}
).catch(
    (error)=>{console.log(error)}
)

const promesaUno = new Promise(
    (resolve, reject) => {
        resolve("Promesa uno resuelta");
    }
);

const promesaDos = new Promise(
    (resolve, reject) => {
        resolve("Promesa dos resuelta");
    }
);

const promesaTres = new Promise(
    (resolve, reject) => {
        reject("Promesa tres resuelta");
    }
);

promesaUno
.then(
    (res) => {
        console.log(res);
        return promesaDos;
    }
)
.then(
    (res) => {
        console.log(res);
        return promesaTres;
    }
)
.catch(
    (e) => {
        console.log(e);
    }
)

promesaUno.then(
    (respuesta) => {
        console.log(respuesta);
        promesaDos.then{
            (respuesta2) => {
                console.log(respuesta2);
                promesaTres.then(
                    (respuesta3) => {console.log(respuesta3)}
                ).catch(
                    (error) => {console.log(error)}
                )   
            }
        }
    }
)
*/

async function fetchPokemon() {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
    const datos = await respuesta.json();
    console.log(datos.results[0].url);
    const detalles = await fetch(datos.results[0].url);
    const datos_detalles = await detalles.json();
    console.log(datos_detalles);
    //
    const col = documents.createElement("div");
    col.className="col-md-4 col-lg-3";
    col.innerHTML=`
    <div class="card h-100 shadow-lg bg-secondary text-white">
        <img src="${datos_detalles.sprites.other['official-artwork'].front_default}"
        class="card-img-top p-3"
        alt ="${datos_detalles.name}">
        <div class="card-body text-center">
            <h5 class="card-title text-capitalize">${datos_detalles.name}</h5>
            <p class="card-text">
                Tipo: ${datos_detalles.types.map(t => t.type.name).join(", ")}
            </p>
        </div>
    </div>
    `;
    const contenedor = document.getElementById("pokemonContainer");
    contenedor.appendChild(col);
}

fetchPokemon();
