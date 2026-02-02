/**
 * Lógica de resposta do bot (texto/postback/quick_reply → resposta).
 * Ponto central para futura integração com IA ou regras mais complexas.
 */

/** Sugestões: título (Quick Reply, max 20 chars) e opcionalmente texto no entry (Ice Breaker). */
export interface SuggestedQuestion {
  title: string;
  payload: string;
  /** Texto no entry (Ice Breaker). Se não definir, usa title. */
  entryQuestion?: string;
}

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    title: 'Conversão 4x4',
    payload: 'conversao_4x4',
    entryQuestion: 'Quero converter meu veículo 4x2 para 4x4',
  },
  {
    title: 'Motorhome / off-road',
    payload: 'motorhome_offroad',
    entryQuestion: 'Quero saber sobre motorhome e adaptações off-road',
  },
  {
    title: 'Acessórios 4x4',
    payload: 'acessorios_4x4',
    entryQuestion: 'Quero saber sobre acessórios (snorkel, guincho, engate)',
  },
  {
    title: 'Falar c/ especialista',
    payload: 'especialista',
    entryQuestion: 'Quero falar com um especialista',
  },
];

export function getSuggestedQuestions(): SuggestedQuestion[] {
  return [...SUGGESTED_QUESTIONS];
}

/** Lista para Ice Breakers (entry): question = entryQuestion ou title. Máx. 4. */
export function getIceBreakerItems(): Array<{ question: string; payload: string }> {
  return SUGGESTED_QUESTIONS.slice(0, 4).map((q) => ({
    question: q.entryQuestion ?? q.title,
    payload: q.payload,
  }));
}

/** Mensagem de boas-vindas (quando enviamos sugestões junto). */
export const WELCOME_MESSAGE = 'Olá! Sou da Easy Four Engenharia. Escolha uma opção ou escreva sua dúvida que nossa equipe entra em contato com você.';

export function getReply(userText: string): string {
  const t = (userText ?? '').trim().toLowerCase();
  if (t === 'oi' || t === 'olá' || t === 'ola') return WELCOME_MESSAGE;
  if (t === 'ajuda')
    return 'Pode mandar sua dúvida ou escolher uma opção acima. Alguém da nossa equipe te retorna em breve.';
  // Payloads dos Ice Breakers / Quick Replies — todas levam ao contato com a equipe
  if (t === 'conversao_4x4')
    return 'Ótimo! Conte qual é seu veículo e objetivo (4x2 → 4x4). Um especialista da Easy Four entra em contato para te orientar.';
  if (t === 'motorhome_offroad')
    return 'Perfeito. Descreva seu projeto ou uso (motorhome, rally, aventura, resgate). Nossa equipe te retorna com as opções e valores.';
  if (t === 'acessorios_4x4')
    return 'Qual acessório te interessa? (snorkel, guincho, engate, adaptador, etc.) Um especialista entra em contato para detalhar e orçar.';
  if (t === 'especialista')
    return 'Descreva brevemente sua necessidade (veículo, uso, prazo). Um especialista da Easy Four te retorna em breve.';
  return 'Descreva o que você precisa ou escolha uma opção acima. Nossa equipe entra em contato com você.';
}
