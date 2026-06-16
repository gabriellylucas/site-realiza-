

type BotaoProps = {
  texto: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function Botao({
  texto,
  onClick,
  type = "button",
  className = "",
}: BotaoProps) {
  return (
    <button type={type} onClick={onClick} className={className}>
      {texto}
    </button>
  );
}