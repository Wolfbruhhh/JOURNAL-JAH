import {createClient,configured} from '../../../lib/supabase/server';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!configured())return Response.json({error:'Image storage is not configured.'},{status:503});
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid origin.'},{status:403});
 try{const client=await createClient();const {data:{user}}=await client.auth.getUser();if(!user)return Response.json({error:'Sign in required.'},{status:401});
 const file=(await request.formData()).get('image');if(!(file instanceof File)||file.size>3*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type))return Response.json({error:'Choose a PNG, JPG, or WebP under 3 MB.'},{status:400});
 const id=crypto.randomUUID();const {error}=await client.storage.from('journal-charts').upload(`${user.id}/${id}`,file,{contentType:file.type,upsert:false});if(error)throw error;
 return Response.json({url:`/api/screenshots/${id}`});
 }catch{return Response.json({error:'Chart upload failed. Check storage setup and try again.'},{status:503});}
}
