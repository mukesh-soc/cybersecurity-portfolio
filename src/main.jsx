import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import './styles.css'

const A = `${import.meta.env.BASE_URL}evidence/assets/`
const LINKEDIN_URL = 'https://www.linkedin.com/in/mukesh-jena-2142ba287'
const TRYHACKME_URL = 'https://tryhackme.com/p/mukeshkujena127?utm_campaign=social_share&utm_medium=social&utm_content=profile&cardVersion=bac428b98298&utm_source=copy&sharerId=691b81971802481448ab2d69'
const GITHUB_URL = 'https://github.com/mukesh-soc'
const DEEP_SOC_LAB_URL = 'https://github.com/mukesh-soc/Deep-Soc-Lab'

const projects = [
  {
    id: 'deep',
    cat: 'SOC',
    title: 'Deep-Soc-Lab',
    subtitle: 'Integrated Enterprise SOC Lab',
    image: 'deep-soc-overview.png',
    text: 'Enterprise-grade security operations center combining Wazuh SIEM, MISP Threat Intelligence, Zeek NSM, Sysmon, and SentinelX into an end-to-end detection and response workflow.',
    tags: ['Wazuh', 'MISP', 'Zeek', 'Sysmon', 'SentinelX'],
    link: DEEP_SOC_LAB_URL,
    evidence: ['deep-soc-overview.png', 'deep-soc-github.png', 'wazuh-threat-hunting.png', 'misp-event.png'],
    attackVector: 'Simulated brute-force attack, privilege escalation, and LOLBins execution.',
    detectionMethod: 'Sysmon Event ID 1 & 3 captured, correlated with Wazuh SIEM rules and MISP IOC feeds.',
    outcome: 'Zero-loss detection pipeline with sub-second alert generation.'
  },
  {
    id: 'wazuh',
    cat: 'SOC',
    title: 'Wazuh Security Monitoring',
    subtitle: 'SIEM & Endpoint Telemetry',
    image: 'wazuh-threat-hunting.png',
    text: 'Continuous endpoint log analysis, real-time intrusion alerts, rule tuning to minimize false positives, and rigorous mapping to the MITRE ATT&CK framework across Windows and Linux nodes.',
    tags: ['Wazuh', 'Sysmon', 'MITRE ATT&CK', 'Windows', 'Linux'],
    link: GITHUB_URL,
    evidence: ['wazuh-threat-hunting.png', 'wazuh-mitre.png', 'wazuh-api.png'],
    attackVector: 'Persistence mechanisms via registry run keys and suspicious scheduled tasks.',
    detectionMethod: 'Wazuh ruleset 5710/5712 triggers with custom severity overrides.',
    outcome: 'Comprehensive MITRE ATT&CK heatmap coverage with verifiable log archives.'
  },
  {
    id: 'sentinel',
    cat: 'Threat Intel',
    title: 'SentinelX + MISP Pipeline',
    subtitle: 'Automated IOC Validation & Enrichment',
    image: 'misp-event.png',
    text: 'Automated threat intelligence ingestion pipeline using MISP REST APIs and Python scripts to cross-reference hashes, suspicious IPs, and domains against live threat feeds.',
    tags: ['MISP', 'IOC Enrichment', 'Python', 'Threat Intel'],
    link: GITHUB_URL,
    evidence: ['misp-event.png', 'misp-api.png'],
    attackVector: 'Inbound suspicious C2 communication and phishing payload hash drops.',
    detectionMethod: 'Automated REST API query against MISP instance with instant correlation score.',
    outcome: 'Eliminated manual analyst lookup time by 85% via automated enrichment.'
  },
  {
    id: 'zeek',
    cat: 'SOC',
    title: 'Zeek Network Security Monitoring',
    subtitle: 'Deep Packet Inspection & Traffic Telemetry',
    image: 'ubuntu-network.png',
    text: 'Network-level monitoring and protocol dissection on Ubuntu virtual environments, generating protocol logs (DNS, HTTP, SSL/TLS, Conn) to identify anomalous traffic patterns.',
    tags: ['Zeek', 'PCAP', 'Ubuntu', 'Network Telemetry'],
    link: GITHUB_URL,
    evidence: ['ubuntu-network.png', 'deep-soc-overview.png'],
    attackVector: 'DNS tunneling attempts and unencrypted credential transmission.',
    detectionMethod: 'Zeek connection tracking and dns.log domain length anomaly parsing.',
    outcome: 'Actionable PCAP forensic logs integrated into central analysis pipelines.'
  },
  {
    id: 'wireshark',
    cat: 'Security',
    title: 'Wireshark Packet Forensics',
    subtitle: 'Live Capture & PCAP Triage',
    image: 'wireshark-pcap.png',
    text: 'Deep packet inspection practice analyzing real-world PCAP captures, stream reconstruction, ARP cache poisoning triage, and malicious payload extraction.',
    tags: ['Wireshark', 'PCAP', 'Forensics', 'TCP/IP'],
    link: GITHUB_URL,
    evidence: ['wireshark-pcap.png'],
    attackVector: 'TCP SYN flooding and cleartext credential harvesting in transit.',
    detectionMethod: 'Display filters (tcp.flags.syn==1 and http.request.method=="POST") and stream following.',
    outcome: 'Rapid root-cause triage from raw packet captures to forensic report.'
  },
  {
    id: 'iot',
    cat: 'IoT',
    title: 'IoT Climate & Security Monitor',
    subtitle: 'Hardware Telemetry & Voice Warning System',
    image: 'iot-hardware.png',
    text: 'Embedded hardware monitoring system using Arduino UNO and DHT11 sensor with Python serial listening daemon and pyttsx3 voice alerts for threshold breaches.',
    tags: ['Arduino UNO', 'DHT11', 'Python', 'Hardware Security', 'IoT'],
    evidence: ['iot-hardware.png', 'iot-architecture.png'],
    pdf: 'IOT_Project_Report_Team.pdf',
    attackVector: 'Environmental threshold violations and sensor spoofing telemetry.',
    detectionMethod: 'Python serial telemetry polling with automated threshold alarms.',
    outcome: 'Formal academic research report and functioning physical lab prototype.'
  },
  {
    id: 'devops',
    cat: 'DevSecOps',
    title: 'DevSecOps & Cloud Security Lab',
    subtitle: 'Infrastructure as Code & CI/CD Security',
    image: 'virtualbox-disk.png',
    text: 'Hands-on exploration of Linux hardening, VirtualBox network isolation, Docker container security, Kubernetes architecture, and automated CI/CD pipeline security practices.',
    tags: ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    link: GITHUB_URL,
    evidence: ['virtualbox-disk.png', 'windows-virtual-lab.png'],
    attackVector: 'Insecure container configurations and pipeline secrets exposure.',
    detectionMethod: 'Automated GitHub Actions workflows and image vulnerability scanners.',
    outcome: 'Repeatable, hardened virtual environments for threat simulation.'
  },
  {
    id: 'python',
    cat: 'Automation',
    title: 'Python Security Tooling',
    subtitle: 'Threat Scrapers & Forensic Utilities',
    image: 'misp-api.png',
    text: 'Custom Python utilities built for IOC parsing, hash verification, automated IP reputation lookups, and log triage to assist SOC analysts in daily alert triage.',
    tags: ['Python', 'Automation', 'REST APIs', 'SecOps'],
    link: GITHUB_URL,
    evidence: ['misp-api.png'],
    attackVector: 'Repetitive analyst fatigue and delayed triage of high-volume IOC lists.',
    detectionMethod: 'Async HTTP requests to VirusTotal & MISP API with structured JSON output.',
    outcome: 'High-throughput CLI tool saving critical minutes during incident response.'
  }
]

const mitreMatrix = [
  { tactic: 'Initial Access', id: 'T1078', name: 'Valid Accounts', tool: 'Wazuh SIEM', event: 'Event ID 4624/4625', status: 'VERIFIED' },
  { tactic: 'Execution', id: 'T1059.001', name: 'PowerShell Execution', tool: 'Sysmon / Wazuh', event: 'Sysmon Event ID 1', status: 'VERIFIED' },
  { tactic: 'Persistence', id: 'T1053.005', name: 'Scheduled Task', tool: 'Sysmon / Wazuh', event: 'Sysmon Event ID 1 / 4698', status: 'VERIFIED' },
  { tactic: 'Discovery', id: 'T1046', name: 'Network Service Scanning', tool: 'Zeek / Wireshark', event: 'conn.log / TCP SYN analysis', status: 'VERIFIED' },
  { tactic: 'Command & Control', id: 'T1071.001', name: 'Web Protocols', tool: 'MISP / Zeek', event: 'http.log / MISP IOC Match', status: 'VERIFIED' },
  { tactic: 'Defense Evasion', id: 'T1027', name: 'Obfuscated Files', tool: 'SentinelX / Python', event: 'Hash Entropy Check', status: 'ACTIVE' }
]

const certifications = [
  { name: 'GUVI HCL Cyber Security Internship', status: 'In Progress', kind: 'active', note: 'Active professional internship & security learning track' },
  { name: 'TryHackMe Security Profile', status: 'Active Rank', kind: 'learning', note: 'Hands-on Blue Team, SOC triage, and Red Team rooms', link: TRYHACKME_URL },
  { name: 'Hack The Box', status: 'Active Practice', kind: 'learning', note: 'Penetration testing & CTF challenge solving' },
  { name: 'CompTIA Security+', status: 'Target Roadmap', kind: 'planned', note: 'Planned industry certification track' },
  { name: 'CompTIA Network+', status: 'Target Roadmap', kind: 'planned', note: 'Planned network security certification' }
]

function ThreeCyberGlobe() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    // Outer Geodesic Hologram Wireframe
    const geo = new THREE.IcosahedronGeometry(1.65, 3)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    })
    const wireSphere = new THREE.Mesh(geo, wireMat)
    group.add(wireSphere)

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(1.05, 32, 32)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.08
    })
    const coreSphere = new THREE.Mesh(coreGeo, coreMat)
    group.add(coreSphere)

    // Orbiting Radar Rings
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.015, 8, 120)
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    ring1.rotation.x = Math.PI / 3
    group.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(2.35, 0.012, 8, 120)
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.5 })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.rotation.y = Math.PI / 4
    ring2.rotation.x = -Math.PI / 6
    group.add(ring2)

    // Dynamic Swarm Particle Constellation
    const particleCount = 750
    const coords = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.4 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      coords[i] = r * Math.sin(phi) * Math.cos(theta)
      coords[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      coords[i + 2] = r * Math.cos(phi)
    }
    const partGeo = new THREE.BufferGeometry()
    partGeo.setAttribute('position', new THREE.BufferAttribute(coords, 3))
    const partMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.022,
      transparent: true,
      opacity: 0.8
    })
    const particles = new THREE.Points(partGeo, partMat)
    scene.add(particles)

    // Interactive mouse tracking
    let targetX = 0
    let targetY = 0
    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8
    }
    window.addEventListener('mousemove', onMouseMove)

    let reqId
    const resizeHandler = () => {
      if (!el) return
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', resizeHandler)

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      group.rotation.y += 0.003
      ring1.rotation.z += 0.004
      ring2.rotation.z -= 0.003
      particles.rotation.y -= 0.0008

      // Gentle damping mouse parallax
      group.rotation.x += (targetY - group.rotation.x) * 0.05
      group.rotation.y += (targetX - group.rotation.y) * 0.05

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resizeHandler)
      renderer.dispose()
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div className="three-container" ref={mountRef} aria-hidden="true" />
}

function InteractiveTerminal() {
  const [history, setHistory] = useState([
    { type: 'info', text: 'SYSTEM BOOT: Mukesh Jena Cyber Defense Telemetry v2.8' },
    { type: 'info', text: 'LAB NODE: Sri Sri University // SOC Level-1 Active' },
    { type: 'cmd', text: 'Type "help" for valid commands, or "report" to view executive dossier.' }
  ])
  const [inputVal, setInputVal] = useState('')
  const terminalEndRef = useRef(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (e) => {
    e.preventDefault()
    const cmd = inputVal.trim().toLowerCase()
    if (!cmd) return

    const newHistory = [...history, { type: 'cmd', text: `$ ${inputVal}` }]

    switch (cmd) {
      case 'help':
        newHistory.push(
          { type: 'info', text: 'AVAILABLE COMMANDS:' },
          { type: 'info', text: '  report    - View Executive Dossier & Lab Findings' },
          { type: 'info', text: '  scan      - Run live simulated telemetry diagnostic' },
          { type: 'info', text: '  mitre     - Display MITRE ATT&CK detection mapping' },
          { type: 'info', text: '  whoami    - Display analyst credentials and background' },
          { type: 'info', text: '  projects  - List all 8 verified security projects' },
          { type: 'info', text: '  clear     - Wipe console screen' }
        )
        break
      case 'report':
        newHistory.push(
          { type: 'info', text: '[+] JUMPING TO EXECUTIVE DOSSIER SECTION...' }
        )
        document.getElementById('dossier')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'scan':
        newHistory.push(
          { type: 'info', text: '[*] INITIATING SOC TELEMETRY PROBE...' },
          { type: 'info', text: '[+] Wazuh Agent: ACTIVE (ID: 001 - Windows 11)' },
          { type: 'info', text: '[+] Sysmon Driver: RUNNING (Config: SwiftOnSecurity)' },
          { type: 'info', text: '[+] MISP API: SYNCHRONIZED (184 IOCs Loaded)' },
          { type: 'info', text: '[+] Zeek Engine: INSPECTING (Interface: eth0)' },
          { type: 'info', text: '[+] DEFCON STATUS: DEFCON 2 // ALL SENSORS NOMINAL' }
        )
        break
      case 'mitre':
        newHistory.push(
          { type: 'info', text: 'MITRE ATT&CK DETECTIONS:' },
          { type: 'info', text: '  [T1059.001] PowerShell Execution -> Sysmon Event ID 1' },
          { type: 'info', text: '  [T1053.005] Scheduled Task Persistence -> Wazuh Rule 5710' },
          { type: 'info', text: '  [T1046] Network Discovery -> Zeek conn.log analysis' }
        )
        break
      case 'whoami':
        newHistory.push(
          { type: 'info', text: 'ANALYST: Mukesh Jena' },
          { type: 'info', text: 'DEGREE: MCA @ Sri Sri University' },
          { type: 'info', text: 'FOCUS: SOC Analysis, Threat Hunting, DevSecOps, IoT' },
          { type: 'info', text: 'STATUS: Open to SOC Analyst & Cybersecurity Opportunities' }
        )
        break
      case 'projects':
        newHistory.push(
          { type: 'info', text: '1. Deep-Soc-Lab (Wazuh, MISP, Zeek, Sysmon)' },
          { type: 'info', text: '2. Wazuh Security Monitoring' },
          { type: 'info', text: '3. SentinelX + MISP IOC Enrichment' },
          { type: 'info', text: '4. Zeek Network Telemetry' },
          { type: 'info', text: '5. Wireshark PCAP Investigation' },
          { type: 'info', text: '6. IoT Smart Climate Monitor (Arduino+Python)' },
          { type: 'info', text: '7. DevSecOps Learning Lab' },
          { type: 'info', text: '8. Python Security Automation' }
        )
        break
      case 'clear':
        setHistory([])
        setInputVal('')
        return
      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for options.`
        })
    }

    setHistory(newHistory)
    setInputVal('')
  }

  return (
    <div className="interactive-terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot dot-red" />
          <span className="terminal-dot dot-yellow" />
          <span className="terminal-dot dot-green" />
        </div>
        <div className="terminal-title">mukesh@soc-operations:~</div>
        <div className="terminal-badge">LIVE INTERACTIVE</div>
      </div>
      <div className="terminal-screen">
        {history.map((line, idx) => (
          <div key={idx} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form className="terminal-input-bar" onSubmit={handleCommand}>
        <span className="terminal-prompt">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type 'help', 'scan', 'report'..."
        />
      </form>
    </div>
  )
}

function ProjectCard({ p, onOpen }) {
  return (
    <article className="cyber-project-card" onClick={() => onOpen(p)}>
      <div className="card-img-wrap">
        <img src={A + p.image} alt={p.title} loading="lazy" />
        <div className="card-scan-line" />
        <span className="card-badge">{p.cat}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{p.subtitle}</span>
          <span>↗</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.text}</p>
        <div className="tag-cloud">
          {p.tags.slice(0, 4).map((t) => (
            <span key={t} className="tag-pill">{t}</span>
          ))}
        </div>
        <button className="btn-card-action">
          <span>INVESTIGATE EVIDENCE</span> <b>→</b>
        </button>
      </div>
    </article>
  )
}

function Modal({ project, onClose }) {
  if (!project) return null

  return (
    <div className="cyber-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cyber-modal-window">
        <button className="modal-close-btn" onClick={onClose} title="Close">×</button>
        <div className="eyebrow-tag">LAB INVESTIGATION // {project.cat}</div>
        <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px' }}>{project.title}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, maxWidth: '780px' }}>
          {project.text}
        </p>

        {project.attackVector && (
          <div style={{
            background: 'rgba(3, 8, 14, 0.7)',
            border: '1px solid var(--line-subtle)',
            borderRadius: '6px',
            padding: '16px',
            margin: '20px 0',
            display: 'grid',
            gap: '8px',
            fontSize: '12px'
          }}>
            <div><b style={{ color: 'var(--neon-red)' }}>[!] ATTACK SIMULATION: </b> {project.attackVector}</div>
            <div><b style={{ color: 'var(--neon-cyan)' }}>[+] DETECTION MECHANISM: </b> {project.detectionMethod}</div>
            <div><b style={{ color: 'var(--neon-green)' }}>[✓] VERIFIABLE OUTCOME: </b> {project.outcome}</div>
          </div>
        )}

        <div className="tag-cloud" style={{ margin: '15px 0' }}>
          {project.tags.map((t) => (
            <span key={t} className="tag-pill" style={{ color: 'var(--neon-cyan)', borderColor: 'var(--neon-cyan)' }}>
              {t}
            </span>
          ))}
        </div>

        <div className="modal-gallery-grid">
          {project.evidence.map((img, i) => (
            <img key={img} src={A + img} alt={`${project.title} evidence ${i + 1}`} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          {project.link && (
            <a className="btn-cyber-primary" href={project.link} target="_blank" rel="noreferrer">
              Inspect GitHub Repository ↗
            </a>
          )}
          {project.pdf && (
            <a className="btn-cyber-outline" href={A + project.pdf} target="_blank" rel="noreferrer">
              Download Formal Research Report (PDF) ↗
            </a>
          )}
          <button className="btn-cyber-outline" onClick={onClose}>
            Close Case
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('home')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [menu, setMenu] = useState(false)
  const [reportTab, setReportTab] = useState('summary')

  const nav = [
    { id: 'home', label: 'Command Center', icon: '⌂' },
    { id: 'about', label: 'SOC Profile', icon: '◉' },
    { id: 'dossier', label: 'Operations Report', icon: '📋', badge: 'REPORT' },
    { id: 'projects', label: 'Lab Work', icon: '▦' },
    { id: 'soc', label: 'Detection Telemetry', icon: '◈' },
    { id: 'devops', label: 'DevSecOps & Cloud', icon: '⚙' },
    { id: 'iot', label: 'IoT Academic Lab', icon: '⌁' },
    { id: 'skills', label: 'Arsenal & Tools', icon: '◆' },
    { id: 'certifications', label: 'Certifications', icon: '◇' },
    { id: 'contact', label: 'Secure Channel', icon: '✉' }
  ]

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -50% 0px' }
    )
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const filteredProjects = useMemo(() => {
    let list = filter === 'All' ? projects : projects.filter((p) => p.cat === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        (p.title + p.subtitle + p.text + p.tags.join(' ')).toLowerCase().includes(q)
      )
    }
    return list
  }, [filter, search])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenu(false)
  }

  const printDossier = () => {
    window.print()
  }

  const filters = ['All', 'SOC', 'Threat Intel', 'DevSecOps', 'IoT', 'Security', 'Automation']

  return (
    <div className="app">
      {/* SCANLINE CRT EFFECT */}
      <div className="cyber-scanlines" />

      {/* SIDEBAR HUD */}
      <aside className={menu ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-mark">MJ</div>
          <div className="brand-text">
            <b>Mukesh Jena</b>
            <small>SOC & Cyber Defense</small>
          </div>
        </div>

        <nav>
          {nav.map(({ id, label, icon, badge }) => (
            <button
              key={id}
              className={active === id ? 'active' : ''}
              onClick={() => scrollTo(id)}
            >
              <span className="icon">{icon}</span>
              <span>{label}</span>
              {badge && <span className="nav-badge-pill">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="telemetry-status">
            <span className="pulse-dot" />
            <div>
              <b>SOC SENSORS: ONLINE</b>
              <small>DEFCON 2 // READY</small>
            </div>
          </div>
          <div className="sidebar-links">
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={TRYHACKME_URL} target="_blank" rel="noreferrer">TryHackMe ↗</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={DEEP_SOC_LAB_URL} target="_blank" rel="noreferrer">Deep-SOC ↗</a>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="page">
        {/* TOPBAR & FURIOUS TELEMETRY TICKER */}
        <div className="topbar-wrapper">
          <header className="topbar">
            <div className="topbar-left">
              <button className="menu-toggle" onClick={() => setMenu(!menu)}>☰</button>
              <div className="crumb">
                MUKESH_JENA // <span>SOC_OPERATIONS_CENTER</span>
              </div>
            </div>

            <div className="topbar-center">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Query telemetry, tags, protocols..."
                />
              </div>
            </div>

            <div className="topbar-right">
              <button className="cyber-btn-sm cyber-btn-accent" onClick={() => scrollTo('dossier')}>
                <span>📋</span> Operations Report
              </button>
              <a className="cyber-btn-sm" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                Connect ↗
              </a>
            </div>
          </header>

          {/* FURIOUS LIVE THREAT TELEMETRY TICKER */}
          <div className="threat-ticker">
            <div className="ticker-label">
              <span>▲</span> THREAT TELEMETRY
            </div>
            <div className="ticker-content">
              <div className="ticker-item">
                <span>[DEFCON 2: ELEVATED]</span>
                <span>//</span>
                <span>STATUS: <span className="ok">ACTIVE DEFENSE</span></span>
              </div>
              <div className="ticker-item">
                <span>SIEM ENGINE: <span className="highlight">WAZUH CLUSTER ONLINE</span></span>
                <span>//</span>
                <span>AGENTS: <span className="ok">ALL CONNECTED</span></span>
              </div>
              <div className="ticker-item">
                <span>THREAT INTEL: <span className="highlight">MISP IOC FEED (184 HASHES LOADED)</span></span>
                <span>//</span>
                <span>MATCH RATE: <span className="ok">100% CORRELATED</span></span>
              </div>
              <div className="ticker-item">
                <span>NSM PROBE: <span className="highlight">ZEEK PROTOCOL DISSECTION</span></span>
                <span>//</span>
                <span>THROUGHPUT: <span className="ok">1,420 PKTS/SEC</span></span>
              </div>
              <div className="ticker-item">
                <span>FORENSICS: <span className="highlight">WIRESHARK PCAP ANALYSIS</span></span>
                <span>//</span>
                <span>ZERO DROPS REPORTED</span>
              </div>
              <div className="ticker-item">
                <span>TRYHACKME: <span className="highlight">BLUE TEAM ROOMS ACTIVE</span></span>
                <span>//</span>
                <span>ACADEMIC: <span className="ok">MCA @ SRI SRI UNIVERSITY</span></span>
              </div>
            </div>
          </div>
        </div>

        <main>
          {/* HERO SECTION */}
          <section id="home" className="hero">
            <div className="hero-background-grid" />
            
            <div className="hero-copy">
              <div className="badge-row">
                <span className="cyber-tag danger">● DEFCON 2 / LIVE LAB</span>
                <span className="cyber-tag cyan">SOC BLUE TEAM</span>
                <span className="cyber-tag green">MCA CYBERSECURITY</span>
              </div>

              <h1>
                Hi, I'm <span className="glitch-text">Mukesh Jena</span><br />
                I Build <span className="highlight-red">Verifiable</span><br />
                Cybersecurity Labs.
              </h1>

              <p className="hero-sub">
                MCA student specializing in <b>Security Operations Center (SOC)</b> detection engineering,
                threat hunting with <b>Wazuh</b> & <b>MISP</b>, packet forensics with <b>Wireshark</b> & <b>Zeek</b>,
                and practical <b>DevSecOps</b> automation. Every project is backed by reproducible evidence.
              </p>

              <div className="hero-actions">
                <button className="btn-cyber-primary" onClick={() => scrollTo('dossier')}>
                  <span>📋</span> View Technical Report →
                </button>
                <button className="btn-cyber-outline" onClick={() => scrollTo('projects')}>
                  Inspect Labs ↘
                </button>
                <a className="btn-cyber-outline" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
                <a className="btn-cyber-outline" href={TRYHACKME_URL} target="_blank" rel="noreferrer">
                  TryHackMe ↗
                </a>
                <a className="btn-cyber-outline" href={GITHUB_URL} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </div>

              <div className="hero-spec-grid">
                <div className="spec-node">
                  <small>PRIMARY BUILD</small>
                  <b>Deep-Soc-Lab</b>
                </div>
                <div className="spec-node">
                  <small>DETECTION STACK</small>
                  <b>Wazuh + Sysmon</b>
                </div>
                <div className="spec-node">
                  <small>NETWORK NSM</small>
                  <b>Zeek + Wireshark</b>
                </div>
                <div className="spec-node">
                  <small>THREAT INTEL</small>
                  <b>MISP + SentinelX</b>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <ThreeCyberGlobe />
              <div className="radar-hud-reticle" />
              <div className="radar-sweep-beam" />

              <div className="profile-radar-badge">
                <div className="avatar-hud-ring">
                  <img src={A + 'mukesh-profile.jpg'} alt="Mukesh Jena" />
                </div>
                <div className="profile-hud-caption">
                  <b>Mukesh Jena</b>
                  <small>SOC Analyst & Cyber Defense</small>
                </div>
              </div>

              <div className="hud-widget-tl">
                <b>TARGET: DETECTION_OPS</b><br />
                SIEM STATUS: ARMED
              </div>
              <div className="hud-widget-br">
                <b>EVIDENCE: VERIFIED</b><br />
                100% REPRODUCIBLE
              </div>
            </div>
          </section>

          {/* STATS MATRIX STRIP */}
          <section className="stats-matrix">
            <div className="matrix-cell">
              <span className="cell-prefix">METRIC_01</span>
              <b>08+</b>
              <span>Active Security Projects</span>
            </div>
            <div className="matrix-cell">
              <span className="cell-prefix">METRIC_02</span>
              <b>05</b>
              <span>Core SOC Technologies</span>
            </div>
            <div className="matrix-cell">
              <span className="cell-prefix">METRIC_03</span>
              <b>06+</b>
              <span>MITRE ATT&CK TTPs Verified</span>
            </div>
            <div className="matrix-cell">
              <span className="cell-prefix">METRIC_04</span>
              <b>01</b>
              <span>IoT Academic Prototype</span>
            </div>
            <div className="matrix-cell">
              <span className="cell-prefix">METRIC_05</span>
              <b>24/7</b>
              <span>Adversary Defense Mindset</span>
            </div>
          </section>

          {/* ABOUT & INTERACTIVE TERMINAL SECTION */}
          <section id="about" className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">01 // ANALYST IDENTITY</div>
                <h2>A Real Defender Behind The Lab</h2>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--neon-cyan)' }}>
                Sri Sri University // MCA Track
              </span>
            </div>

            <div className="about-grid">
              <div className="about-card">
                <p className="about-bio">
                  I am an MCA student at <b>Sri Sri University</b> committed to mastering real-world cybersecurity
                  operations. Rather than relying on conceptual trivia, I construct end-to-end, reproducible
                  security detection labs from scratch.
                </p>
                <p className="about-bio">
                  My signature infrastructure project, <b>Deep-Soc-Lab</b>, bridges <b>Wazuh SIEM</b>,
                  <b>MISP Threat Intelligence</b>, <b>Zeek Network Telemetry</b>, and <b>Sysmon</b> into a unified
                  pipeline that mirrors how Tier-1/Tier-2 enterprise Security Operation Centers identify, enrich,
                  and mitigate active adversary behavior.
                </p>

                <div className="analyst-spec-cards">
                  <div className="analyst-spec-node">
                    <small>MISSION</small>
                    <b>SOC Analyst / Blue Team</b>
                  </div>
                  <div className="analyst-spec-node">
                    <small>METHODOLOGY</small>
                    <b>Build · Test · Document</b>
                  </div>
                  <div className="analyst-spec-node">
                    <small>FRAMEWORKS</small>
                    <b>MITRE ATT&CK · NIST CSF</b>
                  </div>
                </div>
              </div>

              <div>
                <InteractiveTerminal />
              </div>
            </div>
          </section>

          {/* ==========================================================
              EXECUTIVE SOC DOSSIER & WORK REPORT (USER SPECIAL REQUEST)
              ========================================================== */}
          <section id="dossier" className="section darker">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">02 // SPECIAL COMPREHENSIVE DELIVERABLE</div>
                <h2>Executive SOC Dossier & Technical Work Report</h2>
              </div>
              <button className="btn-cyber-primary" onClick={printDossier}>
                <span>📄</span> Export / Print Dossier (PDF)
              </button>
            </div>

            <div className="dossier-hero-card">
              <div className="dossier-header-bar">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span className="cyber-tag cyan">TECHNICAL REPORT // VER 2.8</span>
                    <span className="cyber-tag green">100% LAB-VERIFIED</span>
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
                    Mukesh Jena: Comprehensive Security Operations & Engineering Portfolio Report
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                    A consolidated audit of all completed security research, simulated intrusion detections, telemetry architectures, and lab artifacts.
                  </p>
                </div>

                <div className="dossier-meta">
                  <span>ANALYST: <b>Mukesh Jena</b></span>
                  <span>INSTITUTION: <b>Sri Sri University (MCA)</b></span>
                  <span>FOCUS: <b>SOC / SIEM / DevSecOps</b></span>
                  <span>CLEARANCE: <b>Public Portfolio Dossier</b></span>
                </div>
              </div>

              {/* DOSSIER TABS */}
              <div className="dossier-tabs">
                <button
                  className={`dossier-tab-btn ${reportTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setReportTab('summary')}
                >
                  <span>📋</span> 01. Executive Overview & Methodology
                </button>
                <button
                  className={`dossier-tab-btn ${reportTab === 'mitre' ? 'active' : ''}`}
                  onClick={() => setReportTab('mitre')}
                >
                  <span>🛡️</span> 02. MITRE ATT&CK Mapping Matrix
                </button>
                <button
                  className={`dossier-tab-btn ${reportTab === 'labs' ? 'active' : ''}`}
                  onClick={() => setReportTab('labs')}
                >
                  <span>🔬</span> 03. All 8 Lab Case Investigations
                </button>
              </div>

              {/* TAB 1: EXECUTIVE SUMMARY */}
              {reportTab === 'summary' && (
                <div className="dossier-summary-grid">
                  <div className="dossier-box">
                    <h3><span>◈</span> Executive Statement & Defense Philosophy</h3>
                    <p>
                      Modern cyber defense requires more than theoretical certifications; it demands hands-on mastery of telemetry,
                      log aggregation, indicator-of-compromise (IOC) correlation, and protocol inspection.
                    </p>
                    <p>
                      Throughout my MCA program and specialized internships, I have engineered repeatable virtual security testbeds
                      designed to validate adversary tradecraft against active monitoring systems. All 8 projects showcased below contain
                      reproducible evidence—from live Wireshark packet dumps to Sysmon event logs and Wazuh SIEM rule triggers.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span className="cyber-tag cyan">Host Telemetry</span>
                      <span className="cyber-tag green">Network NSM</span>
                      <span className="cyber-tag danger">Threat Intel</span>
                      <span className="cyber-tag cyan">Hardware Security</span>
                    </div>
                  </div>

                  <div className="dossier-box">
                    <h3><span>⚙</span> 4-Phase Lab Investigation Framework</h3>
                    <div className="methodology-list">
                      <div className="method-item">
                        <span className="method-num">01</span>
                        <div className="method-text">
                          <b>Simulated Adversary Execution</b>
                          <span>Trigger controlled attacks (brute force, LOLBins, persistence, port scans).</span>
                        </div>
                      </div>
                      <div className="method-item">
                        <span className="method-num">02</span>
                        <div className="method-text">
                          <b>Telemetry & Log Harvesting</b>
                          <span>Capture endpoint telemetry via Sysmon/Wazuh and network flow via Zeek/Wireshark.</span>
                        </div>
                      </div>
                      <div className="method-item">
                        <span className="method-num">03</span>
                        <div className="method-text">
                          <b>Threat Intelligence Correlation</b>
                          <span>Enrich extracted IOCs with MISP REST API for threat actor and campaign attribution.</span>
                        </div>
                      </div>
                      <div className="method-item">
                        <span className="method-num">04</span>
                        <div className="method-text">
                          <b>Rule Tuning & Evidence Packaging</b>
                          <span>Refine alert thresholds, eliminate false positives, and compile forensic proof.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MITRE MATRIX */}
              {reportTab === 'mitre' && (
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                    The following matrix details the enterprise tactics and techniques actively simulated and detected across my lab configurations.
                  </p>
                  <div className="mitre-table-wrapper">
                    <table className="mitre-table">
                      <thead>
                        <tr>
                          <th>Tactic Phase</th>
                          <th>Technique ID</th>
                          <th>Technique Name</th>
                          <th>Detection Sensor</th>
                          <th>Telemetry / Rule Source</th>
                          <th>Validation State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mitreMatrix.map((m) => (
                          <tr key={m.id}>
                            <td><b style={{ color: '#fff' }}>{m.tactic}</b></td>
                            <td><span className="mitre-badge">{m.id}</span></td>
                            <td>{m.name}</td>
                            <td>{m.tool}</td>
                            <td><code>{m.event}</code></td>
                            <td>
                              <span className="mitre-status-ok">
                                ● {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ALL 8 LAB INVESTIGATIONS */}
              {reportTab === 'labs' && (
                <div className="dossier-labs-grid">
                  {projects.map((p, idx) => (
                    <div key={p.id} className="lab-report-card">
                      <div className="lab-report-top">
                        <span className="lab-report-id">INVESTIGATION_CASE_0{idx + 1}</span>
                        <span className="cyber-tag cyan">{p.cat}</span>
                      </div>
                      <div className="lab-report-title">{p.title}</div>
                      <div className="lab-report-desc">{p.text}</div>
                      
                      <div className="lab-report-details">
                        <div><b>SIMULATED VECTOR: </b> <span style={{ color: '#ff6699' }}>{p.attackVector}</span></div>
                        <div><b>DETECTION APPARATUS: </b> <span style={{ color: '#00f0ff' }}>{p.detectionMethod}</span></div>
                        <div><b>VERIFIED DELIVERABLE: </b> <span style={{ color: '#00ff88' }}>{p.outcome}</span></div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div className="tag-cloud">
                          {p.tags.slice(0, 3).map((t) => (
                            <span key={t} className="tag-pill">{t}</span>
                          ))}
                        </div>
                        <button className="cyber-btn-sm" onClick={() => setSelected(p)}>
                          Inspect Proof ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* PROJECTS SECTION */}
          <section id="projects" className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">03 // SELECTED SECURITY WORKS</div>
                <h2>Interactive Project Showcase</h2>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                Showing {filteredProjects.length} of {projects.length} Labs
              </span>
            </div>

            <div className="filter-tabs">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="projects-grid">
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} p={p} onOpen={setSelected} />
              ))}
            </div>
          </section>

          {/* SOC LAB EVIDENCE SECTION */}
          <section id="soc" className="section darker">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">04 // TELEMETRY ARTIFACTS</div>
                <h2>Deep SOC Detection & PCAP Evidence</h2>
              </div>
              <a className="btn-cyber-outline" href={DEEP_SOC_LAB_URL} target="_blank" rel="noreferrer">
                Open Deep-Soc-Lab on GitHub ↗
              </a>
            </div>

            <div className="soc-evidence-grid">
              <div className="featured-evidence">
                <img src={A + 'wazuh-mitre.png'} alt="Wazuh MITRE ATT&CK Dashboard" />
                <div className="evidence-caption-bar">
                  <b>Wazuh SIEM // MITRE ATT&CK Correlation Engine</b>
                  <span>LIVE ENDPOINT TELEMETRY</span>
                </div>
              </div>

              <div className="soc-sensor-stack">
                <div className="sensor-card">
                  <div className="sensor-header">
                    <b>Wazuh SIEM</b>
                    <span className="status">● ONLINE</span>
                  </div>
                  <p>Real-time event logging, rule correlation, agent heartbeats, and alert generation.</p>
                </div>

                <div className="sensor-card">
                  <div className="sensor-header">
                    <b>MISP Threat Sharing</b>
                    <span className="status">● SYNCHRONIZED</span>
                  </div>
                  <p>Automated IOC ingestion, threat scoring, and hash enrichment via REST API.</p>
                </div>

                <div className="sensor-card">
                  <div className="sensor-header">
                    <b>Zeek NSM</b>
                    <span className="status">● ACTIVE</span>
                  </div>
                  <p>Network protocol metadata generation, DNS tunneling checks, and connection tracking.</p>
                </div>

                <div className="sensor-card">
                  <div className="sensor-header">
                    <b>Wireshark Forensics</b>
                    <span className="status">● VERIFIED</span>
                  </div>
                  <p>Live packet capture analysis, stream reassembly, and rogue packet identification.</p>
                </div>
              </div>
            </div>

            <div className="evidence-thumbnail-strip">
              {['wazuh-threat-hunting.png', 'misp-event.png', 'misp-api.png', 'wireshark-pcap.png', 'deep-soc-github.png'].map((img) => (
                <img
                  key={img}
                  src={A + img}
                  alt="SOC Lab Evidence"
                  onClick={() => setSelected(projects[0])}
                  title="Click to view lab evidence in modal"
                />
              ))}
            </div>
          </section>

          {/* DEVSECOPS & CLOUD */}
          <section id="devops" className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">05 // SECURE INFRASTRUCTURE</div>
                <h2>DevSecOps & Cloud Security Track</h2>
              </div>
            </div>

            <div className="devops-cards-grid">
              <div className="devops-node">
                <span className="step-num">PHASE_01</span>
                <h3>Linux & Virtualization Hardening</h3>
                <p>
                  Isolated host environments built on Ubuntu Server, VirtualBox network sandboxing, SSH key authentication,
                  and firewall policies to simulate corporate subnets.
                </p>
                <img src={A + 'virtualbox-disk.png'} alt="VirtualBox setup" />
              </div>

              <div className="devops-node">
                <span className="step-num">PHASE_02</span>
                <h3>Container & Cloud Security</h3>
                <p>
                  Exploring Docker container security, image scanning with Trivy, Kubernetes cluster fundamentals,
                  and infrastructure-as-code automation using Terraform.
                </p>
                <div className="skill-pills-row" style={{ marginTop: '20px' }}>
                  <span>Docker</span>
                  <span>Kubernetes</span>
                  <span>Terraform</span>
                  <span>AWS</span>
                  <span>GitHub Actions</span>
                </div>
              </div>

              <div className="devops-node">
                <span className="step-num">PHASE_03</span>
                <h3>Shift-Left CI/CD Pipeline</h3>
                <p>
                  Integrating SAST, DAST, dependency review, and automated secret scanning into GitHub Actions
                  workflows to catch misconfigurations before production deployment.
                </p>
                <button
                  className="btn-cyber-outline"
                  style={{ marginTop: '25px', width: '100%', justifyContent: 'center' }}
                  onClick={() => scrollTo('dossier')}
                >
                  View Operations Report →
                </button>
              </div>
            </div>
          </section>

          {/* IOT PROJECT */}
          <section id="iot" className="section darker">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">06 // HARDWARE TELEMETRY</div>
                <h2>IoT Temperature & Humidity Monitor</h2>
              </div>
              <a className="btn-cyber-outline" href={A + 'IOT_Project_Report_Team.pdf'} target="_blank" rel="noreferrer">
                Download Academic Report (PDF) ↗
              </a>
            </div>

            <div className="iot-showcase">
              <img src={A + 'iot-hardware.png'} alt="Arduino UNO hardware circuit" />
              <div className="iot-details-box">
                <div className="cyber-tag cyan" style={{ width: 'max-content', marginBottom: '12px' }}>
                  MCA ACADEMIC HARDWARE RESEARCH
                </div>
                <h3>Arduino UNO + DHT11 + Python Voice Alert</h3>
                <p>
                  Designed and assembled an embedded telemetry monitor that polls real-time ambient temperature and humidity
                  readings via serial protocol, feeding into a Python daemon that triggers automated speech warnings when safety
                  thresholds are breached.
                </p>

                <div className="iot-spec-list">
                  <div className="iot-spec-item">
                    <small>MICROCONTROLLER</small>
                    <b>Arduino UNO R3 + DHT11 Sensor</b>
                  </div>
                  <div className="iot-spec-item">
                    <small>SOFTWARE STACK</small>
                    <b>Python 3.10 · pyttsx3 · pySerial</b>
                  </div>
                  <div className="iot-spec-item">
                    <small>REPORT DELIVERABLE</small>
                    <b>Peer-Reviewed Academic Team Research Report</b>
                  </div>
                </div>
              </div>
              <img src={A + 'iot-architecture.png'} alt="IoT circuit architecture schematic" />
            </div>
          </section>

          {/* SKILLS ARSENAL */}
          <section id="skills" className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">07 // TECHNICAL TOOLBOX</div>
                <h2>Tactical Defense Arsenal</h2>
              </div>
            </div>

            <div className="skills-quad-grid">
              <div className="skill-category-card">
                <h3><span>◈</span> SOC & Threat Detection</h3>
                <div className="skill-pills-row">
                  <span>Wazuh SIEM</span>
                  <span>Sysmon</span>
                  <span>MITRE ATT&CK</span>
                  <span>MISP Threat Intel</span>
                  <span>Zeek NSM</span>
                  <span>Wireshark</span>
                  <span>Splunk Basics</span>
                  <span>Incident Triage</span>
                </div>
              </div>

              <div className="skill-category-card">
                <h3><span>⚙</span> Systems & Networking</h3>
                <div className="skill-pills-row">
                  <span>Linux (Ubuntu / Debian)</span>
                  <span>Windows Server & 11</span>
                  <span>VirtualBox</span>
                  <span>TCP/IP Suite</span>
                  <span>DNS & HTTP Forensics</span>
                  <span>Subnetting & Routing</span>
                  <span>Firewall Configuration</span>
                </div>
              </div>

              <div className="skill-category-card">
                <h3><span>⌁</span> Programming & Scripting</h3>
                <div className="skill-pills-row">
                  <span>Python 3 (SecOps)</span>
                  <span>Bash Shell</span>
                  <span>REST API Automation</span>
                  <span>Git & GitHub</span>
                  <span>Log Parsing (Regex / JSON)</span>
                  <span>Arduino C++</span>
                </div>
              </div>

              <div className="skill-category-card">
                <h3><span>◆</span> DevSecOps & Cloud</h3>
                <div className="skill-pills-row">
                  <span>Docker Containers</span>
                  <span>Kubernetes Concepts</span>
                  <span>GitHub Actions CI/CD</span>
                  <span>Terraform IaC</span>
                  <span>AWS Fundamentals</span>
                  <span>Secret Scanning</span>
                </div>
              </div>
            </div>
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="section darker">
            <div className="section-head">
              <div>
                <div className="eyebrow-tag">08 // CREDENTIALS & LEARNING TRACK</div>
                <h2>Certifications & Hands-on Practice</h2>
              </div>
            </div>

            <div className="cert-cards-row">
              {certifications.map((c) => (
                <div
                  key={c.name}
                  className={`cert-cyber-card ${c.kind === 'active' ? 'active-cert' : ''}`}
                  onClick={() => c.link && window.open(c.link, '_blank')}
                  style={c.link ? { cursor: 'pointer' } : {}}
                >
                  <span className={`cert-status-badge ${c.kind}`}>
                    {c.status}
                  </span>
                  <h3>{c.name}</h3>
                  <p>{c.note}</p>
                  {c.link && (
                    <span className="link-arrow">
                      View Verified Profile ↗
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section id="contact" className="section">
            <div className="contact-grid">
              <div className="contact-left">
                <div className="eyebrow-tag">09 // SECURE TRANSMISSION</div>
                <h2>Let's Build Something Resilient.</h2>
                <p>
                  I am actively seeking SOC Analyst, Security Engineer, and Blue Team internship/full-time opportunities.
                  Feel free to review my repositories, inspect my lab captures, or send me an inquiry directly.
                </p>
              </div>

              <div className="contact-buttons">
                <a className="btn-cyber-primary" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                  Connect on LinkedIn ↗
                </a>
                <a className="btn-cyber-outline" href={TRYHACKME_URL} target="_blank" rel="noreferrer">
                  TryHackMe Profile ↗
                </a>
                <a className="btn-cyber-outline" href={GITHUB_URL} target="_blank" rel="noreferrer">
                  GitHub Profile ↗
                </a>
                <a className="btn-cyber-outline" href="mailto:mukeshkujena127@gmail.com">
                  Email Mukesh ✉
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer>
          <div>
            © {new Date().getFullYear()} Mukesh Jena // Cyber Defense & SOC Engineering
          </div>
          <div>
            Built with React, Vite, Three.js & Verifiable Evidence
          </div>
          <button onClick={() => scrollTo('home')}>Back to Top ↑</button>
        </footer>
      </div>

      {/* POPUP EVIDENCE MODAL */}
      <Modal project={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
createRoot(document.getElementById('root')).render(<App />)
