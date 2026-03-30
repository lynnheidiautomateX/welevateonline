// Signup form
function handleSignup(e) {
  e.preventDefault();
  var email = document.getElementById('signupEmail').value;
  var btn = document.getElementById('signupBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  var formData = new FormData();
  formData.append('fields[email]', email);
  formData.append('ml-submit', '1');
  formData.append('anticsrf', 'true');
  fetch('https://assets.mailerlite.com/jsonp/2211868/forms/183217235853051090/subscribe', {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
  }).then(function() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'block';
  }).catch(function() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'block';
  });
  return false;
}

// Carousel manual scroll
function scrollCarousel(direction) {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  const card = track.querySelector('.carousel-card');
  if (!card) return;
  const cardWidth = card.offsetWidth + 20;
  track.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
}

// Continuous smooth carousel auto-scroll
(function() {
  var track = document.getElementById('carouselTrack');
  if (!track) return;
  var speed = 0.5;
  var animId = null;
  var paused = false;

  function step() {
    if (!paused) {
      track.scrollLeft += speed;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
        track.scrollLeft = 0;
      }
    }
    animId = requestAnimationFrame(step);
  }

  track.addEventListener('mouseenter', function() { paused = true; });
  track.addEventListener('mouseleave', function() { paused = false; });
  track.addEventListener('touchstart', function() { paused = true; });
  track.addEventListener('touchend', function() { setTimeout(function() { paused = false; }, 2000); });
  animId = requestAnimationFrame(step);
})();

// FAQ Accordion
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });

  if (!wasOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ===== QUIZ =====
var quizData = [
  {
    q: "What's your biggest challenge right now?",
    options: [
      { text: "I spend all day on repetitive tasks and never get to the big stuff", type: "A" },
      { text: "I have a million ideas but none of them are built yet", type: "B" },
      { text: "I've got things running but I know AI could take it further", type: "C" }
    ]
  },
  {
    q: "When you hear \"AI tools,\" what's your first reaction?",
    options: [
      { text: "Sounds great but I barely have time to learn something new", type: "A" },
      { text: "I'm excited but I don't know where to start", type: "B" },
      { text: "I've tried a few but want to go deeper", type: "C" }
    ]
  },
  {
    q: "What would make the biggest difference for you this month?",
    options: [
      { text: "Getting 5 hours back in my week", type: "A" },
      { text: "Turning one of my ideas into something real", type: "B" },
      { text: "Automating or scaling what's already working", type: "C" }
    ]
  }
];

var quizResults = {
  A: {
    emoji: "&#128165;",
    title: "The Overwhelmed Operator",
    msg: "You're doing too much by hand. Your first win with AI is automating the tasks that drain your energy. In our workshops, you'll build your first automation in 45 minutes.",
    color: "pink"
  },
  B: {
    emoji: "&#128161;",
    title: "The Idea Machine",
    msg: "You don't lack creativity. You lack a build system. In our workshops, you'll go from idea to working prototype in a single session. No code, no overwhelm.",
    color: "blue"
  },
  C: {
    emoji: "&#128640;",
    title: "The System Scaler",
    msg: "You've got the foundation. Now it's time to plug in AI and multiply your output. Our workshops will show you how to layer AI into what you've already built.",
    color: "green"
  }
};

var quizAnswers = [];
var quizStep = 0;

function openQuiz() {
  quizAnswers = [];
  quizStep = 0;
  document.getElementById('quizModal').style.display = 'flex';
  document.getElementById('quizQuestions').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  document.body.style.overflow = 'hidden';
  renderQuestion();
}

function closeQuiz() {
  document.getElementById('quizModal').style.display = 'none';
  document.body.style.overflow = '';
}

function renderQuestion() {
  var data = quizData[quizStep];
  document.getElementById('quizStep').textContent = quizStep + 1;
  document.getElementById('quizQ').textContent = data.q;
  var optionsEl = document.getElementById('quizOptions');
  optionsEl.innerHTML = '';
  data.options.forEach(function(opt) {
    var btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt.text;
    btn.onclick = function() { selectAnswer(opt.type); };
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(type) {
  quizAnswers.push(type);
  quizStep++;
  if (quizStep < quizData.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  var counts = { A: 0, B: 0, C: 0 };
  quizAnswers.forEach(function(a) { counts[a]++; });

  var winner = quizAnswers[0]; // tiebreaker = Q1
  if (counts.A > counts[winner]) winner = 'A';
  if (counts.B > counts[winner]) winner = 'B';
  if (counts.C > counts[winner]) winner = 'C';

  var result = quizResults[winner];
  document.getElementById('quizQuestions').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  document.getElementById('quizResultEmoji').innerHTML = result.emoji;
  document.getElementById('quizResultTitle').textContent = result.title;
  document.getElementById('quizResultTitle').className = 'quiz-result-title ' + result.color;
  document.getElementById('quizResultMsg').textContent = result.msg;
}

function resetQuiz() {
  quizAnswers = [];
  quizStep = 0;
  document.getElementById('quizQuestions').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  renderQuestion();
}
