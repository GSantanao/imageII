'use client';

export function PrimeiroComponente() {
	
	function clique(){
		// console.log("Clicou no botão")
		alert("Clicou no botão")
	}

	return (
		<div>
			<h1>Primeiro Componente</h1>
			<button onClick={clique}>Clique aqui</button>
		</div>
	)
}

