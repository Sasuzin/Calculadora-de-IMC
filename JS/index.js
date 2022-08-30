// função do IMC

function calcularImc(){
    let altura = document.getElementById('altura').value
    let peso = document.getElementById('peso').value
    let img = document.getElementById('img')

    let imc = peso / (altura * altura).toFixed(2)
    if(imc >= 0 && imc < 18.5){
        img.src = 'Imagens/magro.png'
        document.body.style.background = '#5bd9ab'
    }
    else if( imc >= 18.5 && imc < 24.9){
        img.src = 'Imagens/peso-ideal.png'
        document.body.style.background = '#1ba673'
    }
    else if( imc >= 25 && imc < 30){
        img.src = 'Imagens/acima do peso.png'
        document.body.style.background = '#f28f79'
    }
    else if( imc >= 30.1 && imc < 35){
        img.src = 'Imagens/gordo.png'
        document.body.style.background = '#f2637e'
    }
    else if( imc >= 35.1 && imc < 99){
        img.src = 'Imagens/obeso.png'
        document.body.style.background = '#d94e4e'
    }
    else{imc
    }

    //botão para ativar a função

    let button = document.getElementById('button')
    button.addEventListener('click', calcularImc)

}
