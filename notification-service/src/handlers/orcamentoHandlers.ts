import { CANAIS, EventoOrcamento } from "../events/eventos";
import { enviarEmail, MensagemEmail } from "../services/emailService";
import { NovaNotificacao, salvarNotificacao } from "../services/notificacaoService";
import { logger } from "../utils/logger";

function montarNotificacao(evento: EventoOrcamento): NovaNotificacao | null {
  const { id, tipo, dados } = evento;
  const base = { eventoId: id, tipo, orcamentoId: dados.orcamentoId };

  switch (tipo) {
    case CANAIS.ORCAMENTO_CRIADO:
      return {
        ...base,
        destinatarioTipo: "ADMIN",
        destinatarioUserId: null,
        mensagem: `Novo orçamento #${dados.orcamentoId} solicitado por ${dados.clienteNome}`,
      };

    case CANAIS.ORCAMENTO_APROVADO:
      return {
        ...base,
        destinatarioTipo: "CLIENTE",
        destinatarioUserId: dados.clienteId,
        mensagem: `Seu orçamento #${dados.orcamentoId} foi aprovado`,
      };

    case CANAIS.ORCAMENTO_RECUSADO:
      return {
        ...base,
        destinatarioTipo: "CLIENTE",
        destinatarioUserId: dados.clienteId,
        mensagem: `Seu orçamento #${dados.orcamentoId} foi recusado`,
      };

    default:
      return null;
  }
}

function montarEmail(evento: EventoOrcamento): MensagemEmail | null {
  const { tipo, dados } = evento;

  switch (tipo) {
    case CANAIS.ORCAMENTO_CRIADO: {
      const emailAdmin = process.env.ADMIN_EMAIL;
      if (!emailAdmin) return null;

      return {
        para: emailAdmin,
        assunto: `Novo orçamento #${dados.orcamentoId}`,
        texto: `Olá,\n\nO orçamento #${dados.orcamentoId} foi solicitado por ${dados.clienteNome}. Acesse o painel para analisá-lo.\n\nRealiza Anti Chamas`,
      };
    }

    case CANAIS.ORCAMENTO_APROVADO:
      return {
        para: dados.clienteEmail,
        assunto: `Seu orçamento #${dados.orcamentoId} foi aprovado`,
        texto: `Olá, ${dados.clienteNome}!\n\nSeu orçamento #${dados.orcamentoId} foi aprovado. Acesse o site para ver os detalhes.\n\nRealiza Anti Chamas`,
      };

    case CANAIS.ORCAMENTO_RECUSADO:
      return {
        para: dados.clienteEmail,
        assunto: `Seu orçamento #${dados.orcamentoId} foi recusado`,
        texto: `Olá, ${dados.clienteNome}.\n\nSeu orçamento #${dados.orcamentoId} foi recusado. Acesse o site para ver os detalhes ou solicitar um novo orçamento.\n\nRealiza Anti Chamas`,
      };

    default:
      return null;
  }
}

// Uma falha no e-mail não pode impedir que o evento seja considerado processado
async function tentarEnviarEmail(evento: EventoOrcamento): Promise<void> {
  const email = montarEmail(evento);
  if (!email) return;

  try {
    await enviarEmail(email, evento.id);
  } catch (error) {
    logger.error("Falha ao enviar e-mail", {
      eventoId: evento.id,
      erro: (error as Error).message,
    });
  }
}

export async function processarEvento(evento: EventoOrcamento): Promise<void> {
  const notificacao = montarNotificacao(evento);

  if (!notificacao) {
    logger.warn("Tipo de evento desconhecido, ignorado", {
      eventoId: evento.id,
      tipo: evento.tipo,
    });
    return;
  }

  const salva = await salvarNotificacao(notificacao);

  if (salva) {
    logger.info("Notificação salva", {
      eventoId: evento.id,
      destinatario: notificacao.destinatarioTipo,
      orcamentoId: evento.dados.orcamentoId,
    });
    await tentarEnviarEmail(evento);
  } else {
    logger.warn("Evento duplicado ignorado", { eventoId: evento.id });
  }
}