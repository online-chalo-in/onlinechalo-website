const progress=document.querySelector(".scroll-progress");
const cursor=document.querySelector(".cursor-orb");
window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(scrollY/max*100)+"%"});
window.addEventListener("mousemove",e=>{if(cursor){cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px"}});
const observer=new IntersectionObserver(items=>items.forEach(x=>{if(x.isIntersecting)x.target.classList.add("visible")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(x=>observer.observe(x));

const menu=document.querySelector(".mobile-menu"), panel=document.querySelector(".mobile-panel");
menu?.addEventListener("click",()=>panel.classList.toggle("open"));
panel?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>panel.classList.remove("open")));

const date=document.querySelector("#date");
if(date){const d=new Date();d.setDate(d.getDate()+1);date.min=d.toISOString().split("T")[0];}
const timeButtons=document.querySelectorAll(".time-grid button");
let chosenTime="";
timeButtons.forEach(btn=>btn.addEventListener("click",()=>{timeButtons.forEach(b=>b.classList.remove("active"));btn.classList.add("active");chosenTime=btn.dataset.time}));

const form=document.querySelector("#appointmentForm");
form?.addEventListener("submit",e=>{
 e.preventDefault();
 if(!chosenTime){alert("Please choose a preferred time.");return;}
 const name=document.querySelector("#name").value.trim();
 const phone=document.querySelector("#phone").value.trim();
 const service=document.querySelector("#service").value;
 const day=document.querySelector("#date").value;
 if(!name||!phone||!service||!day){alert("Please complete the required fields.");return;}
 const formattedDate=new Date(day+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
 const text=`Hi OnlineChalo, I saw your doctor website demo and would like to know more.%0A%0ADemo form details:%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AService: ${encodeURIComponent(service)}%0APreferred Date: ${encodeURIComponent(formattedDate)}%0APreferred Time: ${encodeURIComponent(chosenTime)}`;
 const wa="https://wa.me/919820762331?text="+text;
 window.open(wa,"_blank");
 document.querySelector(".appointment-card").classList.add("sent");
 document.querySelector("#sentState").scrollIntoView({behavior:"smooth",block:"center"});
});
