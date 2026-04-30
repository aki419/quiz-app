const questions = [
  {
    question: '日本で最も長い川はどれですか？',
    choices: ['利根川', '信濃川', '石狩川', '木曽川'],
    answer: 1,
  },
  {
    question: '光が1秒間に進む距離として最も近いものはどれですか？',
    choices: ['約3万km', '約30万km', '約300万km', '約3000万km'],
    answer: 1,
  },
  {
    question: '徳川幕府が置かれた都市はどこですか？',
    choices: ['京都', '大阪', '江戸', '鎌倉'],
    answer: 2,
  },
  {
    question: '人体で最も大きい臓器はどれですか？',
    choices: ['肝臓', '肺', '小腸', '皮膚'],
    answer: 3,
  },
  {
    question: '国際連合（UN）の本部が置かれている都市はどこですか？',
    choices: ['ワシントンD.C.', 'ジュネーブ', 'ニューヨーク', 'パリ'],
    answer: 2,
  },
];

const TIME_LIMIT = 10;

let currentIndex = 0;
let score = 0;
let answered = false;
let timerId = null;
let timeLeft = TIME_LIMIT;
let results = [];
let chartInstance = null;

const startScreen   = document.getElementById('start-screen');
const quizScreen    = document.getElementById('quiz-screen');
const resultScreen  = document.getElementById('result-screen');

const progressFill      = document.getElementById('progress-fill');
const questionNumber    = document.getElementById('question-number');
const questionText      = document.getElementById('question-text');
const choicesContainer  = document.getElementById('choices');
const feedback          = document.getElementById('feedback');
const feedbackText      = document.getElementById('feedback-text');
const correctAnswerText = document.getElementById('correct-answer-text');
const nextBtn           = document.getElementById('next-btn');
const timerEl           = document.getElementById('timer');
const scoreText         = document.getElementById('score-text');
const scoreComment      = document.getElementById('score-comment');

document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('retry-btn').addEventListener('click', startQuiz);
nextBtn.addEventListener('click', showNextQuestion);

function startQuiz() {
  currentIndex = 0;
  score = 0;
  results = [];
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  showQuestion();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = TIME_LIMIT;
  updateTimerDisplay();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timeUp();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function updateTimerDisplay() {
  timerEl.textContent = timeLeft;
  if (timeLeft <= 3) {
    timerEl.classList.add('warning');
  } else {
    timerEl.classList.remove('warning');
  }
}

function timeUp() {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const choiceBtns = choicesContainer.querySelectorAll('.choice-btn');

  choiceBtns.forEach((btn) => (btn.disabled = true));
  choiceBtns[q.answer].classList.add('correct');

  results.push(false);

  feedback.className = 'feedback incorrect-feedback';
  feedbackText.textContent = '⏰ 時間切れ！';
  correctAnswerText.textContent = `正解は「${q.choices[q.answer]}」でした。`;

  const isLast = currentIndex === questions.length - 1;
  nextBtn.textContent = isLast ? '結果を見る' : '次の問題へ';
  nextBtn.classList.remove('hidden');
}

function showQuestion() {
  answered = false;
  const q = questions[currentIndex];

  progressFill.style.width = `${(currentIndex / questions.length) * 100}%`;
  questionNumber.textContent = `問題 ${currentIndex + 1} / ${questions.length}`;
  questionText.textContent = q.question;

  choicesContainer.innerHTML = '';
  q.choices.forEach((choice, index) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => selectAnswer(index));
    choicesContainer.appendChild(btn);
  });

  feedback.className = 'feedback hidden';
  feedbackText.textContent = '';
  correctAnswerText.textContent = '';
  nextBtn.classList.add('hidden');

  startTimer();
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  stopTimer();

  const q = questions[currentIndex];
  const choiceBtns = choicesContainer.querySelectorAll('.choice-btn');

  choiceBtns.forEach((btn) => (btn.disabled = true));

  const isCorrect = selectedIndex === q.answer;
  results.push(isCorrect);

  if (isCorrect) {
    score++;
    choiceBtns[selectedIndex].classList.add('correct');
    feedback.className = 'feedback correct-feedback';
    feedbackText.textContent = '✓ 正解！';
    correctAnswerText.textContent = '';
  } else {
    choiceBtns[selectedIndex].classList.add('incorrect');
    choiceBtns[q.answer].classList.add('correct');
    feedback.className = 'feedback incorrect-feedback';
    feedbackText.textContent = '✗ 不正解';
    correctAnswerText.textContent = `正解は「${q.choices[q.answer]}」でした。`;
  }

  const isLast = currentIndex === questions.length - 1;
  nextBtn.textContent = isLast ? '結果を見る' : '次の問題へ';
  nextBtn.classList.remove('hidden');
}

function showNextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  progressFill.style.width = '100%';

  scoreText.textContent = `${questions.length}問中 ${score}問正解`;

  const ratio = score / questions.length;
  if (ratio === 1) {
    scoreComment.textContent = '完璧です！素晴らしい結果です！';
  } else if (ratio >= 0.6) {
    scoreComment.textContent = 'よくできました！引き続き挑戦してみましょう。';
  } else {
    scoreComment.textContent = 'もう一度挑戦してみましょう！';
  }

  renderChart();
}

function renderChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const labels = questions.map((_, i) => `問題${i + 1}`);
  const colors = results.map((r) => (r ? '#38a169' : '#e53e3e'));
  const borderColors = results.map((r) => (r ? '#276749' : '#9b2c2c'));

  chartInstance = new Chart(document.getElementById('result-chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '結果',
        data: results.map((r) => (r ? 1 : 0)),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => (ctx.raw === 1 ? '正解' : '不正解'),
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 1,
          ticks: {
            stepSize: 1,
            callback: (v) => (v === 1 ? '正解' : v === 0 ? '不正解' : ''),
          },
          grid: { color: '#e2e8f0' },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}
