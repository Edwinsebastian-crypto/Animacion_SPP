const roleFlows = {
 student:{name:"Estudiante",icon:"♙",title:"Registro y desarrollo de la práctica",subtitle:"El estudiante consulta su práctica, desarrolla actividades y entrega evidencias.",steps:[
  ["Consulta su práctica","La interfaz React presenta la información de la práctica asignada y el avance del estudiante.",["actor","ui","core","db"]],
  ["Envía una actividad o evidencia","La solicitud viaja desde el frontend al monolito Node.js + Express, que valida la sesión y los permisos.",["actor","ui","core"]],
  ["Se procesa y guarda la información","Los servicios y repositorios del monolito gestionan los datos relacionales en PostgreSQL / Supabase.",["core","db"]],
  ["Se almacena la evidencia","Los archivos y documentos se gestionan mediante Cloudinary; el sistema conserva sus referencias y metadatos.",["core","db"]],
  ["Recibe seguimiento y notificaciones","Los eventos pertinentes pueden activar el servicio de notificaciones, que gestiona la cola e historial en MongoDB.",["core","notif"]]
 ]},
 tutor:{name:"Tutor académico",icon:"♧",title:"Acompañamiento y evaluación",subtitle:"El tutor organiza actividades, revisa evidencias y realiza evaluaciones.",steps:[
  ["Consulta estudiantes asignados","El tutor accede a su panel. React muestra la información permitida para su rol.",["actor","ui","core","db"]],
  ["Crea y asigna actividades","El monolito valida la operación y registra actividades, fechas y asignaciones en PostgreSQL.",["actor","ui","core","db"]],
  ["Revisa evidencias y registra retroalimentación","El monolito consulta las referencias de evidencias y almacena observaciones y seguimiento.",["core","db"]],
  ["Gestiona una evaluación","Cuando corresponde, el monolito se comunica por API con el microservicio FastAPI para operaciones de evaluación.",["core","eval"]],
  ["Se informa el resultado","El flujo puede generar eventos para el servicio de notificaciones y actualizar la información consultada por los actores.",["core","notif","db"]]
 ]},
 advisor:{name:"Asesor pedagógico",icon:"✧",title:"Acompañamiento pedagógico",subtitle:"El asesor consulta el proceso, registra observaciones y apoya el seguimiento.",steps:[
  ["Accede al seguimiento","El frontend presenta los estudiantes y prácticas disponibles según los permisos del asesor.",["actor","ui","core","db"]],
  ["Consulta avances y evidencias","El monolito obtiene los datos relacionales y las referencias de archivos asociados a la práctica.",["core","db"]],
  ["Registra observaciones","La solicitud se valida en Node.js + Express y se persiste mediante los repositorios del monolito.",["actor","ui","core","db"]],
  ["Comparte retroalimentación","La información queda disponible para el seguimiento de los participantes autorizados.",["core","db"]],
  ["Se generan avisos cuando aplica","Los eventos de seguimiento pueden comunicarse al servicio de notificaciones para su despacho.",["core","notif"]]
 ]},
 director:{name:"Director",icon:"▤",title:"Supervisión e informes",subtitle:"El director revisa el estado general de las prácticas y consulta indicadores.",steps:[
  ["Abre el panel de dirección","React carga las opciones de supervisión habilitadas para el rol director.",["actor","ui","core"]],
  ["Consulta información consolidada","El monolito consulta los datos relacionales de prácticas, usuarios y seguimiento en PostgreSQL.",["core","db"]],
  ["Revisa indicadores y reportes","Los servicios de negocio preparan información estadística y reportes para su visualización o exportación.",["core","db"]],
  ["Consulta resultados de evaluación","Cuando se requieren datos del dominio de evaluación, el monolito solicita la información al servicio FastAPI.",["core","eval"]],
  ["Supervisa el proceso","El director dispone de una vista consolidada para apoyar decisiones y seguimiento del programa.",["actor","ui","core","db"]]
 ]}
};
const allSteps = Object.keys(roleFlows).flatMap(role=>roleFlows[role].steps.map((s,i)=>({role,index:i})));
let currentRole="student",currentStep=0,playing=false,timer=null;
const $=id=>document.getElementById(id);
const nodes={actor:$("actorNode"),ui:$("uiNode"),core:$("coreNode"),db:$("dbNode"),eval:$("evalNode"),notif:$("notifNode")};
const edgeMap={"actor-ui":["actor","ui"],"ui-core":["ui","core"],"core-db":["core","db"],"core-eval":["core","eval"],"core-notif":["core","notif"]};
function render(){
 const flow=roleFlows[currentRole],step=flow.steps[currentStep];
 $("flowTitle").textContent=flow.name+" · "+flow.title;
 $("flowSubtitle").textContent=flow.subtitle;
 $("actorNode").querySelector("b").textContent=flow.name;
 $("actorNode").querySelector(".node-symbol").textContent=flow.icon;
 $("stepCurrent").textContent=String(currentStep+1).padStart(2,"0");
 $("stepTotal").textContent=String(flow.steps.length).padStart(2,"0");
 $("stepTitle").textContent=step[0];$("stepText").textContent=step[1];
 $("progressBar").style.width=((currentStep+1)/flow.steps.length*100)+"%";
 $("playBtn").textContent=playing?"Ⅱ Pausar recorrido":"▶ Reproducir recorrido";
 Object.entries(nodes).forEach(([key,node])=>node.classList.toggle("active",step[2].includes(key)));
 document.querySelectorAll(".edge").forEach(edge=>{
  const pair=edgeMap[edge.dataset.edge];edge.classList.toggle("active",pair&&pair.every(k=>step[2].includes(k)));
 });
 $("stepDots").innerHTML="";
 flow.steps.forEach((_,i)=>{const b=document.createElement("button");b.className=i===currentStep?"active":"";b.setAttribute("aria-label","Ir al paso "+(i+1));b.onclick=()=>{pause();currentStep=i;render()};$("stepDots").appendChild(b)});
 document.querySelectorAll(".role-card").forEach(card=>card.classList.toggle("active",card.dataset.role===currentRole));
 if(playing) animatePacket(step[2]);
}
function animatePacket(active){
 const packet=$("packet"),diagram=$("diagram");
 if(window.innerWidth<761){packet.classList.remove("go");return}
 const sequence=active.filter(k=>nodes[k]);if(sequence.length<2){packet.classList.remove("go");return}
 const a=nodes[sequence[0]].getBoundingClientRect(),b=nodes[sequence[1]].getBoundingClientRect(),d=diagram.getBoundingClientRect();
 packet.style.left=(a.left+a.width/2-d.left-6)+"px";packet.style.top=(a.top+a.height/2-d.top-6)+"px";packet.classList.add("go");
 packet.animate([{transform:"translate(0,0)"},{transform:`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px)`}],{duration:750,easing:"ease-in-out"});
}
function pause(){playing=false;clearInterval(timer);timer=null;$("packet").classList.remove("go");$("playBtn").textContent="▶ Reproducir recorrido"}
function next(){const max=roleFlows[currentRole].steps.length;if(currentStep<max-1){currentStep++}else{pause();return}render()}
function play(){if(playing){pause();return}if(currentStep===roleFlows[currentRole].steps.length-1)currentStep=0;playing=true;render();timer=setInterval(()=>{if(currentStep>=roleFlows[currentRole].steps.length-1){pause();return}currentStep++;render()},3600)}
function selectRole(role){pause();currentRole=role;currentStep=0;render();$("explorador").scrollIntoView({behavior:"smooth",block:"start"})}
document.querySelectorAll(".role-card").forEach(card=>card.addEventListener("click",()=>selectRole(card.dataset.role)));
$("startTour").addEventListener("click",()=>{selectRole("student");play();$("explorador").scrollIntoView({behavior:"smooth"})});
$("exploreBtn").addEventListener("click",()=>$("explorador").scrollIntoView({behavior:"smooth"}));
$("playBtn").addEventListener("click",play);
$("nextStep").addEventListener("click",()=>{pause();next()});
$("prevStep").addEventListener("click",()=>{pause();currentStep=Math.max(0,currentStep-1);render()});
$("resetBtn").addEventListener("click",()=>{pause();currentStep=0;render()});
render();