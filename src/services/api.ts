const API = import.meta.env.VITE_API_URL; // ← puerta abierta

void API; // prevent noUnusedLocals until used
// MOCKS S8
let gifts = [
  { id: crypto.randomUUID(), nombre: "Like Especial", costo: 0.5, puntos: 5 },
  { id: crypto.randomUUID(), nombre: "Super Regalo", costo: 2.99, puntos: 50 },
];

export const api = {
  // Auth mock: guarda en localStorage
  async login(email: string, _password: string) {
    const role = email.includes("+s") ? "streamer" : "espectador";
    const user = { email, role } as const;
    localStorage.setItem("user", JSON.stringify(user));
    return { token: "mock", user };
  },
  async register(email: string, _password: string) {
    return this.login(email, _password);
  },

  // Gifts mock
  async getGifts() { return gifts; },
  async createGift(g: Omit<typeof gifts[number], "id">) {
    const item = { ...g, id: crypto.randomUUID() };
    gifts = [item, ...gifts];
    return item;
  },
  async deleteGift(id: string) { gifts = gifts.filter(x => x.id !== id); },
};
