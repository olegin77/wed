import { score } from "../apps/svc-catalog/src/rank/score";
test("score weights", ()=>{ expect(score({conv:0.4,rating:0.8,profile:1,calendar:1})).toBeCloseTo(0.5*0.4+0.2*0.8+0.2*1+0.1*1); });
