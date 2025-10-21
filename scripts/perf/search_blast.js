const http=require("http"); const URL=process.argv[2]||"http://localhost:3000/catalog/search?city=Tashkent";
let done=0, N=50; for(let i=0;i<N;i++){ http.get(URL, res=>{ res.resume(); res.on("end",()=>{done++; if(done===N) console.log("done",N);}); }); }
