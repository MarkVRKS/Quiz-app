document.addEventListener('DOMContentLoaded', () => {
    nextButton.classList.add('hide');
});

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

let shuffledQuestions, currentQuestionIndex;
let score = 0;

const questions = [
    {
        question: 'Какой из этих языков программирования относится к объектно-ориентированной (императивной) парадигме программирования',
        answers: [
            {text: "Pascal", correct: false},
            {text: "JavaScript", correct: false},
            {text: "C#", correct: true},
            {text: "Assembly", correct: false}
        ]
    },
    {
        question: 'Какая из этих IDE действительно существует?',
        answers: [
            {text: 'Visual Studio Node', correct: false},
            {text: 'GoCode', correct: false},
            {text: 'PyChard', correct: false},
            {text: 'NotePad++', correct: true}
        ]
    },
    {
        question: 'Какой язык программирования используется преимущественно в разработке игр на движке Unity?',
        answers: [
            {text: 'C#', correct: true},
            {text: 'Python', correct: false},
            {text: 'Java', correct: false},
            {text: 'GoLang', correct: false}
        ] 
    }
];

startButton.addEventListener('click', startGame);

function startGame() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    score = 0; // Сброс счета при начале игры
    setNextQuestion();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    answerButtonsElement.innerHTML = ''; // Очищаем предыдущие ответы
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    // Сначала подсвечиваем только выбранную кнопку
    setStatusClass(selectedButton, correct);
    
    // Затем показываем правильный ответ (если выбран неправильный)
    if (!correct) {
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct) {
                setStatusClass(button, true);
            }
        });
    }
    
    // Отключаем все кнопки
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });
    
    if (correct) {
        score++;
    }
    
    setTimeout(() => {
        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            nextButton.classList.remove('hide');
        } else {
            concludeQuiz();
        }
    }, 1000);
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function resetState() {
    nextButton.classList.add('hide');
    while(answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

const quizAppElement = document.getElementById('quiz-app');
const resultsElement = document.createElement('div');
resultsElement.setAttribute('id', 'results');
resultsElement.classList.add('results', 'hide');
quizAppElement.appendChild(resultsElement);

function concludeQuiz() {
    questionContainerElement.classList.add('hide'); 
    nextButton.classList.add('hide');
    
    resultsElement.classList.remove('hide');
    resultsElement.innerHTML= `
    <h2>Квиз пройден!</h2>
    <p>Ваши результаты: ${score} из ${shuffledQuestions.length} правильных ответов</p>
    <button onclick="restartQuiz()" id="reset-btn">Начать заново</button>
    `;
}

function restartQuiz() {
    resultsElement.classList.add('hide');
    score = 0;
    currentQuestionIndex = 0;
    startGame();
}