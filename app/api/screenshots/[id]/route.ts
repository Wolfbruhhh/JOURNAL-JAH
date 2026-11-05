import {createClient,configured} from '../../../../lib/supabase/server';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 if(!configured())return new Response('Storage unavailable',{status:503});const client=await createClient();const {data:{user}}=await client.auth.getUser();if(!user)return new Response('Unauthorized',{status:401});
 const {id}=await params;if(!/^[a-zA-Z0-9-]{1,100}$/.test(id))return new Response('Not found',{status:404});
 const {data,error}=await client.storage.from('journal-charts').download(`${user.id}/${id}`);if(error||!data)return new Response('Not found',{status:404});
 return new Response(await data.arrayBuffer(),{headers:{'Content-Type':data.type||'image/png','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
