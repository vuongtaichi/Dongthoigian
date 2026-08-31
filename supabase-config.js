/* ==========================================================================
   Supabase connection for the comments + reactions feature.

   Fill in the two values below with YOUR project's details:
     Supabase dashboard  ->  Project Settings  ->  API
       - "Project URL"            -> url
       - "anon" / "public" key    -> anonKey   (may be labelled "Publishable key")

   The anon key is DESIGNED to be public — it only allows what the Row Level
   Security policies in comments-setup.sql permit. It is safe to commit and to
   ship in this file.

   Until real values are filled in here, the comment / reaction UI stays
   completely hidden and the site behaves exactly as before. The published
   Claude Artifact never loads this file, so it is unaffected either way.
   ========================================================================== */

window.NKLTT_SUPABASE = {
  url: 'https://zjlkyacwgbqhbktcktql.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbGt5YWN3Z2JxaGJrdGNrdHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMjMyNTIsImV4cCI6MjEwMzY5OTI1Mn0.1mwuSRfmdzYnKroAF1bDRfHNyRqIFNItn_LBX4PEwiE'
};
