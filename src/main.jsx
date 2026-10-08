import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import './styles.css'

const A = `${import.meta.env.BASE_URL}evidence/assets/`

const projects = [
  { id:'deep', cat:'SOC', title:'Deep-Soc-Lab', subtitle:'Full SOC setup', image:'deep-soc-overview.png', text:'Integrated security lab combining Wazuh, MISP, Zeek, Sysmon and SentinelX for monitoring, enrichment and investigation.', tags:['Wazuh','MISP','Zeek','Sysmon','SentinelX'], link:'https://github.com/mukesh-soc/Deep-Soc-Lab', evidence:['deep-soc-overview.png','deep-soc-github.png','wazuh-threat-hunting.png','misp-event.png'] },
  { id:'wazuh', cat:'SOC', title:'Wazuh Security Monitoring', subtitle:'SIEM + endpoint detection', image:'wazuh-threat-hunting.png', text:'Windows endpoint telemetry, alert analysis, rule investigation and MITRE ATT&CK mapping.', tags:['Wazuh','Sysmon','MITRE ATT&CK','Windows'], evidence:['wazuh-threat-hunting.png','wazuh-mitre.png','wazuh-api.png'] },
  { id:'sentinel', cat:'Threat Intel', title:'SentinelX + MISP', subtitle:'IOC enrichment workflow', image:'misp-event.png', text:'Controlled IOC validation and enrichment using MISP with a real positive-match workflow.', tags:['MISP','IOC','Python','Threat Intel'], evidence:['misp-event.png','misp-api.png'] },
  { id:'zeek', cat:'SOC', title:'Zeek Network Monitoring', subtitle:'Network telemetry', image:'ubuntu-network.png', text:'Network lab work using Zeek and Ubuntu networking to support traffic analysis and detection workflows.', tags:['Zeek','PCAP','Ubuntu','Network'], evidence:['ubuntu-network.png','deep-soc-overview.png'] },
  { id:'iot', cat:'IoT', title:'Temperature & Humidity Monitor', subtitle:'DHT11 + voice alert', image:'iot-hardware.png', text:'Arduino UNO and DHT11 monitoring with Python voice alerts for temperature thresholds.', tags:['Arduino','DHT11','Python','IoT'], evidence:['iot-hardware.png','iot-architecture.png'], pdf:'IOT_Project_Report_Team.pdf' },
  { id:'devops', cat:'DevSecOps', title:'DevSecOps Learning Lab', subtitle:'Cloud + automation', image:'virtualbox-disk.png', text:'Practical learning around Linux, Docker, Kubernetes, Terraform, GitHub Actions, cloud and security automation.', tags:['Linux','Docker','Kubernetes','Terraform','AWS'], evidence:['virtualbox-disk.png','windows-virtual-lab.png'] },
  { id:'wireshark', cat:'Security', title:'Wireshark Analysis', subtitle:'Packet investigation', image:'sysmon-test.png', text:'Network and endpoint investigation practice with packet-analysis and detection workflows.', tags:['Wireshark','PCAP','Analysis'], evidence:['sysmon-test.png'] },
  { id:'python', cat:'Automation', title:'Python Security Tools', subtitle:'Scripts + automation', image:'misp-api.png', text:'Python practice for parsing, enrichment, automation and small security utilities.', tags:['Python','Automation','Security'], evidence:['misp-api.png'] },
]

const certifications = [
  {name:'GUVI HCL Cyber Security Internship', status:'In Progress', kind:'active', note:'Active learning / internship track'},
  {name:'TryHackMe', status:'Learning', kind:'learning', note:'Hands-on cybersecurity practice'},
  {name:'Hack The Box', status:'Learning', kind:'learning', note:'Hands-on lab practice'},
  {name:'CompTIA A+', status:'Planned', kind:'planned', note:'Planned certification path'},
  {name:'CompTIA Security+', status:'Planned', kind:'planned', note:'Planned certification path'},
]

function ThreeHero(){
  const ref=useRef(null)
  useEffect(()=>{
    const el=ref.current
    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(42, el.clientWidth/el.clientHeight, .1, 100)
    camera.position.set(0,0,7)
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true})
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
    renderer.setSize(el.clientWidth,el.clientHeight)
    el.appendChild(renderer.domElement)
    const group=new THREE.Group(); scene.add(group)
    const globe=new THREE.Mesh(new THREE.SphereGeometry(1.45,40,40), new THREE.MeshBasicMaterial({color:0x073544,wireframe:true,transparent:true,opacity:.65}))
    group.add(globe)
    const core=new THREE.Mesh(new THREE.SphereGeometry(1.12,28,28), new THREE.MeshBasicMaterial({color:0x00f0c8,transparent:true,opacity:.055}))
    group.add(core)
    const pts=new THREE.BufferGeometry(); const arr=[]
    for(let i=0;i<900;i++){ const r=2.1+Math.random()*1.7, a=Math.random()*Math.PI*2, b=Math.acos(2*Math.random()-1); arr.push(r*Math.sin(b)*Math.cos(a),r*Math.sin(b)*Math.sin(a),r*Math.cos(b)) }
    pts.setAttribute('position',new THREE.Float32BufferAttribute(arr,3))
    const particles=new THREE.Points(pts,new THREE.PointsMaterial({color:0x31e7d0,size:.018,transparent:true,opacity:.8}))
    scene.add(particles)
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.75,.012,8,100),new THREE.MeshBasicMaterial({color:0x00bfff,transparent:true,opacity:.55}))
    ring.rotation.x=Math.PI/2.7; group.add(ring)
    let raf
    const resize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)}
    window.addEventListener('resize',resize)
    const animate=()=>{raf=requestAnimationFrame(animate); group.rotation.y+=.0022; ring.rotation.z+=.003; particles.rotation.y-=.0007; renderer.render(scene,camera)}
    animate()
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);renderer.dispose();el.removeChild(renderer.domElement)}
  },[])
  return <div className="three-hero" ref={ref} aria-hidden="true" />
}

function SectionTitle({eyebrow,title,action}){return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{action}</div>}

function ProjectCard({p,onOpen}){return <article className="project-card" onClick={()=>onOpen(p)}><div className="project-image"><img src={A+p.image} alt=""/><div className="image-glow"/></div><div className="project-body"><div className="project-meta"><span>{p.cat}</span><span>↗</span></div><h3>{p.title}</h3><p>{p.text}</p><div className="tag-row">{p.tags.slice(0,4).map(t=><span key={t}>{t}</span>)}</div><button className="ghost-btn">View Details <b>→</b></button></div></article>}

function Modal({project,onClose}){if(!project)return null;return <div className="modal" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal-card"><button className="modal-close" onClick={onClose}>×</button><div className="eyebrow">PROJECT / {project.cat.toUpperCase()}</div><h2>{project.title}</h2><p className="modal-lead">{project.text}</p><div className="tag-row big">{project.tags.map(t=><span key={t}>{t}</span>)}</div><div className="modal-gallery">{project.evidence.map((img,i)=><img key={img} src={A+img} alt={`${project.title} evidence ${i+1}`} />)}</div><div className="modal-actions">{project.link&&<a className="btn primary" href={project.link} target="_blank" rel="noreferrer">Open GitHub ↗</a>}{project.pdf&&<a className="btn" href={A+project.pdf} target="_blank" rel="noreferrer">Open Project Report ↗</a>}</div></div></div>}

function App(){
  const [active,setActive]=useState('home'), [filter,setFilter]=useState('All'), [selected,setSelected]=useState(null), [search,setSearch]=useState(''), [theme,setTheme]=useState('dark'), [menu,setMenu]=useState(false)
  const nav=['home','about','projects','soc','devops','iot','skills','certifications','learning','contact']
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme])
  useEffect(()=>{
    const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)})},{rootMargin:'-35% 0px -55% 0px'})
    nav.forEach(id=>{const e=document.getElementById(id); if(e)obs.observe(e)})
    return()=>obs.disconnect()
  },[])
  const filtered=useMemo(()=>{let x=filter==='All'?projects:projects.filter(p=>p.cat===filter); if(search.trim()) x=x.filter(p=>(p.title+p.text+p.tags.join(' ')).toLowerCase().includes(search.toLowerCase())); return x},[filter,search])
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false)}
  const filters=['All','SOC','Threat Intel','DevSecOps','IoT','Security','Automation']
  return <div className="app">
    <aside className={menu?'sidebar open':'sidebar'}><div className="brand"><div className="brand-mark">MJ</div><div><b>Mukesh Jena</b><small>Cybersecurity Portfolio</small></div></div><nav>{nav.map(id=><button key={id} className={active===id?'active':''} onClick={()=>go(id)}><span>{({home:'⌂',about:'◉',projects:'▦',soc:'◈',devops:'⚙',iot:'⌁',skills:'◆',certifications:'◇',learning:'◷',contact:'✉'})[id]}</span>{id.replace('devops','DevSecOps').replace('soc','SOC Labs').replace('iot','IoT').replace('skills','Skills').replace('certifications','Certifications').replace('learning','Learning Journey').replace('contact','Contact').replace('home','Home').replace('about','About Me').replace('projects','Projects')}</button>)}</nav><div className="sidebar-bottom"><div className="status"><i/> <div><b>Open to opportunities</b><small>SOC / Cybersecurity</small></div></div><a href="https://github.com/mukesh-soc" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://github.com/mukesh-soc/Deep-Soc-Lab" target="_blank" rel="noreferrer">Deep-Soc-Lab ↗</a></div></aside>
    <div className="page"><header className="topbar"><button className="menu" onClick={()=>setMenu(!menu)}>☰</button><div className="crumb">MUKESH / <span>CYBERSECURITY</span></div><div className="top-actions"><label className="search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects..."/></label><button className="icon-btn" onClick={()=>setTheme(theme==='dark'?'light':'dark')} title="Toggle theme">{theme==='dark'?'☼':'☾'}</button><a className="resume" href="#contact">Contact ↗</a></div></header>
      <main>
        <section id="home" className="hero"><div className="hero-copy"><div className="eyebrow">CYBERSECURITY · SOC · DEVSECOPS · IOT</div><h1>Hi, I'm <span>Mukesh Jena.</span><br/>I build security labs that <span>you can verify.</span></h1><p className="hero-sub">MCA student focused on SOC operations, threat hunting, cloud security, DevSecOps and practical security engineering. I document what I build, test and learn instead of hiding behind buzzwords.</p><div className="hero-buttons"><button className="btn primary" onClick={()=>go('projects')}>Explore My Work →</button><button className="btn" onClick={()=>go('about')}>Meet Mukesh ↘</button><a className="btn" href="https://github.com/mukesh-soc" target="_blank" rel="noreferrer">GitHub ↗</a></div><div className="hero-pills"><span>MCA Student</span><span>SOC / Blue Team</span><span>Linux · Windows</span><span>Python</span></div></div><div className="hero-visual"><ThreeHero/><div className="profile-orbit"><div className="profile-ring"><img src={A+'mukesh-profile.jpg'} alt="Mukesh Jena"/></div><div className="profile-caption"><b>Mukesh Jena</b><span>Cybersecurity · SOC Analyst</span></div></div><div className="hero-orbit-card"><span className="live-dot"/> LAB STATUS <b>ACTIVE</b><small>Wazuh · MISP · Zeek · SentinelX</small></div><div className="hero-code"><span>$</span> detection_pipeline --status<br/><em>Wazuh → MISP → Zeek → SentinelX</em></div></div><div className="hero-gridline"/></section>
        <section className="stats"><div><b>08+</b><span>Projects & labs</span></div><div><b>05</b><span>SOC technologies</span></div><div><b>01</b><span>IoT academic project</span></div><div><b>01</b><span>Active internship track</span></div><div><b>24/7</b><span>Learning mindset</span></div></section>
        <section id="about" className="section"><SectionTitle eyebrow="01 / ABOUT ME" title="A real person behind the lab."/><div className="about-layout about-profile-layout"><div className="about-profile"><img src={A+'mukesh-profile.jpg'} alt="Mukesh Jena"/><div><div className="eyebrow">MCA · CYBERSECURITY</div><h3>Mukesh Jena</h3><p>Building practical cybersecurity skills through SOC labs, investigation, automation, IoT and DevSecOps learning.</p></div></div><div className="about-copy"><p>I am pursuing an <b>MCA at Sri Sri University</b> and building an employable cybersecurity profile through hands-on labs, documentation and repeatable experiments.</p><p>My strongest current build is <b>Deep-Soc-Lab</b>, bringing Wazuh, MISP, Zeek, Sysmon and SentinelX into one security workflow.</p><div className="mini-cards"><div><small>FOCUS</small><b>SOC / Blue Team</b></div><div><small>BUILD STYLE</small><b>Build · Test · Document</b></div><div><small>GOAL</small><b>SOC Analyst</b></div></div></div><div className="terminal"><div className="terminal-top"><span/> <span/> <span/><b>mukesh@soc-lab</b></div><pre>{`$ whoami
mukesh-jena
$ cat focus.txt
SOC monitoring
Threat hunting
DevSecOps
IoT security
$ lab --status
[+] Wazuh   ONLINE
[+] MISP    ONLINE
[+] Zeek    READY
[+] Sysmon  READY`}</pre></div></div></section>
        <section id="projects" className="section dark"><SectionTitle eyebrow="02 / PROJECTS" title="Selected work" action={<span className="hint">Click any card for evidence</span>}/><div className="filter-row">{filters.map(f=><button key={f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="project-grid">{filtered.map(p=><ProjectCard key={p.id} p={p} onOpen={setSelected}/>)}</div></section>
        <section id="soc" className="section"><SectionTitle eyebrow="03 / SOC LABS" title="Detection & investigation evidence" action={<a className="outline" href="https://github.com/mukesh-soc/Deep-Soc-Lab" target="_blank" rel="noreferrer">Open Deep-Soc-Lab ↗</a>}/><div className="soc-layout"><div className="evidence-large"><img src={A+'wazuh-mitre.png'} alt="Wazuh evidence"/><div className="evidence-caption"><b>Wazuh / MITRE ATT&CK</b><span>Endpoint detection and investigation evidence</span></div></div><div className="soc-side"><div className="soc-stat"><b>Wazuh</b><span>SIEM + endpoint monitoring</span><i>ONLINE</i></div><div className="soc-stat"><b>MISP</b><span>Threat intelligence / IOC enrichment</span><i>ONLINE</i></div><div className="soc-stat"><b>Zeek</b><span>Network telemetry and analysis</span><i>READY</i></div><div className="soc-stat"><b>SentinelX</b><span>Enrichment workflow automation</span><i>ACTIVE</i></div></div></div><div className="evidence-strip">{['wazuh-threat-hunting.png','misp-event.png','misp-api.png','sysmon-test.png','deep-soc-github.png'].map(x=><img key={x} src={A+x} alt="SOC evidence" onClick={()=>setSelected(projects[0])}/>)}</div></section>
        <section id="devops" className="section dark"><SectionTitle eyebrow="04 / DEVSECOPS" title="Cloud, automation & security engineering"/><div className="devops-grid"><div className="dev-card featured"><span>01</span><h3>Linux + Virtualization</h3><p>Ubuntu Server, VirtualBox, networking and SSH form the lab foundation.</p><img src={A+'virtualbox-disk.png'} alt="VirtualBox lab"/></div><div className="dev-card"><span>02</span><h3>Container & CI/CD Track</h3><p>Learning path across Docker, Kubernetes, Terraform, GitHub Actions and cloud security.</p><div className="tool-cloud">{['Docker','Kubernetes','Terraform','GitHub Actions','AWS','Linux','Python'].map(t=><b key={t}>{t}</b>)}</div></div><div className="dev-card"><span>03</span><h3>Security in the Pipeline</h3><p>Current direction includes SAST, DAST, dependency scanning, secrets and secure deployment practices.</p><button className="ghost-btn" onClick={()=>go('learning')}>View Roadmap →</button></div></div><div className="truth-note"><b>Evidence policy</b><span>DevSecOps skills are shown as learning/work areas unless a real project screenshot is available. No fabricated deployment evidence.</span></div></section>
        <section id="iot" className="section"><SectionTitle eyebrow="05 / IOT PROJECT" title="Temperature & Humidity Monitoring" action={<a className="outline" href={A+'IOT_Project_Report_Team.pdf'} target="_blank" rel="noreferrer">Open Report ↗</a>}/><div className="iot-layout"><img src={A+'iot-hardware.png'} alt="Arduino DHT11 project"/><div className="iot-info"><div className="eyebrow">MCA ACADEMIC PROJECT</div><h3>Arduino UNO + DHT11 + Python voice alert</h3><p>Temperature and humidity readings are monitored from the Arduino setup, with Python voice alerts for defined temperature thresholds.</p><div className="specs"><div><small>HARDWARE</small><b>Arduino UNO · DHT11</b></div><div><small>SOFTWARE</small><b>Python · pyttsx3</b></div><div><small>OUTPUT</small><b>Serial monitoring + voice alert</b></div></div></div><img src={A+'iot-architecture.png'} alt="IoT architecture"/></div></section>
        <section id="skills" className="section dark"><SectionTitle eyebrow="06 / SKILLS" title="Tools I actually work with"/><div className="skills"><div><h3>SOC & Detection</h3><p>Wazuh · Sysmon · MITRE ATT&CK · MISP · Zeek · Threat Hunting</p></div><div><h3>Systems & Network</h3><p>Linux · Ubuntu · Windows · VirtualBox · Networking · Wireshark</p></div><div><h3>Programming & Automation</h3><p>Python · Git · GitHub · Bash · Security scripting</p></div><div><h3>DevSecOps Learning</h3><p>Docker · Kubernetes · Terraform · GitHub Actions · AWS · Security automation</p></div></div></section>
        <section id="certifications" className="section"><SectionTitle eyebrow="07 / CERTIFICATIONS & LEARNING" title="Current learning status"/><div className="cert-grid">{certifications.map(c=><article className={'cert '+c.kind} key={c.name}><div className="cert-mark">{c.kind==='active'?'●':c.kind==='learning'?'↗':'○'}</div><div><span>{c.status}</span><h3>{c.name}</h3><p>{c.note}</p></div></article>)}</div><p className="disclaimer">Only completed credentials with verifiable proof should be marked completed. Planned items are intentionally shown as planned.</p></section>
        <section id="learning" className="section dark"><SectionTitle eyebrow="08 / LEARNING JOURNEY" title="From fundamentals to SOC-ready practice"/><div className="timeline"><div><span>FOUNDATION</span><h3>Linux · Networking · Python</h3><p>Build the systems and scripting base needed for security work.</p></div><div><span>HANDS-ON</span><h3>Wazuh · Sysmon · Wireshark</h3><p>Detect events, inspect traffic and document investigations.</p></div><div><span>THREAT INTEL</span><h3>MISP · Zeek · SentinelX</h3><p>Enrich IOCs and connect telemetry to investigation workflows.</p></div><div><span>NEXT</span><h3>Docker · Kubernetes · Cloud</h3><p>Continue the DevSecOps path with security built into delivery.</p></div></div></section>
        <section id="contact" className="contact"><div><div className="eyebrow">09 / CONTACT</div><h2>Let's build something secure.</h2><p>Open to cybersecurity learning opportunities, internships and practical collaborations.</p></div><div className="contact-actions"><a className="btn primary" href="https://github.com/mukesh-soc" target="_blank" rel="noreferrer">GitHub ↗</a><a className="btn" href="mailto:mukeshkujena127@gmail.com">Email ↗</a></div></section>
      </main><footer><span>© {new Date().getFullYear()} Mukesh Jena</span><span>SOC Analyst · Cybersecurity · DevSecOps · IoT</span><button onClick={()=>go('home')}>Back to top ↑</button></footer>
    </div><Modal project={selected} onClose={()=>setSelected(null)}/>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
