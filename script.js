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

// Continuous seamless carousel auto-scroll
(function() {
  var track = document.getElementById('carouselTrack');
  if (!track) return;

  // Clone all cards and append for seamless looping
  var cards = track.querySelectorAll('.carousel-card');
  cards.forEach(function(card) {
    var clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  var speed = 0.5;
  var paused = false;
  // Width of original cards (half the track content)
  var originalWidth = 0;

  function measureOriginal() {
    originalWidth = 0;
    var gap = 20; // 1.25rem gap
    for (var i = 0; i < cards.length; i++) {
      originalWidth += cards[i].offsetWidth + gap;
    }
  }
  measureOriginal();
  window.addEventListener('resize', measureOriginal);

  function step() {
    if (!paused) {
      track.scrollLeft += speed;
      // When we've scrolled past all original cards, silently reset
      if (track.scrollLeft >= originalWidth) {
        track.scrollLeft -= originalWidth;
      }
    }
    requestAnimationFrame(step);
  }

  track.addEventListener('mouseenter', function() { paused = true; });
  track.addEventListener('mouseleave', function() { paused = false; });
  track.addEventListener('touchstart', function() { paused = true; });
  track.addEventListener('touchend', function() { setTimeout(function() { paused = false; }, 2000); });
  requestAnimationFrame(step);
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

// ===== WORKSHOP FORM =====
function selectType(btn) {
  document.querySelectorAll('.type-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('typeError').style.display = 'none';
}

function togglePill(btn) {
  btn.classList.toggle('active');
  document.getElementById('toolError').style.display = 'none';
}

function selectSkill(btn) {
  document.querySelectorAll('.skill-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('skillError').style.display = 'none';
}

function handleWorkshopSubmit(e) {
  e.preventDefault();

  var name = document.getElementById('wsName').value.trim();
  var email = document.getElementById('wsEmail').value.trim();
  var otherTool = document.getElementById('wsOtherTool').value.trim();
  var goal = document.getElementById('wsGoal').value.trim();

  // Collect selected tools
  var selectedTools = [];
  document.querySelectorAll('.tool-pill.active').forEach(function(pill) {
    selectedTools.push(pill.getAttribute('data-tool'));
  });
  if (otherTool) selectedTools.push(otherTool);

  // Collect workshop type
  var typeBtn = document.querySelector('.type-btn.active');
  var workshopType = typeBtn ? typeBtn.getAttribute('data-type') : '';

  // Collect skill level
  var skillBtn = document.querySelector('.skill-btn.active');
  var skillLevel = skillBtn ? skillBtn.getAttribute('data-level') : '';

  // Validate
  var valid = true;
  if (!workshopType) {
    document.getElementById('typeError').style.display = 'block';
    valid = false;
  }
  if (selectedTools.length === 0) {
    document.getElementById('toolError').style.display = 'block';
    valid = false;
  }
  if (!skillLevel) {
    document.getElementById('skillError').style.display = 'block';
    valid = false;
  }
  if (!valid) return false;

  var btn = document.getElementById('wsSubmitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Send to MailerLite (same list as waitlist signup)
  var formData = new FormData();
  formData.append('fields[email]', email);
  formData.append('fields[name]', name);
  formData.append('ml-submit', '1');
  formData.append('anticsrf', 'true');

  fetch('https://assets.mailerlite.com/jsonp/2211868/forms/183217235853051090/subscribe', {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
  }).then(function() {
    showWorkshopSuccess();
  }).catch(function() {
    showWorkshopSuccess();
  });

  // Log full details for review
  console.log('Workshop booking:', {
    name: name,
    email: email,
    workshopType: workshopType,
    tools: selectedTools,
    skillLevel: skillLevel,
    goal: goal,
    submittedAt: new Date().toISOString()
  });

  return false;
}

function showWorkshopSuccess() {
  document.getElementById('workshopForm').style.display = 'none';
  document.getElementById('workshopSuccess').style.display = 'block';
}

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
