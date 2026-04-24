"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const business_name = formData.get("business_name") as string;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    redirect("/register?error=signup_failed");
  }

  // Seed the businesses row for this user
  await supabase.from("businesses").insert({
    owner_id: data.user.id,
    name: business_name,
    delay_hours: 24,
  });

  redirect("/dashboard");
}
