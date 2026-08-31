import { initApproachMotion } from "./approach-motion.js";
import { initMediaParallax } from "./media-parallax.js";
import { initSiteNavigation } from "./navigation.js";

const DATA_URL = "./data/generated/site-data.json";
const THEME_KEY = "lds-theme";
const LANGUAGE_KEY = "lds-language";
const THEMES = ["system", "light", "dark"];
const LANGUAGES = ["th", "en"];

const COPY = {
  th: {
    pageTitle: "Landom — คนที่ร่วมสร้าง Landometer",
    socialTitle: "LANDOM · พวกเรา ที่ช่วยกันสร้าง LANDOMETER",
    pageDescription: "รู้จักคน ความสนใจ และผลงานที่เกิดขึ้นระหว่างการร่วมงานกับ Landometer",
    skip: "ข้ามไปยังเนื้อหาหลัก",
    headerLabel: "ส่วนหัวเว็บไซต์",
    homeLabel: "Landometer — หน้าหลัก",
    productLabel: "เว็บไซต์ Landom",
    navigationLabel: "ผลิตภัณฑ์ Landometer",
    joinTeam: "สมัครร่วมทีม",
    openMenu: "เปิดเมนู",
    closeMenu: "ปิดเมนู",
    menuLabel: "เมนู",
    inThisPage: "ในหน้านี้",
    peopleMenu: "ชาว Landom",
    ecosystem: "Landometer ecosystem",
    ecosystemCurrent: "· อยู่ที่นี่",
    ecosystemHomeDescription: "หน้าแรก · ผลิตภัณฑ์และบริการ",
    ecosystemCitymeterDescription: "มุมมองข้อมูลเมือง",
    ecosystemCitywikiDescription: "คู่มือย่าน",
    ecosystemLandomDescription: "ผู้คนที่ร่วมสร้าง Landometer",
    allProducts: "เปิด landometer.com — ผลิตภัณฑ์ทั้งหมด",
    controlsLabel: "การตั้งค่าการแสดงผล",
    switchLanguage: "Switch to English",
    switchLanguageShort: "EN",
    heroEyebrow: "LANDOM · ชุมชนของคนที่ร่วมสร้าง LANDOMETER",
    heroTitle: "ไม่ใช่สถานที่\nแต่คือผู้คน",
    heroIntro: "Landom — แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น",
    heroImageAlt: "ชาว Landom ร่วมทำงาน เรียนรู้ และใช้เวลาร่วมกัน",
    socialImageAlt: "ชาว Landom ถ่ายภาพร่วมกันที่สำนักงาน Landometer",
    peopleUnit: "คนใน Landom",
    loadingData: "กำลังโหลดข้อมูลล่าสุด",
    latestData: "ข้อมูลล่าสุด",
    updatedData: "ปรับปรุงข้อมูล {date}",
    directoryKicker: "ชาว Landom",
    directoryTitle: "รู้จักพวกเรา ที่อยู่เบื้องหลังแต่ละงาน",
    loading: "กำลังโหลด…",
    results: "พบ {shown} จาก {total} คน",
    searchLabel: "ค้นหาชื่อ มหาวิทยาลัย สาขาที่เรียน หรือผลงาน",
    searchPlaceholder: "ค้นหาคนหรือผลงาน",
    filter: "ตัวกรอง",
    filtersCount: "ตัวกรอง ({count})",
    refine: "เลือกดูให้ตรงความสนใจ",
    role: "บทบาท",
    allRoles: "ทุกบทบาท",
    fulltime: "พนักงานประจำ",
    parttime: "พนักงานพาร์ตไทม์",
    intern: "ผู้ฝึกงาน",
    member: "ผู้ร่วมสร้าง",
    cohort: "รุ่น / ปี",
    allCohorts: "ทุกรุ่น",
    status: "สถานะ",
    allStatuses: "ทุกสถานะ",
    active: "ร่วมงานอยู่",
    alumni: "เคยร่วมงาน",
    work: "ผลงาน",
    allWorks: "ทุกผลงาน",
    clearFilters: "ล้างตัวกรอง",
    done: "ดูผลลัพธ์",
    closeFilters: "ปิดตัวกรอง",
    emptyTitle: "ไม่พบข้อมูลที่ค้นหา",
    emptyCopy: "ลองใช้คำค้นสั้นลง หรือล้างตัวกรองแล้วค้นหาอีกครั้ง",
    clearAll: "ล้างการค้นหาและตัวกรอง",
    errorTitle: "โหลดข้อมูลไม่สำเร็จ",
    errorCopy: "โปรดลองอีกครั้ง ข้อมูลบุคคลจะไม่ถูกแทนที่ด้วยข้อมูลที่ยังไม่ได้ยืนยัน",
    retry: "ลองอีกครั้ง",
    footerTitle: "มาเป็นชาว Landom กัน",
    footerCopy: "มาร่วมกันเข้าใจเมือง และช่วยกันทำให้ดีขึ้น",
    footerAddress: "23/34-35 Room 4C-4D 4th Fl. The Quarter Bangkok Tower, ถนนตรีมิตร แขวงตลาดน้อย เขตสัมพันธวงศ์ กรุงเทพมหานคร 10100",
    footerMap: "เปิดแผนที่สำนักงาน",
    footerSocialLabel: "ช่องทางสังคมของ Landometer",
    footerLinksLabel: "ลิงก์ท้ายหน้า",
    footerBackTop: "กลับไปด้านบน",
    footerPeople: "ชาว Landom",
    footerPrivacy: "Privacy & Terms",
    footerBrandLabel: "Landometer — กลับไปด้านบน",
    footerCopyright: "© 2017–2026 Landometer Co., Ltd.",
    registry: "ชาวด้อม Landom",
    openProfile: "ดูโปรไฟล์ของ {name}",
    readStory: "ดูโปรไฟล์",
    collapseProfile: "ย่อรายละเอียด",
    educationSection: "การศึกษา",
    educationQualification: "วุฒิการศึกษา",
    educationProgram: "การศึกษาจาก",
    educationImpvestConsultant: "ที่ปรึกษาธุรกิจ Impvest จาก",
    educationInternship: "นักศึกษาฝึกงานจาก",
    educationCooperative: "นักศึกษาสหกิจศึกษาจาก",
    educationDegreeInProgress: "กำลังศึกษา",
    educationDegreeUnderReview: "การศึกษา",
    educationNeutral: "การศึกษา",
    educationProgramPending: "รอยืนยันสาขาที่เรียน",
    educationQualificationPending: "รอยืนยันวุฒิ",
    openProgramLinkedIn: "เปิดโปรไฟล์หลักสูตรบน LinkedIn",
    openInstitutionLinkedIn: "เปิดโปรไฟล์มหาวิทยาลัยบน LinkedIn",
    university: "มหาวิทยาลัย",
    voice: "มุมมองและเป้าหมาย",
    contributions: "ผลงานที่ร่วมทำ",
    roleHistory: "ช่วงเวลาที่ร่วมงานกับ Landometer",
    engagementHistory: "ช่วงที่ร่วมทีม",
    engagementSequence: "ช่วงที่ {count}",
    placementInternshipShort: "ฝึกงาน",
    placementCooperativeShort: "สหกิจศึกษา",
    achievements: "รางวัลและความสำเร็จ",
    publications: "บทความวิชาการ",
    openPublication: "เปิดบทความ {name}",
    publicProfiles: "ช่องทางออนไลน์",
    closeDetails: "ปิดรายละเอียด",
    certificates: "ประกาศนียบัตร",
    certificateFallback: "ประกาศนียบัตรจาก Landometer",
    openCertificate: "ดูประกาศนียบัตรของ {name}",
    closeCertificate: "ปิดประกาศนียบัตร",
    certificateCredential: "รหัส {id}",
    certificateAwarded: "มอบเมื่อ {date}",
    certificateOpenOriginal: "เปิดภาพต้นฉบับ",
    certificateDownload: "บันทึกภาพความละเอียดสูง",
    present: "ปัจจุบัน",
    moreWorks: "+{count} งาน",
    noStory: "",
    contributionRole: "หน้าที่: {role}",
    openWork: "เปิดผลงาน {name}",
    awardEvidence: "ดูหลักฐานรางวัล",
    openAwardEvidence: "เปิดหลักฐานรางวัลของ {name}",
    theme: {
      system: "ธีม: ตามระบบ กดเพื่อใช้ธีมสว่าง",
      light: "ธีม: สว่าง กดเพื่อใช้ธีมมืด",
      dark: "ธีม: มืด กดเพื่อใช้ธีมตามระบบ"
    },
    themeNames: { system: "ตามระบบ", light: "สว่าง", dark: "มืด" },
    themeChanged: "เปลี่ยนเป็นธีม{theme}แล้ว",
    languageChanged: "เปลี่ยนภาษาเป็นไทยแล้ว"
  },
  en: {
    pageTitle: "Landom — meet the people shaping Landometer",
    socialTitle: "Landom — meet the people shaping Landometer",
    pageDescription: "Meet the people, interests and work shaped through time with Landometer.",
    skip: "Skip to main content",
    headerLabel: "Site header",
    homeLabel: "Landometer — home",
    productLabel: "Landom website",
    navigationLabel: "Landometer products",
    joinTeam: "Join the team",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Menu",
    inThisPage: "On this page",
    peopleMenu: "People of Landom",
    ecosystem: "Landometer ecosystem",
    ecosystemCurrent: "· You are here",
    ecosystemHomeDescription: "Home · Products and services",
    ecosystemCitymeterDescription: "City data views",
    ecosystemCitywikiDescription: "Neighbourhood guides",
    ecosystemLandomDescription: "People shaping Landometer",
    allProducts: "Open landometer.com — all products",
    controlsLabel: "Display preferences",
    switchLanguage: "เปลี่ยนเป็นภาษาไทย",
    switchLanguageShort: "TH",
    heroEyebrow: "LANDOM · THE PEOPLE SHAPING LANDOMETER",
    heroTitle: "It’s not a place.\nIt’s the people.",
    heroIntro: "Landom is for people who want to understand cities and make them better, together.",
    heroImageAlt: "People of Landom working, learning, and celebrating together",
    socialImageAlt: "People of Landom together at the Landometer office",
    peopleUnit: "people in Landom",
    loadingData: "Loading the latest data",
    latestData: "Latest data",
    updatedData: "Data updated {date}",
    directoryKicker: "PEOPLE OF LANDOM",
    directoryTitle: "Meet the people behind the work",
    loading: "Loading…",
    results: "Showing {shown} of {total} people",
    searchLabel: "Search by name, university, program or contribution",
    searchPlaceholder: "Search people or work",
    filter: "Filters",
    filtersCount: "Filters ({count})",
    refine: "NARROW THE RESULTS",
    role: "Role",
    allRoles: "All roles",
    fulltime: "Full-time staff",
    parttime: "Part-time staff",
    intern: "Intern",
    member: "Team member",
    cohort: "Cohort / year",
    allCohorts: "All cohorts",
    status: "Status",
    allStatuses: "All statuses",
    active: "Active",
    alumni: "Alumni",
    work: "Contribution",
    allWorks: "All contributions",
    clearFilters: "Clear filters",
    done: "Show results",
    closeFilters: "Close filters",
    emptyTitle: "No matching profiles",
    emptyCopy: "Try a shorter search or clear the filters and search again.",
    clearAll: "Clear search and filters",
    errorTitle: "The profiles could not be loaded",
    errorCopy: "Please try again. Unverified information will not be substituted.",
    retry: "Try again",
    footerTitle: "Be part of Landom",
    footerCopy: "Understand cities. Make them better, together.",
    footerAddress: "23/34-35 Room 4C-4D 4th Fl. The Quarter Bangkok Tower, Tri Mit Road, Talat Noi, Samphanthawong, Bangkok 10100, Thailand",
    footerMap: "Open office map",
    footerSocialLabel: "Landometer social profiles",
    footerLinksLabel: "Footer links",
    footerBackTop: "Back to top",
    footerPeople: "People of Landom",
    footerPrivacy: "Privacy & Terms",
    footerBrandLabel: "Landometer — back to top",
    footerCopyright: "© 2017–2026 Landometer Co., Ltd.",
    registry: "People of Landom",
    openProfile: "View {name}’s profile",
    readStory: "View profile",
    collapseProfile: "Collapse profile",
    educationSection: "Education",
    educationQualification: "Qualification",
    educationProgram: "Education from",
    educationImpvestConsultant: "Impvest Consulting Partner from",
    educationInternship: "Intern from",
    educationCooperative: "Cooperative education from",
    educationDegreeInProgress: "Degree in progress",
    educationDegreeUnderReview: "Education",
    educationNeutral: "Education",
    educationProgramPending: "Program pending confirmation",
    educationQualificationPending: "Qualification pending confirmation",
    openProgramLinkedIn: "Open the program’s LinkedIn profile",
    openInstitutionLinkedIn: "Open the university’s LinkedIn profile",
    university: "University",
    voice: "Perspective and goals",
    contributions: "Work they contributed to",
    roleHistory: "Time with Landometer",
    engagementHistory: "Engagement history",
    engagementSequence: "Period {count}",
    placementInternshipShort: "Internship",
    placementCooperativeShort: "Co-op",
    achievements: "Awards and achievements",
    publications: "Publication",
    openPublication: "Open publication {name}",
    publicProfiles: "Online profiles",
    closeDetails: "Close details",
    certificates: "Certificates",
    certificateFallback: "Landometer certificate",
    openCertificate: "View {name}’s certificate",
    closeCertificate: "Close certificate",
    certificateCredential: "Credential {id}",
    certificateAwarded: "Awarded {date}",
    certificateOpenOriginal: "Open original image",
    certificateDownload: "Save high-resolution image",
    present: "Present",
    moreWorks: "+{count} more",
    noStory: "",
    contributionRole: "Role: {role}",
    openWork: "Open {name}",
    awardEvidence: "View award evidence",
    openAwardEvidence: "View award evidence for {name}",
    theme: {
      system: "Theme: system. Press to use light theme",
      light: "Theme: light. Press to use dark theme",
      dark: "Theme: dark. Press to follow the system"
    },
    themeNames: { system: "system", light: "light", dark: "dark" },
    themeChanged: "Theme changed to {theme}",
    languageChanged: "Language changed to English"
  }
};

const state = {
  language: window.__LANDOM_PREFERENCES__?.language || "th",
  theme: window.__LANDOM_PREFERENCES__?.theme || "system",
  raw: null,
  models: [],
  works: [],
  filters: {
    query: new URLSearchParams(window.location.search).get("q") || "",
    role: new URLSearchParams(window.location.search).get("role") || "",
    cohort: new URLSearchParams(window.location.search).get("cohort") || "",
    status: new URLSearchParams(window.location.search).get("status") || "",
    work: new URLSearchParams(window.location.search).get("work") || ""
  },
  currentPersonId: new URLSearchParams(window.location.search).get("person") || null,
  lastProfileTrigger: null,
  masonryColumnCount: 0,
  masonryLayoutFrame: 0,
  currentCertificate: null,
  lastCertificateTrigger: null
};

const elements = {
  root: document.documentElement,
  themeColor: document.querySelector('meta[name="theme-color"]'),
  metaDescription: document.querySelector('meta[name="description"]'),
  ogTitle: document.querySelector('meta[property="og:title"]'),
  ogDescription: document.querySelector('meta[property="og:description"]'),
  ogImageAlt: document.querySelector('meta[property="og:image:alt"]'),
  ogLocale: document.querySelector('meta[property="og:locale"]'),
  ogLocaleAlternate: document.querySelector('meta[property="og:locale:alternate"]'),
  twitterTitle: document.querySelector('meta[name="twitter:title"]'),
  twitterDescription: document.querySelector('meta[name="twitter:description"]'),
  twitterImageAlt: document.querySelector('meta[name="twitter:image:alt"]'),
  skip: document.querySelector(".skip-link"),
  siteHeader: document.querySelector(".site-header"),
  brand: document.querySelector(".brand"),
  brandProduct: document.querySelector(".brand-product"),
  headerNav: document.querySelector(".header-nav"),
  joinTeamLinks: document.querySelectorAll("#join-team-link, #join-team-link-mobile"),
  menuToggle: document.querySelector("#menu-toggle"),
  menuPanel: document.querySelector("#site-menu"),
  pageMenuLabel: document.querySelector("#page-menu-label"),
  peopleMenuLabel: document.querySelector("#people-menu-label"),
  ecosystemMenuLabel: document.querySelector("#ecosystem-menu-label"),
  ecosystemCurrentLabel: document.querySelector("#ecosystem-current-label"),
  ecosystemHomeDescription: document.querySelector("#ecosystem-home-description"),
  ecosystemCitymeterDescription: document.querySelector("#ecosystem-citymeter-description"),
  ecosystemCitywikiDescription: document.querySelector("#ecosystem-citywiki-description"),
  ecosystemLandomDescription: document.querySelector("#ecosystem-landom-description"),
  ecosystemLandomLink: document.querySelector('.site-menu-ecosystem a[aria-current="page"]'),
  allProductsLink: document.querySelector("#all-products-link"),
  controls: document.querySelector("#preference-controls"),
  languageButton: document.querySelector("#language-toggle"),
  themeButton: document.querySelector("#theme-toggle"),
  themeIcon: document.querySelector("#theme-toggle .theme-icon"),
  preferenceStatus: document.querySelector("#preference-status"),
  heroEyebrow: document.querySelector("#hero-eyebrow"),
  pageTitle: document.querySelector("#page-title"),
  heroIntro: document.querySelector("#hero-intro"),
  heroImage: document.querySelector("#hero-image"),
  peopleTotal: document.querySelector("#people-total"),
  peopleTotalLabel: document.querySelector("#people-total-label"),
  dataNote: document.querySelector("#data-note"),
  directoryKicker: document.querySelector("#directory-kicker"),
  directoryHeading: document.querySelector("#directory-heading"),
  resultsCount: document.querySelector("#results-count"),
  searchInput: document.querySelector("#search-input"),
  searchLabel: document.querySelector("#search-label"),
  filterOpen: document.querySelector("#filter-open"),
  filterOpenLabel: document.querySelector("#filter-open-label"),
  filterCount: document.querySelector("#filter-count"),
  filterDialog: document.querySelector("#filter-dialog"),
  filterForm: document.querySelector("#filter-form"),
  filterKicker: document.querySelector("#filter-kicker"),
  filterTitle: document.querySelector("#filter-title"),
  filterClose: document.querySelector("#filter-close"),
  filterRole: document.querySelector("#filter-role"),
  filterCohort: document.querySelector("#filter-cohort"),
  filterStatus: document.querySelector("#filter-status"),
  filterWork: document.querySelector("#filter-work"),
  filterRoleLabel: document.querySelector("#filter-role-label"),
  filterCohortLabel: document.querySelector("#filter-cohort-label"),
  filterStatusLabel: document.querySelector("#filter-status-label"),
  filterWorkLabel: document.querySelector("#filter-work-label"),
  filterClear: document.querySelector("#filter-clear"),
  filterDone: document.querySelector("#filter-done"),
  board: document.querySelector("#people-board"),
  loading: document.querySelector("#loading-state"),
  empty: document.querySelector("#empty-state"),
  emptyTitle: document.querySelector("#empty-title"),
  emptyCopy: document.querySelector("#empty-copy"),
  emptyClear: document.querySelector("#empty-clear"),
  error: document.querySelector("#error-state"),
  errorTitle: document.querySelector("#error-title"),
  errorCopy: document.querySelector("#error-copy"),
  retry: document.querySelector("#retry-button"),
  footerTitle: document.querySelector("#footer-title"),
  footerCopy: document.querySelector("#footer-copy"),
  footerAddress: document.querySelector("#footer-address"),
  footerMapLabel: document.querySelector("#footer-map-label"),
  footerSocialLinks: document.querySelector("#footer-social-links"),
  footerLinks: document.querySelector("#footer-links"),
  footerTopLink: document.querySelector("#footer-top-link"),
  footerPeopleLink: document.querySelector("#footer-people-link"),
  footerPrivacyLink: document.querySelector("#footer-privacy-link"),
  footerBrand: document.querySelector("#footer-brand"),
  footerCopyright: document.querySelector("#footer-copyright"),
  footerMeta: document.querySelector("#footer-meta"),
  certificateDialog: document.querySelector("#certificate-dialog"),
  certificateDialogKicker: document.querySelector("#certificate-dialog-kicker"),
  certificateDialogTitle: document.querySelector("#certificate-dialog-title"),
  certificateDialogMeta: document.querySelector("#certificate-dialog-meta"),
  certificateDialogImage: document.querySelector("#certificate-dialog-image"),
  certificateOpenOriginal: document.querySelector("#certificate-open-original"),
  certificateDownload: document.querySelector("#certificate-download"),
  certificateClose: document.querySelector("#certificate-close")
};

const systemThemeQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
const desktopFilterQuery = window.matchMedia?.("(min-width: 760px)");
const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
const reflowAnimations = new WeakMap();
let approachMotionController = null;
let mediaParallaxController = null;

function message(key, values = {}) {
  const keys = key.split(".");
  let value = COPY[state.language];
  keys.forEach((part) => {
    value = value?.[part];
  });
  if (typeof value !== "string") return "";
  return value.replace(/\{(\w+)\}/g, (_, token) => values[token] ?? "");
}

function setText(element, value) {
  if (element) element.textContent = value;
}

function setLayeredActionText(action, value) {
  if (!action) return;
  const layers = action.querySelectorAll(".header-cta-label, .header-cta-sweep");
  if (layers.length === 0) {
    setText(action, value);
    return;
  }
  layers.forEach((layer) => setText(layer, value));
}

function safelyStore(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {}
}

function updateUrl(updates, { replace = true } = {}) {
  const url = new URL(window.location.href);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  });
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", url);
}

function resolveTheme(theme = state.theme) {
  return theme === "dark" || (theme === "system" && systemThemeQuery?.matches) ? "dark" : "light";
}

function applyTheme({ persist = false, updateQuery = false, announce = false } = {}) {
  const resolved = resolveTheme();
  elements.root.dataset.themePreference = state.theme;
  elements.root.dataset.theme = resolved;
  elements.root.style.colorScheme = resolved;
  if (elements.themeColor) elements.themeColor.content = resolved === "dark" ? "#11191D" : "#F6F7F3";
  elements.themeButton?.setAttribute("aria-label", message(`theme.${state.theme}`));
  elements.themeButton?.setAttribute("title", message(`theme.${state.theme}`));
  setText(elements.themeIcon, { system: "light_mode", light: "dark_mode", dark: "contrast" }[state.theme]);
  if (persist) safelyStore(THEME_KEY, state.theme);
  if (updateQuery) updateUrl({ theme: state.theme });
  if (announce) {
    setText(elements.preferenceStatus, message("themeChanged", { theme: message(`themeNames.${state.theme}`) }));
  }
}

function cycleTheme() {
  const index = THEMES.indexOf(state.theme);
  state.theme = THEMES[(index + 1) % THEMES.length];
  applyTheme({ persist: true, updateQuery: true, announce: true });
}

function applyLanguage({ persist = false, updateQuery = false, announce = false } = {}) {
  const copy = COPY[state.language];
  elements.root.lang = state.language;
  document.title = copy.pageTitle;
  elements.metaDescription?.setAttribute("content", copy.pageDescription);
  elements.ogTitle?.setAttribute("content", copy.socialTitle);
  elements.ogDescription?.setAttribute("content", copy.pageDescription);
  elements.ogImageAlt?.setAttribute("content", copy.socialImageAlt);
  elements.ogLocale?.setAttribute("content", state.language === "th" ? "th_TH" : "en_US");
  elements.ogLocaleAlternate?.setAttribute("content", state.language === "th" ? "en_US" : "th_TH");
  elements.twitterTitle?.setAttribute("content", copy.socialTitle);
  elements.twitterDescription?.setAttribute("content", copy.pageDescription);
  elements.twitterImageAlt?.setAttribute("content", copy.socialImageAlt);
  setText(elements.skip, copy.skip);
  elements.siteHeader?.setAttribute("aria-label", copy.headerLabel);
  elements.brand?.setAttribute("aria-label", copy.homeLabel);
  elements.brandProduct?.setAttribute("aria-label", copy.productLabel);
  elements.headerNav?.setAttribute("aria-label", copy.navigationLabel);
  elements.joinTeamLinks?.forEach((link) => setLayeredActionText(link, copy.joinTeam));
  if (elements.menuToggle) {
    elements.menuToggle.dataset.openLabel = copy.openMenu;
    elements.menuToggle.dataset.closeLabel = copy.closeMenu;
    if (elements.menuToggle.getAttribute("aria-expanded") !== "true") {
      elements.menuToggle.setAttribute("aria-label", copy.openMenu);
      elements.menuToggle.setAttribute("title", copy.openMenu);
    }
  }
  elements.menuPanel?.setAttribute("aria-label", copy.menuLabel);
  setText(elements.pageMenuLabel, copy.inThisPage);
  setText(elements.peopleMenuLabel, copy.peopleMenu);
  setText(elements.ecosystemMenuLabel, copy.ecosystem);
  setText(elements.ecosystemCurrentLabel, copy.ecosystemCurrent);
  setText(elements.ecosystemHomeDescription, copy.ecosystemHomeDescription);
  setText(elements.ecosystemCitymeterDescription, copy.ecosystemCitymeterDescription);
  setText(elements.ecosystemCitywikiDescription, copy.ecosystemCitywikiDescription);
  setText(elements.ecosystemLandomDescription, copy.ecosystemLandomDescription);
  setText(elements.allProductsLink, copy.allProducts);
  elements.controls?.setAttribute("aria-label", copy.controlsLabel);
  elements.languageButton?.setAttribute("aria-label", copy.switchLanguage);
  elements.languageButton?.setAttribute("title", copy.switchLanguage);
  elements.languageButton?.setAttribute("hreflang", state.language === "th" ? "en" : "th");
  elements.languageButton?.setAttribute(
    "href",
    state.language === "th" ? new URL("en/", document.baseURI).href : new URL("./", document.baseURI).href
  );
  elements.ecosystemLandomLink?.setAttribute(
    "href",
    state.language === "th" ? new URL("./", document.baseURI).href : new URL("en/", document.baseURI).href
  );
  setText(elements.languageButton?.querySelector("span"), copy.switchLanguageShort);
  setText(elements.heroEyebrow, copy.heroEyebrow);
  setText(elements.pageTitle, copy.heroTitle);
  setText(elements.heroIntro, copy.heroIntro);
  elements.heroImage?.setAttribute("alt", copy.heroImageAlt);
  setText(elements.peopleTotalLabel, copy.peopleUnit);
  setText(elements.directoryKicker, copy.directoryKicker);
  setText(elements.directoryHeading, copy.directoryTitle);
  setText(elements.searchLabel, copy.searchLabel);
  if (elements.searchInput) elements.searchInput.placeholder = copy.searchPlaceholder;
  setText(elements.filterOpenLabel, copy.filter);
  setText(elements.filterKicker, copy.refine);
  setText(elements.filterTitle, copy.filter);
  elements.filterClose?.setAttribute("aria-label", copy.closeFilters);
  setText(elements.filterRoleLabel, copy.role);
  setText(elements.filterCohortLabel, copy.cohort);
  setText(elements.filterStatusLabel, copy.status);
  setText(elements.filterWorkLabel, copy.work);
  setText(elements.filterClear, copy.clearFilters);
  setText(elements.filterDone, copy.done);
  setText(elements.emptyTitle, copy.emptyTitle);
  setText(elements.emptyCopy, copy.emptyCopy);
  setText(elements.emptyClear, copy.clearAll);
  setText(elements.errorTitle, copy.errorTitle);
  setText(elements.errorCopy, copy.errorCopy);
  setText(elements.retry, copy.retry);
  setText(elements.footerTitle, copy.footerTitle);
  setText(elements.footerCopy, copy.footerCopy);
  setText(elements.footerAddress, copy.footerAddress);
  setText(elements.footerMapLabel, copy.footerMap);
  elements.footerSocialLinks?.setAttribute("aria-label", copy.footerSocialLabel);
  elements.footerLinks?.setAttribute("aria-label", copy.footerLinksLabel);
  setText(elements.footerTopLink, copy.footerBackTop);
  setText(elements.footerPeopleLink, copy.footerPeople);
  setText(elements.footerPrivacyLink, copy.footerPrivacy);
  elements.footerBrand?.setAttribute("aria-label", copy.footerBrandLabel);
  setText(elements.footerCopyright, copy.footerCopyright);
  setText(elements.footerMeta, copy.registry);
  setText(elements.certificateDialogKicker, copy.certificates);
  elements.certificateClose?.setAttribute("aria-label", copy.closeCertificate);
  setText(elements.certificateOpenOriginal, copy.certificateOpenOriginal);
  setText(elements.certificateDownload, copy.certificateDownload);
  updateStaticOptions();
  updateDynamicOptions();
  updateDataNote();
  applyTheme();
  if (state.raw) renderDirectory();
  if (elements.certificateDialog?.open && state.currentCertificate) renderCertificateDialog(state.currentCertificate);
  if (persist) safelyStore(LANGUAGE_KEY, state.language);
  if (updateQuery) updateUrl({ lang: state.language });
  if (announce) setText(elements.preferenceStatus, copy.languageChanged);
}

function updateStaticOptions() {
  setOptionLabel(elements.filterRole, "", message("allRoles"));
  setOptionLabel(elements.filterRole, "fulltime", message("fulltime"));
  setOptionLabel(elements.filterRole, "parttime", message("parttime"));
  setOptionLabel(elements.filterRole, "intern", message("intern"));
  setOptionLabel(elements.filterStatus, "", message("allStatuses"));
  setOptionLabel(elements.filterStatus, "active", message("active"));
  setOptionLabel(elements.filterStatus, "alumni", message("alumni"));
}

function setOptionLabel(select, value, label) {
  const option = Array.from(select?.options || []).find((item) => item.value === value);
  if (option) option.textContent = label;
}

function updateDynamicOptions() {
  if (!elements.filterCohort || !elements.filterWork) return;
  const cohortValue = state.filters.cohort;
  const workValue = state.filters.work;
  const cohorts = Array.from(new Set(state.models.map((model) => model.cohort).filter(Boolean)))
    .sort((a, b) => String(b).localeCompare(String(a), "en", { numeric: true }));

  elements.filterCohort.replaceChildren(new Option(message("allCohorts"), ""));
  cohorts.forEach((cohort) => elements.filterCohort.add(new Option(cohort, cohort)));
  elements.filterCohort.value = cohorts.includes(cohortValue) ? cohortValue : "";
  if (cohortValue && !cohorts.includes(cohortValue)) state.filters.cohort = "";

  elements.filterWork.replaceChildren(new Option(message("allWorks"), ""));
  state.works
    .map((work) => ({ id: recordId(work, "work"), label: localizedWorkName(work) }))
    .filter((work) => work.id && work.label)
    .sort((a, b) => a.label.localeCompare(b.label, state.language))
    .forEach((work) => elements.filterWork.add(new Option(work.label, work.id)));
  const validWork = state.works.some((work) => recordId(work, "work") === workValue);
  elements.filterWork.value = validWork ? workValue : "";
  if (workValue && !validWork) state.filters.work = "";
}

function getPath(object, path) {
  if (!object || typeof object !== "object") return undefined;
  return path.split(".").reduce((value, part) => value?.[part], object);
}

function firstValue(object, paths) {
  for (const path of paths) {
    const value = getPath(object, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function asRecords(collection) {
  if (Array.isArray(collection)) return collection.filter((item) => item && typeof item === "object");
  if (!collection || typeof collection !== "object") return [];
  if (firstValue(collection, ["id", "personId", "person_id", "path", "url"])) return [collection];
  return Object.entries(collection).flatMap(([key, value]) => {
    if (Array.isArray(value)) return value.filter((item) => item && typeof item === "object");
    if (!value || typeof value !== "object") return [];
    return [{ _key: key, ...value }];
  });
}

function recordId(record, kind = "") {
  const prefix = kind ? [
    `${kind}Id`,
    `${kind}_id`,
    `${kind.toLowerCase()}Id`,
    `${kind.toLowerCase()}_id`
  ] : [];
  const value = firstValue(record, [...prefix, "id", "recordId", "record_id", "_key"]);
  return value === undefined ? "" : String(value);
}

function personId(record) {
  return String(firstValue(record, ["personId", "person_id", "person.id", "person", "_personId"]) || "");
}

function localizedValue(value, language = state.language) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  if (Array.isArray(value)) return value.map((item) => localizedValue(item, language)).filter(Boolean).join(", ");
  if (typeof value === "object") {
    return String(
      value[language] ?? value[language === "th" ? "en" : "th"] ?? value.value ?? value.name ?? ""
    ).trim();
  }
  return "";
}

function localizedField(record, bases, language = state.language) {
  const suffix = language === "th" ? "Th" : "En";
  const snakeSuffix = language === "th" ? "th" : "en";
  const alternateSuffix = language === "th" ? "En" : "Th";
  const alternateSnake = language === "th" ? "en" : "th";
  for (const base of bases) {
    const candidates = [
      `${base}${suffix}`,
      `${base}_${snakeSuffix}`,
      `${snakeSuffix}_${base}`,
      `${base}.${snakeSuffix}`,
      base,
      `${base}${alternateSuffix}`,
      `${base}_${alternateSnake}`,
      `${base}.${alternateSnake}`
    ];
    for (const candidate of candidates) {
      const value = localizedValue(getPath(record, candidate), language);
      if (value) return value;
    }
  }
  return "";
}

function normalizeRole(value) {
  const role = localizedValue(value, "en").toLowerCase().replace(/[\s_-]+/g, " ").trim();
  if (/full.?time|fulltime|พนักงานประจำ|staff/.test(role)) return "fulltime";
  if (/part.?time|parttime|พาร์ต.?ไทม์/.test(role)) return "parttime";
  if (/intern|ฝึกงาน|trainee|program participant|ผู้ร่วมโปรแกรม/.test(role)) return "intern";
  return "member";
}

function statusKey(value) {
  const status = localizedValue(value, "en").toLowerCase();
  if (/active|current|present|ร่วมทีม|ปัจจุบัน/.test(status)) return "active";
  if (/alumni|former|ended|complete|ศิษย์เก่า|สิ้นสุด/.test(status)) return "alumni";
  return status ? normalizeSearch(status) : "active";
}

function engagementRoleKey(engagement) {
  return normalizeRole(firstValue(engagement, ["roleCategory", "role_category", "employmentType", "employment_type", "role.type", "role", "category"]));
}

function engagementRoleName(engagement, roleKey) {
  const fallback = {
    fulltime: "Full-time staff",
    parttime: "Part-time staff",
    intern: "Intern",
    member: "Team member"
  };
  return localizedField(engagement, ["roleName", "role_name", "roleTitle", "role_title", "title", "role"], "en") || fallback[roleKey] || fallback.member;
}

function engagementIsCurrent(engagement) {
  const rawStatus = String(firstValue(engagement, ["status", "currentStatus", "current_status"]) || "").toLowerCase();
  const end = localizedValue(firstValue(engagement, ["end", "endDate", "end_date"]));
  if (/completed|complete|ended|alumni|former|สิ้นสุด/.test(rawStatus)) return false;
  if (/ongoing|active|current|present|ร่วมทีม|ปัจจุบัน/.test(rawStatus)) return true;
  return !end || /present|current|ปัจจุบัน/i.test(end);
}

function engagementSort(a, b) {
  const currentDifference = Number(engagementIsCurrent(b)) - Number(engagementIsCurrent(a));
  if (currentDifference) return currentDifference;
  const rolePriority = { fulltime: 3, parttime: 2, intern: 1, member: 0 };
  const roleDifference = rolePriority[engagementRoleKey(b)] - rolePriority[engagementRoleKey(a)];
  if (roleDifference) return roleDifference;
  const aDate = String(firstValue(a, ["start", "startDate", "start_date", "cohort", "year"]) || "");
  const bDate = String(firstValue(b, ["start", "startDate", "start_date", "cohort", "year"]) || "");
  return bDate.localeCompare(aDate, "en", { numeric: true });
}

function completedEngagementEndSortValue(engagement) {
  const end = localizedValue(firstValue(engagement, ["end", "endDate", "end_date"]), "en").trim();
  if (!end || engagementIsCurrent(engagement)) return null;

  const isoDate = end.match(/^((?:19|20)\d{2})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
  if (isoDate) {
    const year = Number(isoDate[1]);
    const month = isoDate[2] ? Number(isoDate[2]) : 0;
    const day = isoDate[3] ? Number(isoDate[3]) : 0;
    if ((isoDate[2] && (month < 1 || month > 12)) || (isoDate[3] && (day < 1 || day > 31))) return null;
    return year * 10000 + month * 100 + day;
  }

  const parts = monthYearParts(end);
  return parts ? parts.year * 10000 + (parts.month === null ? 0 : parts.month + 1) * 100 : null;
}

function latestCompletedEngagementEndSortValue(model) {
  let latest = null;
  for (const engagement of Array.isArray(model.engagements) ? model.engagements : []) {
    const value = completedEngagementEndSortValue(engagement);
    if (value !== null && (latest === null || value > latest)) latest = value;
  }
  return latest;
}

function personModelSort(a, b) {
  const activeDifference = Number(b.statusKey === "active") - Number(a.statusKey === "active");
  if (activeDifference) return activeDifference;
  if (a.statusKey === "active") return 0;

  const aLatestEnd = latestCompletedEngagementEndSortValue(a);
  const bLatestEnd = latestCompletedEngagementEndSortValue(b);
  if (aLatestEnd === null && bLatestEnd === null) return 0;
  if (aLatestEnd === null) return 1;
  if (bLatestEnd === null) return -1;
  return Number(bLatestEnd > aLatestEnd) - Number(aLatestEnd > bLatestEnd);
}

function relationId(record, kind) {
  return String(firstValue(record, [
    `${kind}Id`, `${kind}_id`, `${kind}.id`, `${kind}.recordId`, `${kind}.record_id`
  ]) || "");
}

function relationRecord(record, kind, index) {
  const embedded = firstValue(record, [kind]);
  if (embedded && typeof embedded === "object") return embedded;
  const id = relationId(record, kind);
  return index.get(id) || null;
}

function canonicalNameVariant(record, variant, language = state.language) {
  return localizedValue(firstValue(record, [
    `names.${language}.${variant}`,
    `name.${language}.${variant}`,
    `${variant}Name.${language}`,
    `${variant}_name.${language}`
  ]), language);
}

function normalizedEnum(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function academicPlacementTypeFor(engagement) {
  const value = normalizedEnum(firstValue(engagement, ["academicPlacementType", "academic_placement_type"]));
  return ["internship", "cooperative_education", "not_applicable"].includes(value) ? value : "";
}

function normalizedLabel(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function publicRoleLabel(role) {
  return role;
}

function uniqueLabels(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = normalizedLabel(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function degreeDisplayValue({ abbreviation, title, field, compact = false }) {
  if (compact) return uniqueLabels([abbreviation || title, field]).join(", ");
  return uniqueLabels([title || abbreviation, field]).join(" · ");
}

function educationLabelKey(mode, placementType, awardStatus, personalAwardVerified, engagementProgramCode = "") {
  if (mode === "qualification") {
    if (awardStatus === "in_progress") return "educationDegreeInProgress";
    if (awardStatus === "completed" && personalAwardVerified) return "educationQualification";
    if (awardStatus) return "educationDegreeUnderReview";
    return "educationQualification";
  }
  if (mode === "program") {
    if (String(engagementProgramCode).toUpperCase() === "IMP") return "educationImpvestConsultant";
    if (placementType === "cooperative_education") return "educationCooperative";
    if (placementType === "internship") return "educationInternship";
    return "educationProgram";
  }
  return "educationNeutral";
}

function educationFor(person, engagement, linkedEducationRecord, programIndex, institutionIndex, educationMode, hasPrimaryEducationRecord) {
  const personEducation = firstValue(person, ["education", "qualification"]);
  const embeddedEducation = personEducation && typeof personEducation === "object" ? personEducation : {};
  const linkedEducation = linkedEducationRecord && typeof linkedEducationRecord === "object" ? linkedEducationRecord : {};
  const program = relationRecord(linkedEducation, "program", programIndex) ||
    relationRecord(embeddedEducation, "program", programIndex) ||
    (firstValue(person, ["program"]) && typeof person.program === "object" ? person.program : null);
  const institution = relationRecord(linkedEducation, "institution", institutionIndex) ||
    relationRecord(program || {}, "institution", institutionIndex) ||
    relationRecord(embeddedEducation, "institution", institutionIndex) ||
    (firstValue(person, ["institution", "university"]) && typeof firstValue(person, ["institution", "university"]) === "object"
      ? firstValue(person, ["institution", "university"])
      : null);

  const cardDisplay = localizedField(person, ["educationDisplay.card", "education_display.card"]);
  const detailDisplay = localizedField(person, ["educationDisplay.detail", "education_display.detail"]);
  const cardParts = cardDisplay.split(/\s*·\s*/).filter(Boolean);
  const detailParts = detailDisplay.split(/\s*—\s*/).filter(Boolean);
  const canonicalProgramShort = canonicalNameVariant(program || {}, "short");
  const canonicalProgramFull = canonicalNameVariant(program || {}, "formal");
  const canonicalInstitutionShort = canonicalNameVariant(institution || {}, "short");
  const canonicalInstitutionFull = canonicalNameVariant(institution || {}, "formal");
  const qualification = localizedField(linkedEducation, ["qualification"]);
  const degreeAbbreviation = localizedField(linkedEducation, ["degree.abbreviation"]);
  const degreeTitle = localizedField(linkedEducation, ["degree.title"]);
  const degreeField = localizedField(linkedEducation, ["degree.field"]);
  const degreeSupplement = degreeDisplayValue({ abbreviation: degreeAbbreviation, title: degreeTitle, field: degreeField, compact: true });
  const degreeShort = educationMode === "qualification" ? degreeSupplement : "";
  const degreeDetail = educationMode === "qualification"
    ? degreeDisplayValue({ abbreviation: degreeAbbreviation, title: degreeTitle, field: degreeField })
    : "";
  const awardStatus = normalizedEnum(firstValue(linkedEducation, ["degree.awardStatus", "degree.award_status"]));
  const personalAwardVerified = normalizedBoolean(firstValue(linkedEducation, ["degree.personalAwardVerified", "degree.personal_award_verified"]));
  const verificationStatus = String(firstValue(linkedEducation, ["verificationStatus", "verification_status"]) || firstValue(person, ["educationDisplay.verificationStatus", "education_display.verification_status"]) || "");
  const ownerDetailRequiredWithoutPrimaryEducation = normalizedEnum(verificationStatus) === "owner_detail_required" && !hasPrimaryEducationRecord;
  const effectiveAwardStatus = awardStatus || (/pending|review|required/i.test(verificationStatus) ? "under_review" : "");
  const placementType = academicPlacementTypeFor(engagement);
  const hasProgramOrQualification = Boolean(program || qualification || degreeShort || degreeDetail);
  const cardHasProgramAndInstitution = cardParts.length > 1;
  const detailHasProgramAndInstitution = detailParts.length > 1;
  const pendingAcademicLabel = ownerDetailRequiredWithoutPrimaryEducation
    ? ""
    : !hasProgramOrQualification && educationMode === "program"
    ? message("educationProgramPending")
    : !hasProgramOrQualification && educationMode === "qualification"
      ? message("educationQualificationPending")
      : "";

  const shortProgram = degreeShort ||
    (cardHasProgramAndInstitution ? cardParts[0] : "") || canonicalProgramShort ||
    localizedField(program || {}, ["shortName", "short_name", "abbreviation", "abbr", "code"]) ||
    localizedField(embeddedEducation, ["programShort", "program_short", "degreeShort", "degree_short"]) ||
    (hasProgramOrQualification ? cardParts[0] : "") ||
    pendingAcademicLabel;
  const fullProgram = degreeDetail || qualification ||
    (detailHasProgramAndInstitution ? detailParts[0] : "") || canonicalProgramFull ||
    localizedField(program || {}, ["officialName", "official_name", "fullName", "full_name", "name", "degreeName", "degree_name"]) ||
    localizedField(embeddedEducation, ["programOfficial", "program_official", "programName", "program_name", "degree", "qualification"]) ||
    (hasProgramOrQualification ? detailParts[0] : "") ||
    pendingAcademicLabel;
  const shortInstitution = (cardHasProgramAndInstitution ? cardParts.slice(1).join(" · ") : "") || canonicalInstitutionShort ||
    localizedField(institution || {}, ["shortName", "short_name", "abbreviation", "abbr", "code"]) ||
    localizedField(embeddedEducation, ["institutionShort", "institution_short", "universityShort", "university_short"]) ||
    (!hasProgramOrQualification ? cardDisplay : "");
  const fullInstitution = (detailHasProgramAndInstitution ? detailParts.slice(1).join(" — ") : "") || canonicalInstitutionFull ||
    localizedField(institution || {}, ["officialName", "official_name", "fullName", "full_name", "name"]) ||
    localizedField(embeddedEducation, ["institutionOfficial", "institution_official", "institutionName", "institution_name", "university"]) ||
    (!hasProgramOrQualification ? detailDisplay : "");
  const programLinkedInUrl = safeLinkedInUrl(firstValue(linkedEducation, [
    "programLinkedInUrl", "program_linkedin_url", "program.linkedinUrl", "program.linkedin_url"
  ]) || firstValue(program || {}, [
    "linkedinUrl", "linkedInUrl", "linkedin_url", "links.linkedin", "social.linkedin"
  ]) || firstValue(embeddedEducation, [
    "programLinkedInUrl", "program_linkedin_url", "program.linkedinUrl", "program.linkedin_url"
  ]));
  const institutionLinkedInUrl = safeLinkedInUrl(firstValue(linkedEducation, [
    "institutionLinkedInUrl", "institution_linkedin_url", "institution.linkedinUrl", "institution.linkedin_url"
  ]) || firstValue(institution || {}, [
    "linkedinUrl", "linkedInUrl", "linkedin_url", "links.linkedin", "social.linkedin"
  ]) || firstValue(embeddedEducation, [
    "institutionLinkedInUrl", "institution_linkedin_url", "institution.linkedinUrl", "institution.linkedin_url"
  ]));
  const studyPeriodLabel = localizedField(linkedEducation, ["studyPeriod.label", "study_period.label"]);

  return {
    labelKey: educationLabelKey(educationMode, placementType, effectiveAwardStatus, personalAwardVerified, programCode(engagement)),
    institutionId: recordId(institution || {}, "institution"),
    mode: educationMode,
    placementType,
    awardStatus: effectiveAwardStatus,
    personalAwardVerified,
    verificationStatus,
    hidden: ownerDetailRequiredWithoutPrimaryEducation,
    cardDisplay,
    shortProgram: shortProgram || fullProgram,
    fullProgram: fullProgram || shortProgram,
    shortInstitution: shortInstitution || fullInstitution,
    fullInstitution: fullInstitution || shortInstitution,
    programLinkedInUrl,
    institutionLinkedInUrl,
    degreeSupplement: educationMode === "qualification" ? "" : degreeSupplement,
    studyPeriodLabel
  };
}

function educationLabelText(model, { detail = false } = {}) {
  const education = model.education;
  if (education.labelKey === "educationProgram") {
    return detail ? education.fullProgram : education.shortProgram;
  }

  const label = message(education.labelKey);
  const usesChulaStudentTerm = state.language === "th" && education.institutionId === "inst-chula";
  return usesChulaStudentTerm ? label.replaceAll("นักศึกษา", "นิสิต") : label;
}

function normalizedBoolean(value, accepted = []) {
  if (value === true || value === 1) return true;
  const normalized = String(value || "").toLowerCase().trim();
  return ["true", "1", "yes", "y", ...accepted].includes(normalized);
}

function approvedAssetFor(personRecord, assets) {
  const id = recordId(personRecord, "person");
  const candidates = assets.filter((asset) => {
    const owner = personId(asset) || String(firstValue(asset, ["ownerId", "owner_id", "subjectId", "subject_id", "_key"]) || "");
    const type = String(firstValue(asset, ["type", "assetType", "asset_type", "kind", "mediaType", "media_type"]) || "image").toLowerCase();
    const verificationStatus = String(asset.verificationStatus || "").toLowerCase();
    const consentStatus = String(asset.consentStatus || "").toLowerCase();
    const rightsStatus = String(asset.rightsStatus || "").toLowerCase();
    const publicationStatus = String(asset.publicationStatus || "").toLowerCase();
    const publicationBasis = String(asset.publicationBasis || "").toLowerCase();
    const ownerApprovalStatus = String(firstValue(asset, ["ownerApproval.status", "owner_approval.status"]) || "").toLowerCase();
    const authorizedPublicPortrait = publicationBasis === "owner_authorized_public_profile_portrait" && ownerApprovalStatus === "granted";
    const contractApproved = verificationStatus === "verified" &&
      (consentStatus === "granted" || authorizedPublicPortrait) &&
      rightsStatus === "cleared" &&
      publicationStatus === "publishable";
    return owner === id && /image|photo|portrait|headshot|avatar/.test(type) && contractApproved;
  });
  candidates.sort((a, b) => Number(firstValue(b, ["primary", "isPrimary", "is_primary"]) === true) - Number(firstValue(a, ["primary", "isPrimary", "is_primary"]) === true));
  const asset = candidates[0];
  if (!asset) return null;
  const rawUrl = String(firstValue(asset, ["publicPath", "public_path", "path", "src", "url", "href"]) || "").trim();
  const url = safeAssetUrl(rawUrl, id);
  if (!url) return null;
  return {
    url,
    alt: localizedField(asset, ["alt", "altText", "alt_text", "caption"])
  };
}

function socialIsPublishable(profile) {
  const verificationStatus = String(profile.verificationStatus || "").toLowerCase();
  const consentStatus = String(profile.consentStatus || "").toLowerCase();
  const publicationStatus = String(profile.publicationStatus || "").toLowerCase();
  const publicationBasis = String(profile.publicationBasis || "").toLowerCase();
  const ownerApprovalStatus = String(firstValue(profile, ["ownerApproval.status", "owner_approval.status"]) || "").toLowerCase();
  const hasContractGates = [profile.verificationStatus, profile.consentStatus, profile.publicationStatus]
    .some((value) => value !== undefined);
  if (hasContractGates) {
    const authorizedPublicProfile = publicationBasis === "owner_authorized_public_profile_link" && ownerApprovalStatus === "granted";
    return verificationStatus === "verified" && publicationStatus === "publishable" &&
      (consentStatus === "granted" || authorizedPublicProfile);
  }
  const visibility = firstValue(profile, ["public", "isPublic", "is_public", "visibility", "publication_status"]);
  const verified = firstValue(profile, ["verified", "isVerified", "is_verified", "verification_status"]);
  const consent = firstValue(profile, ["consent", "consentPublic", "consent_public", "hasConsent", "has_consent"]);
  return normalizedBoolean(visibility, ["public", "published", "publishable"]) &&
    normalizedBoolean(verified, ["verified", "confirmed"]) &&
    normalizedBoolean(consent, ["consented", "granted", "public"]);
}

function safeExternalUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch (error) {
    return "";
  }
}

function safeLinkedInUrl(value) {
  try {
    const url = new URL(String(value || ""));
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !["linkedin.com", "www.linkedin.com"].includes(host)) return "";
    return url.href;
  } catch (error) {
    return "";
  }
}

function safeAssetUrl(value, expectedPersonId) {
  const normalized = String(value || "").replace(/^\.\//, "");
  const match = normalized.match(/^public\/assets\/people\/([SPI]\d{4})\.(?:jpe?g|png|webp|avif)$/i);
  if (!match || match[1].toUpperCase() !== String(expectedPersonId || "").toUpperCase()) return "";
  return `./${normalized}`;
}

function safeCertificateUrl(value) {
  const normalized = String(value || "").replace(/^\.\//, "");
  if (!/^public\/assets\/certificates\/[A-Za-z0-9][A-Za-z0-9._-]*\.(?:jpe?g|png|webp)$/i.test(normalized)) return "";
  return `./${normalized}`;
}

function certificateIsPublishable(certificate) {
  const verificationStatus = normalizedEnum(firstValue(certificate, ["verificationStatus", "verification_status"]));
  const publicationStatus = normalizedEnum(firstValue(certificate, ["publicationStatus", "publication_status"]));
  const rightsStatus = normalizedEnum(firstValue(certificate, ["rightsStatus", "rights_status"]));
  const consentStatus = normalizedEnum(firstValue(certificate, ["consentStatus", "consent_status"]));
  const publicationBasis = normalizedEnum(firstValue(certificate, ["publicationBasis", "publication_basis"]));
  const ownerApprovalStatus = normalizedEnum(firstValue(certificate, ["ownerApproval.status", "owner_approval.status"]));
  const ownerAuthorized = publicationBasis === "owner_authorized_public_certificate" && ownerApprovalStatus === "granted";
  return verificationStatus === "verified" && publicationStatus === "publishable" && rightsStatus === "cleared" &&
    (consentStatus === "granted" || ownerAuthorized);
}

function certificateRecordsForPerson(personRecord, certificates) {
  const id = recordId(personRecord, "person");
  const embedded = asRecords(firstValue(personRecord, ["certificates"]));
  const seen = new Set();
  return [...certificates.filter((certificate) => personId(certificate) === id), ...embedded]
    .flatMap((certificate) => {
      if (!certificateIsPublishable(certificate)) return [];
      const publicUrl = safeCertificateUrl(firstValue(certificate, ["publicPath", "public_path", "path", "src"]));
      const certificateId = recordId(certificate, "certificate");
      if (!publicUrl || !certificateId || seen.has(certificateId)) return [];
      seen.add(certificateId);
      const fallbackFilename = `${certificateId}.${publicUrl.split(".").pop() || "png"}`;
      const requestedFilename = String(firstValue(certificate, ["downloadFilename", "download_filename"]) || fallbackFilename);
      const downloadFilename = /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(requestedFilename) ? requestedFilename : fallbackFilename;
      return [{
        id: certificateId,
        personId: id,
        publicUrl,
        downloadFilename,
        titleTh: localizedField(certificate, ["title"], "th"),
        titleEn: localizedField(certificate, ["title"], "en"),
        credentialId: String(firstValue(certificate, ["credentialId", "credential_id"]) || ""),
        programCode: String(firstValue(certificate, ["programCode", "program_code"]) || ""),
        awardedOn: String(firstValue(certificate, ["awardedOn", "awarded_on"]) || ""),
        raw: certificate
      }];
    });
}

function socialPlatform(profile) {
  const platform = String(firstValue(profile, ["platform", "network", "type", "service"]) || "website").toLowerCase();
  if (platform.includes("linkedin")) return { key: "linkedin", label: "LinkedIn" };
  if (platform.includes("facebook") || platform === "fb") return { key: "facebook", label: "Facebook" };
  if (platform.includes("instagram") || platform === "ig") return { key: "instagram", label: "Instagram" };
  if (platform.includes("tiktok")) return { key: "tiktok", label: "TikTok" };
  if (platform.includes("github")) return { key: "github", label: "GitHub" };
  if (platform.includes("gitlab")) return { key: "gitlab", label: "GitLab" };
  return { key: "website", label: localizedField(profile, ["label", "name"]) || "Website" };
}

const PUBLIC_WEB_SOCIAL_KEYS = new Set(["linkedin", "github"]);

function normalizeSocials(personRecord, socialProfiles) {
  const id = recordId(personRecord, "person");
  const seen = new Set();
  return socialProfiles.flatMap((profile) => {
    if (personId(profile) !== id || !socialIsPublishable(profile)) return [];
    const platform = socialPlatform(profile);
    if (!PUBLIC_WEB_SOCIAL_KEYS.has(platform.key)) return [];
    const url = safeExternalUrl(firstValue(profile, ["publicUrl", "public_url", "url", "href", "profileUrl", "profile_url"]));
    if (!url || seen.has(url)) return [];
    seen.add(url);
    return [{ ...platform, url }];
  });
}

function normalizeSearch(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeStatusForPerson(personRecord, engagement) {
  const explicit = firstValue(personRecord, ["statusKey", "status_key", "currentStatus", "current_status", "status"]);
  if (explicit) return statusKey(explicit);
  return engagement && engagementIsCurrent(engagement) ? "active" : "alumni";
}

function localizedWorkName(work, language = state.language) {
  return localizedField(work, ["shortNames", "names", "displayName", "display_name", "officialName", "official_name", "name", "workName", "work_name", "product"], language) || recordId(work, "work");
}

function workNameForContribution(contribution, workIndex, language = state.language) {
  const work = workIndex.get(relationId(contribution, "work"));
  return localizedWorkName(work || contribution, language);
}

function localizedContributionRole(contribution) {
  const role = localizedField(contribution, ["roleInWork", "role_in_work", "role", "contributionRole", "contribution_role"], "en");
  return publicRoleLabel(role);
}

function contributionRecordsForPerson(id, contributions, workIndex) {
  return contributions
    .filter((contribution) => {
      if (personId(contribution) === id) return true;
      const personIds = firstValue(contribution, ["personIds", "person_ids", "people"]);
      return Array.isArray(personIds) && personIds.map(String).includes(id);
    })
    .map((contribution) => {
      const workId = relationId(contribution, "work") || recordId(contribution, "work");
      const work = workIndex.get(workId) || {};
      const publicUrl = safeExternalUrl(localizedField(work, ["publicUrls", "catalogUrls", "publicUrl", "catalogUrl", "destinationUrl"]));
      const evidenceLinkScope = normalizedEnum(firstValue(work, ["linkEvidence.linkScope", "linkEvidence.link_scope"]));
      const evidenceOnlyUrl = evidenceLinkScope === "evidence_only"
        ? safeExternalUrl(firstValue(work, ["linkEvidence.evidenceUrl", "linkEvidence.evidence_url"]))
        : "";
      return {
        raw: contribution,
        workId,
        name: workNameForContribution(contribution, workIndex),
        nameTh: workNameForContribution(contribution, workIndex, "th"),
        nameEn: workNameForContribution(contribution, workIndex, "en"),
        publicUrl,
        evidenceOnlyUrl,
        role: localizedContributionRole(contribution),
        period: periodForContribution(contribution)
      };
    })
    .filter((contribution) => contribution.name);
}

function achievementRecordsForPerson(id, achievements, personAchievements) {
  const achievementIndex = new Map(achievements.map((achievement) => [recordId(achievement, "achievement"), achievement]));
  const joined = personAchievements
    .filter((link) => personId(link) === id)
    .map((link) => achievementIndex.get(relationId(link, "achievement")) || link);
  const direct = achievements.filter((achievement) => {
    const people = firstValue(achievement, ["recipientPersonIds", "recipient_person_ids", "personIds", "person_ids", "people"]);
    return Array.isArray(people) && people.map(String).includes(id);
  });
  const seen = new Set();
  return [...joined, ...direct].filter((achievement) => {
    const key = recordId(achievement, "achievement") || localizedField(achievement, ["name", "title"]);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function publicationRecordsForPerson(id, publications) {
  return publications.flatMap((publication) => {
    if (personId(publication) !== id) return [];

    const scope = normalizedEnum(firstValue(publication, ["scope"]));
    const verificationStatus = normalizedEnum(firstValue(publication, ["verificationStatus", "verification_status"]));
    const publicationBasis = normalizedEnum(firstValue(publication, ["publicationBasis", "publication_basis"]));
    const publicUrl = safeExternalUrl(firstValue(publication, ["publicUrl", "public_url"]));
    const isGovernedExternalPublication = scope === "external_publication_not_landometer_contribution" &&
      verificationStatus === "owner_supplied_with_bibliographic_match" &&
      publicationBasis === "owner_authorized_external_publication_link";
    if (!isGovernedExternalPublication || !publicUrl) return [];

    return [{
      id: recordId(publication, "publication"),
      titleTh: localizedField(publication, ["title", "name"], "th"),
      titleEn: localizedField(publication, ["title", "name"], "en"),
      outlet: String(firstValue(publication, ["outlet", "publisher", "journal"]) || ""),
      year: String(firstValue(publication, ["year", "publicationYear", "publication_year"]) || ""),
      publicUrl
    }];
  });
}

function governedBioIsVisible(personRecord, bioTh, bioEn) {
  const status = normalizedEnum(firstValue(personRecord, ["bio.status"]));
  const verificationStatus = normalizedEnum(firstValue(personRecord, ["bio.verificationStatus", "bio.verification_status"]));
  const publicationBasis = normalizedEnum(firstValue(personRecord, ["bio.publicationBasis", "bio.publication_basis"]));
  const sourceBasis = normalizedEnum(firstValue(personRecord, ["bio.sourceBasis", "bio.source_basis"]));
  const sourceType = normalizedEnum(firstValue(personRecord, ["bio.sourceType", "bio.source_type"]));
  const authorRole = normalizedEnum(firstValue(personRecord, ["bio.authorRole", "bio.author_role"]));
  const derivationMethod = normalizedEnum(firstValue(personRecord, ["bio.derivationMethod", "bio.derivation_method"]));
  const reviewStatus = normalizedEnum(firstValue(personRecord, ["bio.reviewStatus", "bio.review_status"]));
  const firstPersonPlaceholder = status === "source_backed_placeholder" &&
    verificationStatus === "owner_authorized_placeholder" &&
    publicationBasis === "owner_authorized_paraphrase_from_first_person_application" &&
    sourceBasis === "first_person_application_exact_roster_match" &&
    sourceType === "first_person_application" &&
    authorRole === "profile_subject" &&
    derivationMethod === "concise_paraphrase" &&
    reviewStatus === "pending_candidate_video_review";
  const factualFallbackPlaceholder = status === "source_backed_placeholder" &&
    verificationStatus === "owner_authorized_placeholder" &&
    publicationBasis === "owner_authorized_synthesis_from_roster_evidence" &&
    sourceBasis === "factual_role_education_and_work_evidence" &&
    sourceType === "factual_fallback" &&
    authorRole === "assistant_paraphrase_from_owner_and_sheet_records" &&
    derivationMethod === "bounded_inference" &&
    reviewStatus === "pending_candidate_video_review";
  const ownerApproved = status === "owner_approved" &&
    verificationStatus === "owner_approved" &&
    reviewStatus === "owner_approved";
  return Boolean(bioTh || bioEn) && (firstPersonPlaceholder || factualFallbackPlaceholder || ownerApproved);
}

function buildModels(data) {
  const people = asRecords(data.people);
  const engagements = asRecords(data.engagements);
  const institutions = asRecords(data.institutions);
  const programs = asRecords(data.programs);
  const educationRecords = asRecords(data.educationRecords || data.education_records);
  const works = asRecords(data.works);
  const contributions = asRecords(data.contributions);
  const achievements = asRecords(data.achievements);
  const personAchievements = asRecords(data.personAchievements || data.person_achievements);
  const publications = asRecords(data.publications);
  const socialProfiles = asRecords(data.socialProfiles || data.social_profiles);
  const assets = asRecords(data.assets?.people || data.assets);
  const certificates = asRecords(data.certificates);
  const institutionIndex = new Map(institutions.map((record) => [recordId(record, "institution"), record]));
  const programIndex = new Map(programs.map((record) => [recordId(record, "program"), record]));
  const workIndex = new Map(works.map((record) => [recordId(record, "work"), record]));

  state.works = works;
  state.models = people.map((personRecord) => {
    const id = recordId(personRecord, "person");
    const personEngagements = engagements.filter((engagement) => personId(engagement) === id).sort(engagementSort);
    const primaryEngagement = personEngagements[0] || {};
    const primaryPlacementType = academicPlacementTypeFor(primaryEngagement);
    const academicEngagement = String(programCode(primaryEngagement)).toUpperCase() === "IMP" ||
      ["internship", "cooperative_education"].includes(primaryPlacementType)
      ? primaryEngagement
      : personEngagements.find((engagement) =>
        ["internship", "cooperative_education"].includes(academicPlacementTypeFor(engagement))
      ) || primaryEngagement;
    const roleKey = engagementRoleKey(primaryEngagement) || normalizeRole(firstValue(personRecord, ["role", "roleCategory", "role_category"]));
    const educationMode = String(firstValue(personRecord, ["educationDisplayMode", "education_display_mode", "educationDisplay.mode", "education_display.mode"]) ||
      (roleKey === "fulltime" ? "qualification" : roleKey === "intern" ? "program" : "neutral"));
    const contributionsForPerson = contributionRecordsForPerson(id, contributions, workIndex);
    const hasPrimaryEducationRecord = educationRecords.some((record) => personId(record) === id && record.isPrimary === true);
    const primaryEducation = educationRecords.find((record) => personId(record) === id && record.isPrimary === true) ||
      educationRecords.find((record) => personId(record) === id) || {};
    const education = educationFor(personRecord, academicEngagement, primaryEducation, programIndex, institutionIndex, educationMode, hasPrimaryEducationRecord);
    const nicknameTh = localizedField(personRecord, ["names.card", "names.nickname", "nickname", "displayName", "display_name", "shortName", "short_name"], "th");
    const nicknameEn = localizedField(personRecord, ["names.card", "names.nickname", "nickname", "displayName", "display_name", "shortName", "short_name"], "en");
    const fullNameTh = localizedField(personRecord, ["names.full", "officialName", "official_name", "fullName", "full_name", "name"], "th");
    const fullNameEn = localizedField(personRecord, ["names.full", "officialName", "official_name", "fullName", "full_name", "name"], "en");
    const nickname = state.language === "th" ? (nicknameTh || nicknameEn || fullNameTh || fullNameEn || id) : (nicknameEn || nicknameTh || fullNameEn || fullNameTh || id);
    const officialName = state.language === "th" ? (fullNameTh || fullNameEn || nickname) : (fullNameEn || fullNameTh || nickname);
    const bioTh = localizedValue(getPath(personRecord, "bio.th"), "th");
    const bioEn = localizedValue(getPath(personRecord, "bio.en"), "en");
    const bioVisible = governedBioIsVisible(personRecord, bioTh, bioEn);
    const cohort = String(firstValue(primaryEngagement, ["cohort", "year", "firstJoined", "first_joined"]) || firstValue(personRecord, ["cohort", "firstJoined", "first_joined", "year"]) || "").slice(0, 4);
    const image = approvedAssetFor(personRecord, assets);
    const achievementRecords = achievementRecordsForPerson(id, achievements, personAchievements);
    const publicationRecords = publicationRecordsForPerson(id, publications);
    const socials = normalizeSocials(personRecord, socialProfiles);
    const certificateRecords = certificateRecordsForPerson(personRecord, certificates);
    const model = {
      id,
      raw: personRecord,
      engagements: personEngagements,
      primaryEngagement,
      roleKey,
      roleName: engagementRoleName(primaryEngagement, roleKey),
      statusKey: normalizeStatusForPerson(personRecord, primaryEngagement),
      cohort,
      education,
      nicknameTh,
      nicknameEn,
      fullNameTh,
      fullNameEn,
      nickname,
      officialName,
      bioTh,
      bioEn,
      bioVisible,
      bio: state.language === "th" ? (bioTh || bioEn) : (bioEn || bioTh),
      contributions: contributionsForPerson,
      achievements: achievementRecords,
      publications: publicationRecords,
      socials,
      certificates: certificateRecords,
      image,
      avatarName: nickname
    };
    model.searchText = makeSearchText(model, programIndex, institutionIndex, workIndex);
    return model;
  }).filter((model) => model.id);

  // Array#sort is stable: Active people remain in source order, while Alumni
  // follow from the most recently completed engagement to undated records.
  state.models.sort(personModelSort);
}

function makeSearchText(model) {
  const values = [
    model.id,
    model.nicknameTh,
    model.nicknameEn,
    model.fullNameTh,
    model.fullNameEn,
    model.roleName,
    model.roleKey,
    model.cohort,
    model.education.shortProgram,
    model.education.fullProgram,
    model.education.shortInstitution,
    model.education.fullInstitution,
    model.bioTh,
    model.bioEn,
    ...model.contributions.flatMap((contribution) => [contribution.nameTh, contribution.nameEn, contribution.role]),
    ...model.achievements.flatMap((achievement) => [
      localizedField(achievement, ["name", "title"], "th"),
      localizedField(achievement, ["name", "title"], "en")
    ])
  ];
  return normalizeSearch(values.filter(Boolean).join(" "));
}

function refreshLocalizedModels() {
  if (!state.raw) return;
  buildModels(state.raw);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function avatarMarkup(model, className = "card-avatar") {
  const image = model.image;
  const imageMarkup = image
    ? `<img class="avatar-image" src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt || model.officialName)}" loading="lazy" decoding="async" data-parallax-media data-parallax-depth="14">`
    : "";
  return `
    <div class="${className}" data-avatar>
      <span class="avatar-name" aria-hidden="true">${escapeHtml(model.nickname || model.avatarName || model.officialName)}</span>
      ${imageMarkup}
    </div>
  `;
}

function hydrateImages(scope) {
  scope.querySelectorAll(".avatar-image").forEach((image) => {
    const avatar = image.closest("[data-avatar]");
    const show = () => avatar?.classList.add("has-photo");
    const fail = () => {
      avatar?.classList.remove("has-photo");
      image.remove();
    };
    image.addEventListener("load", show, { once: true });
    image.addEventListener("error", fail, { once: true });
    if (image.complete) {
      if (image.naturalWidth > 0) show();
      else fail();
    }
  });
}

function educationSummary(model) {
  if (model.education.hidden) return "";
  if (model.education.labelKey === "educationProgram") {
    return model.education.shortInstitution || model.education.cardDisplay || model.education.shortProgram;
  }
  if (model.education.cardDisplay) return model.education.cardDisplay;
  const rawProgram = model.education.shortProgram;
  const program = state.language === "th" && /^วศ\.?\s*คอมพิวเตอร์$/i.test(rawProgram)
    ? "วิศวกรรมคอมพิวเตอร์"
    : rawProgram;
  const parts = [program, model.education.shortInstitution].filter(Boolean);
  return parts.join(" · ");
}

function programCode(engagement) {
  return String(firstValue(engagement, ["program.code", "programCode", "program_code"]) || "").toUpperCase();
}

function roleDisplay(model) {
  if (model.roleKey === "intern") {
    const programs = {
      FDI: "Full-stack Developer Intern, FDI",
      MSI: "Marketing Strategy Intern, MSI",
      PDI: "Product Developer Intern, PDI",
      PMI: "Partnership Maker Intern, PMI"
    };
    return programs[programCode(model.primaryEngagement)] || model.roleName || "Intern";
  }
  return publicRoleLabel(model.roleName) || "Team member";
}

function statusDisplay(model) {
  return model.statusKey === "alumni" ? "Alumni" : "Active";
}

function currentNickname(model) {
  return state.language === "th"
    ? (model.nicknameTh || model.nicknameEn || model.fullNameTh || model.fullNameEn || model.id)
    : (model.nicknameEn || model.nicknameTh || model.fullNameEn || model.fullNameTh || model.id);
}

function currentOfficialName(model) {
  return state.language === "th"
    ? (model.fullNameTh || model.fullNameEn || currentNickname(model))
    : (model.fullNameEn || model.fullNameTh || currentNickname(model));
}

function currentBio(model) {
  if (!model.bioVisible) return "";
  return state.language === "th" ? (model.bioTh || model.bioEn) : (model.bioEn || model.bioTh);
}

function localizedContributionName(contribution) {
  return state.language === "th" ? (contribution.nameTh || contribution.nameEn || contribution.name) : (contribution.nameEn || contribution.nameTh || contribution.name);
}

function engagementCategoryForHistory(engagement) {
  return normalizedEnum(firstValue(engagement, ["category", "roleCategory", "role_category", "employmentType", "employment_type"]));
}

function engagementSequenceForHistory(engagement) {
  const raw = firstValue(engagement, ["sequenceHint", "sequence_hint"]);
  const sequence = Number(raw);
  return Number.isInteger(sequence) && sequence > 0 ? sequence : null;
}

function fourDigitYears(value) {
  return [...new Set(String(value || "").match(/(?:19|20)\d{2}/g) || [])];
}

function engagementPeriodForHistory(engagement) {
  const cohort = localizedField(engagement, ["cohortLabel", "cohort_label", "cohort"]);
  const cohortYears = fourDigitYears(cohort);
  const batchMatch = cohort.match(/\bbatch\s*(\d+)/i) || cohort.match(/รุ่น\s*(\d+)/i);
  if (batchMatch && cohortYears.length) {
    const batch = state.language === "th" ? `รุ่น ${batchMatch[1]}` : `Batch ${batchMatch[1]}`;
    return `${batch} · ${cohortYears.join("–")}`;
  }
  if (cohortYears.length) return cohortYears.join("–");

  const startYears = fourDigitYears(firstValue(engagement, ["start", "startDate", "start_date"]));
  const endYears = fourDigitYears(firstValue(engagement, ["end", "endDate", "end_date"]));
  const startYear = startYears[0] || "";
  const endYear = endYears[0] || "";
  if (startYear && engagementIsCurrent(engagement)) return `${startYear}–${message("present")}`;
  if (startYear && endYear) return startYear === endYear ? startYear : `${startYear}–${endYear}`;
  if (startYear || endYear) return startYear || endYear;
  if (engagementIsCurrent(engagement)) return message("present");
  const sequence = engagementSequenceForHistory(engagement);
  return sequence ? message("engagementSequence", { count: sequence }) : "";
}

function engagementChronologyYear(engagement) {
  const candidates = [
    firstValue(engagement, ["start", "startDate", "start_date"]),
    firstValue(engagement, ["cohortLabel", "cohort_label", "cohort"]),
    firstValue(engagement, ["end", "endDate", "end_date"])
  ];
  for (const candidate of candidates) {
    const year = fourDigitYears(candidate)[0];
    if (year) return Number(year);
  }
  return null;
}

function distinctEngagementsForHistory(engagements) {
  const seen = new Set();
  const distinct = engagements.filter((engagement) => {
    const id = recordId(engagement, "engagement");
    const fallbackKey = [
      engagementCategoryForHistory(engagement),
      programCode(engagement),
      localizedField(engagement, ["program.names"], "th"),
      localizedField(engagement, ["program.names"], "en"),
      firstValue(engagement, ["cohortLabel", "cohort_label", "cohort"]),
      firstValue(engagement, ["start", "startDate", "start_date"]),
      firstValue(engagement, ["end", "endDate", "end_date"]),
      firstValue(engagement, ["status"]),
      engagementSequenceForHistory(engagement)
    ].map((value) => String(value ?? "")).join("|");
    const key = id || fallbackKey;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const everyRecordHasSequence = distinct.length > 0 && distinct.every((engagement) => engagementSequenceForHistory(engagement));
  return distinct.map((engagement, index) => ({ engagement, index })).sort((a, b) => {
    if (everyRecordHasSequence) {
      return engagementSequenceForHistory(a.engagement) - engagementSequenceForHistory(b.engagement);
    }
    const aYear = engagementChronologyYear(a.engagement);
    const bYear = engagementChronologyYear(b.engagement);
    const aRank = aYear ?? (engagementIsCurrent(a.engagement) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
    const bRank = bYear ?? (engagementIsCurrent(b.engagement) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
    return aRank - bRank || a.index - b.index;
  }).map(({ engagement }) => engagement);
}

function engagementChipName(engagement) {
  const category = engagementCategoryForHistory(engagement);
  if (category === "internship") return programCode(engagement) || localizedField(engagement, ["program.names", "roleTitle", "role_title"], "en") || "Intern";
  return engagementRoleName(engagement, engagementRoleKey(engagement)) || programCode(engagement) || "Team member";
}

function engagementChipLabel(engagement) {
  const category = engagementCategoryForHistory(engagement);
  const placementType = academicPlacementTypeFor(engagement);
  const placement = category === "internship"
    ? placementType === "cooperative_education"
      ? message("placementCooperativeShort")
      : placementType === "internship"
        ? message("placementInternshipShort")
        : ""
    : "";
  return uniqueLabels([engagementChipName(engagement), placement, engagementPeriodForHistory(engagement)]).join(" · ");
}

function engagementHistoryMarkup(model) {
  const engagements = distinctEngagementsForHistory(model.engagements);
  if (engagements.length < 2) return "";
  const labels = engagements.map(engagementChipLabel);
  const labelCounts = labels.reduce((counts, label) => counts.set(label, (counts.get(label) || 0) + 1), new Map());
  const chips = engagements.map((engagement, index) => {
    const sequence = engagementSequenceForHistory(engagement) || index + 1;
    const label = labelCounts.get(labels[index]) > 1
      ? `${labels[index]} · ${message("engagementSequence", { count: sequence })}`
      : labels[index];
    const fullProgram = localizedField(engagement, ["program.names", "roleTitle", "role_title"]);
    const title = uniqueLabels([fullProgram, engagementPeriodForHistory(engagement)]).join(" · ") || label;
    return `<span class="engagement-chip" data-engagement-id="${escapeHtml(recordId(engagement, "engagement"))}" title="${escapeHtml(title)}">${escapeHtml(label)}</span>`;
  }).join("");
  return `<span class="engagement-history"><span class="engagement-history-label">${escapeHtml(message("engagementHistory"))}</span><span class="engagement-chip-list">${chips}</span></span>`;
}

function renderCard(model) {
  const nickname = currentNickname(model);
  const officialName = currentOfficialName(model);
  const education = educationSummary(model);
  const story = currentBio(model);
  const contributionPreview = model.contributions.slice(0, 3);
  const more = model.contributions.length - contributionPreview.length;
  const workMarkup = contributionPreview.length
    ? `<span class="work-preview">${contributionPreview.map((contribution) => `<span class="work-chip">${escapeHtml(localizedContributionName(contribution))}</span>`).join("")}${more > 0 ? `<span class="work-chip work-chip--more">${escapeHtml(message("moreWorks", { count: more }))}</span>` : ""}</span>`
    : "";
  const storyMarkup = story ? `<span class="card-story">${escapeHtml(story)}</span>` : "";
  const educationMarkup = education ? `
    <span class="education-summary">
      <span class="education-label">${escapeHtml(educationLabelText(model))}</span>
      <span class="education-value">${escapeHtml(education)}</span>
    </span>
  ` : "";

  const detailId = `person-detail-${model.id}`;
  const shell = document.createElement("article");
  shell.className = "person-card-shell";
  shell.dataset.personId = model.id;
  shell.dataset.approach = "peer_group";
  shell.dataset.approachKey = `person-${model.id}`;

  const button = document.createElement("button");
  button.className = "person-card";
  button.type = "button";
  button.dataset.personId = model.id;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", detailId);
  button.setAttribute("aria-label", message("openProfile", { name: nickname }));
  button.innerHTML = `
    ${avatarMarkup({ ...model, nickname, officialName })}
    <span class="card-body">
      <span class="card-meta-row">
        <span class="card-role-status">
          <span class="role-badge" data-role="${escapeHtml(model.roleKey)}">${escapeHtml(roleDisplay(model))}</span>
          <span class="status-badge" data-status="${escapeHtml(model.statusKey)}">${escapeHtml(statusDisplay(model))}</span>
        </span>
        <span class="person-id">${escapeHtml(model.id)}</span>
      </span>
      <span class="card-name" id="person-card-title-${escapeHtml(model.id)}">${escapeHtml(nickname)}</span>
      ${officialName && officialName !== nickname ? `<span class="card-official-name">${escapeHtml(officialName)}</span>` : ""}
      ${engagementHistoryMarkup(model)}
      ${educationMarkup}
      ${storyMarkup}
      ${workMarkup}
      <span class="card-open-cue">${escapeHtml(message("readStory"))}</span>
    </span>
  `;
  const detail = document.createElement("div");
  detail.className = "person-inline-detail";
  detail.id = detailId;
  detail.hidden = true;

  button.addEventListener("click", () => {
    if (state.currentPersonId === model.id) closePerson({ trigger: button });
    else openPerson(model.id, button);
  });
  shell.append(button, detail);
  return shell;
}

function filteredModels() {
  const tokens = normalizeSearch(state.filters.query).split(" ").filter(Boolean);
  return state.models.filter((model) => {
    if (tokens.length && !tokens.every((token) => model.searchText.includes(token))) return false;
    if (state.filters.role && model.roleKey !== state.filters.role) return false;
    if (state.filters.cohort && model.cohort !== state.filters.cohort) return false;
    if (state.filters.status && model.statusKey !== state.filters.status) return false;
    if (state.filters.work && !model.contributions.some((contribution) => contribution.workId === state.filters.work)) return false;
    return true;
  });
}

function renderDirectory() {
  refreshLocalizedModels();
  const models = filteredModels();
  const expandedPersonIsVisible = models.some((model) => model.id === state.currentPersonId);
  if (state.currentPersonId && !expandedPersonIsVisible) {
    state.currentPersonId = null;
    updateUrl({ person: null });
  }
  const fragment = document.createDocumentFragment();
  models.forEach((model) => fragment.append(renderCard(model)));
  elements.board.replaceChildren(fragment);
  elements.board.setAttribute("aria-busy", "false");
  elements.board.setAttribute("aria-label", message("results", { shown: models.length, total: state.models.length }));
  hydrateImages(elements.board);
  mediaParallaxController?.refresh(elements.board);
  elements.loading.hidden = true;
  elements.error.hidden = true;
  elements.empty.hidden = models.length !== 0;
  elements.board.hidden = models.length === 0;
  if (models.length) layoutMasonry({ resetAssignments: true });
  approachMotionController?.refresh(elements.board);
  setText(elements.peopleTotal, formatNumber(state.models.length));
  setText(elements.resultsCount, message("results", { shown: formatNumber(models.length), total: formatNumber(state.models.length) }));
  updateFilterCount();
  if (state.currentPersonId) openPerson(state.currentPersonId, null, { fromUrl: true, animate: false, scroll: true });
}

function formatNumber(value) {
  return new Intl.NumberFormat(state.language === "th" ? "th-TH" : "en-US").format(value);
}

function updateFilterCount() {
  const count = [state.filters.role, state.filters.cohort, state.filters.status, state.filters.work].filter(Boolean).length;
  setText(elements.filterCount, formatNumber(count));
  elements.filterCount.dataset.empty = String(count === 0);
  setText(elements.filterOpenLabel, message("filter"));
  elements.filterOpen.setAttribute("aria-label", count ? message("filtersCount", { count: formatNumber(count) }) : message("filter"));
}

function syncFilterState() {
  state.filters.query = elements.searchInput.value;
  state.filters.role = elements.filterRole.value;
  state.filters.cohort = elements.filterCohort.value;
  state.filters.status = elements.filterStatus.value;
  state.filters.work = elements.filterWork.value;
  updateUrl({
    q: state.filters.query.trim(),
    role: state.filters.role,
    cohort: state.filters.cohort,
    status: state.filters.status,
    work: state.filters.work
  });
  if (state.raw) renderDirectory();
}

function clearFilters() {
  state.filters = { query: "", role: "", cohort: "", status: "", work: "" };
  elements.searchInput.value = "";
  elements.filterRole.value = "";
  elements.filterCohort.value = "";
  elements.filterStatus.value = "";
  elements.filterWork.value = "";
  updateUrl({ q: null, role: null, cohort: null, status: null, work: null });
  if (state.raw) renderDirectory();
  elements.searchInput.focus({ preventScroll: true });
}

function monthYearParts(value) {
  const text = String(localizedValue(value, "en") || "").trim();
  if (!text) return null;
  if (/^(?:19|20)\d{2}$/.test(text)) return { year: Number(text), month: null };
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const namedDate = text.match(/^(?:\d{1,2}\s+)?([A-Za-z]{3,9})[,.]?\s+((?:19|20)\d{2})$/);
  if (namedDate) {
    const month = monthNames.findIndex((name) => namedDate[1].toLowerCase().startsWith(name));
    if (month >= 0) return { year: Number(namedDate[2]), month };
  }
  const isoDate = text.match(/^((?:19|20)\d{2})-(\d{1,2})(?:-\d{1,2})?$/);
  if (isoDate && Number(isoDate[2]) >= 1 && Number(isoDate[2]) <= 12) {
    return { year: Number(isoDate[1]), month: Number(isoDate[2]) - 1 };
  }
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return null;
  return { year: parsed.getUTCFullYear(), month: parsed.getUTCMonth() };
}

function monthYearLabel(parts) {
  if (!parts) return "";
  if (parts.month === null) return String(parts.year);
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(parts.year, parts.month, 1)));
  return `${month} ${parts.year}`;
}

function monthYearRange(start, end, current = false) {
  if (!start && !end) return "";
  if (start && current) return `${monthYearLabel(start)}–${message("present")}`;
  if (!start) return monthYearLabel(end);
  if (!end) return monthYearLabel(start);
  if (start.month !== null && end.month !== null && start.year === end.year) {
    const startMonth = monthYearLabel(start).replace(` ${start.year}`, "");
    return start.month === end.month ? monthYearLabel(start) : `${startMonth}–${monthYearLabel(end)}`;
  }
  return monthYearLabel(start) === monthYearLabel(end) ? monthYearLabel(start) : `${monthYearLabel(start)}–${monthYearLabel(end)}`;
}

function periodForEngagement(engagement) {
  const startRaw = firstValue(engagement, ["start", "startDate", "start_date"]);
  const endRaw = firstValue(engagement, ["end", "endDate", "end_date"]);
  const normalizedRange = monthYearRange(monthYearParts(startRaw), monthYearParts(endRaw), engagementIsCurrent(engagement));
  if (normalizedRange) return normalizedRange;
  const cohort = localizedValue(firstValue(engagement, ["period", "cohortLabel", "cohort_label", "cohort", "year"]), "en");
  return fourDigitYears(cohort).join("–") || cohort;
}

function periodForContribution(contribution) {
  const startRaw = firstValue(contribution, ["period.start", "start", "startDate", "start_date"]);
  const endRaw = firstValue(contribution, ["period.end", "end", "endDate", "end_date"]);
  const normalizedRange = monthYearRange(monthYearParts(startRaw), monthYearParts(endRaw));
  if (normalizedRange) return normalizedRange;
  const label = localizedField(contribution, ["period.label", "period", "year", "date", "cohort"]);
  return fourDigitYears(label).join("–") || label;
}

function roleTitleForHistory(engagement) {
  if (engagementCategoryForHistory(engagement) === "internship") {
    const titles = {
      FDI: "Full-stack Developer Intern, FDI",
      PDI: "Product Developer Intern, PDI",
      MSI: "Marketing Strategy Intern, MSI",
      PMI: "Partnership Maker Intern, PMI"
    };
    const code = programCode(engagement);
    return titles[code] || localizedField(engagement, ["program.names", "roleTitle", "role_title"], "en") || code || "Intern";
  }
  const key = engagementRoleKey(engagement);
  return publicRoleLabel(engagementRoleName(engagement, key)) || "Team member";
}

function detailIconMarkup(kind) {
  const paths = {
    education: '<path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z"/><path d="M7 12v4.2c2.8 2.1 7.2 2.1 10 0V12"/><path d="M21 10v5"/>',
    history: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    contributions: '<path d="M5 5.5h5v5H5zM14 13.5h5v5h-5z"/><path d="M10 8h2a4 4 0 0 1 4 4v1.5M14 16h-2a4 4 0 0 1-4-4v-1.5"/>',
    achievements: '<path d="M8 4.5h8v3a4 4 0 0 1-8 0v-3Z"/><path d="M8 6H5.5v1.5A3.5 3.5 0 0 0 9 11M16 6h2.5v1.5A3.5 3.5 0 0 1 15 11M12 11.5V16M8.5 19.5h7M10 16h4v3.5"/>',
    publications: '<path d="M6.5 3.5h8l3 3v14h-11z"/><path d="M14.5 3.5v3h3M9.5 11h5M9.5 14h5M9.5 17h3"/>',
    certificates: '<path d="M12 3.5 14 5l2.5-.1.6 2.4 2 1.4-1 2.3.7 2.4-2.2 1.2-.8 2.4-2.5-.3-1.8 1.7-1.8-1.7-2.5.3-.8-2.4L4.2 13l.7-2.4-1-2.3 2-1.4.6-2.4L9 5l3-1.5Z"/><path d="m9.2 11.3 1.8 1.8 3.8-4"/>',
    profiles: '<circle cx="12" cy="12" r="8.5"/><path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5"/>'
  };
  return `<svg class="detail-section-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[kind] || paths.contributions}</svg>`;
}

function detailHeadingMarkup(id, label, icon) {
  return `<h3 id="${escapeHtml(id)}">${detailIconMarkup(icon)}<span>${escapeHtml(label)}</span></h3>`;
}

function externalLinkIconMarkup() {
  return `<span class="material-symbols-rounded external-link-icon" aria-hidden="true">open_in_new</span>`;
}

function educationLinkedInMarkup(url, labelKey) {
  if (!url) return "";
  const label = message(labelKey);
  return `<a class="education-profile-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${socialIconMarkup("linkedin")}</a>`;
}

function educationDetailMarkup(model) {
  if (model.education.hidden) return "";
  const program = model.education.fullProgram;
  const institution = model.education.fullInstitution;
  const supplementary = [model.education.degreeSupplement, model.education.studyPeriodLabel].filter(Boolean).join(" · ");
  const contextClass = model.education.labelKey === "educationImpvestConsultant"
    ? "education-context education-context--literal-case"
    : "education-context";
  if (!program && !institution) return "";
  const programIsContext = model.education.labelKey === "educationProgram";
  return `
    <section class="detail-section" aria-labelledby="detail-education-title-${escapeHtml(model.id)}">
      ${detailHeadingMarkup(`detail-education-title-${model.id}`, message("educationSection"), "education")}
      <div class="education-detail">
        <p class="${contextClass}">${escapeHtml(educationLabelText(model, { detail: true }))}</p>
        ${program && !programIsContext ? `<div class="education-fact"><p class="education-program">${escapeHtml(program)}</p>${educationLinkedInMarkup(model.education.programLinkedInUrl, "openProgramLinkedIn")}</div>` : ""}
        ${institution ? `<div class="education-fact"><p class="education-institution">${escapeHtml(institution)}</p>${educationLinkedInMarkup(model.education.institutionLinkedInUrl, "openInstitutionLinkedIn")}</div>` : ""}
        ${supplementary ? `<p class="education-supplementary">${escapeHtml(supplementary)}</p>` : ""}
      </div>
    </section>
  `;
}

function roleHistoryMarkup(model) {
  if (!model.engagements.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-role-title-${escapeHtml(model.id)}">
      ${detailHeadingMarkup(`detail-role-title-${model.id}`, message("roleHistory"), "history")}
      <ol class="timeline">
        ${model.engagements.map((engagement) => {
          const role = roleTitleForHistory(engagement);
          const product = localizedField(engagement, ["productOwned", "product_owned", "product", "area", "team"]);
          const meta = [periodForEngagement(engagement), product].filter(Boolean).join(" · ");
          return `<li class="timeline-item"><p class="timeline-heading">${escapeHtml(role)}</p>${meta ? `<p class="timeline-meta">${escapeHtml(meta)}</p>` : ""}</li>`;
        }).join("")}
      </ol>
    </section>
  `;
}

function contributionsMarkup(model) {
  if (!model.contributions.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-contribution-title-${escapeHtml(model.id)}">
      ${detailHeadingMarkup(`detail-contribution-title-${model.id}`, message("contributions"), "contributions")}
      <ul class="contribution-list">
        ${model.contributions.map((contribution) => {
          const meta = [contribution.role ? message("contributionRole", { role: contribution.role }) : "", contribution.period].filter(Boolean).join(" · ");
          const name = localizedContributionName(contribution);
          const nameMarkup = contribution.publicUrl
            ? `<a class="contribution-heading-link" href="${escapeHtml(contribution.publicUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(message("openWork", { name }))}"><span class="contribution-name">${escapeHtml(name)}</span><span class="contribution-open-icon" aria-hidden="true">${externalLinkIconMarkup()}</span></a>`
            : `<p class="contribution-name">${escapeHtml(name)}</p>`;
          const evidenceMarkup = contribution.evidenceOnlyUrl
            ? `<a class="contribution-evidence-link" href="${escapeHtml(contribution.evidenceOnlyUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(message("openAwardEvidence", { name }))}"><span>${escapeHtml(message("awardEvidence"))}</span>${externalLinkIconMarkup()}</a>`
            : "";
          return `<li class="contribution-item" data-work-id="${escapeHtml(contribution.workId)}">${nameMarkup}${evidenceMarkup}${meta ? `<p class="contribution-meta">${escapeHtml(meta)}</p>` : ""}</li>`;
        }).join("")}
      </ul>
    </section>
  `;
}

function achievementsMarkup(model) {
  if (!model.achievements.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-achievement-title-${escapeHtml(model.id)}">
      ${detailHeadingMarkup(`detail-achievement-title-${model.id}`, message("achievements"), "achievements")}
      <ul class="achievement-list">
        ${model.achievements.map((achievement) => {
          const name = localizedField(achievement, ["displayName", "display_name", "officialName", "official_name", "name", "title"]);
          const note = localizedField(achievement, ["description", "summary", "note"]);
          return `<li class="achievement-item"><p class="achievement-name">${escapeHtml(name)}</p>${note ? `<p class="contribution-meta">${escapeHtml(note)}</p>` : ""}</li>`;
        }).join("")}
      </ul>
    </section>
  `;
}

function publicationsMarkup(model) {
  if (!model.publications.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-publication-title-${escapeHtml(model.id)}">
      ${detailHeadingMarkup(`detail-publication-title-${model.id}`, message("publications"), "publications")}
      <ul class="publication-list">
        ${model.publications.map((publication) => {
          const title = state.language === "th"
            ? (publication.titleTh || publication.titleEn)
            : (publication.titleEn || publication.titleTh);
          const accessibleTitle = title || message("publications");
          const meta = [publication.outlet, publication.year].filter(Boolean).join(" · ");
          return `<li><a class="publication-link" href="${escapeHtml(publication.publicUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(message("openPublication", { name: accessibleTitle }))}">
            <span class="publication-copy"><strong>${escapeHtml(accessibleTitle)}</strong>${meta ? `<span>${escapeHtml(meta)}</span>` : ""}</span>
            <span class="publication-cue" aria-hidden="true">↗</span>
          </a></li>`;
        }).join("")}
      </ul>
    </section>
  `;
}

function socialIconMarkup(key) {
  if (key === "linkedin") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.34 7.43A2.07 2.07 0 1 1 5.34 3.3a2.07 2.07 0 0 1 0 4.13ZM3.56 9h3.55v11.45H3.56V9Zm5.79 0h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9Z"/></svg>`;
  }
  if (key === "github") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.98 10.98 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg>`;
  }
  return "";
}

function profileSocialIconsMarkup(model) {
  const profiles = model.socials.filter((social) => PUBLIC_WEB_SOCIAL_KEYS.has(social.key));
  if (!profiles.length) return "";
  return `<nav class="profile-icon-links" aria-label="${escapeHtml(message("publicProfiles"))}">${profiles.map((social) => `
    <a class="profile-icon-link" href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(social.label)}" title="${escapeHtml(social.label)}">
      ${socialIconMarkup(social.key)}
    </a>`).join("")}</nav>`;
}

function socialsMarkup(model) {
  return "";
}

function certificateTitle(certificate) {
  return state.language === "th"
    ? (certificate.titleTh || certificate.titleEn || message("certificateFallback"))
    : (certificate.titleEn || certificate.titleTh || message("certificateFallback"));
}

function certificateAwardedLabel(value) {
  const parsed = new Date(String(value || ""));
  if (Number.isNaN(parsed.getTime())) return String(value || "");
  return new Intl.DateTimeFormat(state.language === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(parsed);
}

function certificatesMarkup(model) {
  if (!model.certificates.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-certificate-title-${escapeHtml(model.id)}">
      ${detailHeadingMarkup(`detail-certificate-title-${model.id}`, message("certificates"), "certificates")}
      <div class="certificate-list">
        ${model.certificates.map((certificate) => {
          const title = certificateTitle(certificate);
          const meta = [
            certificate.programCode,
            certificate.credentialId ? message("certificateCredential", { id: certificate.credentialId }) : "",
            certificate.awardedOn ? message("certificateAwarded", { date: certificateAwardedLabel(certificate.awardedOn) }) : ""
          ].filter(Boolean).join(" · ");
          return `<button class="certificate-preview" type="button" data-certificate-id="${escapeHtml(certificate.id)}" aria-label="${escapeHtml(message("openCertificate", { name: currentNickname(model) }))}">
            <span class="certificate-thumbnail"><img src="${escapeHtml(certificate.publicUrl)}" alt="" loading="lazy" decoding="async"></span>
            <span class="certificate-preview-copy"><strong>${escapeHtml(title)}</strong>${meta ? `<span>${escapeHtml(meta)}</span>` : ""}</span>
            <span class="certificate-preview-cue" aria-hidden="true">↗</span>
          </button>`;
        }).join("")}
      </div>
    </section>
  `;
}

function personDetailMarkup(model) {
  return `
    <article class="person-detail" aria-labelledby="person-card-title-${escapeHtml(model.id)}">
      <div class="inline-detail-toolbar">
        <span class="section-kicker">${escapeHtml(message("registry"))}</span>
        <div class="inline-detail-actions">
          ${profileSocialIconsMarkup(model)}
          <button class="icon-button inline-detail-close" type="button" data-inline-close aria-label="${escapeHtml(message("closeDetails"))}"><span aria-hidden="true">×</span></button>
        </div>
      </div>
      <div class="detail-content">
        ${educationDetailMarkup(model)}
        ${roleHistoryMarkup(model)}
        ${contributionsMarkup(model)}
        ${achievementsMarkup(model)}
        ${publicationsMarkup(model)}
        ${certificatesMarkup(model)}
        ${socialsMarkup(model)}
      </div>
    </article>
  `;
}

function cardShellFor(id) {
  return Array.from(elements.board.querySelectorAll(".person-card-shell"))
    .find((shell) => shell.dataset.personId === id) || null;
}

function masonryGap() {
  const value = Number.parseFloat(getComputedStyle(elements.board).columnGap);
  return Number.isFinite(value) ? value : 16;
}

function masonryColumnCount(width, gap) {
  if (!desktopFilterQuery?.matches) return 1;
  return Math.min(3, Math.max(1, Math.floor((width + gap) / (300 + gap))));
}

function layoutMasonry() {
  const shells = Array.from(elements.board.querySelectorAll(".person-card-shell"));
  const boardWidth = elements.board.clientWidth;
  if (!shells.length || boardWidth <= 0 || elements.board.hidden) {
    elements.board.style.removeProperty("height");
    state.masonryColumnCount = 0;
    return;
  }

  const gap = masonryGap();
  const columnCount = masonryColumnCount(boardWidth, gap);
  const columnWidth = (boardWidth - (gap * (columnCount - 1))) / columnCount;

  shells.forEach((shell) => {
    shell.style.width = `${columnWidth}px`;
  });

  // Read every height only after all widths are fixed. This keeps the result
  // deterministic and avoids the browser's multi-column balancing algorithm.
  // Each card then joins the currently shortest column; ties resolve left to
  // right, so the first row always begins at the same top edge.
  void elements.board.offsetWidth;
  const columnHeights = Array(columnCount).fill(0);
  shells.forEach((shell) => {
    let column = 0;
    for (let candidate = 1; candidate < columnCount; candidate += 1) {
      if (columnHeights[candidate] < columnHeights[column]) column = candidate;
    }
    const top = columnHeights[column];
    shell.dataset.masonryColumn = String(column);
    shell.dataset.approachStep = String(column);
    shell.style.left = `${column * (columnWidth + gap)}px`;
    shell.style.top = `${top}px`;
    columnHeights[column] = top + shell.offsetHeight + gap;
  });

  elements.board.style.height = `${Math.max(0, ...columnHeights) - gap}px`;
  state.masonryColumnCount = columnCount;
}

function scheduleMasonryLayout() {
  if (state.masonryLayoutFrame) cancelAnimationFrame(state.masonryLayoutFrame);
  state.masonryLayoutFrame = requestAnimationFrame(() => {
    state.masonryLayoutFrame = 0;
    layoutMasonry();
  });
}

function cardPositionSnapshot() {
  return new Map(Array.from(elements.board.querySelectorAll(".person-card-shell"))
    .map((shell) => [shell.dataset.personId, shell.getBoundingClientRect()]));
}

function animateCardReflow(before, originId) {
  if (reducedMotionQuery?.matches) return;
  const shells = Array.from(elements.board.querySelectorAll(".person-card-shell"));
  const originIndex = Math.max(0, shells.findIndex((shell) => shell.dataset.personId === originId));
  const movers = [];
  shells.forEach((shell, index) => {
    const previous = before.get(shell.dataset.personId);
    const current = shell.getBoundingClientRect();
    if (!previous) return;
    const deltaX = previous.left - current.left;
    const deltaY = previous.top - current.top;
    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;
    movers.push({ shell, index, current, deltaX, deltaY });
  });

  // A deterministic ripple travels outward from the card the person chose.
  // The full FLIP delta makes cross-column hops traceable instead of abrupt.
  movers.sort((a, b) => Math.abs(a.index - originIndex) - Math.abs(b.index - originIndex) || a.index - b.index);
  movers.forEach(({ shell, index, deltaX, deltaY }, rippleIndex) => {
    reflowAnimations.get(shell)?.cancel();
    const delay = Math.min(rippleIndex, 10) * 38;
    const settleX = deltaX === 0 ? 0 : deltaX > 0 ? -7 : 7;
    const settleY = deltaY > 0 ? -5 : 5;
    if (typeof shell.animate !== "function") {
      shell.classList.remove("is-reflowing");
      shell.style.setProperty("--reflow-x", `${deltaX}px`);
      shell.style.setProperty("--reflow-y", `${deltaY}px`);
      shell.style.setProperty("--reflow-settle-x", `${settleX}px`);
      shell.style.setProperty("--reflow-settle-y", `${settleY}px`);
      shell.style.setProperty("--reflow-delay", `${delay}ms`);
      const reflowToken = `${performance.now()}-${index}`;
      shell.dataset.reflowToken = reflowToken;
      void shell.offsetWidth;
      shell.classList.add("is-reflowing");
      window.setTimeout(() => {
        if (shell.dataset.reflowToken !== reflowToken) return;
        shell.classList.remove("is-reflowing");
        delete shell.dataset.reflowToken;
        shell.style.removeProperty("--reflow-x");
        shell.style.removeProperty("--reflow-y");
        shell.style.removeProperty("--reflow-settle-x");
        shell.style.removeProperty("--reflow-settle-y");
        shell.style.removeProperty("--reflow-delay");
      }, 670 + delay);
      return;
    }
    const animation = shell.animate([
      { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.995)`, offset: 0, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      { transform: "translate3d(0, 0, 0) scale(1)", offset: 0.72, easing: "cubic-bezier(0.33, 1, 0.68, 1)" },
      { transform: `translate3d(${settleX}px, ${settleY}px, 0) scale(1.002)`, offset: 0.86, easing: "ease-out" },
      { transform: "translate3d(0, 0, 0)", offset: 1 }
    ], {
      id: `landom-card-reflow-${originId}`,
      duration: 620,
      delay,
      fill: "backwards"
    });
    reflowAnimations.set(shell, animation);
    animation.finished.catch(() => {}).finally(() => {
      if (reflowAnimations.get(shell) === animation) reflowAnimations.delete(shell);
    });
  });
}

function setCardExpanded(shell, expanded) {
  if (!shell) return;
  const button = shell.querySelector(":scope > .person-card");
  const detail = shell.querySelector(":scope > .person-inline-detail");
  const cue = button?.querySelector(".card-open-cue");
  shell.classList.toggle("is-expanded", expanded);
  if (button) {
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", expanded
      ? message("collapseProfile")
      : message("openProfile", { name: currentNickname(state.models.find((model) => model.id === shell.dataset.personId) || {}) }));
  }
  if (detail) detail.hidden = !expanded;
  if (cue) cue.textContent = expanded ? message("collapseProfile") : message("readStory");
}

function renderPersonDetail(id, detail) {
  const model = state.models.find((person) => person.id === id);
  if (!model || !detail) return false;
  detail.innerHTML = personDetailMarkup(model);
  detail.querySelector("[data-inline-close]")?.addEventListener("click", () => closePerson({ trigger: detail.closest(".person-card-shell")?.querySelector(".person-card") }));
  detail.querySelectorAll("[data-certificate-id]").forEach((button) => {
    const certificate = model.certificates.find((item) => item.id === button.dataset.certificateId);
    if (certificate) button.addEventListener("click", () => openCertificate(certificate, model, button));
  });
  return true;
}

function openPerson(id, trigger = null, { fromUrl = false, animate = true, scroll = true } = {}) {
  const shell = cardShellFor(id);
  const detail = shell?.querySelector(":scope > .person-inline-detail");
  if (!shell || !renderPersonDetail(id, detail)) return false;
  if (elements.filterDialog.open && !desktopFilterQuery?.matches) elements.filterDialog.close();
  // Direct profile routes must be visible before expansion and scrolling.
  // User-driven FLIP reflow owns card transforms, so settle every possible
  // mover before taking the position snapshot.
  if (animate) approachMotionController?.landSubtree(elements.board);
  else approachMotionController?.land(shell);
  const before = animate ? cardPositionSnapshot() : null;
  if (state.currentPersonId && state.currentPersonId !== id) setCardExpanded(cardShellFor(state.currentPersonId), false);
  setCardExpanded(shell, true);
  state.currentPersonId = id;
  state.lastProfileTrigger = trigger || shell.querySelector(".person-card");
  if (!fromUrl) updateUrl({ person: id }, { replace: false });
  layoutMasonry();
  if (before) animateCardReflow(before, id);
  if (!reducedMotionQuery?.matches) {
    detail.classList.remove("is-revealing");
    void detail.offsetWidth;
    detail.classList.add("is-revealing");
  }
  if (scroll && fromUrl) requestAnimationFrame(() => shell.scrollIntoView({ block: "nearest" }));
  return true;
}

function closePerson({ updateQuery = true, trigger = null, animate = true } = {}) {
  const shell = cardShellFor(state.currentPersonId);
  if (!shell) {
    state.currentPersonId = null;
    if (updateQuery) updateUrl({ person: null });
    return;
  }
  if (animate) approachMotionController?.landSubtree(elements.board);
  else approachMotionController?.land(shell);
  const before = animate ? cardPositionSnapshot() : null;
  const originId = state.currentPersonId;
  setCardExpanded(shell, false);
  state.currentPersonId = null;
  if (updateQuery) updateUrl({ person: null });
  layoutMasonry();
  if (before) animateCardReflow(before, originId);
  (trigger || state.lastProfileTrigger)?.focus({ preventScroll: true });
}

function renderCertificateDialog(context) {
  const { certificate, personName } = context;
  const title = certificateTitle(certificate);
  const meta = [
    personName,
    certificate.programCode,
    certificate.credentialId ? message("certificateCredential", { id: certificate.credentialId }) : "",
    certificate.awardedOn ? message("certificateAwarded", { date: certificateAwardedLabel(certificate.awardedOn) }) : ""
  ].filter(Boolean).join(" · ");
  setText(elements.certificateDialogKicker, message("certificates"));
  setText(elements.certificateDialogTitle, title);
  setText(elements.certificateDialogMeta, meta);
  elements.certificateDialogImage.src = certificate.publicUrl;
  elements.certificateDialogImage.alt = `${title} — ${personName}`;
  elements.certificateOpenOriginal.href = certificate.publicUrl;
  elements.certificateDownload.href = certificate.publicUrl;
  elements.certificateDownload.download = certificate.downloadFilename;
  setText(elements.certificateOpenOriginal, message("certificateOpenOriginal"));
  setText(elements.certificateDownload, message("certificateDownload"));
}

function openCertificate(certificate, model, trigger) {
  state.currentCertificate = { certificate, personName: currentOfficialName(model) };
  state.lastCertificateTrigger = trigger;
  renderCertificateDialog(state.currentCertificate);
  if (!elements.certificateDialog.open) elements.certificateDialog.showModal();
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => elements.certificateClose.focus({ preventScroll: true }));
}

function closeCertificate() {
  if (elements.certificateDialog.open) elements.certificateDialog.close();
  state.currentCertificate = null;
  document.body.classList.remove("modal-open");
  state.lastCertificateTrigger?.focus({ preventScroll: true });
}

function syncFilterDialogMode() {
  if (!desktopFilterQuery) return;
  if (desktopFilterQuery.matches) {
    if (elements.filterDialog.open) elements.filterDialog.close();
    elements.filterDialog.show();
    if (!elements.certificateDialog.open) document.body.classList.remove("modal-open");
  } else if (elements.filterDialog.open) {
    elements.filterDialog.close();
    if (!elements.certificateDialog.open) document.body.classList.remove("modal-open");
  }
}

function openFilters() {
  if (desktopFilterQuery?.matches) return;
  if (!elements.filterDialog.open) elements.filterDialog.showModal();
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => elements.filterRole.focus({ preventScroll: true }));
}

function closeFilters() {
  if (elements.filterDialog.open && !desktopFilterQuery?.matches) elements.filterDialog.close();
  if (!elements.certificateDialog.open) document.body.classList.remove("modal-open");
  elements.filterOpen.focus({ preventScroll: true });
}

function updateDataNote() {
  if (!state.raw) {
    setText(elements.dataNote, message("loadingData"));
    return;
  }
  const rawDate = firstValue(state.raw.meta || {}, ["generatedAt", "generated_at", "updatedAt", "updated_at", "sourceUpdatedAt", "source_updated_at", "releaseDate", "release_date"]);
  const date = rawDate ? new Date(rawDate) : null;
  if (date && !Number.isNaN(date.getTime())) {
    const formatted = new Intl.DateTimeFormat(state.language === "th" ? "th-TH" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
    setText(elements.dataNote, message("updatedData", { date: formatted }));
  } else {
    setText(elements.dataNote, message("latestData"));
  }
  const version = firstValue(state.raw.meta || {}, ["release", "version", "schemaVersion", "schema_version"]);
  setText(elements.footerMeta, version ? `${message("registry")} · ${version}` : message("registry"));
}

async function loadData() {
  elements.loading.hidden = false;
  elements.error.hidden = true;
  elements.empty.hidden = true;
  elements.board.hidden = false;
  elements.board.setAttribute("aria-busy", "true");
  setText(elements.resultsCount, message("loading"));
  try {
    const response = await fetch(DATA_URL, { cache: "no-cache", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Data request failed with ${response.status}`);
    const data = await response.json();
    if (!data || !asRecords(data.people).length) throw new Error("People data is missing");
    state.raw = data;
    buildModels(data);
    elements.searchInput.value = state.filters.query;
    elements.filterRole.value = state.filters.role;
    elements.filterStatus.value = state.filters.status;
    updateDynamicOptions();
    elements.filterCohort.value = state.filters.cohort;
    elements.filterWork.value = state.filters.work;
    updateDataNote();
    renderDirectory();
  } catch (error) {
    console.error("Unable to load the public people register", error);
    state.raw = null;
    elements.loading.hidden = true;
    elements.board.hidden = true;
    elements.board.setAttribute("aria-busy", "false");
    elements.error.hidden = false;
    setText(elements.resultsCount, "");
    setText(elements.peopleTotal, "—");
  }
}

function bindEvents() {
  elements.themeButton.addEventListener("click", cycleTheme);
  elements.searchInput.addEventListener("input", syncFilterState);
  elements.filterForm.addEventListener("change", syncFilterState);
  elements.filterForm.addEventListener("submit", (event) => event.preventDefault());
  elements.filterOpen.addEventListener("click", openFilters);
  elements.filterClose.addEventListener("click", closeFilters);
  elements.filterDone.addEventListener("click", closeFilters);
  elements.filterClear.addEventListener("click", clearFilters);
  elements.emptyClear.addEventListener("click", clearFilters);
  elements.retry.addEventListener("click", loadData);
  elements.certificateClose.addEventListener("click", closeCertificate);

  elements.filterDialog.addEventListener("click", (event) => {
    if (event.target === elements.filterDialog && !desktopFilterQuery?.matches) closeFilters();
  });
  elements.certificateDialog.addEventListener("click", (event) => {
    if (event.target === elements.certificateDialog) closeCertificate();
  });
  elements.filterDialog.addEventListener("close", () => {
    if (!elements.certificateDialog.open) document.body.classList.remove("modal-open");
  });
  elements.certificateDialog.addEventListener("close", () => {
    state.currentCertificate = null;
    document.body.classList.remove("modal-open");
  });
  elements.certificateDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCertificate();
  });
  elements.filterDialog.addEventListener("cancel", (event) => {
    if (!desktopFilterQuery?.matches) {
      event.preventDefault();
      closeFilters();
    }
  });
  systemThemeQuery?.addEventListener("change", () => {
    if (state.theme === "system") applyTheme({ announce: true });
  });
  desktopFilterQuery?.addEventListener("change", syncFilterDialogMode);
  window.addEventListener("resize", () => scheduleMasonryLayout());
  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    const person = params.get("person");
    if (person && person !== state.currentPersonId && state.raw) openPerson(person, null, { fromUrl: true });
    else if (!person && state.currentPersonId) closePerson({ updateQuery: false });
  });
}

function initialize() {
  state.language = LANGUAGES.includes(state.language) ? state.language : "th";
  state.theme = THEMES.includes(state.theme) ? state.theme : "system";
  updateUrl({ lang: state.language, theme: state.theme });
  bindEvents();
  applyLanguage();
  applyTheme();
  initSiteNavigation();
  approachMotionController = initApproachMotion();
  mediaParallaxController = initMediaParallax();
  syncFilterDialogMode();
  updateFilterCount();
  loadData();
  document.fonts?.ready.then(() => scheduleMasonryLayout());
}

initialize();
