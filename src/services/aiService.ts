import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const generateReportFromSources = async (reportType: string, sourcesContext: string) => {
  if (!apiKey) {
    throw new Error('Falta la clave API de Gemini. Por favor, crea un archivo .env en la raíz del proyecto y añade VITE_GEMINI_API_KEY=tu_clave_aqui');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Eres un analista experto en desarrollo de software, arquitectura de sistemas y diseño de productos digitales. 
Tu tarea es generar un documento de tipo: "${reportType}".

Aquí tienes la información y contexto recopilado de varias fuentes del usuario:
---
${sourcesContext || 'No hay fuentes seleccionadas. Usa tu conocimiento general para estructurar el documento ideal para un proyecto de software estándar.'}
---

Instrucciones:
1. Genera el "${reportType}" solicitado en formato Markdown.
2. Hazlo estructurado, profesional y muy completo.
3. Si el tipo de informe es "Informe Maestro", debe incluir el objetivo del proyecto, funcionalidades clave y próximos pasos.
4. Si es "Especificación Técnica", debe incluir la arquitectura sugerida, el stack tecnológico y los requisitos técnicos.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error generating report:', error);
    throw new Error(error.message || 'Error al conectar con la IA');
  }
};

export const chatWithBrain = async (message: string, historyMessages: {role: 'user' | 'assistant', content: string}[], sourcesContext: string) => {
  if (!apiKey) {
    throw new Error('Falta la clave API de Gemini. Añade VITE_GEMINI_API_KEY a tu archivo .env');
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: `Eres el "Cerebro Central", un asistente de IA para desarrollo de aplicaciones. 
Utiliza el siguiente contexto recopilado de las fuentes para ayudar al usuario con su aplicación:

CONTEXTO DE FUENTES:
${sourcesContext || 'Sin contexto específico.'}

Responde siempre en formato Markdown, de manera proactiva y profesional.`
  });

  const history = historyMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({ history });

  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error in chat:', error);
    throw new Error(error.message || 'Error al conectar con la IA');
  }
};

export const aiService = {
  generateTaskPrompt: (task: any, project: any, directives: any[]) => {
    return `
PROYECTO: ${project?.name}
DESCRIPCIÓN: ${project?.description}

DIRECTIVAS ACTIVAS:
${directives?.map(d => `- ${d.title}: ${d.description}`).join('\n')}

TAREA ACTUAL:
Título: ${task?.title}
Descripción: ${task?.description}

Genera el código o la solución necesaria para esta tarea respetando las directivas del proyecto.
`;
  }
};

export const searchSourcesWithAI = async (topic: string) => {
  if (!apiKey) {
    throw new Error('Falta la clave API de Gemini. Añade VITE_GEMINI_API_KEY a tu archivo .env');
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
Eres un motor de búsqueda experto. Devuelve exactamente 5 enlaces REALES Y EXISTENTES (artículos conocidos, documentación oficial, repositorios o hilos famosos) sobre: "${topic}".
Debes devolver un array JSON válido con la siguiente estructura:
[
  {
    "id": "gen_unico_1",
    "title": "Título del artículo",
    "url": "https://url-real-y-valida.com/...",
    "snippet": "Breve resumen descriptivo."
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Si Gemini devuelve markdown a pesar del mimeType (a veces pasa), lo limpiamos
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    }
    if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Error in AI search:', error);
    throw new Error(error.message || 'Error al conectar con la IA de Google.');
  }
};
