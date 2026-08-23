const DATA_URL = "./data/generated/site-data.json";
const THEME_KEY = "lds-theme";
const LANGUAGE_KEY = "lds-language";
const THEMES = ["system", "light", "dark"];
const LANGUAGES = ["th", "en"];

const COPY = {
  th: {
    pageTitle: "Landom — คนที่ร่วมสร้าง Landometer",
    pageDescription: "รู้จักคน ความสนใจ และผลงานที่เกิดขึ้นระหว่างการร่วมงานกับ Landometer",
    skip: "ข้ามไปยังเนื้อหาหลัก",
    headerLabel: "ส่วนหัวเว็บไซต์",
    homeLabel: "Landom — หน้าหลัก",
    controlsLabel: "การตั้งค่าการแสดงผล",
    switchLanguage: "Switch to English",
    heroEyebrow: "LANDOM · ชุมชนของคนที่ร่วมสร้าง LANDOMETER",
    heroTitle: "คนที่ร่วมสร้าง Landometer",
    heroIntro: "Landom — แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น",
    peopleUnit: "คนใน Landom",
    loadingData: "กำลังโหลดข้อมูลล่าสุด",
    latestData: "ข้อมูลล่าสุด",
    updatedData: "ปรับปรุงข้อมูล {date}",
    directoryKicker: "ชาว Landom",
    directoryTitle: "รู้จักคนเบื้องหลังแต่ละผลงาน",
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
    intern: "Intern",
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
    footerCopy: "มาเป็นชาว Landom กัน · Let us cultivate our city with data.",
    registry: "รายชื่อชาว Landom",
    openProfile: "ดูโปรไฟล์ของ {name}",
    readStory: "ดูโปรไฟล์",
    educationSection: "การศึกษา",
    educationQualification: "วุฒิการศึกษา",
    educationProgram: "นิสิตฝึกงานและสหกิจศึกษาจาก",
    educationNeutral: "การศึกษา",
    educationProgramPending: "รอยืนยันสาขาที่เรียน",
    educationQualificationPending: "รอยืนยันวุฒิ",
    university: "มหาวิทยาลัย",
    voice: "มุมมองและเป้าหมาย",
    contributions: "ผลงานที่ร่วมทำ",
    roleHistory: "ช่วงเวลาที่ร่วมงานกับ Landometer",
    achievements: "รางวัลและความสำเร็จ",
    publicProfiles: "ช่องทางออนไลน์",
    closeDetails: "ปิดรายละเอียด",
    present: "ปัจจุบัน",
    moreWorks: "+{count} งาน",
    noStory: "",
    contributionRole: "หน้าที่: {role}",
    openWork: "เปิดผลงาน {name}",
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
    pageTitle: "Landom — people who build with Landometer",
    pageDescription: "Meet the people, interests and work shaped through time with Landometer.",
    skip: "Skip to main content",
    headerLabel: "Site header",
    homeLabel: "Landom — home",
    controlsLabel: "Display preferences",
    switchLanguage: "เปลี่ยนเป็นภาษาไทย",
    heroEyebrow: "LANDOM · THE PEOPLE BUILDING WITH LANDOMETER",
    heroTitle: "People who build with Landometer",
    heroIntro: "Landom is for people who want to understand cities and make them better, together.",
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
    emptyTitle: "No matching profiles",
    emptyCopy: "Try a shorter search or clear the filters and search again.",
    clearAll: "Clear search and filters",
    errorTitle: "The profiles could not be loaded",
    errorCopy: "Please try again. Unverified information will not be substituted.",
    retry: "Try again",
    footerCopy: "Come be part of Landom · Let us cultivate our city with data.",
    registry: "People of Landom",
    openProfile: "View {name}’s profile",
    readStory: "View profile",
    educationSection: "Education",
    educationQualification: "Qualification",
    educationProgram: "Internship and cooperative education from",
    educationNeutral: "Education",
    educationProgramPending: "Program pending confirmation",
    educationQualificationPending: "Qualification pending confirmation",
    university: "University",
    voice: "Perspective and goals",
    contributions: "Work they contributed to",
    roleHistory: "Time with Landometer",
    achievements: "Awards and achievements",
    publicProfiles: "Online profiles",
    closeDetails: "Close details",
    present: "Present",
    moreWorks: "+{count} more",
    noStory: "",
    contributionRole: "Role: {role}",
    openWork: "Open {name}",
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

function educationFor(person, engagement, linkedEducationRecord, programIndex, institutionIndex, educationMode) {
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
  const pendingAcademicLabel = !hasProgramOrQualification && educationMode === "program"
    ? message("educationProgramPending")
    : !hasProgramOrQualification && educationMode === "qualification"
      ? message("educationQualificationPending")
      : "";

  const shortProgram = canonicalProgramShort ||
    localizedField(program || {}, ["shortName", "short_name", "abbreviation", "abbr", "code"]) ||
    localizedField(embeddedEducation, ["programShort", "program_short", "degreeShort", "degree_short"]) ||
    (cardHasProgramAndInstitution || hasProgramOrQualification ? cardParts[0] : "") ||
    pendingAcademicLabel;
  const fullProgram = qualification || canonicalProgramFull ||
    localizedField(program || {}, ["officialName", "official_name", "fullName", "full_name", "name", "degreeName", "degree_name"]) ||
    localizedField(embeddedEducation, ["programOfficial", "program_official", "programName", "program_name", "degree", "qualification"]) ||
    (detailHasProgramAndInstitution || hasProgramOrQualification ? detailParts[0] : "") ||
    pendingAcademicLabel;
  const shortInstitution = canonicalInstitutionShort ||
    localizedField(institution || {}, ["shortName", "short_name", "abbreviation", "abbr", "code"]) ||
    localizedField(embeddedEducation, ["institutionShort", "institution_short", "universityShort", "university_short"]) ||
    (cardHasProgramAndInstitution ? cardParts.slice(1).join(" · ") : !hasProgramOrQualification ? cardDisplay : "");
  const fullInstitution = canonicalInstitutionFull ||
    localizedField(institution || {}, ["officialName", "official_name", "fullName", "full_name", "name"]) ||
    localizedField(embeddedEducation, ["institutionOfficial", "institution_official", "institutionName", "institution_name", "university"]) ||
    (detailHasProgramAndInstitution ? detailParts.slice(1).join(" — ") : !hasProgramOrQualification ? detailDisplay : "");

  return {
    labelKey: educationMode === "qualification" ? "educationQualification" : educationMode === "program" ? "educationProgram" : "educationNeutral",
    mode: educationMode,
    verificationStatus: String(firstValue(linkedEducation, ["verificationStatus", "verification_status"]) || firstValue(person, ["educationDisplay.verificationStatus", "education_display.verification_status"]) || ""),
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

function safeAssetUrl(value, expectedPersonId) {
  const normalized = String(value || "").replace(/^\.\//, "");
  const match = normalized.match(/^public\/assets\/people\/([SPI]\d{4})\.(?:jpe?g|png|webp|avif)$/i);
  if (!match || match[1].toUpperCase() !== String(expectedPersonId || "").toUpperCase()) return "";
  return `./${normalized}`;
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
    .map((contribution) => {
      const workId = relationId(contribution, "work") || recordId(contribution, "work");
      const work = workIndex.get(workId) || {};
      const publicUrl = safeExternalUrl(localizedField(work, ["publicUrls", "catalogUrls", "publicUrl", "catalogUrl", "destinationUrl"]));
      return {
        raw: contribution,
        workId,
        name: workNameForContribution(contribution, workIndex),
        nameTh: workNameForContribution(contribution, workIndex, "th"),
        nameEn: workNameForContribution(contribution, workIndex, "en"),
        publicUrl,
        role: localizedField(contribution, ["roleInWork", "role_in_work", "role", "contributionRole", "contribution_role"]),
        period: localizedField(contribution, ["period.label", "period", "year", "date", "cohort"])
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
    const educationMode = String(firstValue(personRecord, ["educationDisplayMode", "education_display_mode", "educationDisplay.mode", "education_display.mode"]) ||
      (roleKey === "fulltime" ? "qualification" : roleKey === "intern" ? "program" : "neutral"));
    const contributionsForPerson = contributionRecordsForPerson(id, contributions, workIndex);
    const primaryEducation = educationRecords.find((record) => personId(record) === id && record.isPrimary === true) ||
      educationRecords.find((record) => personId(record) === id) || {};
    const education = educationFor(personRecord, primaryEngagement, primaryEducation, programIndex, institutionIndex, educationMode);
    const nicknameTh = localizedField(personRecord, ["names.card", "names.nickname", "nickname", "displayName", "display_name", "shortName", "short_name"], "th");
    const nicknameEn = localizedField(personRecord, ["names.card", "names.nickname", "nickname", "displayName", "display_name", "shortName", "short_name"], "en");
    const fullNameTh = localizedField(personRecord, ["names.full", "officialName", "official_name", "fullName", "full_name", "name"], "th");
    const fullNameEn = localizedField(personRecord, ["names.full", "officialName", "official_name", "fullName", "full_name", "name"], "en");
    const nickname = state.language === "th" ? (nicknameTh || nicknameEn || fullNameTh || fullNameEn || id) : (nicknameEn || nicknameTh || fullNameEn || fullNameTh || id);
    const officialName = state.language === "th" ? (fullNameTh || fullNameEn || nickname) : (fullNameEn || fullNameTh || nickname);
    const bioTh = localizedField(personRecord, ["profileText", "profile_text", "story", "bio", "about", "summary"], "th");
    const bioEn = localizedField(personRecord, ["profileText", "profile_text", "story", "bio", "about", "summary"], "en");
    const bioStatus = String(firstValue(personRecord, ["bio.status", "profileText.status", "profile_text.status", "story.status"]) || "").toLowerCase();
    const bioVerification = String(firstValue(personRecord, ["bio.verificationStatus", "profileText.verificationStatus", "profile_text.verification_status"]) || "").toLowerCase();
    const bioVisible = Boolean(bioTh || bioEn) && !/placeholder|pending|generated|draft/.test(`${bioStatus} ${bioVerification}`);
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
      bioVisible,
      bio: state.language === "th" ? (bioTh || bioEn) : (bioEn || bioTh),
      contributions: contributionsForPerson,
      achievements: achievementRecords,
      socials,
      image,
      avatarName: nickname
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
    return programs[programCode(model.primaryEngagement)] || model.roleName || message("intern");
  }
  const standardized = ["fulltime", "parttime"].includes(model.roleKey) ? message(model.roleKey) : "";
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
  if (!model.bioVisible) return "";
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
    ${avatarMarkup({ ...model, nickname, officialName })}
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
      <h3 id="detail-education-title">${escapeHtml(message("educationSection"))}</h3>
      <div class="education-detail">
        <p class="education-context">${escapeHtml(message(model.education.labelKey))}</p>
        ${program ? `<p class="education-program">${escapeHtml(program)}</p>` : ""}
        ${institution ? `<p class="education-institution">${escapeHtml(institution)}</p>` : ""}
      </div>
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
          const name = localizedContributionName(contribution);
          const nameMarkup = contribution.publicUrl
            ? `<a class="contribution-link" href="${escapeHtml(contribution.publicUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(message("openWork", { name }))}"><span>${escapeHtml(name)}</span><span aria-hidden="true">↗</span></a>`
            : `<p class="contribution-name">${escapeHtml(name)}</p>`;
          return `<li class="contribution-item" data-work-id="${escapeHtml(contribution.workId)}">${nameMarkup}${meta ? `<p class="contribution-meta">${escapeHtml(meta)}</p>` : ""}</li>`;
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
  const profiles = model.socials.filter((social) => ["linkedin", "github"].includes(social.key));
  if (!profiles.length) return "";
  return `<nav class="profile-icon-links" aria-label="${escapeHtml(message("publicProfiles"))}">${profiles.map((social) => `
    <a class="profile-icon-link" href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(social.label)}" title="${escapeHtml(social.label)}">
      ${socialIconMarkup(social.key)}
    </a>`).join("")}</nav>`;
}

function socialsMarkup(model) {
  const profiles = model.socials.filter((social) => !["linkedin", "github"].includes(social.key));
  if (!profiles.length) return "";
  return `
    <section class="detail-section" aria-labelledby="detail-social-title">
      <h3 id="detail-social-title">${escapeHtml(message("publicProfiles"))}</h3>
      <div class="social-list">
        ${profiles.map((social) => `<a class="social-link" href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" data-platform="${escapeHtml(social.key)}">${escapeHtml(social.label)}</a>`).join("")}
      </div>
    </section>
  `;
}

function renderPersonDetail(id) {
  const model = state.models.find((person) => person.id === id);
  if (!model) return false;
  const nickname = currentNickname(model);
  const officialName = currentOfficialName(model);
  const story = currentBio(model);
  elements.personDetail.innerHTML = `
    <header class="detail-hero">
      ${avatarMarkup({ ...model, nickname, officialName }, "detail-avatar")}
      <div class="detail-heading">
        <span class="role-badge" data-role="${escapeHtml(model.roleKey)}">${escapeHtml(roleDisplay(model))}</span>
        <h2 id="modal-title">${escapeHtml(nickname)}</h2>
        ${officialName && officialName !== nickname ? `<p class="detail-full-name">${escapeHtml(officialName)}</p>` : ""}
        ${profileSocialIconsMarkup(model)}
        <p class="detail-id">${escapeHtml(model.id)}</p>
      </div>
    </header>
    <div class="detail-content">
      ${story ? `<section class="detail-section" aria-labelledby="detail-story-title">
        <h3 id="detail-story-title">${escapeHtml(message("voice"))}</h3>
        <p class="detail-story">${escapeHtml(story)}</p>
      </section>` : ""}
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
