import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bpmasqikmimzviugmrvp.supabase.co"
const supabaseKey = "sb_publishable_9m0mpqG0RBtWngvJWbRSVw_GBy3U61m"

export const supabase = createClient(supabaseUrl, supabaseKey)
