"use client";
import { useEffect } from "react";
export default function Error({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
 useEffect(()=>{console.error("TaskMatrix route error:",error)},[error]);
 return <main className="loading" role="alert" aria-live="assertive"><section className="panel" style={{width:"min(100% - 32px,520px)",textAlign:"center"}}><div className="eyebrow">SOMETHING WENT WRONG</div><h1 style={{margin:"12px 0"}}>This workspace hit an error.</h1><p className="sub">Your saved tasks are not intentionally changed. Try loading this section again.</p>{error.digest&&<p className="sub">Reference: {error.digest}</p>}<button className="btn primary" style={{marginTop:20}} onClick={()=>reset()}>Try again</button></section></main>
}