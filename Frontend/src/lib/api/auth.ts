import { apiClient } from "./client";
import { User, PublicProfile, SessionInfo } from "@/types/auth";

export async function register(data: { email: string; username: string; password: string }): Promise<User> {
  const res = await apiClient.post<{ user: User }>("/auth/register", data);
  return res.data.user;
}

export async function login(data: { email: string; password: string }): Promise<User> {
  const res = await apiClient.post<{ user: User }>("/auth/login", data);
  return res.data.user;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<{ user: User }>("/users/me");
  return res.data.user;
}

export async function updateMe(data: {
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  websiteUrl?: string | null;
}): Promise<User> {
  const res = await apiClient.patch<{ user: User }>("/users/me", data);
  return res.data.user;
}

export async function deleteMe(password?: string): Promise<void> {
  await apiClient.delete("/users/me", { data: password ? { password } : {} });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post("/auth/password-reset/request", { email });
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<void> {
  await apiClient.post("/auth/password-reset/confirm", { token, newPassword });
}

export async function requestEmailVerification(): Promise<void> {
  await apiClient.post("/auth/verify-email/request");
}

export async function confirmEmailVerification(token: string): Promise<{ status: string; emailVerified: boolean }> {
  const res = await apiClient.post<{ status: string; emailVerified: boolean }>("/auth/verify-email/confirm", { token });
  return res.data;
}

export async function listSessions(): Promise<SessionInfo[]> {
  const res = await apiClient.get<{ data: SessionInfo[] }>("/users/me/sessions");
  return res.data.data;
}

export async function revokeSession(id: string): Promise<void> {
  await apiClient.delete(`/users/me/sessions/${id}`);
}

export async function revokeAllSessions(): Promise<{ revoked: number }> {
  const res = await apiClient.delete<{ revoked: number }>("/users/me/sessions");
  return res.data;
}

export async function getPublicProfile(username: string): Promise<PublicProfile> {
  const res = await apiClient.get<{ profile: PublicProfile }>(`/users/${username}`);
  return res.data.profile;
}
