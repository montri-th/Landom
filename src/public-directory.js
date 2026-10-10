// The build and browser share this narrow public projection. Do not add private
// provenance, profile statements, portraits or social links to this fallback.
export const LANDOM_PUBLIC_ROOT = "https://montri-th.github.io/Landom/";

export function personProfileUrl(personId, language = "th") {
  if (!/^[SPI]\d{4}$/.test(String(personId))) return "";
  const url = new URL(language === "en" ? "en/" : "", LANDOM_PUBLIC_ROOT);
  url.searchParams.set("person", personId);
  return url.href;
}

function localized(value, language) {
  if (typeof value === "string") return value.trim();
  return String(value?.[language] || value?.[language === "en" ? "th" : "en"] || "").trim();
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}

export function contributionRoleLabel(role, language = "th") {
  const value = String(role || "").trim();
  if (language === "en") return value === "Contributor" ? "Team member" : value;
  const labels = {
    "Contributor": "ร่วมทำงาน",
    "Team member": "ร่วมทำงาน",
    "Software development": "พัฒนาซอฟต์แวร์",
    "Product development": "พัฒนาผลิตภัณฑ์",
    "Product management": "บริหารผลิตภัณฑ์",
    "Go-to-market": "วางแผนเข้าสู่ตลาด",
    "Full-time staff": "พนักงานประจำ",
    "Project support": "ร่วมสนับสนุนงาน",
    "Consulting Partner": "ที่ปรึกษาธุรกิจ",
    "Developing": "กำลังจัดทำ",
    "Improving": "กำลังปรับปรุง"
  };
  return labels[value] || value;
}

export function publicDirectoryEntries(data, language = "th") {
  const works = new Map((data.works || []).map((work) => [work.workId, work]));
  return (data.people || []).flatMap((person) => {
    const url = personProfileUrl(person.personId, language);
    const name = localized(person.names?.card, language) || localized(person.names?.nickname, language) || localized(person.names?.full, language);
    if (!url || !name) return [];
    const contributions = (data.contributions || [])
      .filter((item) => item.personId === person.personId || item.personIds?.includes(person.personId))
      .flatMap((item) => {
        const work = works.get(item.workId);
        if (!work) return [];
        const name = localized(work.shortNames, language) || localized(work.names, language);
        if (!name) return [];
        const destination = [work.publicUrls, work.catalogUrls, work.publicUrl, work.catalogUrl, work.destinationUrl]
          .map((value) => localized(value, language)).find(Boolean);
        return [{ workId: item.workId, name, url: safeUrl(destination), role: contributionRoleLabel(localized(item.roleInWork || item.role, language), language) }];
      });
    return [{ personId: person.personId, name, fullName: localized(person.names?.full, language), url, contributions }];
  });
}

export function escapePublicHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

export function renderPublicDirectory(data, language = "th") {
  const entries = publicDirectoryEntries(data, language);
  const esc = escapePublicHtml;
  const labels = language === "en"
    ? { title: "People and their work", note: "Browse the public directory below. Search and profile details become available when loading finishes.", works: "Contributions", profile: "Open profile" }
    : { title: "ผู้คนและผลงาน", note: "อ่านรายชื่อและผลงานได้ที่นี่ เมื่อโหลดเสร็จจะค้นหาและเปิดรายละเอียดโปรไฟล์ได้", works: "ผลงานที่ร่วมทำ", profile: "เปิดโปรไฟล์" };
  return `<section id="public-directory-fallback" class="public-directory-fallback" aria-labelledby="public-directory-title">
    <h3 id="public-directory-title">${labels.title}</h3><p class="public-directory-note">${labels.note}</p>
    <div class="public-directory-grid">${entries.map((person) => `<article class="public-person" data-public-person-id="${esc(person.personId)}">
      <h4><a href="${esc(person.url)}">${esc(person.name)}</a></h4>
      ${person.fullName && person.fullName !== person.name ? `<p>${esc(person.fullName)}</p>` : ""}
      ${person.contributions.length ? `<details><summary>${labels.works} (${person.contributions.length})</summary><ul>${person.contributions.map((work) => `<li data-public-work-id="${esc(work.workId)}">${work.url ? `<a href="${esc(work.url)}">${esc(work.name)}</a>` : esc(work.name)}${work.role ? `<small>${esc(work.role)}</small>` : ""}</li>`).join("")}</ul></details>` : ""}
    </article>`).join("")}</div>
  </section>`;
}
