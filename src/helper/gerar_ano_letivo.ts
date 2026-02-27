type AnoLetivoResult = {
  nome: string;
  valido: boolean;
  erro?: string;
};

export function gerarAnoLetivo(
  dataInicio: Date,
  dataFim: Date
): AnoLetivoResult {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  // 1️⃣ Verificar se as datas são válidas
  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return {
      nome: "",
      valido: false,
      erro: "Datas inválidas",
    };
  }

  // 2️⃣ Verificar ordem das datas
  if (fim <= inicio) {
    return {
      nome: "",
      valido: false,
      erro: "A data de fim deve ser maior que a data de início",
    };
  }

  const anoInicio = inicio.getFullYear();
  const anoFim = fim.getFullYear();

  // 3️⃣ Validar diferença de anos
  if (anoFim - anoInicio > 1) {
    return {
      nome: "",
      valido: false,
      erro: "Um ano letivo não pode ter mais de 1 ano de diferença",
    };
  }

  // 4️⃣ Gerar nome do ano letivo
  const nome =
    anoInicio === anoFim
      ? `${anoInicio}`
      : `${anoInicio}-${anoFim}`;

  return {
    nome,
    valido: true,
  };
}