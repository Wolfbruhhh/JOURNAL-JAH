import {createClient} from '../../../lib/supabase/server';
import {NextResponse} from 'next/server';
export async function POST(request:Request){const origin=new URL(request.url).origin;if(request.headers.get('origin')!==origin)return new Response('Invalid origin',{status:403});const client=await createClient();await client.auth.signOut({scope:'local'});return NextResponse.redirect(new URL('/login',origin),303);}
