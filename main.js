//AXIOS (instancia con url base y )
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1', //url base y el header X-API-KEY
});
api.defaults.headers.common['X-API-KEY'] = 'live_IWMr6vT6Q6JM0hTwMOPbCP9UGFIZ1k5rcvQVWvaoGklejrVj8yOXaE4dbJPmp3j8'


//API REST
const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';

const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
                        

const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

//&api_key=live_IWMr6vT6Q6JM0hTwMOPbCP9UGFIZ1k5rcvQVWvaoGklejrVj8yOXaE4dbJPmp3j8
const spanError = document.getElementById('error');

//cargar michis random
async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('random');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + error.status;
    } else {
        const img1 = document.querySelector('#img1');
        const img2 = document.querySelector('#img2');
        const img3 = document.querySelector('#img3');

        const btn1 = document.querySelector('#btn1');
        const btn2 = document.querySelector('#btn2');
        const btn3 = document.querySelector('#btn3');
    
        img1.src = data[0].url; //en la posicion 0 trae la url de ese gatito
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavoriteMichi(data[0].id);
        btn2.onclick = () => saveFavoriteMichi(data[1].id);
        btn3.onclick = () => saveFavoriteMichi(data[2].id);
    }
}

//cargar michis favoritos solicitud de tipo get
async function loadFavoriteMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            //'X-API-KEY' ES COMO SE PIDE EN LA DOCUMENTACION Y EL VALOR ES LA KEY DE LOGUEO Q ME DIERON A MI
            'X-API-KEY': 'live_IWMr6vT6Q6JM0hTwMOPbCP9UGFIZ1k5rcvQVWvaoGklejrVj8yOXaE4dbJPmp3j8'
        }
    });
    const data = await res.json();

    console.log('favoritos');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {

        //limpiar el html
        const section = document.getElementById('favoriteMichis');
        section.innerHTML = "";
        

        data.forEach(michi => {

           // const div = document.createElement('div');
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Eliminar al michi de favoritos');

            //devolvemos para ir metiendo las cosas donde son
            btn.appendChild(btnText);
            btn.classList.add('info-button');
            btn.onclick = () => borrrarFavoriteMichi(michi.id)
            img.src = michi.image.url; //por la API
            
            article.appendChild(img);
            article.appendChild(btn);
            section.classList.add('michis-grid-item');

            section.appendChild(article);
            section.classList.add('michis-grid2');

        })
    }
}

//guardar a muchis en favoritos
//comentamos el codigo para ver como se hace con axios
async function saveFavoriteMichi(id) {
    // const res = await fetch(API_URL_FAVORITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json', //obligatorio
    //         'X-API-KEY': 'live_IWMr6vT6Q6JM0hTwMOPbCP9UGFIZ1k5rcvQVWvaoGklejrVj8yOXaE4dbJPmp3j8'
    //     },
    //     body: JSON.stringify({  //la info q vamos a enviar al backend (guarda esta img en favoritos)
    //         image_id: id
            
    //     }),
    // });

    // const data = await res.json();

     // console.log('guardar');
    // console.log(res);

    // if (res.status !== 200) {
    //     spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    // } else {
    //     console.log('michi guardado en favoritos');
    //     loadFavoriteMichis();
    // }

    //con axios resumimos todo lo q se hacia con fetch nativo de arriba en esto tan simple
    const {data, status} = await api.post('/favourites', { //ultima parte de la url
        image_id: id
    });

    console.log('guardar');
    // console.log(res);

     if (status !== 200) {
         spanError.innerHTML = "Hubo un error: " + status + data.message;
     } else {
         console.log('michi guardado en favoritos');
         loadFavoriteMichis();
     }

   
}

//borrar michis
async function borrrarFavoriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), { //
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_IWMr6vT6Q6JM0hTwMOPbCP9UGFIZ1k5rcvQVWvaoGklejrVj8yOXaE4dbJPmp3j8'
        }
    });

    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('michi ELIMINADO en favoritos');
        loadFavoriteMichis();
    }
}

//cargar michis desde el formulario html
async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form); //agrega todo lo q haya dentro del formulario
    console.log(formData.get('file')); //file es el name del input
    const res = await fetch(API_URL_UPLOAD,{
        method: 'POST',
        headers:{
            //'Content-Type':'multipart/form-data', (iba un boundary pero fetch con pasarle formdaata crea el content type)
            'X-API-KEY': 'live_IWMr6vT6Q6JM0hTwMOPbCP9UGFIZ1k5rcvQVWvaoGklejrVj8yOXaE4dbJPmp3j8',
        },
        body:formData
    })
    const data = await res.json();
    if(res.status !== 201){
        spanError.innerHTML = "Hubo un error: " +res.status + data.message;
        console.log({data})
    }else{
        console.log('Foto de michi subida');
        console.log({data})
        console.log(data.url)
        saveFavoriteMichi(data.id);
    }
}



//para q no aparezca sin imagen la primera vez q carga la pagina
loadRandomMichis();
loadFavoriteMichis();