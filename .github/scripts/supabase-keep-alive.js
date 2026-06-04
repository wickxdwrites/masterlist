import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const sharedListId = process.env.SHARED_LIST_ID

if (!supabaseUrl || !supabaseAnonKey || !sharedListId) {
  console.error('Missing required environment variables. Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SHARED_LIST_ID.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  const { data, error } = await supabase
    .from('shared_lists')
    .select('list_id')
    .eq('list_id', sharedListId)
    .maybeSingle()

  if (error) {
    console.error('Supabase keep-alive query failed:', error.message || error)
    process.exit(1)
  }

  if (data) {
    console.log(`Supabase ping succeeded for shared_lists row: ${sharedListId}`)
  } else {
    console.log(`Supabase ping succeeded, no row found for ${sharedListId}. The DB connection still worked.`)
  }
}

main().catch((err) => {
  console.error('Unexpected error while pinging Supabase:', err)
  process.exit(1)
})
