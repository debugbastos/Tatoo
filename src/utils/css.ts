import type { CSSProperties } from 'react';

/** Estilo com variáveis CSS (`--d`, `--i`…), tipado para o React. */
export const cssVars = (vars: Record<`--${string}`, string | number>): CSSProperties => vars as CSSProperties;
