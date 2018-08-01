class Expense
{

	constructor(year, month, day, typeOf, description, cost)
	{

		this.year = year;
		this.month = month;
		this.day = day;
		this.typeOf = typeOf;
		this.description = description;
		this.cost = cost;

	}

	// verificando a validade dos dados do formulário
	validateData()
	{

		for(let i in this)
		{

			if (this[i] == undefined || this[i] == '' || this[i] == null) return false;

		}

		return true;

	}

}

class Db
{

	// como ao iniciar o app não teremos um id inicial, é necessário verificar no localStorage (LS)
	// se estamos no início do app e, em caso afirmativo, atribuir um id inicial (0 no caso)
	constructor()
	{

		// recupera o id no LS
		let id = localStorage.getItem('id');

		if (id === null) localStorage.setItem('id', 0);

	}
	
	// procurando o último Id registrado no localStorage para criarmos o próx id
	getNextId()
	{

		let nextId = localStorage.getItem('id');
		return parseInt(nextId) + 1;

	}

	// método para salvar no LocalStorage a despesa criada no app
	save(expense)
	{

		// cria o próx id
		let id = this.getNextId();

		// add no LS
		localStorage.setItem(id, JSON.stringify(expense));

		// prepara o próx id a ser usado no próx cadastro
		localStorage.setItem('id', id);

	}

	// busca tds os registros no LS para mostrar na tela de cosulta
	fetchAll()
	{

		// array de despesas
		let expenses = Array();

		// recupera o último id registrado que está salvo no param id
		let id = localStorage.getItem('id');

		// recupera tds despesas salvas
		for(let i = 1 ; i <= id ; i++)
		{

			// recuperando as despesas no formato JSON e convertendo pra obj literal
			let expense = JSON.parse(localStorage.getItem(i));

			// verificando índices removidos e pulando-os
			if (expense === null) continue;

			expenses.push(expense);

		}

		return expenses;

	}

	// faz a procura de despesas com base nos param passados na pag consulta
	search(expense)
	{

		let filteredExpenses = Array();

		filteredExpenses = this.fetchAll();

		if (expense.year != '') filteredExpenses = filteredExpenses.filter( exp => exp.year == expense.year);

		if (expense.month != '') filteredExpenses = filteredExpenses.filter( exp => exp.month == expense.month);

		if (expense.day != '') filteredExpenses = filteredExpenses.filter( exp => exp.day == expense.day);

		if (expense.typeOf != '') filteredExpenses = filteredExpenses.filter( exp => exp.typeOf == expense.typeOf);

		if (expense.description != '') filteredExpenses = filteredExpenses.filter( exp => exp.description == expense.description);

		if (expense.cost != '') filteredExpenses = filteredExpenses.filter( exp => exp.cost == expense.cost);

		return filteredExpenses;

	}

}

let db = new Db();

function createExpense()
{

	let year = document.getElementById('ano');
	let month = document.getElementById('mes');
	let day = document.getElementById('dia');
	let typeOf = document.getElementById('tipo');
	let description = document.getElementById('descricao');
	let cost = document.getElementById('valor');

	let expense =  new Expense(year.value, month.value, day.value, 
								typeOf.value, description.value, cost.value);

	if(expense.validateData())	
	{
		
		db.save(expense);

		document.getElementById('modalTitle').innerHTML = 'Registro inserido com sucesso';
		document.getElementById('modalTitleDiv').className = 'modal-header text-success';
		document.getElementById('modalContent').innerHTML = 'Despesa cadastrada com sucesso';
		document.getElementById('modalBtn').innerHTML = 'Voltar';
		document.getElementById('modalBtn').className = 'btn btn-success';

		// um pouco de JQuery caso não haja erro no preenchimento do form
		$('#modalRegisterExpense').modal('show');

		year.value = '';
		month.value = '';
		day.value = '';
		typeOf.value = '';
		description.value = '';
		cost.value = '';

	} else {

		document.getElementById('modalTitle').innerHTML = 'Erro no cadastro!';
		document.getElementById('modalTitleDiv').className = 'modal-header text-danger';
		document.getElementById('modalContent').innerHTML = 'Campos obrigatórios não preenchidos';
		document.getElementById('modalBtn').innerHTML = 'Voltar e Corrigir';
		document.getElementById('modalBtn').className = 'btn btn-danger';

		// um pouco de JQuery caso haja erro no preenchimento do form
		$('#modalRegisterExpense').modal('show');

	};

}

function showListExpenses(expenses = Array(), filter = false)
{

	// verificando se o tamanho do array passado como param é zero, ou seja,
	// se a função foi chamada pelo on load da pag consulta.html, o que
	// faz que seja necessário retornar todas as entradas do LS
	if (expenses.length == 0 && filter == false) expenses = db.fetchAll();

	let expenseList = document.getElementById('expenseList');

	// limpa a tabela existente para mostrar a nova busca
	expenseList.innerHTML = '';

	// percorrendo o array depesas e colocando de forma dinâmica no HTML
	expenses.forEach(function(expense){

		// cria a linha
		let row = expenseList.insertRow();

		// cria a coluna
		row.insertCell(0).innerHTML = `${expense.day}/${expense.month}/${expense.year}`;
		
		switch (expense.typeOf) {
			case '1':
				expense.typeOf = 'Alimentação';
				break;
			case '2':
				expense.typeOf = 'Educação';
				break;
			case '3':
				expense.typeOf = 'Lazer';
				break;
			case '4':
				expense.typeOf = 'Saúde';
				break;
			case '5':
				expense.typeOf = 'Transporte';
				break;
		}

		row.insertCell(1).innerHTML = expense.typeOf;
		row.insertCell(2).innerHTML = expense.description;
		row.insertCell(3).innerHTML = expense.cost;

	});

}

// busca as despesas que foram solicitadas através do buscar na pag consulta
function fetchExpense()
{

	let year = document.getElementById('ano').value;
	let month = document.getElementById('mes').value;
	let day = document.getElementById('dia').value;
	let typeOf = document.getElementById('tipo').value;
	let description = document.getElementById('descricao').value;
	let cost = document.getElementById('valor').value; 

	let expense =  new Expense(year, month, day, 
								typeOf, description, cost);

	let expenses = db.search(expense);

	// mostra os intens pesquisados e, pelo param true, não retornada nada caso
	// não haja uma entrada com os dados pesquisados
	showListExpenses(expenses, true);

}

