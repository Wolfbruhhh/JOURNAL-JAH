import {redirect} from 'next/navigation';
import {configured,createClient} from '../../lib/supabase/server';
import LoginForm from './login-form';
export const dynamic='force-dynamic';
export default async function Login(){if(!configured())redirect('/');const client=await createClient();const {data:{user}}=await client.auth.getUser();if(user)redirect('/');return <LoginForm/>;}
