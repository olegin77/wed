import { hashPassword, verifyPassword } from "../packages/auth/password";
test("hash/verify", ()=>{ const h=hashPassword("x"); expect(verifyPassword("x",h)).toBe(true); });
