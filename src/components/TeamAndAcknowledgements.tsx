import { GraduationCap, Heart, Quote } from "lucide-react";

import { researchTeam } from "@/lib/cecuv-team";
import placeholder from "@/assets/team-placeholder.svg";

export function TeamAndAcknowledgements() {
  return (
    <section id="equipo" className="section-band">
      <div className="container">
        <div className="section-heading">
          <small>04 / EQUIPO</small>
          <h2>Equipo Investigador</h2>
          <p>Semillero de Investigación OPENIN · Universidad Cooperativa de Colombia</p>
        </div>
        <div className="team-grid">
          {researchTeam.map(({ name, career, photoUrl, initials }) => (
            <article key={name} className="team-card">
              <div className="avatar team-photo">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`Foto de ${name}`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = placeholder;
                    }}
                  />
                ) : (
                  <span
                    className="team-initials"
                    role="img"
                    aria-label={`${name} — foto pendiente`}
                  >
                    {initials}
                  </span>
                )}
              </div>
              <h3>{name}</h3>
              <p>Estudiante de {career}</p>
              <p>UCC Campus Bogotá</p>
              <small>Semillero OPENIN</small>
            </article>
          ))}
        </div>

        <div className="ack-pair">
          <blockquote className="dedication-card">
            <div className="ack-title">
              <Heart /> <span>Dedicatoria</span>
            </div>
            <Quote className="quote-icon" />
            <p>
              "Este proyecto se consolida, en primer lugar, gracias a Dios por concedernos la
              sabiduría, la salud y la perseverancia en cada etapa de nuestra formación. Dedicamos
              de manera muy especial este logro a nuestras familias y a nuestros padres, quienes
              constituyen el motor principal de nuestras vidas, el motivo para seguir luchando día a
              día y la inspiración constante para alcanzar el éxito en cada uno de nuestros
              proyectos académicos y personales. Asimismo, dedicamos este nuevo triunfo con profundo
              amor y respeto a aquellos familiares que ya no están físicamente con nosotros, pero
              que desde el cielo nos acompañan; es gracias a su recuerdo, su fuerza y su bendición
              que hemos logrado llegar a este punto en nuestras vidas."
            </p>
          </blockquote>

          <div className="mentor-card">
            <div className="mentor-profile">
              <div className="avatar big">
                <GraduationCap />
              </div>
              <div>
                <h3>Pablo Elías Velásquez Perilla</h3>
                <p>Líder del Semillero de Investigación OPENIN</p>
                <p>Docente e Investigador · Universidad Cooperativa de Colombia (Campus Bogotá)</p>
              </div>
            </div>
            <p className="mentor-msg">
              "Expresamos nuestra profunda gratitud al Semillero de Investigación OPENIN de la
              Universidad Cooperativa de Colombia (Campus Bogotá) por brindarnos el espacio ideal
              para crecer académica, científica y profesionalmente. De manera muy especial,
              reconocemos y agradecemos a nuestro docente líder, Pablo Elías Velásquez Perilla, por
              su valiosa guía, mentoría incondicional y acompañamiento en cada una de las decisiones
              tomadas durante este proceso. Gracias, profesor, por permitirnos ser parte de este
              semillero donde hemos crecido tanto profesional como personalmente, y por guiarnos,
              aconsejarnos y apoyarnos no solo en las decisiones académicas, sino también en nuestro
              desarrollo de vida dentro de la investigación."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
