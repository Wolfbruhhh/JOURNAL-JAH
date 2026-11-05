import {createClient} from '../../../lib/supabase/server';
import {NextResponse} from 'next/server';
export async function GET(request:Request){const url=new URL(request.url),code=url.searchParams.get('code');if(code){const client=await createClient();const {error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL('/',url.origin));}return NextResponse.redirect(new URL('/login',url.origin));}
