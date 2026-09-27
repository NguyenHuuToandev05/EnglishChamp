import apiClient from "./client";

export interface LoginResponse {
    token: string;
    user: { id: string; username: string; email: string; eloRating: number };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>("/auth/login", { email, password });
    return res.data;
}

export async function register(username: string, email: string, password: string) {
    const res = await apiClient.post("/auth/register", { username, email, password });
    return res.data;
}