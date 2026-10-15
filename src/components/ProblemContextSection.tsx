import { HeartPulse, Leaf } from "lucide-react";

export function ProblemContextSection() {
  return <section id="problema" className="section-band"><div className="container">
    <div className="section-heading"><small>00 / EL PROBLEMA</small><h2>¿Por qué el Cromo Hexavalente?</h2><p>El villano invisible de las aguas residuales de curtiembres, y la solución que propone la CECUV.</p></div>
    <div className="problem-grid">
      <article className="problem-card env">
        <div className="problem-top"><Leaf/><small>FICHA 1</small></div>
        <h3>🌿 Impacto Ambiental</h3>
        <ul>
          <li><b>Filtración en acuíferos:</b> el Cr(VI) es muy soluble y viaja con el agua hasta las fuentes subterráneas.</li>
          <li><b>Afectación de ríos:</b> los vertimientos sin tratar alteran la calidad del agua y la vida de los ecosistemas.</li>
          <li><b>Bioacumulación:</b> peces y organismos acuáticos lo acumulan y lo trasladan a la cadena alimentaria.</li>
        </ul>
        <div className="vs"><span className="bad">Villano: Cr(VI) soluble</span><span className="good">Solución: Cr(III) precipitable</span></div>
      </article>
      <article className="problem-card health">
        <div className="problem-top"><HeartPulse/><small>FICHA 2</small></div>
        <h3>🏥 Riesgos para la Salud Humana</h3>
        <ul>
          <li><b>Carcinógeno Grupo 1:</b> clasificado por la IARC/OMS como sustancia que causa cáncer en humanos.</li>
          <li><b>Lesiones cutáneas:</b> dermatitis, úlceras y alergias por contacto directo.</li>
          <li><b>Daño sistémico:</b> afecta riñones, hígado y vías respiratorias con exposición prolongada.</li>
        </ul>
        <div className="vs"><span className="bad">Antes: agua tóxica</span><span className="good">Después: agua tratada</span></div>
      </article>
    </div>
  </div></section>;
}
