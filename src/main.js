import { demoAi } from './services/ai/demo-ai.js';
import { experienceTemplate, cvTemplate, escapeHtml } from './components/templates.js';

const $ = (selector) => document.querySelector(selector);
let experienceCount = 0;
const showMessage = (selector, message, success = false) => { const el = $(selector); el.textContent = message; el.classList.toggle('success', success); };
const copyContent = async (id) => { const text = $('#' + id).innerText; try { await navigator.clipboard.writeText(text); alert('Copiado al portapapeles.'); } catch { alert('Selecciona el texto y cópialo manualmente.'); } };

$('#year').textContent = new Date().getFullYear();
$('#menu-toggle').addEventListener('click', () => { const nav = $('#main-nav'); nav.classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded', nav.classList.contains('open')); });
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => $('#main-nav').classList.remove('open')));
function addExperience() { experienceCount++; $('#experience-list').insertAdjacentHTML('beforeend', experienceTemplate(experienceCount)); }
addExperience();
$('#add-experience').addEventListener('click', addExperience);
$('#experience-list').addEventListener('click', (event) => { if (event.target.matches('.remove-experience')) event.target.closest('[data-experience]').remove(); });

$('#cv-form').addEventListener('submit', (event) => {
  event.preventDefault(); const form = event.currentTarget;
  if (!form.checkValidity()) { showMessage('#cv-form-message', 'Completa los campos obligatorios y revisa tu correo electrónico.'); form.reportValidity(); return; }
  showMessage('#cv-form-message', 'Tu hoja de vida está lista.', true);
  const data = Object.fromEntries(new FormData(form));
  const experiences = [...document.querySelectorAll('[data-experience]')].map(item => ({ company: item.querySelector('[name^="company-"]').value, job: item.querySelector('[name^="job-"]').value, start: item.querySelector('[name^="start-"]').value, end: item.querySelector('[name^="end-"]').value, tasks: item.querySelector('[name^="tasks-"]').value }));
  $('#cv-output').innerHTML = cvTemplate(data, experiences); $('#cv-result').classList.remove('hidden'); $('#cv-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.addEventListener('click', event => { const copy = event.target.closest('[data-copy]'); if (copy) copyContent(copy.dataset.copy); if (event.target.closest('[data-edit-cv]')) $('#cv-form').scrollIntoView({ behavior: 'smooth', block: 'start' }); });

$('#improve-form').addEventListener('submit', async event => {
  event.preventDefault(); const text = $('#cv-text').value.trim(); if (!text) { showMessage('#improve-message', 'Pega el texto de tu hoja de vida para analizarlo.'); return; }
  const button = event.currentTarget.querySelector('button'); button.disabled = true; button.textContent = 'Analizando…'; showMessage('#improve-message', '');
  try { const result = await demoAi.analyzeCv(text); $('#analysis-list').innerHTML = result.analysis.map(item => `<article class="analysis-item"><b>${item.status} ${item.title}</b><p>${item.text}</p></article>`).join(''); $('#improved-output').textContent = result.improved; $('#improve-result').classList.remove('hidden'); } catch { showMessage('#improve-message', 'No pudimos analizar tu CV. Inténtalo nuevamente.'); } finally { button.disabled = false; button.textContent = '🔍 Analizar mi CV'; }
});
$('#interview-form').addEventListener('submit', async event => {
  event.preventDefault(); const role = $('#interview-role').value.trim(); if (!role) { showMessage('#interview-message', 'Escribe el cargo al que aspiras.'); return; }
  const button = event.currentTarget.querySelector('button'); button.disabled = true; button.textContent = 'Preparando…'; showMessage('#interview-message', '');
  try { const questions = await demoAi.interviewQuestions(role); $('#role-output').textContent = role; $('#questions-list').innerHTML = questions.map(q => `<article class="question-card"><h3>${escapeHtml(q.question)}</h3><p><strong>Respuesta sugerida:</strong> ${escapeHtml(q.answer)}</p><p><strong>Consejo:</strong> ${escapeHtml(q.tip)}</p></article>`).join(''); $('#interview-result').classList.remove('hidden'); } catch { showMessage('#interview-message', 'No pudimos preparar las preguntas. Inténtalo nuevamente.'); } finally { button.disabled = false; button.textContent = '🎤 Preparar entrevista'; }
});
