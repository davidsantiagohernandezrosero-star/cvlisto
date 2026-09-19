import { demoAi } from './services/ai/demo-ai.js';
import { experienceTemplate, repeaterTemplate, cvTemplate, tipsTemplate, escapeHtml } from './components/templates.js';

const $ = (selector) => document.querySelector(selector);
const showMessage = (selector, message, success = false) => { const el = $(selector); el.textContent = message; el.classList.toggle('success', success); };
const copyContent = async (id) => { try { await navigator.clipboard.writeText($('#' + id).innerText); alert('El texto se copió al portapapeles.'); } catch { alert('No pudimos copiar automáticamente. Selecciona el texto y cópialo manualmente.'); } };
let experienceCount = 0, skillCount = 0, languageCount = 0, courseCount = 0;

$('#year').textContent = new Date().getFullYear();
$('#menu-toggle').addEventListener('click', () => { const nav = $('#main-nav'); nav.classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded', String(nav.classList.contains('open'))); });
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => $('#main-nav').classList.remove('open')));
function addExperience() { experienceCount++; $('#experience-list').insertAdjacentHTML('beforeend', experienceTemplate(experienceCount)); }
function addRepeater(type) { const counters = { skill: () => ++skillCount, language: () => ++languageCount, course: () => ++courseCount }; $(`#${type}-list`).insertAdjacentHTML('beforeend', repeaterTemplate(type, counters[type]())); }
$('#add-experience').addEventListener('click', addExperience);
$('#add-skill').addEventListener('click', () => addRepeater('skill'));
$('#add-language').addEventListener('click', () => addRepeater('language'));
$('#add-course').addEventListener('click', () => addRepeater('course'));
['#experience-list', '#skill-list', '#language-list', '#course-list'].forEach(id => $(id).addEventListener('click', event => { if (event.target.matches('.remove-experience,.remove-repeater')) event.target.closest('[data-experience],[data-skill],[data-language],[data-course]').remove(); }));
addRepeater('skill'); addRepeater('language'); addRepeater('course');

function values(selector, field) { return [...document.querySelectorAll(selector)].map(item => item.querySelector(`[name^="${field}-"]`)?.value.trim()).filter(Boolean); }
function formData(form) {
  const data = Object.fromEntries(new FormData(form));
  data.skills = values('[data-skill]', 'skill');
  data.languages = [...document.querySelectorAll('[data-language]')].map(item => { const language = item.querySelector('[name^="language-"]').value.trim(); const level = item.querySelector('[name^="language-level-"]').value; return language ? `${language}${level ? ` (${level})` : ''}` : ''; }).filter(Boolean);
  data.courses = values('[data-course]', 'course');
  return data;
}
function experiences() { return [...document.querySelectorAll('[data-experience]')].map(item => ({ job: item.querySelector('[name^="job-"]').value, company: item.querySelector('[name^="company-"]').value, city: item.querySelector('[name^="work-city-"]').value, start: item.querySelector('[name^="start-"]').value, end: item.querySelector('[name^="end-"]').value, current: item.querySelector('[name^="current-"]').checked, tasks: item.querySelector('[name^="tasks-"]').value })); }

$('#cv-form').addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget;
  if (!form.checkValidity()) { showMessage('#cv-form-message', 'Completa tu nombre, ciudad, correo electrónico, cargo deseado y nivel de experiencia.'); form.reportValidity(); return; }
  const data = formData(form); const profile = demoAi.professionalProfile(data.role, data.experienceLevel);
  $('#cv-output').innerHTML = cvTemplate(data, experiences(), profile);
  $('#cv-tips').innerHTML = tipsTemplate(demoAi.cvTips(data));
  showMessage('#cv-form-message', 'Tu hoja de vida fue creada correctamente.', true);
  $('#cv-result').classList.remove('hidden'); $('#cv-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.addEventListener('click', event => {
  const copy = event.target.closest('[data-copy]'); if (copy) copyContent(copy.dataset.copy);
  if (event.target.closest('[data-edit-cv]')) $('#cv-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (event.target.closest('[data-pdf]')) { $('#pdf-message').textContent = 'La descarga en PDF estará disponible próximamente.'; }
  if (event.target.closest('[data-new-cv]')) { const form = $('#cv-form'); form.reset(); $('#experience-list').innerHTML = ''; $('#skill-list').innerHTML = ''; $('#language-list').innerHTML = ''; $('#course-list').innerHTML = ''; addRepeater('skill'); addRepeater('language'); addRepeater('course'); $('#cv-result').classList.add('hidden'); showMessage('#cv-form-message', 'Puedes crear una nueva hoja de vida.', true); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});

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
