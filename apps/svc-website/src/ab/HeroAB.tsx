import React from "react"; import { enabled } from "../../../packages/ab/rollout";
export default function HeroAB(){ const uid="demo"; const B=enabled(uid,50);
  return B? <section className="py-16 text-center"><h1 className="text-4xl font-extrabold mb-3">Найдите идеальную площадку</h1><p>Сравните цены и забронируйте онлайн</p></section>
          : <section className="py-16 text-center"><h1 className="text-4xl font-extrabold mb-3">WeddingTech UZ</h1><p>Все для свадьбы в одном месте</p></section>;
}
