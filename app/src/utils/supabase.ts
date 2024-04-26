import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hlbqbkagiigpbobecfzr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsYnFia2FnaWlncGJvYmVjZnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNzc1NTksImV4cCI6MjAyOTY1MzU1OX0.8D4YpXuHhxRr1vHWGcts6umgd_hBc8asJZmzT9DE4Yg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
