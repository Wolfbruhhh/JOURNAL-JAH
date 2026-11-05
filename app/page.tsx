import {redirect} from 'next/navigation';
import {configured,createClient} from '../lib/supabase/server';
import Journal from './journal';
export const dynamic='force-dynamic';
export default async function Home(){
 if(!configured())return <main className="setup-page"><h1>JAH Journal is ready for setup.</h1><p>Connect one Supabase project to enable secure sign-in and the same journal on every device.</p><ol><li>Run <code>supabase/schema.sql</code> in your Supabase SQL Editor.</li><li>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in Vercel.</li><li>Set your deployed URL in Supabase Authentication → URL Configuration, then redeploy.</li></ol><p>Full instructions are in the repository README. Entries are never stored as a separate local-only journal.</p></main>;
 const client=await createClient();const {data:{user}}=await client.auth.getUser();if(!user)redirect('/login');return <Journal/>;
}
