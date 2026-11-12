import { Nav } from './components/Nav';
import { Hero } from './sections/Hero';
import { Sessao } from './sections/Sessao';
import { Manifesto } from './sections/Manifesto';
import { Trabalhos } from './sections/Trabalhos';
import { Sobre } from './sections/Sobre';
import { Estudio } from './sections/Estudio';
import { Processo } from './sections/Processo';
import { Agenda } from './sections/Agenda';
import { Cuidados } from './sections/Cuidados';
import { Localizacao } from './sections/Localizacao';
import { Contato } from './sections/Contato';
import { Rodape } from './sections/Rodape';

export function App() {
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="grao" aria-hidden="true" />
      <Nav />
      <main id="conteudo">
        <Hero />
        <Sessao />
        <Manifesto />
        <Trabalhos />
        <Sobre />
        <Estudio />
        <Processo />
        <Agenda />
        <Cuidados />
        <Localizacao />
        <Contato />
      </main>
      <Rodape />
    </>
  );
}
