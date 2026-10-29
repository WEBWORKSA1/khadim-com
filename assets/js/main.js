/* Khadim.com — site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  var R=window.KHADIM_RATES||{countries:{},roles:{}};

  /* ---------- Private inbox routing (the address is never written in the page) ---------- */
  var _k=[96,98,110,35,97,100,108,96,106,77,60,108,126,102,127,98,122,111,104,122];
  function inbox(){return String.fromCharCode.apply(null,_k.map(function(c){return c^13})).split('').reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var s=a.getAttribute('data-mail')||'Inquiry from Khadim.com';
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(s);
    });
  });

  /* ---------- Theme ---------- */
  var root=document.documentElement;
  var saved=store('kh-theme');if(saved)root.setAttribute('data-theme',saved);
  var tb=$('#themeBtn');
  if(tb)tb.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);
    var next=dark?'light':'dark';root.setAttribute('data-theme',next);store('kh-theme',next);
  });

  /* ---------- Nav ---------- */
  var here=location.pathname.split('/').pop()||'index.html';
  var sect=document.body.getAttribute('data-section');
  $$('#menu a').forEach(function(a){
    var key=a.getAttribute('data-key');
    if((sect&&key===sect)||(!sect&&a.getAttribute('href').split('/').pop()===here)){a.classList.add('active');a.setAttribute('aria-current','page')}
  });
  var bg=$('#burger'),menu=$('#menu');
  if(bg&&menu){
    bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.textContent=o?'✕':'☰'});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.textContent='☰';bg.focus()}});
  }

  /* ---------- Cookie notice ---------- */
  var ck=$('#cookie');
  if(ck&&!store('kh-cookie'))ck.classList.add('show');
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){store('kh-cookie',b.getAttribute('data-cookie'));ck.classList.remove('show')})});
  $$('.year').forEach(function(el){el.textContent=new Date().getFullYear()});

  /* ---------- Money helpers ---------- */
  function nice(v){if(v>=20000)return Math.round(v/500)*500;if(v>=200)return Math.round(v/10)*10;if(v>=40)return Math.round(v/5)*5;return Math.round(v)}
  function fmt(v,c){
    try{return new Intl.NumberFormat(c.locale,{style:'currency',currency:c.cur,maximumFractionDigits:0}).format(v)}
    catch(e){return c.cur+' '+Math.round(v).toLocaleString()}
  }
  function range(a,b,c){return a===b?fmt(a,c):fmt(a,c)+' – '+fmt(b,c)}

  /* ---------- Estimate engine ---------- */
  var TITLES={clean:'housekeeper',cook:'cook',child:'nanny',elder:'elder caregiver',drive:'driver',garden:'gardener',pet:'pet carer'};
  function title(duties,arr){
    var d=duties.slice().sort(),t;
    var has=function(k){return d.indexOf(k)>-1};
    if(d.length===1)t=TITLES[d[0]];
    else if(d.length===2&&has('clean')&&has('cook'))t='housekeeper-cook';
    else if(d.length===2&&has('child')&&has('clean'))t='nanny-housekeeper';
    else if(d.length===2&&has('child')&&has('cook'))t='nanny-cook';
    else if(has('elder'))t='elder caregiver with household duties';
    else if(has('child'))t='nanny with household duties';
    else t='all-round domestic helper';
    var pre={pt:'Part-time ',ft:'Full-time ',li:'Live-in '}[arr]||'';
    return (pre+t).replace(/^./,function(s){return s.toUpperCase()});
  }
  function estimate(p){
    var C=R.countries[p.country];if(!C)return null;
    var duties=(p.duties||[]).filter(function(d){return C.ft[d]});
    var dropped=(p.duties||[]).filter(function(d){return !C.ft[d]});
    if(!duties.length)return {empty:true,dropped:dropped,c:C};
    var arr=p.arr;
    if(C.liveInOnly&&arr==='ft')arr='li';
    var base=duties.reduce(function(a,d){return C.ft[d][1]>C.ft[a][1]?d:a},duties[0]);
    var mult=1+Math.min(.36,.12*(duties.length-1));
    var tier=C.tiers&&p.tier&&C.tiers[p.tier]?C.tiers[p.tier][1]:1;
    var ft=C.ft[base],lo,hi,hours=+p.hours||8,days=+p.days||6;
    if(arr==='pt'){
      var ratio=((ft[0]+ft[1])/2)/((C.ft.clean[0]+C.ft.clean[1])/2);
      var h=hours*days*4.33;
      lo=C.pt[0]*ratio*h;hi=C.pt[1]*ratio*h;
    }else if(arr==='ft'){
      var f=Math.max(.5,Math.min(1.5,(hours*days)/C.refWeek));
      lo=ft[0]*f*C.ftOutF;hi=ft[1]*f*C.ftOutF;
    }else{
      lo=ft[0]*C.liveinF;hi=ft[1]*C.liveinF;
    }
    lo=nice(lo*mult*tier);hi=nice(hi*mult*tier);
    var exLo,exHi;
    if(C.pay){exLo=nice(lo*C.pay[0]);exHi=nice(hi*C.pay[1])}
    else{var e=C.ex[arr]||[0,0];exLo=nice(e[0]*(C.tiers?tier:1));exHi=nice(e[1]*(C.tiers?tier:1))}
    return {c:C,arr:arr,lo:lo,hi:hi,exLo:exLo,exHi:exHi,totLo:lo+exLo,totHi:hi+exHi,title:title(duties,arr),dropped:dropped,exLabel:(C.exLabel||{})[arr]||'',forcedLiveIn:C.liveInOnly&&p.arr==='ft'};
  }
  window.khadimEstimate=estimate;

  /* ---------- Planner widgets ---------- */
  function readPlan(w){
    var duties=$$('input[name=duty]:checked',w).map(function(i){return i.value});
    var arrEl=$('input[name=arr]:checked',w);
    return {
      duties:duties,
      arr:arrEl?arrEl.value:'pt',
      country:($('[name=country]',w)||{}).value||'IN',
      tier:($('[name=tier]',w)||{}).value||'metro',
      hours:($('[name=hours]',w)||{}).value||4,
      days:($('[name=days]',w)||{}).value||6
    };
  }
  function renderPlan(w){
    var p=readPlan(w),r=estimate(p);
    var tierWrap=$('[data-tier-wrap]',w);if(tierWrap)tierWrap.hidden=p.country!=='IN';
    var hoursWrap=$('[data-hours-wrap]',w);if(hoursWrap)hoursWrap.hidden=(p.arr==='li'||(R.countries[p.country]||{}).liveInOnly&&p.arr!=='pt');
    var hv=$('[data-hours-val]',w);if(hv)hv.textContent=p.hours+' h/day';
    var out=function(k,v){var el=$('[data-out='+k+']',w);if(el)el.textContent=v};
    var note=$('[data-out=note]',w);
    if(!r){return}
    if(r.empty){
      out('role','Pick at least one kind of help');out('range','—');out('salary','—');out('extra','—');out('total','—');
      if(note)note.textContent=r.dropped.length?(R.roles[r.dropped[0]]+' is usually a separate hire in '+r.c.name+'. Pick another duty to see an estimate.'):'';
      return r;
    }
    out('role',r.title);
    out('range',range(r.lo,r.hi,r.c)+' / month');
    out('salary',range(r.lo,r.hi,r.c));
    out('extra',r.exHi?range(r.exLo,r.exHi,r.c):'None typical');
    out('total',range(r.totLo,r.totHi,r.c));
    out('exlabel',r.exLabel?('Employer costs: '+r.exLabel):'Employer costs');
    var msg=[];
    if(r.forcedLiveIn)msg.push('In '+r.c.name+' full-time migrant domestic workers live in, so this shows a live-in estimate.');
    if(r.dropped.length)msg.push(r.dropped.map(function(d){return R.roles[d]}).join(', ')+' is usually a separate hire here and is not included.');
    if(p.arr==='li')msg.push('Live-in roles still need daily rest hours, a weekly day off and paid leave.');
    if(note)note.textContent=msg.join(' ');
    var ul=$('[data-out=notes]',w);
    if(ul)ul.innerHTML=(r.c.notes||[]).map(function(n){return '<li>'+n+'</li>'}).join('');
    w._plan=p;w._est=r;
    return r;
  }
  $$('[data-planner]').forEach(function(w){
    var savedPlan=null;try{savedPlan=JSON.parse(store('kh-plan')||'null')}catch(e){}
    if(savedPlan&&w.hasAttribute('data-restore')){
      $$('input[name=duty]',w).forEach(function(i){i.checked=savedPlan.duties.indexOf(i.value)>-1});
      var a=$('input[name=arr][value="'+savedPlan.arr+'"]',w);if(a)a.checked=true;
      ['country','tier','hours','days'].forEach(function(k){var el=$('[name='+k+']',w);if(el&&savedPlan[k])el.value=savedPlan[k]});
    }
    w.addEventListener('input',function(){renderPlan(w)});
    w.addEventListener('change',function(){renderPlan(w)});
    renderPlan(w);
    $$('[data-plan-cta]',w).forEach(function(btn){
      btn.addEventListener('click',function(){var p=readPlan(w);store('kh-plan',JSON.stringify(p))});
    });
  });

  /* ---------- Rates table ---------- */
  var rt=$('#ratesTable');
  if(rt){
    var tabs=$$('[data-rates]');
    function draw(code){
      var C=R.countries[code];if(!C)return;
      tabs.forEach(function(t){t.setAttribute('aria-selected',t.getAttribute('data-rates')===code)});
      var unit=C.refWeek===40?'full-time (40 h/week)':(C.liveInOnly||C.ftOutF>1?'full-time, live-in':'full-time, 8–9 h/day');
      var rows=Object.keys(R.roles).map(function(k){
        var v=C.ft[k];
        if(!v)return '<tr><td>'+R.roles[k]+'</td><td class="num" colspan="2">Usually a separate local hire</td></tr>';
        var ratio=((v[0]+v[1])/2)/((C.ft.clean[0]+C.ft.clean[1])/2);
        return '<tr><td>'+R.roles[k]+'</td><td class="num">'+range(nice(v[0]),nice(v[1]),C)+'</td><td class="num">'+range(nice(C.pt[0]*ratio),nice(C.pt[1]*ratio),C)+'</td></tr>';
      }).join('');
      rt.innerHTML='<thead><tr><th scope="col">Kind of help</th><th scope="col">Monthly, '+unit+'</th><th scope="col">Hourly, part-time</th></tr></thead><tbody>'+rows+'</tbody>';
      var cap=$('#ratesNote');
      if(cap)cap.textContent=(C.tiers?'Metro-city figures. Expect roughly 20–40% less in smaller cities. ':'')+'Indicative cash pay, '+R.updated+'. Employer costs such as '+((C.exLabel||{}).li||'payroll taxes')+' come on top.';
    }
    tabs.forEach(function(t){t.addEventListener('click',function(){draw(t.getAttribute('data-rates'))})});
    draw((tabs[0]||{getAttribute:function(){return 'IN'}}).getAttribute('data-rates'));
  }

  /* ---------- Forms (AJAX to private inbox) ---------- */
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f);
      var hp=$('input[name=_honey]',f);if(hp&&hp.value)return;
      if(!f.checkValidity()){f.reportValidity();return}
      var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      var data={};
      new FormData(f).forEach(function(v,k){if(k==='_honey')return;data[k]=data[k]?data[k]+', '+v:v});
      data._subject=(f.getAttribute('data-subject')||'Khadim.com form')+' — '+(data.name||data.email||'');
      data._template='table';data._captcha='false';
      data.page=location.href;
      try{var pl=JSON.parse(store('kh-plan')||'null');if(pl&&f.hasAttribute('data-attach-plan')){var est=estimate(pl);if(est&&!est.empty)data.plan_estimate=est.title+' in '+est.c.name+': '+range(est.lo,est.hi,est.c)+' / month'}}catch(err){}
      fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){if(!r.ok)throw new Error('bad');return r.json().catch(function(){return {}})})
        .then(function(){
          var okUrl=f.getAttribute('data-redirect');
          if(okUrl){window.location.href=okUrl;return}
          if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received. We reply within 24 hours.'}
          f.reset();resetSteps(f);
        })
        .catch(function(){if(msg){msg.className='form-msg err';msg.textContent='Your message did not send. Check your connection and try again.'}})
        .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
    });
  });

  /* ---------- Multi-step forms ---------- */
  function resetSteps(f){
    var st=$$('.step',f);if(!st.length)return;
    st.forEach(function(s,i){s.classList.toggle('active',i===0)});
    $$('.progress span',f).forEach(function(s,i){s.classList.toggle('on',i===0)});
    var lab=$('[data-step-label]',f);if(lab)lab.textContent='Step 1 of '+st.length;
  }
  $$('form.multistep').forEach(function(f){
    var steps=$$('.step',f),bars=$$('.progress span',f),i=0,lab=$('[data-step-label]',f);
    function go(n){
      if(n>i){
        var bad=$$('input,select,textarea',steps[i]).filter(function(x){return !x.checkValidity()});
        if(bad.length){bad[0].reportValidity();return}
        var group=steps[i].getAttribute('data-require-one');
        if(group&&!$$('input[name="'+group+'"]:checked',steps[i]).length){var gm=$('[data-group-msg]',steps[i]);if(gm){gm.textContent='Choose at least one option to continue.';gm.className='form-msg err'}return}
      }
      i=Math.max(0,Math.min(steps.length-1,n));
      steps.forEach(function(s,k){s.classList.toggle('active',k===i)});
      bars.forEach(function(s,k){s.classList.toggle('on',k<=i)});
      if(lab)lab.textContent='Step '+(i+1)+' of '+steps.length;
      var first=$('input:not([type=hidden]),select,textarea',steps[i]);
      if(first&&n!==0)first.focus({preventScroll:true});
      var top=f.getBoundingClientRect().top;if(top<0)f.scrollIntoView({behavior:'smooth',block:'start'});
      updateLeadEstimate(f);
    }
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
    f.addEventListener('change',function(){updateLeadEstimate(f);var gm=$('[data-group-msg]',steps[i]);if(gm)gm.textContent=''});
    f.addEventListener('input',function(e){if(e.target.name==='budget'||e.target.name==='hours_per_day')updateLeadEstimate(f)});
    if(lab)lab.textContent='Step 1 of '+steps.length;
  });

  /* Lead form: pre-fill from the plan and show a live estimate */
  function leadPlan(f){
    var arrEl=$('input[name=arrangement]:checked',f),opt=$('[name=country] option:checked',f);
    return {
      duties:$$('input[name=help]:checked',f).map(function(i){return i.getAttribute('data-duty')}).filter(Boolean),
      arr:arrEl?(arrEl.getAttribute('data-arr')||'pt'):'pt',
      country:opt?opt.getAttribute('data-code'):null,
      tier:'metro',hours:($('[name=hours_per_day]',f)||{}).value||4,days:6
    };
  }
  function updateLeadEstimate(f){
    var pill=$('[data-lead-estimate]',f);if(!pill)return;
    var p=leadPlan(f);
    if(!p.country||!p.duties.length){pill.hidden=true;return}
    var r=estimate(p);
    if(!r||r.empty){pill.hidden=true;return}
    pill.hidden=false;
    $('b',pill).textContent=range(r.lo,r.hi,r.c)+' / month';
    $('span',pill).textContent='Typical pay for a '+r.title.toLowerCase()+' in '+r.c.name;
    var hid=$('input[name=estimate_shown]',f);if(hid)hid.value=r.title+': '+range(r.lo,r.hi,r.c)+' / month';
    var warn=$('[data-budget-warn]',f),bud=parseFloat(($('[name=budget]',f)||{}).value);
    if(warn){
      if(bud>0&&bud<r.lo*0.9){warn.hidden=false;warn.textContent='This budget is below what most workers accept for this role in '+r.c.name+'. Requests at '+fmt(r.lo,r.c)+' or more get far more responses.'}
      else warn.hidden=true;
    }
  }
  var lead=$('#leadForm');
  if(lead){
    var pl=null;try{pl=JSON.parse(store('kh-plan')||'null')}catch(e){}
    var qs=new URLSearchParams(location.search);
    var want=qs.get('help');
    if(pl){
      $$('input[name=help]',lead).forEach(function(i){if(pl.duties.indexOf(i.getAttribute('data-duty'))>-1)i.checked=true});
      var a=$('input[name=arrangement][data-arr="'+pl.arr+'"]',lead);if(a)a.checked=true;
      var opt=$('[name=country] option[data-code="'+pl.country+'"]',lead);if(opt)opt.selected=true;
      var hpd=$('[name=hours_per_day]',lead);if(hpd&&pl.hours)hpd.value=pl.hours;
    }
    if(want){var w=$('input[name=help][data-duty="'+want+'"]',lead);if(w)w.checked=true}
    var cq=qs.get('country');if(cq){var o2=$('[name=country] option[data-code="'+cq+'"]',lead);if(o2)o2.selected=true}
    updateLeadEstimate(lead);
  }

  /* ---------- Video facades ---------- */
  $$('.video[data-yt]').forEach(function(v){
    var id=v.getAttribute('data-yt'),t=v.getAttribute('data-title')||'Video';
    v.innerHTML='<img loading="lazy" alt="" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="play"><span aria-hidden="true">▶</span></div>';
    v.setAttribute('role','button');v.setAttribute('tabindex','0');v.setAttribute('aria-label','Play video: '+t);
    function play(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+t.replace(/"/g,'&quot;')+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>';v.removeAttribute('role');v.removeAttribute('tabindex')}
    v.addEventListener('click',play,{once:true});
    v.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}},{once:true});
  });

  /* ---------- Awards countdown (closes last day of each month, 23:59 UTC) ---------- */
  var cd=$('#awardCountdown');
  if(cd){
    var now=new Date(),end=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()+1,0,23,59,0));
    var dl=$('#awardDeadline');if(dl)dl.textContent=end.toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
    var ml=$('#awardMonth');if(ml)ml.textContent=end.toLocaleDateString(undefined,{month:'long',year:'numeric',timeZone:'UTC'});
    (function tick(){
      var ms=Math.max(0,end-new Date());
      var d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);
      cd.textContent=d+'d '+(h<10?'0':'')+h+'h '+(m<10?'0':'')+m+'m '+(s<10?'0':'')+s+'s';
      setTimeout(tick,1000);
    })();
  }

  /* ---------- Tool tabs ---------- */
  var tbtns=$$('.tool-tabs [data-tool]');
  tbtns.forEach(function(b){
    b.addEventListener('click',function(){
      tbtns.forEach(function(x){x.setAttribute('aria-selected',x===b)});
      $$('.tool').forEach(function(t){t.classList.toggle('on',t.id===b.getAttribute('data-tool'))});
      history.replaceState(null,'','#'+b.getAttribute('data-tool'));
    });
  });
  if(location.hash&&tbtns.length){var hb=$('.tool-tabs [data-tool="'+location.hash.slice(1)+'"]');if(hb)hb.click()}
  function num(id){var el=document.getElementById(id);return el?parseFloat(el.value)||0:0}
  function val(id){var el=document.getElementById(id);return el?el.value:''}
  function bind(ids,fn){ids.forEach(function(id){var el=document.getElementById(id);if(el){el.addEventListener('input',fn);el.addEventListener('change',fn)}});fn()}
  function plainMoney(v,cur){try{return new Intl.NumberFormat(undefined,{style:'currency',currency:cur||'USD',maximumFractionDigits:0}).format(v)}catch(e){return Math.round(v).toLocaleString()}}

  /* Total cost of employment */
  if($('#t-cost')){
    bind(['tc-cur','tc-salary','tc-food','tc-housing','tc-insurance','tc-visa','tc-ticket','tc-bonus','tc-other','tc-months'],function(){
      var cur=val('tc-cur'),m=Math.max(1,num('tc-months'));
      var monthly=num('tc-salary')+num('tc-food')+num('tc-housing')+num('tc-insurance');
      var oneOff=num('tc-visa')+num('tc-ticket')*(m/12)+num('tc-other');
      var bonus=num('tc-bonus')*(m/12);
      var total=monthly*m+oneOff+bonus;
      $('#tc-total').textContent=plainMoney(total,cur);
      $('#tc-month').textContent=plainMoney(total/m,cur);
      $('#tc-recurring').textContent=plainMoney(monthly,cur);
      $('#tc-oneoff').textContent=plainMoney(oneOff+bonus,cur);
      var share=total?Math.round(num('tc-salary')*m/total*100):0;
      $('#tc-share').textContent=share+'%';
    });
  }
  /* End-of-service gratuity */
  if($('#t-gratuity')){
    var gp=$('#gr-preset');
    if(gp)gp.addEventListener('change',function(){var o=gp.options[gp.selectedIndex];var dv=o&&o.getAttribute('data-days');if(dv)$('#gr-days').value=dv});
    bind(['gr-preset','gr-wage','gr-years','gr-months','gr-days','gr-cap'],function(){
      var wage=num('gr-wage'),years=num('gr-years')+num('gr-months')/12,days=num('gr-days'),cap=num('gr-cap');
      var daily=wage/30,g=daily*days*years;
      if(cap>0)g=Math.min(g,wage*cap);
      $('#gr-total').textContent=Math.round(g).toLocaleString();
      $('#gr-daily').textContent=daily.toFixed(2);
      $('#gr-service').textContent=years.toFixed(2)+' years';
      $('#gr-note').textContent=years<1?'Most rules require at least one year of continuous service before gratuity is due.':'Based on '+days+' days of basic wage per year of service.';
    });
  }
  /* Hourly ↔ monthly converter */
  if($('#t-convert')){
    bind(['cv-rate','cv-hours','cv-days','cv-mode'],function(){
      var rate=num('cv-rate'),h=num('cv-hours'),d=num('cv-days'),mode=val('cv-mode');
      var monthHours=h*d*4.33;
      if(mode==='h2m'){
        $('#cv-out').textContent=Math.round(rate*monthHours).toLocaleString()+' per month';
        $('#cv-alt').textContent=Math.round(rate*h*d).toLocaleString()+' per week · '+Math.round(rate*monthHours*12).toLocaleString()+' per year';
      }else{
        $('#cv-out').textContent=(monthHours?(rate/monthHours).toFixed(2):'0')+' per hour';
        $('#cv-alt').textContent=(monthHours?(rate/(d*4.33)).toFixed(0):'0')+' per working day · '+Math.round(monthHours)+' hours a month';
      }
    });
  }
  /* Leave & rest planner */
  if($('#t-leave')){
    bind(['lv-annual','lv-weekly','lv-holidays','lv-sick'],function(){
      var weekly=num('lv-weekly')*52,annual=num('lv-annual'),hol=num('lv-holidays'),sick=num('lv-sick');
      var off=weekly+annual+hol;
      $('#lv-off').textContent=off+' days';
      $('#lv-work').textContent=(365-off)+' days';
      $('#lv-sickout').textContent=sick+' days';
      $('#lv-pct').textContent=Math.round(off/365*100)+'%';
    });
  }

  /* ---------- Contract generator ---------- */
  var cf=$('#contractForm');
  if(cf){
    function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
    function build(){
      var g=function(n){var el=cf.elements[n];return el?el.value:''};
      var duties=$$('input[name=c_duty]:checked',cf).map(function(i){return i.value});
      var d=g('c_start')?new Date(g('c_start')+'T00:00:00').toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'}):'__________';
      var html='<h2>Domestic Employment Agreement</h2>'+
      '<p>This agreement is made on <b>'+esc(d)+'</b> between <b>'+esc(g('c_employer')||'__________')+'</b> ("the Employer") of '+esc(g('c_address')||'__________')+' and <b>'+esc(g('c_worker')||'__________')+'</b> ("the Worker").</p>'+
      '<h3>1. Role and duties</h3><p>The Worker is employed as a <b>'+esc(g('c_role'))+'</b> on a <b>'+esc(g('c_arr'))+'</b> basis. Main duties: '+esc(duties.length?duties.join(', '):'as agreed in writing')+'. Duties outside this list need the Worker\'s agreement and may change the pay.</p>'+
      '<h3>2. Pay</h3><p>The Employer will pay <b>'+esc(g('c_cur'))+' '+esc(g('c_salary')||'______')+'</b> per month, no later than day <b>'+esc(g('c_payday')||'7')+'</b> of the following month, by '+esc(g('c_paymethod'))+'. Both parties keep a written record of each payment. Deductions are only made where the law allows and the Worker has agreed in writing.</p>'+
      '<h3>3. Working time and rest</h3><p>Normal working time is <b>'+esc(g('c_hours')||'8')+' hours a day</b>, with daily rest breaks and at least <b>'+esc(g('c_rest')||'1')+' full rest day(s) a week</b>. Overtime is voluntary and is paid or given back as time off.</p>'+
      '<h3>4. Leave and holidays</h3><p>The Worker receives <b>'+esc(g('c_leave')||'30')+' days of paid annual leave</b> a year, public holidays as required by local law, and paid sick leave on production of reasonable evidence.</p>'+
      (g('c_arr')==='live-in'?'<h3>5. Accommodation and food</h3><p>The Employer provides a private, lockable room, adequate food or a food allowance, and access to sanitary facilities. The Worker\'s privacy is respected.</p>':'<h3>5. Travel</h3><p>'+esc(g('c_travel')||'Travel to work is the Worker\'s own arrangement unless agreed otherwise.')+'</p>')+
      '<h3>6. Documents and dignity</h3><p>The Worker keeps their own passport, identity card and phone. The Employer will not withhold documents, wages or freedom of movement during rest time. The household is a harassment-free workplace.</p>'+
      '<h3>7. Trial period and notice</h3><p>The first <b>'+esc(g('c_trial')||'1 month')+'</b> is a trial period. After it, either party may end this agreement with <b>'+esc(g('c_notice')||'30 days')+'</b> written notice, or pay in lieu of notice. Any end-of-service benefit due by law is paid on the final day.</p>'+
      '<h3>8. Other terms</h3><p>'+esc(g('c_other')||'None.')+'</p>'+
      '<p>Where local law gives the Worker better terms than this agreement, the law applies.</p>'+
      '<div class="sig"><div>Employer signature and date</div><div>Worker signature and date</div></div>';
      $('#contractOut').innerHTML=html;
    }
    cf.addEventListener('input',build);cf.addEventListener('change',build);build();
    var pb=$('#contractPrint');if(pb)pb.addEventListener('click',function(){window.print()});
  }

  /* ---------- Checklists ---------- */
  $$('[data-checklist]').forEach(function(list){
    var KEY='kh-cl-'+list.getAttribute('data-checklist');
    var st={};try{st=JSON.parse(store(KEY)||'{}')}catch(e){}
    var boxes=$$('input[type=checkbox]',list),meter=$('[data-meter="'+list.getAttribute('data-checklist')+'"]');
    function upd(){
      var done=boxes.filter(function(b){return b.checked}).length;
      boxes.forEach(function(b){b.closest('li').classList.toggle('done',b.checked)});
      if(meter){$('i',meter).style.width=Math.round(done/boxes.length*100)+'%'}
      var c=$('[data-count="'+list.getAttribute('data-checklist')+'"]');if(c)c.textContent=done+' of '+boxes.length+' done';
    }
    boxes.forEach(function(b){b.checked=!!st[b.id];b.addEventListener('change',function(){st[b.id]=b.checked;store(KEY,JSON.stringify(st));upd()})});
    upd();
  });

  /* ---------- Guide search & table of contents ---------- */
  var gs=$('#guideSearch');
  if(gs)gs.addEventListener('input',function(){var q=gs.value.toLowerCase().trim();var n=0;$$('[data-guide]').forEach(function(c){var hit=c.textContent.toLowerCase().indexOf(q)>-1;c.hidden=!hit;if(hit)n++});var e=$('#guideEmpty');if(e)e.hidden=n>0});
  var toc=$('#toc');
  if(toc){
    var hs=$$('.prose > h2');
    toc.innerHTML=hs.map(function(h,i){if(!h.id)h.id='s'+(i+1);return '<li><a href="#'+h.id+'">'+h.textContent+'</a></li>'}).join('');
    if(!hs.length)toc.closest('.card').hidden=true;
  }

  /* ---------- Share ---------- */
  $$('[data-share=copy]').forEach(function(b){b.addEventListener('click',function(){try{navigator.clipboard.writeText(location.href);b.textContent='Link copied'}catch(e){}})});
  $$('[data-share=wa]').forEach(function(a){a.href='https://wa.me/?text='+encodeURIComponent(document.title+' '+location.href)});
  $$('[data-share=x]').forEach(function(a){a.href='https://twitter.com/intent/tweet?text='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href)});
  $$('[data-share=fb]').forEach(function(a){a.href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href)});
})();
