import { useEffect, useRef, useState } from "react";
import { Atom, Bot, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { answerQuestion } from "@/lib/cecuv-knowledge";

type ChatTurn = { role: "user" | "bot"; text: string; topics?: string[] };

const quickPrompts = [
  "💡 ¿Cómo funciona el interlock?",
  "👨‍🔬 ¿Quiénes integran el semillero OPENIN?",
  "⏱️ ¿Cuánto tarda la descontaminación?",
];
const botChips = [
  "¿Por qué el Cr(VI) es peligroso?",
  "Simular reacción TiO₂ + UV-A",
  "¿Cómo funciona el Interlock?",
  "Sensores ESP32 / DHT22",
  "¿Cuál es la ventaja económica?",
  "Metodología del ensayo",
];

function BotAnswer({ text, animate }: { text: string; animate: boolean }) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) {
      setShown(text.length);
      return;
    }
    setShown(0);
    let n = 0;
    const id = setInterval(() => {
      n += 6;
      setShown(Math.min(n, text.length));
      if (n >= text.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text, animate]);
  const visible = text.slice(0, shown);
  const paragraphs = visible.split("\n\n");
  return (
    <>
      {paragraphs.map((para, pi) => {
        const parts = para.split(/(?<=[.:])\s+(?=[A-ZÁÉÍÓÚÑ¿])/).filter(Boolean);
        if (parts.length < 2) return <p key={pi}>{para}</p>;
        return (
          <ul key={pi} className="bot-bullets">
            {parts.map((s, si) => (
              <li key={si}>
                <CheckCircle2 />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        );
      })}
      {shown < text.length && <span className="bot-caret" />}
    </>
  );
}

export function CecuvChatbot() {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chat, setChat] = useState<ChatTurn[]>([
    {
      role: "bot",
      text: "Hola, soy CECUV—Bot v2.0. Consulto la matriz de conocimiento del trabajo escrito del Semillero OPENIN. Pregúnteme sobre Cr(VI), fotocatálisis, sensores ESP32/DHT22, costos o metodología.",
    },
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, thinking]);

  function send(question: string) {
    const q = question.trim();
    if (!q || thinking) return;
    setChat((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const reply = answerQuestion(q);
      setChat((prev) => [...prev, { role: "bot", text: reply.text, topics: reply.topics }]);
      setThinking(false);
    }, 650);
  }

  return (
    <div className="bot-panel bot-v2">
      <div className="bot-head">
        <span className="bot-avatar">
          <Bot />
        </span>
        <div>
          <h3>CECUV—Bot v2.0</h3>
          <small className="bot-online">
            <i /> MATRIZ OPENIN
          </small>
        </div>
        <em className="bot-tag">Semillero OPENIN</em>
      </div>
      <div className="bot-log" ref={logRef} aria-live="polite">
        {chat.map((turn, i) =>
          turn.role === "user" ? (
            <div key={i} className="bot-turn user">
              <p>{turn.text}</p>
            </div>
          ) : (
            <div key={i} className="bot-turn">
              <span className="bot-icon">
                <Sparkles />
              </span>
              <div className="bot-bubble">
                <BotAnswer text={turn.text} animate={i > 0 && i === chat.length - 1} />
                {turn.topics && turn.topics.length > 0 && (
                  <div className="bot-topics">
                    {turn.topics.map((t) => (
                      <span key={t}>
                        <Atom /> {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
        {thinking && (
          <div className="bot-turn">
            <span className="bot-icon">
              <Sparkles />
            </span>
            <div className="bot-bubble bot-typing">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
      <div className="bot-prompts bot-quick">
        {quickPrompts.map((p) => (
          <Button
            variant="outline"
            key={p}
            type="button"
            disabled={thinking}
            onClick={() => send(p.replace(/^\S+\s/, ""))}
          >
            {p}
          </Button>
        ))}
      </div>
      <div className="bot-prompts">
        {botChips.map((p) => (
          <Button
            variant="outline"
            key={p}
            type="button"
            onClick={() => {
              setInput(p);
              inputRef.current?.focus();
            }}
          >
            {p}
          </Button>
        ))}
      </div>
      <form
        className="bot-form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escriba su pregunta…"
          aria-label="Pregunta para CECUV-Bot"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Enviar pregunta"
          disabled={thinking || !input.trim()}
        >
          <ChevronRight />
        </Button>
      </form>
    </div>
  );
}
