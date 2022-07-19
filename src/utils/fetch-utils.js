import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getLevel(level) {
  const { data, error } = await supabase.from('Levels').select('tileColumns[]').match({Name: level});
  // console.log(JSON.parse(data[0].tileColumns[0][0]).id);
  return data[0].tileColumns;
}

export async function saveLevel(level, array) {
  const { resp, error } = await supabase.from('Levels').insert([{ Name: `${level}`, tileColumns: array }])
  resp ? console.log(resp) : console.log(error);
}