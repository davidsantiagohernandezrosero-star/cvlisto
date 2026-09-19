export function experienceTemplate(index) {
  return `<div class="experience-item" data-experience><button type="button" class="remove-experience" aria-label="Eliminar experiencia">Eliminar</button><div class="form-grid"><label>Cargo<input name="job-${index}" placeholder="Ej. Auxiliar administrativo" /></label><label>Empresa<input name="company-${index}" placeholder="Ej. Empresa S.A.S." /></label><label>Ciudad<input name="work-city-${index}" placeholder="Ej. Bogotá" /></label><label>Fecha de inicio<input name="start-${index}" placeholder="Ej. Enero 2024" /></label><label>Fecha de finalización<input name="end-${index}" placeholder="Ej. Actualidad" /></label><label class="span-all"><span><input type="checkbox" name="current-${index}" /> Actualmente trabajo aquí</span></label><label class="span-all">Descripción<textarea name="tasks-${index}" placeholder="Describe tus funciones, responsabilidades o logros."></textarea></label></div></div>`;
}
export function repeaterTemplate(type, index) {
  const fields = {
    skill: `<label>Habilidad<input name="skill-${index}" placeholder="Ej. Excel" /></label>`,
    language: `<label>Idioma<input name="language-${index}" placeholder="Ej. Inglés" /></label><label>Nivel<select name="language-level-${index}"><option value="">Selecciona nivel</option><option>Básico</option><option>Intermedio</option><option>Avanzado</option><option>Nativo</option></select></label>`,
    course: `<label>Curso o certificación<input name="course-${index}" placeholder="Ej. Excel básico - SENA" /></label>`
  };
  return `<div class="repeater-item" data-${type}><button type="button" class="remove-repeater" aria-label="Eliminar">Eliminar</button><div class="form-grid">${fields[type]}</div></div>`;
}
export function cvTemplate(data, experiences, profile) {
  const contact = [data.city, data.phone, data.email, data.linkedin].filter(Boolean).map(escapeHtml).join(' · ');
  const education = [data.educationLevel, data.institution, data.educationYear].filter(Boolean).map(escapeHtml).join(' · ');
  const experienceItems = experiences.filter(item => item.company || item.job || item.tasks);
  const experienceHtml = experienceItems.map(item => `<div><p class="item-title">${escapeHtml(item.job || 'Experiencia profesional')}${item.company ? ` — ${escapeHtml(item.company)}` : ''}</p><p class="contact">${escapeHtml([item.city, item.start, item.current ? 'Actualidad' : item.end].filter(Boolean).join(' · '))}</p>${item.tasks ? `<p>${escapeHtml(item.tasks)}</p>` : ''}</div>`).join('');
  const noExperience = data.experienceLevel === 'sin-experiencia' && !experienceItems.length ? `<h3>Perfil sin experiencia laboral</h3><p>${escapeHtml(profile.noExperienceNote)}</p>` : '';
  const list = (items) => items.length ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
  return `<h2>${escapeHtml(data.name)}</h2><p class="contact">${contact}</p><p class="cv-role">${escapeHtml(data.role)}</p><h3>Perfil profesional</h3><p>${escapeHtml(profile.text)}</p>${experienceHtml ? `<h3>Experiencia</h3>${experienceHtml}` : ''}${noExperience}${education ? `<h3>Educación</h3><p>${education}</p>` : ''}${data.skills.length ? `<h3>Habilidades</h3>${list(data.skills)}` : ''}${data.languages.length ? `<h3>Idiomas</h3>${list(data.languages)}` : ''}${data.courses.length ? `<h3>Cursos y certificaciones</h3>${list(data.courses)}` : ''}`;
}
export function tipsTemplate(tips) { return `<h3>Consejos para mejorar tu hoja de vida</h3><ul>${tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}</ul>`; }
export function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;' }[char])); }
