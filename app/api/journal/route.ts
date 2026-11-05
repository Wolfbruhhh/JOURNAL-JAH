import {createClient,configured} from '../../../lib/supabase/server';
import {schema} from '../../../lib/validation';
import {initialData} from '../../model';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store, max-age=0'}});
export async function GET(){
 if(!configured())return reply({error:'Cloud database is not configured. Complete the README setup first.'},503);
 try{const client=await createClient();const {data:{user}}=await client.auth.getUser();if(!user)return reply({error:'Please sign in to open your journal.'},401);
 let {data,error}=await client.from('journals').select('data,revision').eq('user_id',user.id).maybeSingle();if(error)throw error;
 if(!data){const inserted=await client.from('journals').insert({user_id:user.id,data:initialData()}).select('data,revision').single();if(inserted.error){if(inserted.error.code!=='23505')throw inserted.error;const existing=await client.from('journals').select('data,revision').eq('user_id',user.id).single();if(existing.error)throw existing.error;data=existing.data;}else data=inserted.data;}
 return reply(data);
 }catch{return reply({error:'Could not load your cloud journal. Check the connection and database setup, then retry.'},503);}
}
export async function PUT(request:Request){
 if(!configured())return reply({error:'Cloud database is not configured.'},503);
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return reply({error:'Invalid origin.'},403);
 try{const client=await createClient();const {data:{user}}=await client.auth.getUser();if(!user)return reply({error:'Your session expired. Sign in again.'},401);
 const raw=await request.text();if(new TextEncoder().encode(raw).byteLength>1500000)return reply({error:'Journal exceeds 1.5 MB. Export your records before continuing.'},413);
 const parsed=schema.safeParse(JSON.parse(raw));if(!parsed.success)return reply({error:'Check your trade and account fields.'},400);const {data,revision}=parsed.data;
 if(new Set(data.accounts.map(a=>a.id)).size!==data.accounts.length||new Set(data.trades.map(t=>t.id)).size!==data.trades.length)return reply({error:'Duplicate record IDs.'},400);
 for(const t of data.trades){const a=data.accounts.find(a=>a.id===t.accountId);if(!a||(a.market==='Futures'&&!Number.isInteger(t.quantity)))return reply({error:'Futures need whole contracts; every trade must belong to an account.'},400);}
 const result=await client.from('journals').update({data}).eq('user_id',user.id).eq('revision',revision).select('revision').maybeSingle();if(result.error)throw result.error;
 if(!result.data)return reply({error:'Newer changes were saved on another device. Copy your unsaved notes, close this form to sync, then retry.'},409);
 return reply({revision:result.data.revision});
 }catch{return reply({error:'Could not save to the cloud. Nothing was marked as saved. Please retry.'},503);}
}
