"use client";

import { useMemo, useState } from "react";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const NUM = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

function apenasDigitos(texto: string) {
  const d = texto.replace(/\D/g, "");
  return d ? Number(d) : 0;
}

type CampoProps = {
  rotulo: string;
  ajuda: string;
  valor: number;
  aoMudar: (v: number) => void;
  prefixo?: string;
  sufixo?: string;
};

function Campo({ rotulo, ajuda, valor, aoMudar, prefixo, sufixo }: CampoProps) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{rotulo}</span>
      <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
        {ajuda}
      </span>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-900">
        {prefixo && (
          <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
            {prefixo}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={NUM.format(valor)}
          onChange={(e) => aoMudar(apenasDigitos(e.target.value))}
          className="w-full bg-transparent text-right text-lg font-semibold tabular-nums outline-none"
        />
        {sufixo && (
          <span className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
            {sufixo}
          </span>
        )}
      </div>
    </label>
  );
}

function Resultado({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-zinc-200 py-3 last:border-0 dark:border-zinc-800">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{rotulo}</span>
      <span
        className={
          destaque
            ? "text-xl font-bold tabular-nums"
            : "text-base font-semibold tabular-nums"
        }
      >
        {valor}
      </span>
    </div>
  );
}

export default function Home() {
  const [vgv, setVgv] = useState(12_000_000);
  const [terreno, setTerreno] = useState(2_000_000);
  const [obra, setObra] = useState(6_500_000);
  const [despesasPct, setDespesasPct] = useState(18);

  const r = useMemo(() => {
    const despesas = (vgv * despesasPct) / 100;
    const custoTotal = terreno + obra + despesas;
    const lucro = vgv - custoTotal;
    const margem = vgv > 0 ? (lucro / vgv) * 100 : 0;
    const roi = custoTotal > 0 ? (lucro / custoTotal) * 100 : 0;
    return { despesas, custoTotal, lucro, margem, roi };
  }, [vgv, terreno, obra, despesasPct]);

  const veredito =
    r.margem >= 20
      ? {
          texto: "Viável",
          nota: "Margem dentro do patamar usual do setor.",
          cor: "bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800",
        }
      : r.margem >= 10
        ? {
            texto: "Atenção",
            nota: "Margem apertada. Sensível a atraso e a custo de obra.",
            cor: "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800",
          }
        : {
            texto: "Inviável",
            nota: "Margem abaixo do mínimo para absorver risco.",
            cor: "bg-red-50 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
          };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:py-16">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
          iajudite.com.br · ambiente de teste
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Viabilidade rápida
        </h1>
        <p className="mt-3 max-w-prose text-zinc-600 dark:text-zinc-400">
          Estimativa de margem e retorno de um empreendimento imobiliário.
          Os números recalculam conforme você digita.
        </p>
      </header>

      <section className="grid gap-5">
        <Campo
          rotulo="VGV"
          ajuda="Valor Geral de Vendas — receita total prevista"
          valor={vgv}
          aoMudar={setVgv}
          prefixo="R$"
        />
        <Campo
          rotulo="Custo do terreno"
          ajuda="Aquisição ou permuta avaliada a mercado"
          valor={terreno}
          aoMudar={setTerreno}
          prefixo="R$"
        />
        <Campo
          rotulo="Custo de obra"
          ajuda="Construção, projetos, licenças e infraestrutura"
          valor={obra}
          aoMudar={setObra}
          prefixo="R$"
        />
        <Campo
          rotulo="Despesas"
          ajuda="Comerciais, administrativas e tributos, sobre o VGV"
          valor={despesasPct}
          aoMudar={(v) => setDespesasPct(Math.min(v, 99))}
          sufixo="% do VGV"
        />
      </section>

      <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Resultado
        </h2>
        <Resultado rotulo="Despesas calculadas" valor={BRL.format(r.despesas)} />
        <Resultado rotulo="Custo total" valor={BRL.format(r.custoTotal)} />
        <Resultado rotulo="Lucro" valor={BRL.format(r.lucro)} destaque />
        <Resultado rotulo="Margem sobre o VGV" valor={`${r.margem.toFixed(1)}%`} destaque />
        <Resultado rotulo="Retorno sobre o custo" valor={`${r.roi.toFixed(1)}%`} />
      </section>

      <section className={`mt-5 rounded-2xl border p-5 ${veredito.cor}`}>
        <p className="text-lg font-bold">{veredito.texto}</p>
        <p className="mt-1 text-sm opacity-90">{veredito.nota}</p>
      </section>

      <footer className="mt-10 border-t border-zinc-200 pt-5 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Modelo simplificado, sem valor do dinheiro no tempo, cronograma
        físico-financeiro ou custo de capital. Serve para triagem inicial,
        não substitui o estudo de viabilidade completo.
      </footer>
    </main>
  );
}
