import { createClient } from '@supabase/supabase-js'

// Use dummy values during build if env vars are not available
const supabaseUrl = "https://iiarlfgnthrktzrwykbg.supabase.co"
const supabaseAnonKey = "sb_publishable__DxHszC06ueFy-ZFlP65zQ_ZEnqDDoC"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
