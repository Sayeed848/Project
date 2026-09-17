/* ==========================================================================
   Mehndi Queen Studio - JavaScript Logic
   ========================================================================== */

/* ==========================================================================
   MANUAL PHOTO CONFIGURATION SECTION
   Replace any photo URL below with your own custom image URL or relative path!
   ========================================================================== */

// --- 1. Gallery Photos Configuration (Change photos & titles manually here) ---
const GALLERY_ITEMS = [
  { cat: "Bridal",   src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", title: "Bridal Royal Pattern 1" },
  { cat: "Arabic",   src: "https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?auto=format&fit=crop&w=800&q=80", title: "Arabic Floral Trail 2" },
  { cat: "Indian",   src: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", title: "Traditional Indian Mandala 3" },
  { cat: "Festival", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80", title: "Festival Special Feet 4" },
  { cat: "Minimal",  src: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80", title: "Minimal Wrist Design 5" },
  { cat: "Royal",    src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", title: "Royal Full Arm Heritage 6" },
  { cat: "Bridal",   src: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80", title: "Bridal Grand Collection 7" },
  { cat: "Arabic",   src: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80", title: "Arabic Modern Vine 8" },
  { cat: "Indian",   src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80", title: "Classic Peacock Pattern 9" },
  { cat: "Festival", src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", title: "Karva Chauth Special 10" },
  { cat: "Minimal",  src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80", title: "Chic Finger Accents 11" },
  { cat: "Royal",    src: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80", title: "Queen Rajasthani Style 12" },
  { cat: "Bridal",   src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", title: "Dulhan Heavy Mehndi 13" },
  { cat: "Arabic",   src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80", title: "Dubai Palm Motif 14" },
  { cat: "Indian",   src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80", title: "Marwari Delicate Art 15" }
];

// --- 2. Customer Avatar Photos Configuration (Change user avatars manually here) ---
const CUSTOMER_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80"
];

// --- Helper Utility Functions ---
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

// --- Toast Notification ---
function toast(m, e) {
  let t = $("#toast");
  t.textContent = m;
  t.className = "toast show" + (e ? " error" : "");
  clearTimeout(window.tt);
  window.tt = setTimeout(() => (t.className = "toast"), 2600);
}

// --- Preloader & Theme Setup ---
addEventListener("load", () => setTimeout(() => $("#preloader").classList.add("hide"), 350));

$(".theme").onclick = () => {
  let isDark = document.documentElement.getAttribute("data-theme") === "dark";
  document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  localStorage.mqTheme = isDark ? "light" : "dark";
};

if (localStorage.mqTheme) {
  document.documentElement.setAttribute("data-theme", localStorage.mqTheme);
}

// --- Mobile Navigation Drawer ---
$(".menu").onclick = () => {
  $(".drawer").classList.add("open");
  $(".shade").classList.add("open");
};

$(".shade").onclick = () => {
  $(".drawer").classList.remove("open");
  $(".shade").classList.remove("open");
};

$$(".drawer a").forEach((a) => (a.onclick = $(".shade").onclick));

// --- Scroll & FAQ Accordions ---
$("#topBtn").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
$$(".faq button").forEach((b) => (b.onclick = () => b.parentElement.classList.toggle("open")));

// --- Gallery & Lightbox Render ---
let galCat = "All";
let li = 0;

function renderGal() {
  let list = galCat === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((x) => x.cat === galCat);
  $("#masonry").innerHTML = list
    .map(
      (g) =>
        `<article class="gallery-item" data-i="${GALLERY_ITEMS.indexOf(g)}"><img src="${g.src}" alt="${g.title}"><span>${g.title}</span></article>`
    )
    .join("");
  $$(".gallery-item").forEach((x) => (x.onclick = () => openLight(+x.dataset.i)));
}

function openLight(i) {
  li = i;
  let g = GALLERY_ITEMS[i];
  let l = $("#lightbox");
  $("img", l).src = g.src;
  $(".caption", l).textContent = g.title;
  l.classList.add("open");
}

function step(d) {
  openLight((li + d + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
}

$$("#galleryFilters .chip").forEach(
  (b) =>
    (b.onclick = () => {
      $$("#galleryFilters .chip").forEach((c) => c.classList.remove("active"));
      b.classList.add("active");
      galCat = b.dataset.cat;
      renderGal();
    })
);

$("#lightbox .close").onclick = () => $("#lightbox").classList.remove("open");
$(".prev").onclick = () => step(-1);
$(".next").onclick = () => step(1);
renderGal();

// --- Live Price Calculator & Form Handlers ---
let guests = 1;

function price() {
  let base =
    {
      "Bridal Wedding": 15000,
      Engagement: 8000,
      "Sangeet / Haldi": 12000,
      "Festival (Eid / Karva Chauth)": 3000,
      "Corporate Event": 20000,
      "Other Celebration": 5000,
    }[$("#eventType").value] || 0;

  let gp = Math.max(0, guests - 1) * 700;
  let b = +$("#budget").value;
  let ad = b >= 40000 ? 5000 : b >= 25000 ? 2500 : 0;

  $("#base").textContent = money(base);
  $("#guestPrice").textContent = money(gp);
  $("#addon").textContent = money(ad);
  $("#total").textContent = money(base + gp + ad);
  $("#budgetValue").textContent = money(b);
}

$("#plus").onclick = () => {
  guests = Math.min(60, guests + 1);
  $("#guestCount").textContent = guests;
  price();
};

$("#minus").onclick = () => {
  guests = Math.max(1, guests - 1);
  $("#guestCount").textContent = guests;
  price();
};

$("#eventType").oninput = price;
$("#budget").oninput = price;
price();

// --- Validation Helper ---
function mark(f, n, ok) {
  let w = f[n].closest(".field");
  w.classList.toggle("bad", !ok);
  let e = $(".err", w);
  if (e) e.textContent = "This field needs your attention";
  return ok;
}

// --- Booking Form Submit ---
$("#bookingForm").onsubmit = (e) => {
  e.preventDefault();
  let f = e.currentTarget;
  let ok = true;

  ok &= mark(f, "fullName", f.fullName.value.trim().length > 1);
  ok &= mark(f, "mobile", /^\d[\d\s+-]{8,}$/.test(f.mobile.value.trim()));
  ok &= mark(f, "email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()));
  ok &= mark(f, "city", f.city.value.trim().length > 1);
  ok &= mark(f, "eventType", !!f.eventType.value);
  ok &= mark(f, "eventDate", !!f.eventDate.value);
  ok &= mark(f, "address", f.address.value.trim().length > 4);

  if (!ok) return toast("Please check the highlighted booking fields", 1);

  $("#summary").innerHTML = `
    <div><span>Name</span><b>${f.fullName.value}</b></div>
    <div><span>Event</span><b>${f.eventType.value}</b></div>
    <div><span>Date</span><b>${f.eventDate.value}</b></div>
    <div><span>Guests</span><b>${guests}</b></div>
    <div><span>Estimate</span><b>${$("#total").textContent}</b></div>
  `;
  $("#modal").classList.add("open");
  toast("Booking request saved");
};

$$("#modal .close,#modal .close2").forEach((b) => (b.onclick = () => $("#modal").classList.remove("open")));

// --- Contact Form Submit ---
$("#contactForm").onsubmit = (e) => {
  e.preventDefault();
  let f = e.currentTarget;
  let ok = true;

  ok &= mark(f, "cName", f.cName.value.trim().length > 1);
  ok &= mark(f, "cEmail", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.cEmail.value.trim()));
  ok &= mark(f, "cMessage", f.cMessage.value.trim().length > 4);

  if (!ok) return toast("Please check the highlighted contact fields", 1);

  toast("Message sent. We will get back to you shortly");
  f.reset();
};

// --- Customer Reviews Data & Rendering ---
const fn = ["Ananya", "Priya", "Kavita", "Sneha", "Riya", "Pooja", "Neha", "Divya", "Meera", "Aisha", "Fatima", "Simran"];
const ln = ["Sharma", "Mehta", "Reddy", "Iyer", "Khan", "Verma", "Kapoor", "Nair", "Gupta", "Joshi"];
const cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Jaipur", "Ahmedabad"];
const srv = ["Bridal Package", "Festival Mehndi", "Arabic Mehndi", "Event Booking", "Sangeet Package", "Minimal Design", "Royal Collection"];
const txt = [
  "The attention to detail was incredible - every line was precise and the colour came out so dark.",
  "Our artist arrived right on time and worked through the whole bridal party without delay.",
  "I was nervous about my wedding mehndi but the team made the afternoon effortless.",
  "Booked for our sangeet night and every guest wanted to know the studio name afterward.",
  "The design consultation translated my vague ideas into something stunning.",
  "Colour stayed rich and dark for over two weeks.",
  "Professional, warm, and incredibly talented - exactly what you want on your wedding day.",
];

const reviews = Array.from({ length: 112 }, (_, i) => ({
  name: `${fn[i % fn.length]} ${ln[i % ln.length]}`,
  city: cities[i % cities.length],
  service: srv[i % srv.length],
  text: txt[i % txt.length],
  rating: [5, 5, 5, 5, 4, 5, 4, 5, 3, 5][i % 10],
  avatar: CUSTOMER_AVATARS[i % CUSTOMER_AVATARS.length],
}));

let visible = 0;
let rate = "All";

function stats() {
  let total = reviews.length;
  let avg = (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);
  $("#avg").textContent = avg;
  $("#count").textContent = `Based on ${total} verified reviews`;
  $("#bars").innerHTML = [5, 4, 3, 2, 1]
    .map((st) => {
      let c = reviews.filter((r) => r.rating === st).length;
      return `<div class="bar"><span>${st} star</span><div class="track"><div class="fill" style="width:${((c / total) * 100).toFixed(0)}%"></div></div><span>${c}</span></div>`;
    })
    .join("");
}

function filtered() {
  return rate === "All" ? reviews : reviews.filter((r) => r.rating === +rate);
}

function card(r) {
  return `<article class="card review"><div class="person"><img src="${r.avatar}" alt="${r.name}"><div><b>${r.name}</b><span>${r.city}</span></div></div><span class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span><p>"${r.text}"</p><span class="tag">${r.service}</span></article>`;
}

function renderReviews(reset) {
  let f = filtered();
  if (reset) {
    $("#reviewGrid").innerHTML = "";
    visible = 0;
  }
  $("#results").textContent = `${f.length} review${f.length === 1 ? "" : "s"}`;
  let next = f.slice(visible, visible + 12);
  $("#reviewGrid").insertAdjacentHTML("beforeend", next.map(card).join(""));
  visible += next.length;
  $("#loadMore").style.display = visible < f.length ? "inline-flex" : "none";
}

$$("#ratingFilter .chip").forEach(
  (b) =>
    (b.onclick = () => {
      $$("#ratingFilter .chip").forEach((c) => c.classList.remove("active"));
      b.classList.add("active");
      rate = b.dataset.rating;
      renderReviews(true);
    })
);

$("#loadMore").onclick = () => renderReviews(false);
stats();
renderReviews(true);

// --- Featured Testimonials Carousel ---
const feat = reviews.filter((r) => r.rating === 5).slice(0, 9);
const car = $("#carousel");
const dots = $("#dots");

car.innerHTML = feat
  .map(
    (r) =>
      `<div class="card testi"><span class="stars">★★★★★</span><p>"${r.text}"</p><div class="person"><img src="${r.avatar}" alt="${r.name}"><div><b>${r.name}</b><span>${r.city} · ${r.service}</span></div></div></div>`
  )
  .join("");

let si = 0;
let spv = () => (innerWidth <= 640 ? 1 : innerWidth <= 1080 ? 2 : 3);
let ts = () => Math.max(1, feat.length - spv() + 1);

function rd() {
  dots.innerHTML = Array.from({ length: ts() }, (_, i) => `<button class="${i === si ? "active" : ""}" data-i="${i}"></button>`).join("");
  $$("button", dots).forEach(
    (b) =>
      (b.onclick = () => {
        si = +b.dataset.i;
        uc();
      })
  );
}

function uc() {
  let w = car.children[0]?.getBoundingClientRect().width || 0;
  car.style.transform = `translateX(-${si * (w + 24)}px)`;
  $$("button", dots).forEach((b, i) => b.classList.toggle("active", i === si));
}

rd();
uc();

addEventListener("resize", () => {
  si = 0;
  rd();
  uc();
});

setInterval(() => {
  si = (si + 1) % ts();
  uc();
}, 4200);

$$(".video").forEach((v) => (v.onclick = () => toast("Video testimonial coming soon ▶")));
