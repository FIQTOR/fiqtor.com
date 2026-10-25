import { S } from '../data/site';
import { useLanguage } from '../lib/catalog';

/**
 * The four-step engagement (talk → plan → build → ship).
 *
 * Shared by the contact page and the homepage closing block: a first-time
 * client's biggest unspoken question is "what happens after I message you?",
 * so the same four answers have to appear wherever the invite to get in touch
 * does. `limit` lets the homepage show a shorter list if that ever helps.
 */
export function ProcessSteps({ limit }: { limit?: number }) {
  const { lang } = useLanguage();
  const steps = limit ? S.process.slice(0, limit) : S.process;

  return (
    <div className="prc">
      {steps.map((p) => (
        <div className="pr rv" key={p.title.en}>
          <h3>{p.title[lang]}</h3>
          <p>{p.desc[lang]}</p>
        </div>
      ))}
    </div>
  );
}
