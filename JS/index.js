// =====================================================
//  Calculadora de IMC
//  Classificação baseada nas faixas da OMS
//  (Organização Mundial da Saúde) para adultos.
// =====================================================

// Cada faixa vai até "max" (sem incluir). Não há buracos entre elas,
// então qualquer IMC válido sempre cai em alguma faixa.
const FAIXAS = [
    {
        max: 18.5,
        nome: 'Abaixo do peso',
        cor: '#5bd9ab',
        img: 'Imagens/magro.png',
        msg: 'Seu peso está abaixo do recomendado para a sua altura. Vale conversar com um profissional de saúde para ganhar peso de forma equilibrada.'
    },
    {
        max: 25,
        nome: 'Peso normal',
        cor: '#1ba673',
        img: 'Imagens/peso-ideal.png',
        msg: 'Parabéns! Seu peso está dentro da faixa considerada saudável. Mantenha a alimentação equilibrada e a prática de atividades físicas.'
    },
    {
        max: 30,
        nome: 'Sobrepeso',
        cor: '#f28f79',
        img: 'Imagens/acima do peso.png',
        msg: 'Você está um pouco acima do peso ideal. Pequenas mudanças na alimentação e mais movimento no dia a dia já fazem diferença.'
    },
    {
        max: 35,
        nome: 'Obesidade',
        cor: '#f2637e',
        img: 'Imagens/gordo.png',
        msg: 'Seu IMC indica obesidade. Procure orientação médica e nutricional para cuidar da sua saúde com segurança.'
    },
    {
        max: Infinity,
        nome: 'Obesidade grave',
        cor: '#d94e4e',
        img: 'Imagens/obeso.png',
        msg: 'Atenção! Seu IMC indica obesidade grave. É importante buscar acompanhamento médico o quanto antes.'
    }
]

// Início e fim de cada faixa na barra colorida (usado só para posicionar o marcador)
const LIMITES_ESCALA = [10, 18.5, 25, 30, 35, 45]

// Faixa de peso considerada saudável pela OMS
const IMC_IDEAL_MIN = 18.5
const IMC_IDEAL_MAX = 24.9

// ---------- Elementos da página ----------
const form = document.getElementById('form-imc')
const campos = {
    altura: document.getElementById('altura'),
    peso: document.getElementById('peso')
}
const intro = document.getElementById('intro')
const resultado = document.getElementById('resultado')
const valorImc = document.getElementById('valor-imc')
const selo = document.getElementById('selo')
const marcador = document.getElementById('marcador')
const segmentos = document.querySelectorAll('.escala__segmento')
const img = document.getElementById('img')
const pesoIdeal = document.getElementById('peso-ideal')
const diferenca = document.getElementById('diferenca')
const mensagem = document.getElementById('mensagem')

// Pré-carrega as imagens para a troca ser instantânea
FAIXAS.forEach(faixa => { new Image().src = faixa.img })

// ---------- Utilidades ----------
const formatar = (numero, casas = 1) =>
    numero.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

// Aceita "1,75", "1.75", "175cm", "70 kg"...
function lerNumero(texto) {
    const limpo = texto.trim().toLowerCase().replace(/kg|cm|m|\s/g, '').replace(',', '.')
    if (!/^(\d+\.?\d*|\.\d+)$/.test(limpo)) return NaN
    return Number(limpo)
}

function mostrarErro(nome, texto) {
    const campo = campos[nome]
    campo.closest('.campo').classList.add('invalido')
    campo.setAttribute('aria-invalid', 'true')
    document.getElementById(`erro-${nome}`).textContent = texto
}

function limparErro(nome) {
    const campo = campos[nome]
    campo.closest('.campo').classList.remove('invalido')
    campo.removeAttribute('aria-invalid')
    document.getElementById(`erro-${nome}`).textContent = ''
}

// ---------- Validação ----------
function lerFormulario() {
    limparErro('altura')
    limparErro('peso')

    const textoAltura = campos.altura.value
    const textoPeso = campos.peso.value
    let altura = lerNumero(textoAltura)
    const peso = lerNumero(textoPeso)
    let valido = true

    if (textoAltura.trim() === '') {
        mostrarErro('altura', 'Informe sua altura.')
        valido = false
    } else if (Number.isNaN(altura)) {
        mostrarErro('altura', 'Digite apenas números. Ex: 1,75')
        valido = false
    } else {
        // Quem digita "175" quis dizer 175 cm
        if (altura > 3) altura = altura / 100
        if (altura < 0.5 || altura > 2.6) {
            mostrarErro('altura', 'A altura deve estar entre 0,50 m e 2,60 m.')
            valido = false
        }
    }

    if (textoPeso.trim() === '') {
        mostrarErro('peso', 'Informe seu peso.')
        valido = false
    } else if (Number.isNaN(peso)) {
        mostrarErro('peso', 'Digite apenas números. Ex: 70,5')
        valido = false
    } else if (peso < 2 || peso > 500) {
        mostrarErro('peso', 'O peso deve estar entre 2 kg e 500 kg.')
        valido = false
    }

    if (!valido) {
        const primeiroInvalido = form.querySelector('[aria-invalid="true"]')
        primeiroInvalido.focus()
        return null
    }

    return { altura, peso }
}

// ---------- Cálculo ----------
// Arredonda para 1 casa decimal, como na tabela da OMS (ex: 24,98 vira 25,0).
// Assim o número mostrado e a faixa escolhida sempre combinam.
function calcularImc(altura, peso) {
    return Math.round((peso / (altura * altura)) * 10) / 10
}

function classificar(imc) {
    return FAIXAS.findIndex(faixa => imc < faixa.max)
}

// Posição do marcador (0 a 100%) na barra com 5 faixas de mesmo tamanho
function posicaoNaEscala(imc, indice) {
    const inicio = LIMITES_ESCALA[indice]
    const fim = LIMITES_ESCALA[indice + 1]
    const dentroDaFaixa = Math.min(Math.max((imc - inicio) / (fim - inicio), 0.03), 0.97)
    return ((indice + dentroDaFaixa) / FAIXAS.length) * 100
}

// ---------- Exibição ----------
function mostrarResultado(altura, peso) {
    const imc = calcularImc(altura, peso)
    const indice = classificar(imc)
    const faixa = FAIXAS[indice]

    // Muda a cor do site de acordo com a faixa
    document.documentElement.style.setProperty('--tema', faixa.cor)

    valorImc.textContent = formatar(imc)
    selo.textContent = faixa.nome
    marcador.style.left = `${posicaoNaEscala(imc, indice)}%`
    segmentos.forEach((segmento, i) => segmento.classList.toggle('ativo', i === indice))

    img.src = faixa.img
    img.alt = `Ilustração da faixa ${faixa.nome}`

    const minimo = IMC_IDEAL_MIN * altura * altura
    const maximo = IMC_IDEAL_MAX * altura * altura
    pesoIdeal.textContent = `${formatar(minimo)} kg a ${formatar(maximo)} kg`

    if (indice === 0) {
        diferenca.textContent = `Faltam ${formatar(minimo - peso)} kg para chegar à faixa saudável.`
    } else if (indice === 1) {
        diferenca.textContent = 'Você está dentro da faixa saudável. 🎉'
    } else {
        diferenca.textContent = `Você está ${formatar(peso - maximo)} kg acima da faixa saudável.`
    }

    mensagem.textContent = faixa.msg

    intro.hidden = true
    resultado.hidden = false

    // Reinicia a animação de entrada a cada novo cálculo
    resultado.classList.remove('entrar')
    void resultado.offsetWidth
    resultado.classList.add('entrar')

    // No celular o resultado fica embaixo do formulário: rola até ele
    if (window.matchMedia('(max-width: 900px)').matches) {
        resultado.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

function voltarAoInicio() {
    limparErro('altura')
    limparErro('peso')
    document.documentElement.style.removeProperty('--tema')
    resultado.hidden = true
    intro.hidden = false
    campos.altura.focus()
}

// ---------- Eventos ----------
form.addEventListener('submit', evento => {
    evento.preventDefault()
    const dados = lerFormulario()
    if (dados) mostrarResultado(dados.altura, dados.peso)
})

form.addEventListener('reset', voltarAoInicio)

// Some com o erro assim que a pessoa começa a corrigir
Object.keys(campos).forEach(nome => {
    campos[nome].addEventListener('input', () => limparErro(nome))
})
