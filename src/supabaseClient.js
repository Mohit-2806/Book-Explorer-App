import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zbyljhukpxzfkbvyuiyq.supabase.co";
const supabaseKey = "sb_publishable_5h94pNyJr42b-i8JCtokWg_f7uisqnr";

export const supabase = createClient(supabaseUrl, supabaseKey);