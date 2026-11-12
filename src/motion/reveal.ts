/**
 * Revelações na entrada da tela: um IntersectionObserver compartilhado adiciona `.is-in`
 * aos elementos registrados (uma vez só). O CSS em base.css faz o resto
 * ([data-fade], [data-clip], .mask).
 */
let io: IntersectionObserver | null = null;

function observador(): IntersectionObserver {
  if (!io) {
    io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io?.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
  }
  return io;
}

/** Ref callback (React 19): `ref={revelar}`. */
export function revelar(el: Element | null): (() => void) | void {
  if (!el) return;
  if (typeof IntersectionObserver === 'undefined') {
    el.classList.add('is-in');
    return;
  }
  const o = observador();
  o.observe(el);
  return () => o.unobserve(el);
}
