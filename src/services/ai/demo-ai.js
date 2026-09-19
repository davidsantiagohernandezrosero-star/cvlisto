/** Demo adapter. Replace these functions with an API client when an LLM provider is configured. */
export const demoAi = {
  professionalProfile(role, experienceLevel) {
    const normalizedRole = role.toLowerCase();
    const focus = /producci[oó]n|operario|bodega|log[ií]stica/.test(normalizedRole) ? 'el área de producción, el cumplimiento de procedimientos y la calidad' : /administrativ|recepci[oó]n|asistente/.test(normalizedRole) ? 'la organización de información, el servicio y el apoyo administrativo' : /venta|comercial|asesor|cliente/.test(normalizedRole) ? 'la atención al cliente, la comunicación y el logro de objetivos comerciales' : /tecnolog|sistemas|soporte/.test(normalizedRole) ? 'el soporte tecnológico, la solución de problemas y el aprendizaje continuo' : 'el cumplimiento de objetivos, el trabajo en equipo y el aprendizaje continuo';
    const starting = experienceLevel === 'sin-experiencia';
    return {
      text: starting ? `Persona responsable, comprometida y orientada a ${focus}, interesada en desarrollarse como ${role}. Cuenta con disposición para aprender, aportar al equipo y asumir sus responsabilidades con actitud profesional.` : `Profesional con experiencia en crecimiento, orientado(a) a ${focus}. Busca aportar sus capacidades como ${role}, trabajar de forma responsable y contribuir a los resultados del equipo.`,
      noExperienceNote: `Perfil orientado a ${role}. Sus estudios, cursos y habilidades demuestran disposición para aprender, adaptarse y contribuir desde el inicio.`
    };
  },
  cvTips(data) {
    const tips = ['Adapta el título y el perfil profesional al cargo específico de cada vacante.', 'Revisa la ortografía y mantén la hoja de vida en una o dos páginas.'];
    if (!data.email.includes('@') || /apodo|gamer|lol/i.test(data.email)) tips.unshift('Usa un correo profesional que incluya tu nombre.');
    if (!data.skills.length) tips.unshift('Agrega habilidades relacionadas con el puesto al que quieres aplicar.');
    if (data.experienceLevel === 'sin-experiencia') tips.unshift('Destaca tus estudios, cursos, proyectos académicos y habilidades transferibles.');
    return tips.slice(0, 5);
  },
  async analyzeCv(text) {
    await delay();
    const hasSkills = /habilidad|excel|word|servicio|ventas|ingl[eé]s/i.test(text);
    return {
      analysis: [
        { title: 'Perfil profesional', status: '⚠️', text: 'Puede ser más específico: menciona tu cargo objetivo y un aporte concreto.' },
        { title: 'Experiencia', status: '✅', text: 'Tiene información relevante. Prioriza logros y resultados cuando sea posible.' },
        { title: 'Habilidades', status: hasSkills ? '✅' : '⚠️', text: hasSkills ? 'Incluye habilidades útiles para tu postulación.' : 'Agrega habilidades técnicas y herramientas que conoces.' },
        { title: 'Presentación', status: '⚠️', text: 'Usa frases directas, verbos de acción y revisa la ortografía antes de enviarla.' }
      ],
      improved: `PERFIL PROFESIONAL\nProfesional orientado(a) a resultados, con interés en aportar organización, compromiso y una excelente actitud de servicio. Busco una oportunidad para aplicar mis habilidades y continuar desarrollándome.\n\nEXPERIENCIA Y FORMACIÓN\n${text.trim()}\n\nHABILIDADES DESTACADAS\nComunicación efectiva · Organización · Trabajo en equipo · Atención al detalle`
    };
  },
  async interviewQuestions(role) {
    await delay();
    const name = role.trim();
    return [
      ['Háblame sobre ti.', `Soy una persona responsable y con interés en desarrollarme como ${name}. Me caracterizan mi disposición para aprender, mi organización y mi compromiso con los objetivos del equipo.`, 'Conecta tu experiencia o estudios con el cargo. Mantén la respuesta en menos de un minuto.'],
      ['¿Por qué quieres trabajar con nosotros?', 'Me interesa una empresa donde pueda aportar mis capacidades, aprender y crecer profesionalmente. También me motiva que el cargo se relaciona con lo que quiero desarrollar.', 'Menciona un dato real de la empresa que hayas investigado antes de la entrevista.'],
      ['¿Cuáles son tus fortalezas?', 'Destaco mi responsabilidad, capacidad para aprender rápido y buena comunicación con las personas.', 'Elige dos fortalezas y respáldalas con un ejemplo breve.'],
      ['¿Cuál es una debilidad que estás trabajando?', 'Estoy trabajando en mejorar mi seguridad al hablar en público; por eso practico preparando mis ideas y participando más activamente.', 'Evita decir que no tienes debilidades. Explica siempre cómo la estás mejorando.'],
      ['¿Por qué deberíamos contratarte?', `Porque tengo la actitud, el compromiso y las ganas de aprender para aportar como ${name}. Estoy dispuesto(a) a asumir responsabilidades y a trabajar en equipo para lograr buenos resultados.`, 'Une tus fortalezas con una necesidad concreta del cargo.']
    ].map(([question, answer, tip]) => ({ question, answer, tip }));
  }
};
function delay(){ return new Promise(resolve => setTimeout(resolve, 550)); }
