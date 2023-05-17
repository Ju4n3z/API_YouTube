const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '43fb46b3ddmshb564e496bdd54f2p19a28bjsn9174e7cf60a2',
		'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
	}
};

const ponerVideosRelacionados = async (videos) => {
	let a1 = document.querySelector('#urlVideo1');
	let a2 = document.querySelector('#urlVideo2');
	let a3 = document.querySelector('#urlVideo3');
	let imagen1 = document.querySelector('#imagenVideo1');
	let imagen2 = document.querySelector('#imagenVideo2');
	let imagen3 = document.querySelector('#imagenVideo3');
	a1.href = `https://www.youtube.com/watch?v=${videos[0].video.videoId}`;
	a2.href = `https://www.youtube.com/watch?v=${videos[1].video.videoId}`;
	a3.href = `https://www.youtube.com/watch?v=${videos[2].video.videoId}`;
	imagen1.src = videos[0].video.thumbnails[1].url;
	imagen2.src = videos[1].video.thumbnails[1].url;
	imagen3.src = videos[2].video.thumbnails[1].url;
};

const videosRelacionados = async (id) => {
	const url = `https://youtube138.p.rapidapi.com/video/related-contents/?id=${id}&hl=es&gl=US`;
	
	try {
		const response = await fetch(url, options);
		const result = await response.json();
		console.log(result);
		let videos = [];
		let contador = 0;
		let i = 0;
		while (contador < 3) {
        	if (result.contents[i].type === "video") {
			videos.push(result.contents[i]);
			contador += 1;
		}
		i +=1
    } 	
	console.log(videos)
	ponerVideosRelacionados(videos)
	} catch (error) {
		console.error(error);
	}
}

const ponerDescripcion = async (descripcion) => {
	let descripcionP = document.querySelector('#descripcion')
	descripcionP.innerHTML = descripcion
}

const descripcion = async (id) => {
	const url = `https://youtube138.p.rapidapi.com/video/details/?id=${id}&hl=es&gl=US`;

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		ponerDescripcion(result.description)
	} catch (error) {
		console.error(error);
	}
}

const ponerComentarios = async (comentarios) => {
	let divComentarios = document.querySelector('#divComentarios');
	divComentarios.innerHTML = "";
	divComentarios.insertAdjacentHTML("beforeend",`<h6 class="text-center">Comentarios</h6>`);
	if (comentarios.length === 0) {
		divComentarios.insertAdjacentHTML("beforeend",`<p class="text-center">No hay comentarios</p>`);
	} else{
		for (let i = 0; i < (comentarios.length); i++) {
			parrafos = `<p>➡${comentarios[i].content}</>`
			divComentarios.insertAdjacentHTML("beforeend",parrafos);
		};
	}
}

const comentarios = async (id) => {
	const url = `https://youtube138.p.rapidapi.com/video/comments/?id=${id}&hl=es&gl=US`;

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		ponerComentarios(result.comments);
		console.log(result.comments)
	} catch (error) {
		console.error(error);
	}
}


const ponerDatos1 = async (titulo, avatar, nombreCanal, id) => {
	let tituloVideo = document.querySelector('#tituloVideo');
	tituloVideo.innerHTML = titulo;
    let avatarCanal = document.querySelector('#avatarCanal');
	avatarCanal.src = avatar;
	let nombreCanalP = document.querySelector('#nombreCanal');
	nombreCanalP.innerHTML = nombreCanal;
	let video = document.querySelector('#video');
	video.src = `https://www.youtube.com/embed/${id}`;
}

const funcion = async (busqueda) => {
const url = `https://youtube138.p.rapidapi.com/search/?q=${busqueda}&hl=en&gl=US`;

	try {
		const response = await fetch(url, options);
		const result = await response.json();
		if (result.contents[1].type === "video"){
			titulo = result.contents[1].video.title;
			avatar = result.contents[1].video.author.avatar[0].url;
			nombreCanal = result.contents[1].video.author.title;
			id = result.contents[1].video.videoId;
			ponerDatos1(titulo, avatar, nombreCanal, id)
			comentarios(id)
			descripcion(id)
			videosRelacionados(id)   
		} else {
			titulo = result.contents[0].video.title;
			avatar = result.contents[0].video.author.avatar[0].url;
			nombreCanal = result.contents[0].video.author.title;
			id = result.contents[0].video.videoId;
			ponerDatos1(titulo, avatar, nombreCanal, id)
			comentarios(id)
			descripcion(id)
			videosRelacionados(id)
		}
		 
	} catch (error) {
		console.error(error);
	}
}

let formulario = document.querySelector('#formulario');

formulario.addEventListener("submit", (e)=>{
	e.preventDefault();
	let data = Object.fromEntries(new FormData(e.target));
	funcion(data.buscar)
})


