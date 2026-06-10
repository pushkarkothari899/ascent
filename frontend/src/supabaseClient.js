import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://nrzcakmcqvrkysmcnxnr.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TOR6FgVqCmSHNREr36zJOA_c8OjNiZn"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)