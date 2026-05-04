import { demoUsers } from "../data/sampleData";
import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";
import { ROLES } from "../lib/permissions";

const STORAGE_KEY = "bugtrack-demo-user";

function findDemoUser(email, role) {
  return demoUsers.find((user) => user.email === email) || demoUsers.find((user) => user.role === role) || demoUsers[0];
}

async function getSupabaseProfile(user) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", user.id)
    .single();

  if (error) {
    return {
      id: user.id,
      name: user.email?.split("@")[0] || "Supabase User",
      email: user.email,
      role: ROLES.ENGINEER,
      avatar: "SU",
      profileWarning: "No profile row found. Defaulting to engineer for UI only.",
    };
  }

  return {
    ...data,
    email: data.email || user.email,
    avatar: data.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };
}

export async function getInitialUser() {
  if (hasSupabaseConfig) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) return getSupabaseProfile(data.session.user);
    return null;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

export async function signIn({ email, password, role }) {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return getSupabaseProfile(data.user);
  }

  const user = findDemoUser(email, role);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function signUp({ email, password, name }) {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw error;
    return data.user ? getSupabaseProfile(data.user) : null;
  }

  const user = {
    id: `usr-local-${Date.now()}`,
    name: name || email.split("@")[0],
    email,
    role: ROLES.ENGINEER,
    avatar: (name || email).slice(0, 2).toUpperCase(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function signOut() {
  if (hasSupabaseConfig) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(STORAGE_KEY);
}
