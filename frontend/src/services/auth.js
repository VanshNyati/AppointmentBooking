import { api } from "./api";

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  // { token, role }
  return data;
}

export async function register({ name, email, password }) {
  const { data } = await api.post("/register", { name, email, password });
  // { id, name, email, role }
  return data;
}
