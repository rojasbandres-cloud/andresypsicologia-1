/**
 * Clasificación y Catálogo de Trastornos y Problemas Clínicos DSM-5-TR
 * Estructurado para selección diagnóstica y orientación analítico-conductual en Psicogénesis.
 */

export interface DsmCategory {
  id: string;
  categoryName: string;
  description: string;
  disorders: string[];
}

export const DSM5_TR_CATEGORIES: DsmCategory[] = [
  {
    id: 'neurodesarrollo',
    categoryName: 'Trastornos del Neurodesarrollo',
    description: 'Afectación del desarrollo temprano, interacción social y habilidades adaptativas.',
    disorders: [
      'Trastorno del Espectro Autista (TEA)',
      'Trastorno por Déficit de Atención con Hiperactividad (TDAH)',
      'Trastornos de la Comunicación y del Lenguaje',
      'Trastornos Motores y Tics (Síndrome de Tourette / Tics Crónicos)',
      'Dificultades Específicas del Aprendizaje'
    ]
  },
  {
    id: 'ansiedad',
    categoryName: 'Trastornos de Ansiedad',
    description: 'Respuestas de evitación experiencial, hiperreactividad fisiológica y miedo condicionado.',
    disorders: [
      'Trastorno de Ansiedad Generalizada (TAG)',
      'Trastorno de Pánico y Crisis de Angustia',
      'Agorafobia',
      'Fobias Específicas (sangre/inyecciones, animales, alturas, etc.)',
      'Trastorno de Ansiedad Social (Fobia Social)',
      'Trastorno de Ansiedad por Separación'
    ]
  },
  {
    id: 'toc_relacionados',
    categoryName: 'Trastorno Obsesivo-Compulsivo y Relacionados',
    description: 'Patrones repetitivos y conductas de escape/neutralización funcional (EPR).',
    disorders: [
      'Trastorno Obsesivo-Compulsivo (TOC)',
      'Trastorno Dismórfico Corporal',
      'Tricotilomanía (Arrancarse el cabello)',
      'Trastorno por Excoriación (Dermatilomanía / Dañarse la piel)',
      'Trastorno de Acumulación'
    ]
  },
  {
    id: 'depresivos',
    categoryName: 'Trastornos Depresivos',
    description: 'Deprivación de reforzamiento positivo de fuentes estables (Activación Conductual).',
    disorders: [
      'Trastorno de Depresión Mayor (Episodio Único o Recurrente)',
      'Trastorno Depresivo Persistente (Distimia)',
      'Trastorno Disfórico Premenstrual',
      'Trastorno de Desregulación Perturbadora del Estado de Ánimo'
    ]
  },
  {
    id: 'trauma_estres',
    categoryName: 'Trastornos Relacionados con Traumas y Factores de Estrés',
    description: 'Condicionamiento aversivo, reactividad traumática y evitación contextual.',
    disorders: [
      'Trastorno de Estrés Postraumático (TEPT)',
      'Trastorno de Estrés Agudo',
      'Trastornos de Adaptación (con ansiedad, ánimo deprimido o mixto)'
    ]
  },
  {
    id: 'conducta_alimentaria',
    categoryName: 'Trastornos de la Conducta Alimentaria y de la Ingesta',
    description: 'Contingencias aversivas respecto a imagen corporal, ingesta y peso.',
    disorders: [
      'Anorexia Nerviosa',
      'Bulimia Nerviosa',
      'Trastorno por Atracón',
      'Trastorno de Evitación / Restricción de la Ingesta de Alimentos (ARFID)'
    ]
  },
  {
    id: 'sueno_vigilia',
    categoryName: 'Trastornos del Sueño-Vigilia',
    description: 'Condicionamiento contextual de activación en cama y control de estímulos del sueño.',
    disorders: [
      'Trastorno de Insomnio Crónico',
      'Trastorno de Hipersomnolencia',
      'Alteraciones del Ritmo Circadiano de Sueño-Vigilia'
    ]
  },
  {
    id: 'control_impulsos',
    categoryName: 'Trastornos Disruptivos y del Control de los Impulsos',
    description: 'Contingencias de coacción, dificultades en regulación de la conducta operante.',
    disorders: [
      'Trastorno Negativista Desafiante (TND)',
      'Trastorno de la Conducta',
      'Trastorno Explosivo Intermitente'
    ]
  },
  {
    id: 'personalidad',
    categoryName: 'Trastornos de la Personalidad',
    description: 'Repertorios conductuales inflexibles de afrontamiento interpersonal y emocional.',
    disorders: [
      'Trastorno de la Personalidad Límite (TLP / Desregulación Emocional Grave)',
      'Trastorno de la Personalidad Evasiva / Evitativa',
      'Trastorno de la Personalidad Dependiente',
      'Trastorno de la Personalidad Obsesivo-Compulsiva'
    ]
  },
  {
    id: 'somaticos',
    categoryName: 'Trastornos de Síntomas Somáticos y Relacionados',
    description: 'Refuerzo de conductas de queja médica y sensibilidad visceral aumentada.',
    disorders: [
      'Trastorno de Síntomas Somáticos (Dolor Crónico / Fibromialgia)',
      'Trastorno de Ansiedad por la Enfermedad (Preocupación Hipocondríaca)'
    ]
  },
  {
    id: 'bipolar',
    categoryName: 'Trastorno Bipolar y Relacionados',
    description: 'Oscilaciones del nivel de activación operante y regulación de rutinas estables.',
    disorders: [
      'Trastorno Bipolar Tipo I',
      'Trastorno Bipolar Tipo II',
      'Trastorno Ciclotímico'
    ]
  },
  {
    id: 'relacionales_conductuales',
    categoryName: 'Problemas de Relación y Otros Motivos Clínicos de Consulta',
    description: 'Contingencias en relaciones íntimas, pérdidas, procrastinación o transiciones vitales.',
    disorders: [
      'Conflictos de Pareja y Coerción Relacional',
      'Duelo Complicado y Pérdidas Afectivas Significativas',
      'Procrastinación Crónica y Bloqueos de Rendimiento Académico/Laboral',
      'Estrés Laboral Crónico y Síndrome de Desgaste (Burnout)',
      'Dificultades en Habilidades Sociales y Aislamiento Interpersonal'
    ]
  },
  {
    id: 'otro_motivo',
    categoryName: 'Otro Motivo de Consulta',
    description: 'Situaciones específicas que no se ajustan a las categorías anteriores.',
    disorders: [
      'Otro motivo (especificar en el mensaje)'
    ]
  }
];

export const ALL_DSM5_OPTIONS: string[] = DSM5_TR_CATEGORIES.flatMap(cat => cat.disorders);
