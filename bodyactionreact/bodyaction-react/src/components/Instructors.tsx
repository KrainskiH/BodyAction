import React from 'react';

const Instructors: React.FC = () => {
  return (
    <section className="cards">
      <h2>Conheça Nossos Instrutores</h2>
      <div className="card-container">
        <div className="cardinstrutor">
          <img src="/assets/img/instrutor1.jfif" alt="Instrutor Lucas Silva" />
          <h3>Lucas Silva</h3>
          <p>Especialista em musculação e treinos funcionais, focado na evolução personalizada de cada aluno.</p>
        </div>
        <div className="cardinstrutor">
          <img src="/assets/img/instrutor2.webp" alt="Instrutora Ana Costa" />
          <h3>Ana Costa</h3>
          <p>Instrutora de aulas coletivas e HIIT, motivadora e dedicada ao bem-estar de todos.</p>
        </div>
        <div className="cardinstrutor">
          <img src="/assets/img/instrutor3.jfif" alt="Instrutor Rafael Mendes" />
          <h3>Rafael Mendes</h3>
          <p>Treinamento funcional e personal trainer para quem busca resultados rápidos e seguros.</p>
        </div>
      </div>
    </section>
  );
};

export default Instructors;
