// Public recruitment copy: owner-supplied v3 Set A, 4 October 2026.
// These program descriptions do not amend any person's registry record.
export const RECRUITMENT_FORM_URL = 'https://forms.gle/FWbukGX7X3QWZf317';

export const RECRUITMENT_PROGRAMS = Object.freeze([
  {
    id: 'msi',
    name: 'Marketing Strategy Intern',
    poster: 'msi-set-a-v3-9bfcce536f95.png',
    summary: {
      th: 'เข้าใจคนที่ใช้ผลิตภัณฑ์ แล้วเปลี่ยนข้อมูลและไอเดียเป็นแคมเปญที่ได้ลงมือทำและวัดผลจริง',
      en: 'Understand the audience, turn insights into a campaign, and learn from the results.'
    },
    tasks: {
      th: ['ศึกษาพฤติกรรมผู้ใช้และกลุ่มเป้าหมายของ CityMETER, CityChat หรือ ijji', 'วางแผนการตลาดจากปัญหาของผู้ใช้ เล่าเรื่อง และทำความเข้าใจชุมชน', 'นำเสนอแผน ทดลองทำแคมเปญ วัดผล และปรับปรุงร่วมกับทีมผลิตภัณฑ์ ดีไซน์ และ AI'],
      en: ['Research user behaviour and audiences for CityMETER, CityChat or ijji.', 'Build marketing plans from user needs, storytelling and community insight.', 'Pitch, run, measure and refine a campaign alongside the product, design and AI teams.']
    },
    fit: {
      th: 'เหมาะกับคนที่ชอบค้นคว้าเรื่องผู้ใช้ เล่าเรื่อง และทดลองไอเดียด้วยข้อมูล',
      en: 'A good fit if you enjoy audience research, storytelling and testing ideas with data.'
    }
  },
  {
    id: 'pdi',
    name: 'Product Developer Intern',
    poster: 'pdi-set-a-v3-ee744d266cb4.png',
    summary: {
      th: 'เริ่มจากความต้องการของผู้ใช้ ออกแบบต้นแบบ และร่วมพัฒนาฟีเจอร์ให้คนใช้งานได้จริง',
      en: 'Start with a user need, prototype an idea, and help take a feature through to release.'
    },
    tasks: {
      th: ['ออกแบบและทำต้นแบบฟีเจอร์ โดยเริ่มจากปัญหาของผู้ใช้', 'ใช้ความคิดเห็นและข้อมูลผลิตภัณฑ์ค้นหาสิ่งที่ควรปรับปรุง', 'ทดลองใช้ AI และแผนที่ใน CityMETER, CityChat หรือ ijji ร่วมกับทีมผลิตภัณฑ์'],
      en: ['Design and prototype features with a user-first mindset.', 'Use feedback and product data to find gaps and refine improvements.', 'Explore AI and mapping in CityMETER, CityChat or ijji with the product team.']
    },
    fit: {
      th: 'เหมาะกับคนที่ชอบเข้าใจผู้คน ออกแบบ ทดลอง และเชื่อมความคิดสร้างสรรค์เข้ากับข้อมูลและเทคโนโลยี',
      en: 'A good fit if you enjoy understanding people, designing and testing ideas, and working with data and technology.'
    }
  },
  {
    id: 'fdi',
    name: 'Full-Stack Developer Intern',
    poster: 'fdi-set-a-v3-74af307858a4.png',
    summary: {
      th: 'เขียนโค้ดสำหรับผลิตภัณฑ์ที่มีคนใช้งานจริง ตั้งแต่หน้าเว็บและ API ไปจนถึงข้อมูลเชิงพื้นที่ พร้อมเรียนรู้ผ่าน code review',
      en: 'Build software for real users, from interfaces and APIs to spatial data, with feedback through code review.'
    },
    tasks: {
      th: ['พัฒนาหน้าเว็บด้วย React, Next.js, TypeScript และ Material UI', 'พัฒนา API ด้วย Kotlin และ Spring Boot ใช้ jOOQ, PostgreSQL และ PostGIS จัดการข้อมูล', 'ทำงานกับแผนที่และกราฟ: OpenLayers, MapLibre, deck.gl และ amCharts', 'ทดลอง OpenAI และ Gemini โดยตรวจผลกับข้อมูลต้นทาง ทดสอบด้วย Vitest และปรับปรุงผ่าน code review'],
      en: ['Build interfaces with React, Next.js, TypeScript and Material UI.', 'Develop APIs with Kotlin and Spring Boot, using jOOQ, PostgreSQL and PostGIS for data.', 'Work with maps and charts: OpenLayers, MapLibre, deck.gl and amCharts.', 'Explore OpenAI and Gemini, check outputs against source data, test with Vitest and improve through code review.']
    },
    fit: {
      th: 'เหมาะกับคนที่ชอบสร้างซอฟต์แวร์ แก้ปัญหาด้วยโค้ดและข้อมูล และทำให้ข้อมูลเชิงพื้นที่ใช้ง่ายขึ้น',
      en: 'A good fit if you enjoy building software, solving problems with code and data, and making spatial information easier to use.'
    }
  }
]);

const COPY = {
  th: {
    eyebrow: 'ฝึกงานกับเรา',
    heading: 'มาฝึกงานกับ Landometer',
    intro: 'ลองทำงานกับ Data + AI ผ่านโจทย์จริงของ CityMETER, CityChat และ ijji ตั้งแต่เข้าใจผู้ใช้ ไปจนถึงแคมเปญ ฟีเจอร์ และซอฟต์แวร์ที่มีคนใช้งาน',
    benefits: [
      ['มีงานจริงให้ลงมือ', 'เลือกสายการตลาด ผลิตภัณฑ์ หรือซอฟต์แวร์ แล้วร่วมทำงานตั้งแต่โจทย์แรกจนได้เรียนรู้จากผลลัพธ์'],
      ['เรียนรู้จากทีมและรุ่นพี่', 'ต่อยอดจากโปรแกรมที่มีผลงานของผู้ฝึกงานใช้งานจริง และมีรุ่นพี่นักพัฒนากลับมาช่วยแนะนำและรีวิวโค้ด'],
      ['พกผลงานกลับไปเล่าต่อ', 'เก็บกระบวนการคิด สิ่งที่ได้ลอง และผลงานที่ได้รับเครดิตในโปรไฟล์ Landom ไว้ใช้เล่าประสบการณ์และทำพอร์ต']
    ],
    logistics: 'ระยะเวลา รูปแบบงาน และค่าตอบแทน',
    terms: ['10 สัปดาห์ · ตกลงวันเริ่มงานร่วมกัน', 'Hybrid กรุงเทพฯ · เข้าออฟฟิศใกล้ MRT หัวลำโพง 3 วัน ทำงานทางไกล 2 วัน', 'ค่าตอบแทน 400 บาท/วัน'],
    apply: 'สมัครฝึกงาน',
    details: 'ดูรายละเอียดโปรแกรม',
    tasks: 'งานที่จะได้ลองทำ',
    choose: 'ในแบบฟอร์ม เลือกตำแหน่ง',
    preparation: 'เตรียม CV และเอกสารสมัครงาน การอัปโหลดไฟล์ต้องลงชื่อเข้าใช้บัญชี Google',
    poster: 'โปสเตอร์รับสมัคร',
    posterNote: 'โปสเตอร์ภาษาอังกฤษ · ภาพบรรยากาศเป็นภาพประกอบ'
  },
  en: {
    eyebrow: 'Internships',
    heading: 'An internship with Landometer',
    intro: 'Work with Data + AI on real challenges in CityMETER, CityChat and ijji—from understanding users to campaigns, features and software people use.',
    benefits: [
      ['Real work to take on', 'Choose marketing, product or software. Help shape the work from the first question and learn from its results.'],
      ['Learn with the team and former interns', 'Build on a program with intern work already in use and former developer interns helping with mentorship and code review.'],
      ['Work you can talk about', 'Bring together your thinking, experiments and credited work on your Landom profile to share your experience and build a portfolio.']
    ],
    logistics: 'Duration, working arrangements and allowance',
    terms: ['10 weeks · start date by agreement', 'Hybrid, Bangkok · 3 days on-site near MRT Hua Lamphong, 2 days remote', '400 THB/day'],
    apply: 'Apply for an internship',
    details: 'Program details',
    tasks: 'What you’ll work on',
    choose: 'In the form, choose',
    preparation: 'Have your CV and application documents ready. Uploading files requires a Google sign-in.',
    poster: 'Recruitment poster for',
    posterNote: 'English poster · workplace scenes are illustrative'
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function renderRecruitmentSection(locale = 'th') {
  if (!Object.hasOwn(COPY, locale)) throw new Error(`Unsupported recruitment locale: ${locale}`);
  const copy = COPY[locale];
  return `<section class="recruitment-section" id="internships" aria-labelledby="internships-heading" data-recruitment-locale="${locale}">
  <header class="recruitment-heading">
    <p class="recruitment-eyebrow">${copy.eyebrow}</p>
    <h2 id="internships-heading">${copy.heading}</h2>
    <p class="recruitment-intro">${copy.intro}</p>
    <dl class="recruitment-benefits">${copy.benefits.map(([title, description]) => `<div><dt>${escapeHtml(title)}</dt><dd>${escapeHtml(description)}</dd></div>`).join('')}</dl>
    <details class="recruitment-logistics" id="internship-logistics">
      <summary>${copy.logistics}</summary>
      <ul class="recruitment-terms">${copy.terms.map((term) => `<li>${escapeHtml(term)}</li>`).join('')}</ul>
    </details>
  </header>
  <div class="recruitment-grid">${RECRUITMENT_PROGRAMS.map((program) => `
    <article class="recruitment-card" id="internship-${program.id}" aria-labelledby="internship-${program.id}-title">
      <figure class="recruitment-poster">
        <img src="./public/assets/recruitment/${program.poster}" width="1080" height="1528" loading="lazy" decoding="async" alt="${copy.poster} ${program.name}">
        <figcaption>${copy.posterNote}</figcaption>
      </figure>
      <div class="recruitment-card-body">
        <p class="recruitment-code">${program.id.toUpperCase()}</p>
        <h3 id="internship-${program.id}-title" lang="en">${program.name}</h3>
        <p class="recruitment-summary">${escapeHtml(program.summary[locale])}</p>
        <a class="recruitment-apply" href="${RECRUITMENT_FORM_URL}" aria-label="${copy.apply} — ${program.name}">${copy.apply}</a>
        <details class="recruitment-details" id="internship-${program.id}-details">
          <summary>${copy.details}<span class="sr-only"> — ${program.name}</span></summary>
          <div class="recruitment-details-body">
            <h4>${copy.tasks}</h4>
            <ul>${program.tasks[locale].map((task) => `<li>${escapeHtml(task)}</li>`).join('')}</ul>
            <p>${escapeHtml(program.fit[locale])}</p>
            <p>${copy.choose} <strong lang="en">${program.name}</strong></p>
            <p>${copy.preparation}</p>
          </div>
        </details>
      </div>
    </article>`).join('')}
  </div>
</section>`;
}

// Same renderer as the static build; no dependency on the people-data request.
// A matching initial locale stays untouched, preserving focus and native details.
export function updateRecruitmentSection(root, locale) {
  if (!root || root.querySelector('[data-recruitment-locale]')?.dataset.recruitmentLocale === locale) return;
  const openIds = [...root.querySelectorAll('details[open]')].map((details) => details.id);
  root.innerHTML = renderRecruitmentSection(locale);
  for (const details of root.querySelectorAll('details')) details.open = openIds.includes(details.id);
}

// Native fragments arrive before the directory has replaced its shorter static
// fallback. Correct that one initial arrival only after its layout is ready.
export function prepareRecruitmentArrival({ win, doc }) {
  const hash = win.location.hash;
  if (!/^#(?:internships|internship-(?:msi|pdi|fdi))$/.test(hash)) return { afterLayout() {} };
  let active = true;
  let queued = false;
  let frame = 0;
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange', 'pagehide'];
  const cancel = () => {
    if (!active) return;
    active = false;
    win.clearTimeout(timeout);
    if (frame) win.cancelAnimationFrame(frame);
    for (const type of events) win.removeEventListener(type, cancel);
  };
  const timeout = win.setTimeout(cancel, 10000);
  for (const type of events) win.addEventListener(type, cancel, { passive: true });
  return {
    afterLayout() {
      if (!active || queued) return;
      queued = true;
      // Font-ready handlers and masonry each get their layout frame first.
      frame = win.requestAnimationFrame(() => {
        frame = win.requestAnimationFrame(() => {
          if (!active) return;
          const target = win.location.hash === hash ? doc.getElementById(hash.slice(1)) : null;
          cancel();
          target?.scrollIntoView({ block: 'start', behavior: 'instant' });
        });
      });
    }
  };
}
