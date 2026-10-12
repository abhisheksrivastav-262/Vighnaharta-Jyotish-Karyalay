// Vighnaharta Jyotish Karyalay — shared interactions
(function(){
  const WA_NUMBER = "917988466477";
  const waLink = (msg)=> `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  // Mobile nav (top dropdown, half screen)
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if(toggle && mobileNav){
    toggle.addEventListener("click", ()=>{
      const open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true":"false");
      toggle.textContent = open ? "✕" : "☰";
    });
    mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
      mobileNav.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
      toggle.textContent="☰";
    }));
  }

  // Reveal on scroll
  const els = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && els.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target);} });
    },{threshold:.12});
    els.forEach(el=>io.observe(el));
  } else {
    els.forEach(el=>el.classList.add("visible"));
  }

  // Current year
  document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());

  // Service enquiry buttons: data-service attribute -> prefilled WA
  document.querySelectorAll("[data-service]").forEach(btn=>{
    btn.addEventListener("click",(ev)=>{
      const service = btn.getAttribute("data-service") || "परामर्श";
      const msg = `नमस्ते विघ्नहर्ता ज्योतिष कार्यालय, मुझे ${service} के लिए जानकारी चाहिए। कृपया मार्गदर्शन करें।`;
      window.open(waLink(msg),"_blank","noopener");
    });
  });

  // Appointment / contact forms -> WhatsApp
  document.querySelectorAll("[data-wa-form]").forEach(form=>{
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit",(ev)=>{
      ev.preventDefault();
      const name = form.querySelector("[name=name]")?.value.trim() || "";
      const phone = form.querySelector("[name=phone]")?.value.trim() || "";
      const service = form.querySelector("[name=service]")?.value.trim() || "";
      const date = form.querySelector("[name=date]")?.value.trim() || "";
      const message = form.querySelector("[name=message]")?.value.trim() || "";
      const errors = [];
      const setErr=(field,msg)=>{
        const errEl = form.querySelector(`[data-error-for="${field}"]`);
        if(errEl) errEl.textContent = msg||"";
      };
      ["name","phone","service","message"].forEach(f=>setErr(f,""));
      if(name.length<2){ setErr("name","कृपया अपना सही नाम लिखें।"); errors.push("name"); }
      if(!/^[6-9]\d{9}$/.test(phone.replace(/\s+/g,""))){ setErr("phone","कृपया 10 अंकों का सही मोबाइल नंबर लिखें।"); errors.push("phone"); }
      if(!service){ setErr("service","कृपया सेवा चुनें।"); errors.push("service"); }
      if(date){
        const d = new Date(date); const today = new Date(); today.setHours(0,0,0,0);
        if(isNaN(d.getTime())||d<today){ setErr("date","कृपया आज या भविष्य की तारीख चुनें।"); errors.push("date"); }
        else setErr("date","");
      } else setErr("date","");
      if(message.length<3){ setErr("message","कृपया अपना संदेश संक्षेप में लिखें।"); errors.push("message"); }
      if(errors.length){
        if(status){ status.textContent="कृपया फॉर्म में बताई गई त्रुटियाँ सुधारें, फिर पुनः प्रयास करें।"; status.style.color="#ffb4ab"; }
        form.querySelector(`[name=${errors[0]}]`)?.focus();
        return;
      }
      const msg = `नमस्ते विघ्नहर्ता ज्योतिष कार्यालय, मुझे ज्योतिष/वास्तु परामर्श के लिए जानकारी चाहिए। मेरा नाम: ${name}, सेवा: ${service}, पसंदीदा तारीख: ${date||"जल्द से जल्द"}, संदेश: ${message}। मेरा नंबर: ${phone}`;
      if(status){ status.textContent="धन्यवाद! WhatsApp खुल रहा है — वहाँ Send दबाते ही आपकी जानकारी हमें मिल जाएगी।"; status.style.color="#7CFFB2"; }
      setTimeout(()=>window.open(waLink(msg),"_blank","noopener"),400);
    });
  });

  // FAQ deep-linking
  if(location.hash){
    const t=document.querySelector(location.hash);
    if(t&&t.tagName==="DETAILS") t.open=true;
  }
})();
