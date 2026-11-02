export const API_URL=(process.env.NEXT_PUBLIC_API_URL||"http://localhost:10000").replace(/\/$/,"");
export type Product={id:string;name:string;slug:string;sku:string;brand?:string|null;model?:string|null;description?:string|null;price:number;images:{id:string;url:string;alt?:string|null}[];category?:{name:string;slug:string}|null};
export async function api<T>(path:string,init?:RequestInit):Promise<T>{const r=await fetch(API_URL+path,{...init,headers:{"Content-Type":"application/json",...(init?.headers||{})},cache:"no-store"});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||"Request failed");return j as T}
export const kes=(n:number)=>new Intl.NumberFormat("en-KE",{style:"currency",currency:"KES",maximumFractionDigits:0}).format(n);
