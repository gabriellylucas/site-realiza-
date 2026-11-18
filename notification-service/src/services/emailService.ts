import nodemailer, { Transporter } from "nodemailer";
import { logger } from "../utils/logger";

export interface MensagemEmail {
  para: string;
  assunto: string;
  texto: string;
}

let transporte: Transporter | null = null;
let modoTeste = false;

async function obterTransporte(): Promise<Transporter | null> {
  if (transporte) return transporte;

  const modo = process.env.EMAIL_MODE;

  // Modo de teste: caixa de e-mail falsa (Ethereal). Nada é entregue de verdade.
  if (modo === "teste") {
    const conta = await nodemailer.createTestAccount();

    transporte = nodemailer.createTransport({
      host: conta.smtp.host,
      port: conta.smtp.port,
      secure: conta.smtp.secure,
      auth: { user: conta.user, pass: conta.pass },
    });

    modoTeste = true;
    logger.info("E-mail em modo de teste (caixa falsa, nada é entregue de verdade)");
    return transporte;
  }

  // Modo SMTP: envio real, configurado pelo .env
  if (modo === "smtp" && process.env.SMTP_HOST) {
    transporte = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    return transporte;
  }

  return null;
}

export async function enviarEmail(mensagem: MensagemEmail, eventoId: string): Promise<void> {
  const transport = await obterTransporte();

  if (!transport) {
    logger.warn("Envio de e-mail desativado (EMAIL_MODE não configurado)", { eventoId });
    return;
  }

  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM || "Realiza Anti Chamas <notificacoes@realiza.local>",
    to: mensagem.para,
    subject: mensagem.assunto,
    text: mensagem.texto,
  });

  logger.info("E-mail enviado", {
    eventoId,
    destinatario: mensagem.para,
    ...(modoTeste ? { visualizar: nodemailer.getTestMessageUrl(info) } : {}),
  });
}