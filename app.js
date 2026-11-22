const roleOrder = ["student", "tutor", "advisor", "director"];

const roleFlows = {
  student: {
    name: "Estudiante",
    icon: "♙",
    title: "Registro y desarrollo de la práctica",
    subtitle: "El estudiante consulta su práctica, desarrolla actividades y entrega evidencias.",
    steps: [
      [
        "Consulta su práctica",
        "La interfaz React solicita al monolito la práctica asignada y sus avances en PostgreSQL.",
        ["actor", "ui", "core", "db"],
        "Lectura inicial",
        "GET /practica"
      ],
      [
        "Entrega actividades y evidencias",
        "El estudiante sube avances desde React; el monolito valida la sesión, guarda datos en PostgreSQL y almacena archivos en Cloudinary.",
        ["actor", "ui", "core", "db"],
        "Persistencia + Archivo",
        "POST /evidencia"
      ],
      [
        "Responde evaluaciones",
        "El estudiante responde cuestionarios desde React; el monolito reenvía sus respuestas al microservicio FastAPI para registrar el intento.",
        ["actor", "ui", "core", "eval"],
        "Microservicio",
        "POST /respuestas"
      ],
      [
        "Consulta su progreso y notas",
        "El monolito consolida en PostgreSQL el avance de actividades, observaciones y estado general de la práctica.",
        ["core", "db"],
        "Seguimiento",
        "SQL + Resultados"
      ],
      [
        "Activa avisos de seguimiento",
        "El monolito emite el evento al microservicio de notificaciones, que guarda la cola e historial en MongoDB.",
        ["core", "notif"],
        "Notificación",
        "Evento → Alerta"
      ]
    ]
  },
  tutor: {
    name: "Tutor académico",
    icon: "♧",
    title: "Acompañamiento y evaluación",
    subtitle: "El tutor organiza actividades, revisa evidencias y realiza evaluaciones.",
    steps: [
      [
        "Consulta estudiantes asignados",
        "El tutor abre su panel; React pide al monolito la lista de estudiantes y prácticas de PostgreSQL.",
        ["actor", "ui", "core", "db"],
        "Consulta de grupo",
        "GET /estudiantes"
      ],
      [
        "Crea y asigna actividades",
        "El monolito valida los permisos del tutor y registra nuevas actividades y fechas en PostgreSQL.",
        ["actor", "ui", "core", "db"],
        "Asignación",
        "POST /actividad"
      ],
      [
        "Revisa evidencias y retroalimenta",
        "El monolito consulta las referencias de evidencias y guarda las observaciones del tutor en la base de datos.",
        ["core", "db"],
        "Revisión",
        "SQL + Evidencia"
      ],
      [
        "Gestiona una evaluación",
        "El monolito se comunica por API REST con el microservicio FastAPI para registrar cuestionarios o notas.",
        ["core", "eval"],
        "Microservicio",
        "API FastAPI"
      ],
      [
        "Notifica el resultado",
        "Se actualiza el seguimiento en el monolito y el servicio de notificaciones despacha el aviso al estudiante.",
        ["core", "notif"],
        "Aviso de nota",
        "Evento → Correo"
      ]
    ]
  },
  advisor: {
    name: "Asesor pedagógico",
    icon: "✧",
    title: "Acompañamiento pedagógico",
    subtitle: "El asesor consulta el proceso, registra observaciones y apoya el seguimiento.",
    steps: [
      [
        "Accede al seguimiento",
        "El frontend carga los estudiantes y prácticas habilitadas según los permisos del asesor.",
        ["actor", "ui", "core", "db"],
        "Acceso por rol",
        "GET /seguimiento"
      ],
      [
        "Consulta avances y evidencias",
        "El monolito obtiene los registros de avance y las referencias de archivos asociadas a la práctica.",
        ["core", "db"],
        "Lectura de avances",
        "SQL + Cloudinary"
      ],
      [
        "Registra observaciones pedagógicas",
        "La observación enviada desde React se valida en Node.js + Express y se persiste en PostgreSQL.",
        ["actor", "ui", "core", "db"],
        "Registro",
        "POST /observacion"
      ],
      [
        "Comparte retroalimentación",
        "La información queda consolidada en PostgreSQL para que los participantes autorizados la consulten.",
        ["core", "db"],
        "Disponibilidad",
        "UPDATE estado"
      ],
      [
        "Genera avisos cuando aplica",
        "Los eventos relevantes de seguimiento se envían al microservicio de notificaciones en MongoDB.",
        ["core", "notif"],
        "Notificación",
        "Evento → Aviso"
      ]
    ]
  },
  director: {
    name: "Director",
    icon: "▤",
    title: "Supervisión e informes",
    subtitle: "El director revisa el estado general de las prácticas y consulta indicadores.",
    steps: [
      [
        "Abre el panel de dirección",
        "React carga la vista ejecutiva y solicita al monolito las opciones habilitadas para el rol director.",
        ["actor", "ui", "core"],
        "Autenticación",
        "JWT + Rol"
      ],
      [
        "Consulta información consolidada",
        "El monolito consulta prácticas, usuarios y estados de seguimiento desde PostgreSQL.",
        ["core", "db"],
        "Consolidado",
        "SELECT global"
      ],
      [
        "Prepara indicadores y reportes",
        "Los servicios de negocio procesan métricas por programa y cohorte en PostgreSQL para visualizar o exportar.",
        ["core", "db"],
        "Analítica",
        "Métricas SQL"
      ],
      [
        "Visualiza resultados de evaluación",
        "El director consulta en modo solo lectura los resultados y el desempeño general desde el microservicio FastAPI.",
        ["actor", "ui", "core", "eval"],
        "Solo lectura",
        "GET /evaluaciones"
      ],
      [
        "Recibe avisos y notificaciones",
        "El microservicio de notificaciones en MongoDB gestiona alertas del programa y novedades para el director.",
        ["core", "notif"],
        "Notificación",
        "Evento → Director"
      ]
    ]
  }
};

const nodeDescriptions = {
  actor: "Rol activo en SPP (Estudiante, Tutor, Asesor o Director). Cada rol ve únicamente las acciones permitidas.",
  ui: "Frontend web en React 19 + Vite. Presenta formularios, paneles y evidencias según los permisos del usuario.",
  core: "Monolito principal en Node.js + Express. Valida sesiones, aplica reglas de negocio y coordina datos y microservicios.",
  db: "Persistencia del monolito: PostgreSQL / Supabase para datos relacionales y Cloudinary para archivos multimedia.",
  eval: "Microservicio independiente en Python + FastAPI con su propia base PostgreSQL para cuestionarios y calificaciones.",
  notif: "Microservicio en Node.js + Express con MongoDB encargado de la cola, historial y envío de alertas y correos."
};

const edgeDefinitions = [
  ["actor", "ui"],
  ["ui", "core"],
  ["core", "db"],
  ["core", "eval"],
  ["core", "notif"]
];

let currentRole = "student";
let currentStep = 0;
let playing = false;
let tourAllRoles = false;
let timer = null;
let packetRaf = null;
let selectedTipNode = null;

const $ = id => document.getElementById(id);

const nodes = {
  actor: $("actorNode"),
  ui: $("uiNode"),
  core: $("coreNode"),
  db: $("dbNode"),
  eval: $("evalNode"),
  notif: $("notifNode")
};

function isMobileDiagram() {
  return window.innerWidth <= 760;
}

function getBoxRelative(el, containerRect) {
  const r = el.getBoundingClientRect();
  return {
    left: r.left - containerRect.left,
    top: r.top - containerRect.top,
    right: r.right - containerRect.left,
    bottom: r.bottom - containerRect.top,
    width: r.width,
    height: r.height,
    cx: r.left - containerRect.left + r.width / 2,
    cy: r.top - containerRect.top + r.height / 2
  };
}

function buildEdgePath(fromKey, toKey, boxes) {
  const a = boxes[fromKey];
  const b = boxes[toKey];
  const mobile = isMobileDiagram();

  if (!mobile) {
    const x1 = a.right;
    const y1 = a.cy;
    const x2 = b.left;
    const y2 = b.cy;
    const dx = (x2 - x1) * 0.55;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + dx).toFixed(1)} ${y1.toFixed(1)}, ${(x2 - dx).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  if (fromKey === "actor" && toKey === "ui") {
    const x1 = a.right;
    const y1 = a.cy;
    const x2 = b.left;
    const y2 = b.cy;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  if (fromKey === "ui" && toKey === "core") {
    const x1 = a.cx;
    const y1 = a.bottom;
    const x2 = b.cx + b.width * 0.18;
    const y2 = b.top;
    const midY = (y1 + y2) / 2;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${midY.toFixed(1)}, ${x2.toFixed(1)} ${midY.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  const offsetX = fromKey === "core" && toKey === "db" ? -b.width * 0.15 : fromKey === "core" && toKey === "eval" ? b.width * 0.15 : 0;
  const x1 = a.cx + offsetX;
  const y1 = a.bottom;
  const x2 = b.cx;
  const y2 = b.top;
  const midY = (y1 + y2) / 2;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${midY.toFixed(1)}, ${x2.toFixed(1)} ${midY.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function drawEdges(activeHops = []) {
  const diagram = $("diagram");
  const svg = $("connectionsSvg");
  const layer = $("edgesLayer");
  const rect = diagram.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
  const boxes = {};
  Object.entries(nodes).forEach(([k, el]) => {
    boxes[k] = getBoxRelative(el, rect);
  });

  const activePairs = new Set();
  for (let i = 0; i < activeHops.length - 1; i++) {
    activePairs.add(`${activeHops[i]}-${activeHops[i + 1]}`);
  }

  layer.innerHTML = "";
  edgeDefinitions.forEach(([from, to]) => {
    const key = `${from}-${to}`;
    const isActive = activePairs.has(key);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", buildEdgePath(from, to, boxes));
    path.setAttribute("data-edge", key);
    path.setAttribute("class", isActive ? "edge active" : "edge");
    path.setAttribute("marker-end", isActive ? "url(#arrowActive)" : "url(#arrowIdle)");
    layer.appendChild(path);
  });
}

function renderFlowChain(hops) {
  const container = $("flowChain");
  container.innerHTML = "";
  const flow = roleFlows[currentRole];

  hops.forEach((key, idx) => {
    const chip = document.createElement("span");
    chip.className = "chain-chip";
    chip.dataset.hop = key;
    const label = key === "actor" ? flow.name : nodes[key].querySelector("b").textContent;
    const symbol = key === "actor" ? flow.icon : nodes[key].querySelector(".node-symbol").textContent;
    chip.textContent = `${symbol} ${label}`;
    container.appendChild(chip);

    if (idx < hops.length - 1) {
      const arrow = document.createElement("span");
      arrow.className = "chain-arrow";
      arrow.textContent = "→";
      container.appendChild(arrow);
    }
  });
}

function highlightHop(nodeKey) {
  Object.entries(nodes).forEach(([k, el]) => {
    el.classList.toggle("hop-focus", k === nodeKey);
  });
  document.querySelectorAll(".chain-chip").forEach(chip => {
    chip.classList.toggle("is-hop", chip.dataset.hop === nodeKey);
  });
}

function stopPacketAnimation() {
  if (packetRaf) {
    cancelAnimationFrame(packetRaf);
    packetRaf = null;
  }
  $("packet").classList.remove("go");
  highlightHop(null);
}

function animateHops(hops, label) {
  stopPacketAnimation();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!hops || hops.length < 2) return;

  const packet = $("packet");
  const packetLabel = $("packetLabel");
  packetLabel.textContent = label || "HTTP";

  const segments = [];
  for (let i = 0; i < hops.length - 1; i++) {
    const pathEl = document.querySelector(`#edgesLayer path[data-edge="${hops[i]}-${hops[i + 1]}"]`);
    if (pathEl) {
      segments.push({ from: hops[i], to: hops[i + 1], path: pathEl, len: pathEl.getTotalLength() });
    }
  }
  if (!segments.length) return;

  const segDuration = Math.min(720, Math.max(460, Math.floor(2100 / segments.length)));
  let segIndex = 0;
  let segStart = null;

  packet.classList.add("go");
  highlightHop(segments[0].from);

  function frame(ts) {
    if (!segStart) segStart = ts;
    const seg = segments[segIndex];
    const progress = Math.min(1, (ts - segStart) / segDuration);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const pt = seg.path.getPointAtLength(seg.len * eased);

    packet.style.left = `${pt.x}px`;
    packet.style.top = `${pt.y}px`;

    if (progress >= 1) {
      highlightHop(seg.to);
      segIndex++;
      if (segIndex < segments.length) {
        segStart = ts;
        packetRaf = requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          if (!playing) highlightHop(null);
        }, 650);
      }
      return;
    }

    packetRaf = requestAnimationFrame(frame);
  }

  packetRaf = requestAnimationFrame(frame);
}

function updateModePill() {
  const pill = $("modePill");
  if (tourAllRoles && playing) {
    const idx = roleOrder.indexOf(currentRole) + 1;
    pill.classList.add("tour");
    pill.innerHTML = `<span></span> RECORRIDO · ROL ${idx}/${roleOrder.length}`;
  } else {
    pill.classList.remove("tour");
    pill.innerHTML = `<span></span> SIMULACIÓN`;
  }
}

function render(animate = true) {
  const flow = roleFlows[currentRole];
  const step = flow.steps[currentStep];
  const [stepTitle, stepText, hops, badge, packetLabel] = step;

  $("flowTitle").textContent = `${flow.name} · ${flow.title}`;
  $("flowSubtitle").textContent = flow.subtitle;
  $("actorNode").querySelector("b").textContent = flow.name;
  $("actorNode").querySelector(".node-symbol").textContent = flow.icon;

  $("stepCurrent").textContent = String(currentStep + 1).padStart(2, "0");
  $("stepTotal").textContent = String(flow.steps.length).padStart(2, "0");
  $("stepBadge").textContent = badge;
  $("stepTitle").textContent = stepTitle;
  $("stepText").textContent = stepText;
  $("progressBar").style.width = `${((currentStep + 1) / flow.steps.length) * 100}%`;
  $("playBtn").textContent = playing ? "Ⅱ Pausar" : "▶ Reproducir";

  Object.entries(nodes).forEach(([key, node]) => {
    node.classList.toggle("active", hops.includes(key));
  });

  renderFlowChain(hops);
  drawEdges(hops);
  updateModePill();

  const dotsContainer = $("stepDots");
  dotsContainer.innerHTML = "";
  flow.steps.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = i === currentStep ? "active" : "";
    b.setAttribute("aria-label", `Ir al paso ${i + 1}`);
    b.onclick = () => {
      pause();
      currentStep = i;
      render(true);
    };
    dotsContainer.appendChild(b);
  });

  document.querySelectorAll(".role-card").forEach(card => {
    card.classList.toggle("active", card.dataset.role === currentRole);
  });

  if (animate) {
    animateHops(hops, packetLabel);
  }
}

function pause() {
  playing = false;
  tourAllRoles = false;
  clearInterval(timer);
  timer = null;
  stopPacketAnimation();
  $("playBtn").textContent = "▶ Reproducir";
  updateModePill();
}

function advanceStep() {
  const max = roleFlows[currentRole].steps.length;
  if (currentStep < max - 1) {
    currentStep++;
    render(true);
    return;
  }

  if (tourAllRoles) {
    const nextRoleIdx = roleOrder.indexOf(currentRole) + 1;
    if (nextRoleIdx < roleOrder.length) {
      currentRole = roleOrder[nextRoleIdx];
      currentStep = 0;
      render(true);
      return;
    }
  }

  pause();
}

function play(fullTour = false) {
  if (playing) {
    pause();
    return;
  }
  tourAllRoles = fullTour;
  if (!fullTour && currentStep === roleFlows[currentRole].steps.length - 1) {
    currentStep = 0;
  }
  playing = true;
  render(true);
  timer = setInterval(advanceStep, 4200);
}

function selectRole(role) {
  pause();
  currentRole = role;
  currentStep = 0;
  render(true);
  $("explorador").scrollIntoView({ behavior: "smooth", block: "start" });
}

Object.entries(nodes).forEach(([key, el]) => {
  el.addEventListener("click", () => {
    const tip = $("nodeTip");
    if (selectedTipNode === key && !tip.hidden) {
      tip.hidden = true;
      selectedTipNode = null;
      return;
    }
    selectedTipNode = key;
    const title = key === "actor" ? roleFlows[currentRole].name : el.querySelector("b").textContent;
    $("nodeTipTitle").textContent = `${title}:`;
    $("nodeTipText").textContent = nodeDescriptions[key];
    tip.hidden = false;
  });
});

document.querySelectorAll(".role-card").forEach(card => {
  card.addEventListener("click", () => selectRole(card.dataset.role));
});

$("startTour").addEventListener("click", () => {
  pause();
  currentRole = "student";
  currentStep = 0;
  play(true);
  $("explorador").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("exploreBtn").addEventListener("click", () => {
  $("explorador").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("playBtn").addEventListener("click", () => play(false));

$("nextStep").addEventListener("click", () => {
  pause();
  const max = roleFlows[currentRole].steps.length;
  if (currentStep < max - 1) {
    currentStep++;
    render(true);
  }
});

$("prevStep").addEventListener("click", () => {
  pause();
  currentStep = Math.max(0, currentStep - 1);
  render(true);
});

$("resetBtn").addEventListener("click", () => {
  pause();
  currentStep = 0;
  render(true);
});

let resizeRaf = null;
window.addEventListener("resize", () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    const hops = roleFlows[currentRole].steps[currentStep][2];
    drawEdges(hops);
  });
});

window.addEventListener("load", () => render(true));
render(false);
