// Runtime configuration for the classroom-ai-assistant app.
//
// Keep LocalStorage as the default while Supabase integration is being tested.
// To test Supabase reads later, replace the placeholder values below and set:
// DATA_PROVIDER: "supabase"
//
// Browser query overrides are also supported:
//   ?provider=local
//   ?provider=supabase
//
// In a hosted deployment, generate this file from environment variables such as:
//   SUPABASE_URL
//   SUPABASE_ANON_KEY
window.ClassroomAIConfig = {
  PROJECT_NAME: "classroom-ai-assistant",
  DATA_PROVIDER: "local",
  SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
};
