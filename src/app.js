const DATA_URL = "./data/generated/site-data.json";
const THEME_KEY = "lds-theme";
const LANGUAGE_KEY = "lds-language";
const THEMES = ["system", "light", "dark"];
const LANGUAGES = ["th", "en"];

const COPY = {
  th: {
    pageTitle: "Landom — ชาว Landom ผู้ร่วมสร้าง Landometer",
    pageDescription: "เรื่องเล่า บทบาท การศึกษา และผลงานของชาว Landom จากทะเบียนข้อมูลที่เผยแพร่ได้",
    skip: "ข้ามไปยังเนื้อหาหลัก",
    headerLabel: "ส่วนหัวเว็บไซต์",
    homeLabel: "Landom — หน้าหลัก",
    controlsLabel: "การตั้งค่าการแสดงผล",
    switchLanguage: "Switch to English",
    heroEyebrow: "LANDOMETER คือแบรนด์ · LANDOM คือด้อม",
    heroTitle: "ยินดีต้อนรับชาว Landom",
    heroIntro: "Landom — แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น",
    peopleUnit: "ชาว Landom",
    loadingData: "กำลังอ่านข้อมูลชุดเผยแพร่ล่าสุด",
    latestData: "ข้อมูลชุดเผยแพร่ล่าสุด",
    updatedData: "ปรับปรุงข้อมูล {date}",
    directoryKicker: "เรื่องเล่าจากชาวแลนด้อม",
    directoryTitle: "ใครทำเรื่องอะไรไว้บ้าง",
    loading: "กำลังโหลด…",
    results: "พบ {shown} จาก {total} คน",
    searchLabel: "ค้นหาชื่อ มหาวิทยาลัย หลักสูตร หรือผลงาน",
    searchPlaceholder: "ค้นหาคนหรือผลงาน",
    filter: "ตัวกรอง",
    filtersCount: "ตัวกรอง ({count})",
    refine: "ชวนค้นให้ใกล้ขึ้น",
    role: "บทบาท",
    allRoles: "ทุกบทบาท",
    fulltime: "พนักงานประจำ",
    parttime: "พนักงานพาร์ตไทม์",
    intern: "นักศึกษาฝึกงาน",
    member: "ผู้ร่วมสร้าง",
    cohort: "รุ่น / ปี",
    allCohorts: "ทุกรุ่น",
    status: "สถานะ",
    allStatuses: "ทุกสถานะ",
    active: "ร่วมทีมอยู่",
    alumni: "ศิษย์เก่าทีม",
    work: "ผลงาน",
    allWorks: "ทุกผลงาน",
    clearFilters: "ล้างตัวกรอง",
    done: "ดูผลลัพธ์",
    closeFilters: "ปิดตัวกรอง",
    emptyTitle: "ยังไม่เจอชาว Landom คนนี้",
    emptyCopy: "ลองใช้คำค้นสั้นลง หรือชวนทุกคนกลับมารวมวงด้วยการล้างตัวกรอง",
    clearAll: "ล้างการค้นหาและตัวกรอง",
    errorTitle: "ประตูด้อมยังเปิดทะเบียนไม่ได้",
    errorCopy: "โปรดลองอีกครั้ง หน้านี้จะไม่เดาข้อมูลบุคคลจากแหล่งอื่นมาแทน",
    retry: "ลองอีกครั้ง",
    footerCopy: "มาเข้าด้อม Landometer กัน · Let us cultivate our city with data.",
    registry: "ทะเบียนชาว Landom",
    openProfile: "เปิดเรื่องราวของ {name}",
    readStory: "อ่านเรื่องราว",
    educationQualification: "วุฒิการศึกษา",
    educationProgram: "หลักสูตร",
    educationNeutral: "การศึกษา",
    educationProgramPending: "รอยืนยันหลักสูตร",
    educationQualificationPending: "รอยืนยันวุฒิ",
    university: "มหาวิทยาลัย",
    voice: "เสียงจากชาว Landom",
    contributions: "สิ่งที่ร่วมสร้าง",
    roleHistory: "เส้นทางใน Landom",
    achievements: "หมุดหมายร่วมกัน",
    publicProfiles: "ช่องทางสาธารณะที่ยืนยันแล้ว",
    closeDetails: "ปิดรายละเอียด",
    present: "ปัจจุบัน",
    moreWorks: "+{count} งาน",
    noStory: "เรื่องเล่ากำลังรอเจ้าตัวมาอัปเดต",
    contributionRole: "บทบาท: {role}",
    theme: {
      system: "ธีม: ตามระบบ กดเพื่อใช้ธีมสว่าง",
      light: "ธีม: สว่าง กดเพื่อใช้ธีมมืด",
      dark: "ธีม: มืด กดเพื่อใช้ธีมตามระบบ"
    },
    themeNames: { system: "ตามระบบ", light: "สว่าง", dark: "มืด" },
    themeChanged: "เปลี่ยนธีมเป็น {theme}แล้ว",
    languageChanged: "เปลี่ยนภาษาเป็นไทยแล้ว"
  },
  en: {
    pageTitle: "Landom — the people of the Landometer community",
    pageDescription: "Stories, roles, education and contributions from public records of the Landom community.",
    skip: "Skip to main content",
    headerLabel: "Site header",
    homeLabel: "Landom — home",
    controlsLabel: "Display preferences",
    switchLanguage: "เปลี่ยนเป็นภาษาไทย",
    heroEyebrow: "LANDOMETER IS THE BRAND · LANDOM IS THE COMMUNITY",
    heroTitle: "Welcome, people of Landom",
    heroIntro: "Landom — the community for people who want to understand cities and help make them better.",
    peopleUnit: "people of Landom",
    loadingData: "Reading the latest public data release",
    latestData: "Latest public data release",
    updatedData: "Data updated {date}",
    directoryKicker: "STORIES FROM THE LANDOM COMMUNITY",
    directoryTitle: "Meet the people behind the work",
    loading: "Loading…",
    results: "Showing {shown} of {total} people",
    searchLabel: "Search by name, university, program or contribution",
    searchPlaceholder: "Search people or work",
    filter: "Filters",
    filtersCount: "Filters ({count})",
    refine: "REFINE THE CIRCLE",
    role: "Role",
    allRoles: "All roles",
    fulltime: "Full-time staff",
    parttime: "Part-time staff",
    intern: "Intern",
    member: "Contributor",
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
    emptyTitle: "That corner of Landom is still quiet",
    emptyCopy: "Try a shorter search, or bring everyone back into the circle by clearing the filters.",
    clearAll: "Clear search and filters",
    errorTitle: "The community register is not open yet",
    errorCopy: "Please try again. This page will not guess personal information from another source.",
    retry: "Try again",
    footerCopy: "Come join the Landometer community · Let us cultivate our city with data.",
    registry: "Landom community register",
    openProfile: "Open {name}’s story",
    readStory: "Read their story",
    educationQualification: "Qualification",
    educationProgram: "Program",
    educationNeutral: "Education",
    educationProgramPending: "Program pending confirmation",
    educationQualificationPending: "Qualification pending confirmation",
    university: "University",
    voice: "A voice from Landom",
    contributions: "What they helped build",
    roleHistory: "Their path in Landom",
    achievements: "Shared milestones",
    publicProfiles: "Verified public profiles",
    closeDetails: "Close details",
    present: "Present",
    moreWorks: "+{count} more",
    noStory: "This story is waiting for its author’s update.",
    contributionRole: "Role: {role}",
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
  lastProfileTrigger: null
};

const elements = {
  root: document.documentElement,
  themeColor: document.querySelector('meta[name="theme-color"]'),
  metaDescription: document.querySelector('meta[name="description"]'),
  ogTitle: document.querySelector('meta[property="og:title"]'),
  ogDescription: document.querySelector('meta[property="og:description"]'),
  ogLocale: document.querySelector('meta[property="og:locale"]'),
  ogLocaleAlternate: document.querySelector('meta[property="og:locale:alternate"]'),
  twitterTitle: document.querySelector('meta[name="twitter:title"]'),
  twitterDescription: document.querySelector('meta[name="twitter:description"]'),
  skip: document.querySelector(".skip-link"),
  siteHeader: document.querySelector(".site-header"),
  brand: document.querySelector(".brand"),
  controls: document.querySelector(".preference-controls"),
  languageButton: document.querySelector("#language-toggle"),
  themeButton: document.querySelector("#theme-toggle"),
  themeIcon: document.querySelector("#theme-toggle .theme-icon"),
  preferenceStatus: document.querySelector("#preference-status"),
  heroEyebrow: document.querySelector("#hero-eyebrow"),
  pageTitle: document.querySelector("#page-title"),
  heroIntro: document.querySelector("#hero-intro"),
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
  footerCopy: document.querySelector("#footer-copy"),
  footerMeta: document.querySelector("#footer-meta"),
  personDialog: document.querySelector("#person-dialog"),
  personDetail: document.querySelector("#person-detail"),
  modalClose: document.querySelector("#modal-close")
};

const systemThemeQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
const desktopFilterQuery = window.matchMedia?.("(min-width: 760px)");

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
  setText(elements.themeIcon, { system: "◐", light: "☀", dark: "☾" }[state.theme]);
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
  elements.ogTitle?.setAttribute("content", copy.pageTitle);
  elements.ogDescription?.setAttribute("content", copy.pageDescription);
  elements.ogLocale?.setAttribute("content", state.language === "th" ? "th_TH" : "en_US");
  elements.ogLocaleAlternate?.setAttribute("content", state.language === "th" ? "en_US" : "th_TH");
  elements.twitterTitle?.setAttribute("content", copy.pageTitle);
  elements.twitterDescription?.setAttribute("content", copy.pageDescription);
  setText(elements.skip, copy.skip);
  elements.siteHeader?.setAttribute("aria-label", copy.headerLabel);
  elements.brand?.setAttribute("aria-label", copy.homeLabel);
  elements.controls?.setAttribute("aria-label", copy.controlsLabel);
  elements.languageButton?.setAttribute("aria-label", copy.switchLanguage);
  elements.languageButton?.setAttribute("title", copy.switchLanguage);
  setText(elements.languageButton?.querySelector("span"), state.language.toUpperCase());
  setText(elements.heroEyebrow, copy.heroEyebrow);
  setText(elements.pageTitle, copy.heroTitle);
  setText(elements.heroIntro, copy.heroIntro);
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
  setText(elements.footerCopy, copy.footerCopy);
  setText(elements.footerMeta, copy.registry);
  elements.modalClose?.setAttribute("aria-label", copy.closeDetails);
  updateStaticOptions();
  updateDynamicOptions();
  updateDataNote();
  applyTheme();
  if (state.raw) renderDirectory();
  if (elements.personDialog?.open && state.currentPersonId) renderPersonDetail(state.currentPersonId);
  if (persist) safelyStore(LANGUAGE_KEY, state.language);
  if (updateQuery) updateUrl({ lang: state.language });
  if (announce) setText(elements.preferenceStatus, copy.languageChanged);
}

function toggleLanguage() {
  state.language = state.language === "th" ? "en" : "th";
  applyLanguage({ persist: true, updateQuery: true, announce: true });
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
  if (/intern|ฝึกงาน|trainee/.test(role)) return "intern";
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
  return localizedField(engagement, ["roleName", "role_name", "roleTitle", "role_title", "title", "role"]) || message(roleKey);
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

function educationFor(person, engagement, linkedEducationRecord, programIndex, institutionIndex, roleKey) {
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
  const hasProgramOrQualification = Boolean(program || qualification);
  const cardHasProgramAndInstitution = cardParts.length > 1;
  const detailHasProgramAndInstitution = detailParts.length > 1;
  const pendingAcademicLabel = !hasProgramOrQualification && roleKey === "intern"
    ? message("educationProgramPending")
    : !hasProgramOrQualification && roleKey === "fulltime"
      ? message("educationQualificationPending")
      : "";

  const shortProgram = (cardHasProgramAndInstitution || hasProgramOrQualification ? cardParts[0] : "") || canonicalProgramShort ||
    localizedField(program || {}, ["shortName", "short_name", "abbreviation", "abbr", "code"]) ||
    localizedField(embeddedEducation, ["programShort", "program_short", "degreeShort", "degree_short"]) ||
    pendingAcademicLabel;
  const fullProgram = (detailHasProgramAndInstitution || hasProgramOrQualification ? detailParts[0] : "") || qualification || canonicalProgramFull ||
    localizedField(program || {}, ["officialName", "official_name", "fullName", "full_name", "name", "degreeName", "degree_name"]) ||
    localizedField(embeddedEducation, ["programOfficial", "program_official", "programName", "program_name", "degree", "qualification"]) ||
    pendingAcademicLabel;
  const shortInstitution = (cardHasProgramAndInstitution ? cardParts.slice(1).join(" · ") : !hasProgramOrQualification ? cardDisplay : "") || canonicalInstitutionShort ||
    localizedField(institution || {}, ["shortName", "short_name", "abbreviation", "abbr", "code"]) ||
    localizedField(embeddedEducation, ["institutionShort", "institution_short", "universityShort", "university_short"]);
  const fullInstitution = (detailHasProgramAndInstitution ? detailParts.slice(1).join(" — ") : !hasProgramOrQualification ? detailDisplay : "") || canonicalInstitutionFull ||
    localizedField(institution || {}, ["officialName", "official_name", "fullName", "full_name", "name"]) ||
    localizedField(embeddedEducation, ["institutionOfficial", "institution_official", "institutionName", "institution_name", "university"]);

  return {
    labelKey: roleKey === "fulltime" ? "educationQualification" : roleKey === "intern" ? "educationProgram" : "educationNeutral",
    shortProgram: shortProgram || fullProgram,
    fullProgram: fullProgram || shortProgram,
    shortInstitution: shortInstitution || fullInstitution,
    fullInstitution: fullInstitution || shortInstitution
  };
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
    const hasContractGates = [asset.verificationStatus, asset.consentStatus, asset.rightsStatus, asset.publicationStatus]
      .some((value) => value !== undefined);
    const contractApproved = verificationStatus === "verified" &&
      consentStatus === "granted" &&
      ["approved", "cleared", "granted", "licensed", "owned"].includes(rightsStatus) &&
      publicationStatus === "publishable";
    const legacyApproval = firstValue(asset, ["approved", "isApproved", "is_approved", "approvalStatus", "approval_status", "status"]);
    const legacyApproved = normalizedBoolean(legacyApproval, ["approved", "verified", "ready", "publishable"]);
    const isApproved = hasContractGates ? contractApproved : legacyApproved;
    return owner === id && /image|photo|portrait|headshot|avatar/.test(type) && isApproved;
  });
  candidates.sort((a, b) => Number(firstValue(b, ["primary", "isPrimary", "is_primary"]) === true) - Number(firstValue(a, ["primary", "isPrimary", "is_primary"]) === true));
  const asset = candidates[0];
  if (!asset) return null;
  const rawUrl = String(firstValue(asset, ["publicPath", "public_path", "path", "src", "url", "href"]) || "").trim();
  const url = safeAssetUrl(rawUrl);
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
  const hasContractGates = [profile.verificationStatus, profile.consentStatus, profile.publicationStatus]
    .some((value) => value !== undefined);
  if (hasContractGates) {
    return verificationStatus === "verified" && consentStatus === "granted" && publicationStatus === "publishable";
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

function safeAssetUrl(value) {
  if (!value || /^data:|^javascript:/i.test(value)) return "";
  if (/^https?:\/\//i.test(value)) return safeExternalUrl(value);
  if (value.startsWith("./") || value.startsWith("../") || value.startsWith("/")) return value;
  if (value.startsWith("public/")) return `./${value}`;
  if (value.startsWith("assets/")) return `./public/${value}`;
  return `./public/assets/${value.replace(/^\/+/, "")}`;
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

function normalizeSocials(personRecord, socialProfiles) {
  const id = recordId(personRecord, "person");
  const seen = new Set();
  return socialProfiles.flatMap((profile) => {
    if (personId(profile) !== id || !socialIsPublishable(profile)) return [];
    const url = safeExternalUrl(firstValue(profile, ["publicUrl", "public_url", "url", "href", "profileUrl", "profile_url"]));
    if (!url || seen.has(url)) return [];
    seen.add(url);
    return [{ ...socialPlatform(profile), url }];
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

function contributionRecordsForPerson(id, contributions, workIndex) {
  return contributions
    .filter((contribution) => {
      if (personId(contribution) === id) return true;
      const personIds = firstValue(contribution, ["personIds", "person_ids", "people"]);
      return Array.isArray(personIds) && personIds.map(String).includes(id);
    })
    .map((contribution) => ({
      raw: contribution,
      workId: relationId(contribution, "work") || recordId(contribution, "work"),
      name: workNameForContribution(contribution, workIndex),
      nameTh: workNameForContribution(contribution, workIndex, "th"),
      nameEn: workNameForContribution(contribution, workIndex, "en"),
      role: localizedField(contribution, ["roleInWork", "role_in_work", "role", "contributionRole", "contribution_role"]),
      period: localizedField(contribution, ["period.label", "period", "year", "date", "cohort"])
    }))
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
  const socialProfiles = asRecords(data.socialProfiles || data.social_profiles);
  const assets = asRecords(data.assets?.people || data.assets);
  const institutionIndex = new Map(institutions.map((record) => [recordId(record, "institution"), record]));
  const programIndex = new Map(programs.map((record) => [recordId(record, "program"), record]));
  const workIndex = new Map(works.map((record) => [recordId(record, "work"), record]));

  state.works = works;
  state.models = people.map((personRecord) => {
    const id = recordId(personRecord, "person");
    const personEngagements = engagements.filter((engagement) => personId(engagement) === id).sort(engagementSort);
    const primaryEngagement = personEngagements[0] || {};
    const roleKey = engagementRoleKey(primaryEngagement) || normalizeRole(firstValue(personRecord, ["role", "roleCategory", "role_category"]));
    const contributionsForPerson = contributionRecordsForPerson(id, contributions, workIndex);
    const primaryEducation = educationRecords.find((record) => personId(record) === id && record.isPrimary === true) ||
      educationRecords.find((record) => personId(record) === id) || {};
    const education = educationFor(personRecord, primaryEngagement, primaryEducation, programIndex, institutionIndex, roleKey);
    const nicknameTh = localizedField(personRecord, ["names.card", "names.nickname", "nickname", "displayName", "display_name", "shortName", "short_name"], "th");
    const nicknameEn = localizedField(personRecord, ["names.card", "names.nickname", "nickname", "displayName", "display_name", "shortName", "short_name"], "en");
    const fullNameTh = localizedField(personRecord, ["names.full", "officialName", "official_name", "fullName", "full_name", "name"], "th");
    const fullNameEn = localizedField(personRecord, ["names.full", "officialName", "official_name", "fullName", "full_name", "name"], "en");
    const nickname = state.language === "th" ? (nicknameTh || nicknameEn || fullNameTh || fullNameEn || id) : (nicknameEn || nicknameTh || fullNameEn || fullNameTh || id);
    const officialName = state.language === "th" ? (fullNameTh || fullNameEn || nickname) : (fullNameEn || fullNameTh || nickname);
    const bioTh = localizedField(personRecord, ["profileText", "profile_text", "story", "bio", "about", "summary", "placeholderBio", "placeholder_bio"], "th");
    const bioEn = localizedField(personRecord, ["profileText", "profile_text", "story", "bio", "about", "summary", "placeholderBio", "placeholder_bio"], "en");
    const cohort = String(firstValue(primaryEngagement, ["cohort", "year", "firstJoined", "first_joined"]) || firstValue(personRecord, ["cohort", "firstJoined", "first_joined", "year"]) || "").slice(0, 4);
    const image = approvedAssetFor(personRecord, assets);
    const achievementRecords = achievementRecordsForPerson(id, achievements, personAchievements);
    const socials = normalizeSocials(personRecord, socialProfiles);
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
      bio: state.language === "th" ? (bioTh || bioEn) : (bioEn || bioTh),
      contributions: contributionsForPerson,
      achievements: achievementRecords,
      socials,
      image,
      initials: initialsFor(nickname, officialName)
    };
    model.searchText = makeSearchText(model, programIndex, institutionIndex, workIndex);
    return model;
  }).filter((model) => model.id);

  state.models.sort((a, b) => {
    const active = Number(b.statusKey === "active") - Number(a.statusKey === "active");
    if (active) return active;
    return a.nickname.localeCompare(b.nickname, state.language);
  });
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

function initialsFor(nickname, officialName) {
  const name = String(nickname || officialName || "L").trim();
  if (/^[\x00-\x7F]/.test(name)) {
    const letters = name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]);
    return letters.join("").toUpperCase() || "L";
  }
  return Array.from(name).filter((character) => !/[\s\u0E31-\u0E3A\u0E47-\u0E4E]/.test(character)).slice(0, 2).join("") || "ล";
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
    ? `<img class="avatar-image" src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt || model.officialName)}" loading="lazy" decoding="async">`
    : "";
  return `
    <div class="${className}" data-avatar>
      <span class="avatar-initials" aria-hidden="true">${escapeHtml(model.initials)}</span>
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
  const parts = [model.education.shortProgram, model.education.shortInstitution].filter(Boolean);
  return parts.join(" · ");
}

function roleDisplay(model) {
  const standardized = ["fulltime", "parttime", "intern"].includes(model.roleKey) ? message(model.roleKey) : "";
  return standardized || model.roleName || message("member");
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
  return state.language === "th" ? (model.bioTh || model.bioEn) : (model.bioEn || model.bioTh);
}

function localizedContributionName(contribution) {
  return state.language === "th" ? (contribution.nameTh || contribution.nameEn || contribution.name) : (contribution.nameEn || contribution.nameTh || contribution.name);
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
      <span class="education-label">${escapeHtml(message(model.education.labelKey))}</span>
      <span class="education-value">${escapeHtml(education)}</span>
    </span>
  ` : "";

  const button = document.createElement("button");
  button.className = "person-card";
  button.type = "button";
  button.dataset.personId = model.id;
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-label", message("openProfile", { name: nickname }));
  button.innerHTML = `
    ${avatarMarkup({ ...model, nickname, officialName, initials: initialsFor(nickname, officialName) })}
    <span class="card-body">
      <span class="card-meta-row">
        <span class="role-badge" data-role="${escapeHtml(model.roleKey)}">${escapeHtml(roleDisplay(model))}</span>
        <span class="person-id">${escapeHtml(model.id)}</span>
      </span>
      <span class="card-name">${escapeHtml(nickname)}</span>
      ${officialName && officialName !== nickname ? `<span class="card-official-name">${escapeHtml(officialName)}</span>` : ""}
      ${educationMarkup}
      ${storyMarkup}
      ${workMarkup}
      <span class="card-open-cue">${escapeHtml(message("readStory"))}</span>
    </span>
  `;
  button.addEventListener("click", () => openPerson(model.id, button));
  return button;
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
  const fragment = document.createDocumentFragment();
  models.forEach((model) => fragment.append(renderCard(model)));
  elements.board.replaceChildren(fragment);
  elements.board.setAttribute("aria-busy", "false");
  elements.board.setAttribute("aria-label", message("results", { shown: models.length, total: state.models.length }));
  hydrateImages(elements.board);
  elements.loading.hidden = true;
  elements.error.hidden = true;
  elements.empty.hidden = models.length !== 0;
  elements.board.hidden = models.length === 0;
  setText(elements.peopleTotal, formatNumber(state.models.length));
  setText(elements.resultsCount, message("results", { shown: formatNumber(models.length), total: formatNumber(state.models.length) }));
  updateFilterCount();
}

function formatNumber(value) {
  return new Intl.NumberFormat(state.language === "th" ? "th-TH" : "en-US").format(value);
}

function updateFilterCount() {
  const count = [state.filters.role, state.filters.cohort, state.filters.status, state.filters.work].filter(Boolean).length;
  setText(elements.filterCount, formatNumber(count));
  elements.filterCount.dataset.empty = String(count === 0);
  setText(elements.filterOpenLabel, count ? message("filtersCount", { count: formatNumber(count) }) : message("filter"));
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

function periodForEngagement(engagement) {
  const start = localizedValue(firstValue(engagement, ["start", "startDate", "start_date", "cohort", "year"]));
  const end = localizedValue(firstValue(engagement, ["end", "endDate", "end_date"]));
  if (start && end) return `${start}–${end}`;
  if (start) return `${start}–${engagementIsCurrent(engagement) ? message("present") : ""}`.replace(/–$/, "");
  return localizedValue(firstValue(engagement, ["period", "cohortLabel", "cohort_label", "cohort"])) || "";
}

function educationDetailMarkup(model) {
  const program = model.education.fullProgram;
  const institution = model.education.fullInstitution;
  if (!program && !institution) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-education-title">
      <h3 id="detail-education-title">${escapeHtml(message(model.education.labelKey))}</h3>
      <dl class="education-detail">
        ${program ? `<dt>${escapeHtml(message(model.education.labelKey))}</dt><dd>${escapeHtml(program)}</dd>` : ""}
        ${institution ? `<dt>${escapeHtml(message("university"))}</dt><dd>${escapeHtml(institution)}</dd>` : ""}
      </dl>
    </section>
  `;
}

function roleHistoryMarkup(model) {
  if (!model.engagements.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-role-title">
      <h3 id="detail-role-title">${escapeHtml(message("roleHistory"))}</h3>
      <ol class="timeline">
        ${model.engagements.map((engagement) => {
          const key = engagementRoleKey(engagement);
          const role = engagementRoleName(engagement, key) || message(key);
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
    <section class="detail-section" aria-labelledby="detail-contribution-title">
      <h3 id="detail-contribution-title">${escapeHtml(message("contributions"))}</h3>
      <ul class="contribution-list">
        ${model.contributions.map((contribution) => {
          const meta = [contribution.role ? message("contributionRole", { role: contribution.role }) : "", contribution.period].filter(Boolean).join(" · ");
          return `<li class="contribution-item"><p class="contribution-name">${escapeHtml(localizedContributionName(contribution))}</p>${meta ? `<p class="contribution-meta">${escapeHtml(meta)}</p>` : ""}</li>`;
        }).join("")}
      </ul>
    </section>
  `;
}

function achievementsMarkup(model) {
  if (!model.achievements.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-achievement-title">
      <h3 id="detail-achievement-title">${escapeHtml(message("achievements"))}</h3>
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

function socialsMarkup(model) {
  if (!model.socials.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-social-title">
      <h3 id="detail-social-title">${escapeHtml(message("publicProfiles"))}</h3>
      <div class="social-list">
        ${model.socials.map((social) => `<a class="social-link" href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" data-platform="${escapeHtml(social.key)}">${escapeHtml(social.label)}</a>`).join("")}
      </div>
    </section>
  `;
}

function renderPersonDetail(id) {
  const model = state.models.find((person) => person.id === id);
  if (!model) return false;
  const nickname = currentNickname(model);
  const officialName = currentOfficialName(model);
  const story = currentBio(model) || message("noStory");
  elements.personDetail.innerHTML = `
    <header class="detail-hero">
      ${avatarMarkup({ ...model, nickname, officialName, initials: initialsFor(nickname, officialName) }, "detail-avatar")}
      <div class="detail-heading">
        <span class="role-badge" data-role="${escapeHtml(model.roleKey)}">${escapeHtml(roleDisplay(model))}</span>
        <h2 id="modal-title">${escapeHtml(nickname)}</h2>
        ${officialName && officialName !== nickname ? `<p class="detail-full-name">${escapeHtml(officialName)}</p>` : ""}
        <p class="detail-id">${escapeHtml(model.id)}</p>
      </div>
    </header>
    <div class="detail-content">
      <section class="detail-section" aria-labelledby="detail-story-title">
        <h3 id="detail-story-title">${escapeHtml(message("voice"))}</h3>
        <p class="detail-story">${escapeHtml(story)}</p>
      </section>
      ${educationDetailMarkup(model)}
      ${roleHistoryMarkup(model)}
      ${contributionsMarkup(model)}
      ${achievementsMarkup(model)}
      ${socialsMarkup(model)}
    </div>
  `;
  hydrateImages(elements.personDetail);
  return true;
}

function openPerson(id, trigger = null, { fromUrl = false } = {}) {
  if (!renderPersonDetail(id)) return;
  if (elements.filterDialog.open && !desktopFilterQuery?.matches) elements.filterDialog.close();
  state.currentPersonId = id;
  state.lastProfileTrigger = trigger;
  if (!fromUrl) updateUrl({ person: id }, { replace: false });
  if (!elements.personDialog.open) elements.personDialog.showModal();
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => elements.modalClose.focus({ preventScroll: true }));
}

function closePerson({ updateQuery = true } = {}) {
  if (elements.personDialog.open) elements.personDialog.close();
  if (updateQuery) updateUrl({ person: null });
  state.currentPersonId = null;
  document.body.classList.remove("modal-open");
  state.lastProfileTrigger?.focus({ preventScroll: true });
}

function syncFilterDialogMode() {
  if (!desktopFilterQuery) return;
  if (desktopFilterQuery.matches) {
    if (elements.filterDialog.open) elements.filterDialog.close();
    elements.filterDialog.show();
    document.body.classList.remove("modal-open");
  } else if (elements.filterDialog.open) {
    elements.filterDialog.close();
    document.body.classList.remove("modal-open");
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
  document.body.classList.remove("modal-open");
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
    if (state.currentPersonId) openPerson(state.currentPersonId, null, { fromUrl: true });
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
  elements.languageButton.addEventListener("click", toggleLanguage);
  elements.searchInput.addEventListener("input", syncFilterState);
  elements.filterForm.addEventListener("change", syncFilterState);
  elements.filterForm.addEventListener("submit", (event) => event.preventDefault());
  elements.filterOpen.addEventListener("click", openFilters);
  elements.filterClose.addEventListener("click", closeFilters);
  elements.filterDone.addEventListener("click", closeFilters);
  elements.filterClear.addEventListener("click", clearFilters);
  elements.emptyClear.addEventListener("click", clearFilters);
  elements.retry.addEventListener("click", loadData);
  elements.modalClose.addEventListener("click", () => closePerson());

  elements.filterDialog.addEventListener("click", (event) => {
    if (event.target === elements.filterDialog && !desktopFilterQuery?.matches) closeFilters();
  });
  elements.personDialog.addEventListener("click", (event) => {
    if (event.target === elements.personDialog) closePerson();
  });
  elements.filterDialog.addEventListener("close", () => {
    if (!elements.personDialog.open) document.body.classList.remove("modal-open");
  });
  elements.personDialog.addEventListener("close", () => {
    if (state.currentPersonId) {
      updateUrl({ person: null });
      state.currentPersonId = null;
    }
    document.body.classList.remove("modal-open");
  });
  elements.personDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closePerson();
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
  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    const person = params.get("person");
    if (person && person !== state.currentPersonId && state.raw) openPerson(person, null, { fromUrl: true });
    else if (!person && elements.personDialog.open) closePerson({ updateQuery: false });
  });
}

function initialize() {
  state.language = LANGUAGES.includes(state.language) ? state.language : "th";
  state.theme = THEMES.includes(state.theme) ? state.theme : "system";
  updateUrl({ lang: state.language, theme: state.theme });
  bindEvents();
  applyLanguage();
  applyTheme();
  syncFilterDialogMode();
  updateFilterCount();
  loadData();
}

initialize();
