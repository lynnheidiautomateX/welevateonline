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
