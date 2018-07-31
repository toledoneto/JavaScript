var width;
var height;
var hpBar = 1;
var timer = 10;

var createMosquitoTime = 1500;

var nivel = window.location.search;
nivel = nivel.replace('?', '');

if (nivel === 'normal') 
{

	createMosquitoTime = 1500;

} else if (nivel === 'hard'){

	createMosquitoTime = 1000;

} else if (nivel === 'chucknorris'){

	createMosquitoTime = 750;

}

// função para recalcular o tamanho da janela em que o jogo está sendo executado naquele momento
// se houver redimensionamento, o jogo se adequará
function windowGameSize()
{
	height =  window.innerHeight;
	width = window.innerWidth;
}

windowGameSize();

var clock = setInterval(function(){

	timer -= 1;

	if (timer < 0) 
	{

		clearInterval(clock);
		clearInterval(createMosquito);
		window.location.href = 'victory.html';

	} else {

		document.getElementById('clock').innerHTML = timer;

	}
	
} , 1000);

function randomPosition()
{

	// removendo o mosquito anterior, caso ele exista
	if (document.getElementById('mosquito')) 
	{

		document.getElementById('mosquito').remove();

		if (hpBar > 3) 
		{

			window.location.href = 'game_over.html';

		} else{

			document.getElementById('v' + hpBar).src = "imagens/coracao_vazio.png";
			hpBar++;

		}

	}
	

	// garantindo que as img sejam criadas dinâmicamente dentro do tamanho da página
	var positionX = Math.floor(Math.random() * width) - 90;
	var positionY = Math.floor(Math.random() * height) - 90;

	positionX = positionX < 0 ? 0 : positionX;
	positionY = positionY < 0 ? 0 : positionY;

	// cria o elemento HTML
	var mosquito = document.createElement('img');
	mosquito.src = "imagens/mosquito.png";
	mosquito.className = randomSize() + ' ' + randomFace();
	mosquito.style.left = positionX + 'px';
	mosquito.style.top = positionY + 'px';
	mosquito.style.position = 'absolute';
	mosquito.id = 'mosquito';
	mosquito.onclick = function(){

		// como a função está associada a um elemento html, pode-se usar o this
		this.remove();

	}

	document.body.appendChild(mosquito);

	randomSize();

}

// função para decidir o tamanho dos mosquitos renderizados dentre 3 opções
function randomSize()
{

	var imgClass = Math.floor(Math.random() * 3);

	switch (imgClass) {
		case 0:
			return 'mosquito1'
		case 1:
			return 'mosquito2'
		case 2:
			return 'mosquito3'
	}

}

function randomFace()
{

	var imgClass = Math.floor(Math.random() * 2);

		switch (imgClass) {
			case 0:
				return 'faceA'
			case 1:
				return 'faceB'
		}

}