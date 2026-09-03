import multer from "multer";
import path from "path";
import crypto from "crypto";
import { Request } from "express";

const EXTENSOES_PERMITIDAS = [".jpg", ".jpeg", ".png"];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    // Gera um nome único (evita colisão de nomes)
    const nomeUnico = crypto.randomUUID();
    const extensao = path.extname(file.originalname).toLowerCase();
    cb(null, `${nomeUnico}${extensao}`);
  },
});

function filtroDeArquivo(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const extensao = path.extname(file.originalname).toLowerCase();

  if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
    return cb(new Error("Formato de arquivo não permitido. Use JPG ou PNG."));
  }

  cb(null, true);
}

export const uploadFoto = multer({
  storage,
  fileFilter: filtroDeArquivo,
  limits: {
    fileSize: TAMANHO_MAXIMO,
  },
});