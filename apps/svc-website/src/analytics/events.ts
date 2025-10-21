type Evt="page_view"|"search"|"enquiry_submit";
export function send(evt:Evt, payload:any){ try{ navigator.sendBeacon?.("/analytics", new Blob([JSON.stringify({evt,payload,ts:Date.now()})],{type:"application/json"})); }catch(e){ console.log("evt",evt,payload); } }
