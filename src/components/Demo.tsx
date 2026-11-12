/** Selo para conteúdo demonstrativo, que o estúdio ainda precisa confirmar. */
export function Demo({ texto = 'Demonstrativo' }: { texto?: string }) {
  return (
    <span className="demo" title="Conteúdo de exemplo: confirmar com o Thalles antes de publicar">
      {texto}
    </span>
  );
}
