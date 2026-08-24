# Landom people data dictionary

เอกสารนี้กำหนดโครงสร้างข้อมูลกลางสำหรับหน้า people ของ Landom และเป็นสัญญาระหว่าง Google Sheet, ตัว normalize และหน้าเว็บจริง Public data schema ปัจจุบันคือ `1.5.0` ซึ่งเพิ่ม nullable official LinkedIn profile ให้ institution/program โดยไม่เดาหน้าใกล้เคียง; ข้อมูลที่ generate แล้วอยู่ใน `data/generated/site-data.json` ไฟล์ย่อยแต่ละ dimension อยู่ในโฟลเดอร์เดียวกัน และ schema อยู่ที่ `data/schema/site-data.schema.json`

Raw snapshot เป็นข้อมูลปฏิบัติการที่อาจมี private contact fields จึงต้องอยู่เฉพาะในเครื่องของผู้มีสิทธิ์และถูก ignore จาก Git/public build ส่วน `data/generated/` ผ่าน privacy gate และเป็นชุดที่ Dev ใช้ได้ ตัว normalize รับ authorized snapshot ผ่าน `--input` และเลือกปลายทางผ่าน `--output-dir`; public CI ตรวจ generated contract โดยไม่มี raw input และห้ามอ่าน/เขียน Google Sheet แบบ remote

การแก้รายละเอียดที่เจ้าของยืนยันหลัง snapshot อยู่ใน `data/approved/profile-detail-overrides.json` และมี contract ที่ `data/schema/profile-detail-overrides.schema.json` เพื่อไม่แก้ generated output ด้วยมือ ส่วนชื่อบุคคลที่ยืนยันได้ภายหลังอยู่ใน `data/approved/person-identity-overrides.json` ภายใต้ `data/schema/person-identity-overrides.schema.json` โดยรับเฉพาะชื่อเล่นไทยที่เจ้าของหรือ Sheet ยืนยันตรงตัว และชื่ออังกฤษที่ตรงกับโปรไฟล์ LinkedIn ของบุคคลนั้น ห้ามถอดเสียงหรือเดาชื่อที่ยังไม่มีหลักฐาน ทั้งสองไฟล์ใช้ canonical person/work/engagement IDs และไม่เก็บ contact หรือ private Sheet locator

Snapshot รองรับ 2 schema โดย normalizer ตรวจรูปแบบให้อัตโนมัติ:

1. Sheet-style `{"sheets":{"<tab>":[["header"],["row value"]]}}` — แต่ละ tab เป็น array โดยแถวแรกคือ header
2. Exporter-style `{"tabs":{"<tab>":{"headers":["header"],"rows":[["row value"]]}}}` — แยก `headers` และ `rows`

ทั้งสองแบบเป็น private raw artifact เหมือนกัน ไม่ใช่ public contract และห้าม commit

## หลักการสำคัญ

1. คนหนึ่งคนมี `personId` เดียวตลอดอายุข้อมูล บทบาทและสถานะที่เปลี่ยนไปเก็บเป็นหลาย engagement
2. ชื่อมหาวิทยาลัยและหลักสูตรเก็บเป็น dimension กลาง ไม่พิมพ์ชื่อซ้ำในแต่ละคน
3. ผลงานเป็น work dimension; ความสัมพันธ์คน–ผลงานอยู่ใน contribution ดังนั้นงานเดียวผูกหลายคนได้ และคนเดียวผูกงานเดียวข้ามหลาย engagement ได้
4. รางวัล/ความสำเร็จแยกจาก contribution เพื่อไม่ทำให้ “ทำผลงาน” กับ “ได้รับรางวัล” เป็นข้อเท็จจริงชนิดเดียวกัน
5. ข้อมูลโซเชียลและภาพต้องมี identity verification, publication status และ publication basis ที่บันทึกชัดเจน โดยแยก `individual_consent` ออกจากการอนุมัติแบบจำกัดขอบเขตของเจ้าของ directory; ภาพต้องมีสิทธิการใช้ asset เพิ่มเติม
6. ข้อมูลจากผลิตภัณฑ์หนึ่งไม่ถูกยกเป็นข้อเท็จจริงของ Landometer ทุกผลิตภัณฑ์ การเทียบข้ามผลิตภัณฑ์/เมืองต้องใช้ schema และ release เดียวกัน หรือระบุ incompatibility

## Brand และ community copy

- `Landometer` คือชื่อแบรนด์
- `Landom` คือชื่อ community หรือ “ด้อม”
- สมาชิกเรียก `ชาว Landom` หรือ `ชาวแลนด้อม`
- Tagline ภาษาไทย: `แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น`

ค่าชุดนี้อยู่ใน `copy.brand` และมีสถานะ `owner_approved_current_truth`

## Canonical person ID

รหัสถูก assign ณ migration วันที่ 2026-08-23 และ freeze หลัง migration การเปลี่ยนบทบาทในอนาคตไม่เปลี่ยนรหัส

| สถานะ ณ migration | รูปแบบ | จำนวนเริ่มต้น |
|---|---:|---:|
| Full-time staff | `S0001` เป็นต้นไป | 4 |
| Part-time staff | `P0001` เป็นต้นไป | 1 |
| Intern / program participant / บุคคลอื่น | `I0001` เป็นต้นไป | 43 |

ห้ามสร้างรหัสอีกเวอร์ชันหรือใช้รหัส legacy ใน generated/public data หากคนเดิมกลับมาร่วมงานในบทบาทใหม่ ให้เพิ่ม engagement โดยใช้ `personId` เดิม

กรณีสำคัญ: โอ๊ตคือ `S0001` เพียง record เดียว มี 3 engagement ตามลำดับ Intern → Part-time → Full-time

## Top-level contract

| Key | หน้าที่ |
|---|---|
| `meta` | schema version, source boundary, ID policy, counts |
| `copy` | brand/community copy ที่ได้รับอนุมัติ |
| `institutions` | ชื่อมหาวิทยาลัย/สถาบันแบบเต็มและย่อ |
| `programs` | ชื่อหลักสูตร/สาขาแบบเต็มและย่อ |
| `educationRecords` | ความสัมพันธ์คน–สถาบัน–หลักสูตร |
| `people` | ตัวตนหลัก หนึ่ง record ต่อคน |
| `engagements` | ช่วงบทบาทหลายช่วงต่อคน |
| `works` | ผลิตภัณฑ์ โมดูล โครงการ งานวิจัย หรือ deliverable |
| `contributions` | ความสัมพันธ์คน–ผลงาน–ช่วงบทบาท |
| `achievements` | รางวัลหรือความสำเร็จที่มีผู้รับหนึ่งคนหรือหลายคน |
| `socialProfiles` | ช่องทางสังคมพร้อม publication gate |
| `assets` | ภาพ profile พร้อม consent/verification/rights gate |
| `certificates` | ใบประกาศที่ยืนยันแล้ว พร้อม local path/hash, printed facts, work linkage และ owner-authorization gate |

## people

| Field | ชนิด | กติกา |
|---|---|---|
| `personId` | string | `S/P/I` + เลข 4 หลัก; unique และ immutable |
| `names.full.th/en` | string/null | ชื่อเต็มตามหลักฐาน ห้ามเติมนามสกุลด้วยการเดา |
| `names.nickname.th/en` | string/null | ชื่อเล่น; อาจซ้ำได้ จึงห้ามใช้เป็น key |
| `names.card.th/en` | string/null | ชื่อที่ใช้บน masonry card |
| `currentStatus` | enum | `active`, `alumni` |
| `firstJoined` | ISO date, year, null | เก็บ precision เท่าที่หลักฐานมี ไม่สร้างวันที่จากปี |
| `migrationClassification` | enum | `full_time`, `part_time`, `intern_or_program_participant` |
| `educationDisplayMode` | enum | Full-time=`qualification`, Intern=`program`, Part-time=`neutral` |
| `educationDisplay.card` | localized | หลักสูตร/field + ชื่อย่อสถาบัน |
| `educationDisplay.detail` | localized | หลักสูตร/field + ชื่อเต็มสถาบัน |
| `bio.th/en` | string/null | current materialized copy; null เมื่อยังไม่มีข้อความที่ผ่าน publication basis |
| `bio.status` | enum | `owner_pending`, `source_backed_placeholder`, `owner_approved` |
| `bio.verificationStatus` | enum | `owner_pending`, `owner_authorized_placeholder`, `owner_approved` |
| `bio.publicationBasis` | enum/null | `owner_authorized_paraphrase_from_first_person_application` หรือ `owner_authorized_synthesis_from_roster_evidence` |
| `bio.sourceBasis` | enum/null | แยก `first_person_application_exact_roster_match` จาก `factual_role_education_and_work_evidence` |
| `bio.sourceType` | enum/null | ปัจจุบันใช้ `first_person_application` หรือ `factual_fallback`; future version อาจใช้ transcript/owner copy ที่มี provenance ใหม่ |
| `bio.sourceRef` | string/null | public-safe evidence reference เท่านั้น ห้ามเป็น Sheet ID/range, URL ของ private source หรือ contact |
| `bio.authorRole` | enum/null | ผู้ให้ข้อมูลต้นทาง/ผู้เรียบเรียง เช่น `profile_subject`, `assistant_paraphrase_from_owner_and_sheet_records` |
| `bio.derivationMethod` | enum/null | `concise_paraphrase` หรือ `bounded_inference` สำหรับ release นี้ |
| `bio.evidenceScope` | string/null | ขอบเขตข้ออ้างที่หลักฐานรองรับ ห้ามขยายเป็น personality claim ที่ไม่มีหลักฐาน |
| `bio.evidenceConfidence` | enum/null | `exact_roster_match`, `medium_high`, `medium`, `medium_low` สำหรับ release นี้ |
| `bio.reviewStatus` | enum | `pending_owner_copy`, `pending_candidate_video_review`, `owner_approved` |
| `bio.ownerApproval` | object/null | owner authorization ที่มีวัน ขอบเขต และ source reference; ไม่ใช่ individual consent |
| `publication.consentStatus` | enum | `pending`, `granted`, `denied` |

สำหรับ release ปัจจุบัน ตามคำสั่งเจ้าของ directory หน้าเว็บแสดง core profile ทั้ง 48 คนพร้อมข้อความสองภาษาแบบ `source_backed_placeholder` โดย 25 คนเป็น paraphrase จากคำตอบ first-person ที่จับคู่ full name กับ roster ได้ exact และ 23 คนเป็น `factual_fallback` ที่สังเคราะห์อย่างจำกัดจาก role, education และ verified work ที่ reconcile แล้ว ทั้งสองกลุ่มยังรอวิดีโอ/เจ้าตัวทบทวน (`pending_candidate_video_review`) และต้องเก็บ provenance แยกกัน ค่า `people.publication.consentStatus=pending` ไม่ได้ใช้ filter card/detail หลักและไม่ถูกเปลี่ยนเป็น `granted` เพราะ owner authorization ห้ามเผย raw application, Sheet ID/range, contact, คะแนน หรือ reviewer data และห้ามทำ inference เกิน `evidenceScope`

### profile_statements ใน Google Sheet

ข้อความแต่ละ version เป็นคนละแถว (`statement_id`) และ `people_registry.current_statement_id` เลือกข้อความปัจจุบัน เก็บ `supersedes_statement_id` เมื่ออัปเดตจากวิดีโอ ห้าม overwrite ข้อความเก่าโดยไม่มี history ฟิลด์สำคัญคือ text TH/EN, `publication_basis`, `source_basis`, source type/ref, author role, derivation method, evidence scope/confidence, owner approval, person review, consent และ publication status ข้อมูลดิบจากใบสมัครหรือวิดีโอ private ไม่ถูก copy มาที่ tab นี้ Release v3.4 ต้องมี current statement ครบ 48 คน: first-person 25 และ factual fallback 23

## institutions, programs และ educationRecords

### institutions

`linkedinUrl` ใช้ได้เฉพาะหน้า LinkedIn school/company ที่ชื่อหน้าและเว็บไซต์ official ที่หน้าเชื่อมออกไปตรงกับ canonical institution เท่านั้น `linkedinVerificationStatus=verified_official_page` เมื่อผ่านเงื่อนไขนี้ ถ้ายังไม่พบ exact page ให้ `linkedinUrl=null` และใช้ `not_found_exact_official_page`; ห้ามใช้หน้า faculty หรือองค์กรชื่อคล้ายเป็นตัวแทนมหาวิทยาลัย

ชื่อสถาบันมีทั้ง:

- `names.th.formal`, `names.en.formal` สำหรับหน้า detail
- `names.th.short`, `names.en.short` สำหรับ masonry card
- `aliases` สำหรับ normalize ค่าที่สะกดต่างกันใน source

### programs

ชื่อหลักสูตร/field ใช้โครงสร้าง formal/short แบบเดียวกับสถาบัน `qualificationLevel` เป็น `null` เมื่อ source ไม่ระบุระดับวุฒิ ห้ามเดา B.Eng., B.A. หรือวุฒิอื่นจากชื่อสาขาเพียงอย่างเดียว ชื่อปริญญาที่ใช้ต้องอ้าง official curriculum ของ program ที่จับคู่สถาบันและ field ได้แล้ว

`linkedinUrl` ของ program ใช้เฉพาะหน้า LinkedIn ที่เป็น official exact program และมีเว็บไซต์ official ตรงกับ program นั้น หน้า faculty หรือ university-wide page ไม่ถูกเลื่อนชั้นเป็น program page; เมื่อไม่พบให้เก็บ `null` พร้อม `not_found_exact_official_page`

- Computer Engineering ใช้ short label อังกฤษ `CP`
- `I0022` และ `I0025` ใช้ `BBA Finance`
- `I0020`, `I0021`, `I0023`, `I0024` ใช้ `EBA`
- Ming (`I0004`) ใช้ card label `อักษร จุฬา` / `Arts · CU` แต่ detail ยังคงชื่อหลักสูตรและมหาวิทยาลัยทางการ

### educationRecords

| Field | หน้าที่ |
|---|---|
| `educationRecordId` | unique row ID |
| `personId` | FK → people |
| `institutionId` | FK → institutions |
| `programId` | FK → programs หรือ null เมื่อไม่ทราบหลักสูตร |
| `recordType` | `education` หรือ `study_abroad` |
| `isPrimary` | record หลักที่ใช้แสดงบน card/detail |
| `sourceLabel` | ค่าเดิมจาก source เพื่อ audit normalization |
| `qualification.th/en` | field/discipline เท่าที่ source รองรับ; ไม่เติม degree ที่เดาเอง |
| `degree.abbreviation.th/en` | ชื่อย่อ degree program เช่น `วศ.บ.` / `B.Eng.` |
| `degree.title.th/en` | ชื่อเต็ม degree program |
| `degree.field.th/en` | field ที่บุคคลเรียนและใช้ร่วมกับ official program evidence |
| `degree.awardStatus` | `under_review`, `in_progress`, `completed` แยกจากชื่อหลักสูตร |
| `degree.personalAwardVerified` | true เมื่อมี person-level evidence ที่บันทึกชัดเจน; release นี้เจ้าของ directory ยืนยันครบ 4 staff และ official curriculum ใช้ยืนยัน nomenclature |
| `degree.programEvidenceUrl` | primary official program source; ไม่ใช่หลักฐาน personal award |
| `degree.evidenceScope` | ขอบเขตว่าหลักฐานรองรับ program หรือสถานะบุคคลระดับใด |
| `verificationStatus` | `owner_review_required` หรือสถานะ conflict |

ณัฏฐณิชา (`I0037`) และนรภัทร (`I0038`) ยังเก็บค่าจากชีตเป็น CU CEDT พร้อม `source_conflict_unresolved` การปรากฏชื่อในเอกสารรับเข้าศึกษาของอีกมหาวิทยาลัยไม่พิสูจน์การลงทะเบียนหรือสถานะปัจจุบัน จึงไม่ overwrite

## engagements

Engagement คือช่วงบทบาท ไม่ใช่ตัวคน

| Field | กติกา |
|---|---|
| `engagementId` | unique FK target |
| `personId` | FK → people |
| `category` | `internship`, `part_time`, `full_time`, `program_participant` |
| `program.code` | เช่น FDI, MSI, PDI, PMI, IMP, Full-time, Part-time |
| `program.names.th/en` | ชื่อโปรแกรมฝึกงานเป็นอังกฤษทั้งสองโหมด; FDI ใช้ข้อความ exact `Full-stack Developer Intern, FDI` |
| `cohortLabel` | label สำหรับ cohort; availability note และวัน exact จาก response ถูก sanitize ก่อนออก public และไม่ใช้เป็น key |
| `academicPlacementType` | `internship`, `cooperative_education`, `not_applicable`; ห้าม parse จาก cohort label |
| `roleTitle.th/en` | ชื่อบทบาทในช่วงนั้น |
| `start`, `end` | ISO date หรือ null เมื่อไม่ทราบ |
| `status` | `ongoing`, `completed` |
| `responsibilityWorkIds` | FK ไป work ที่เป็นความรับผิดชอบหลัก |
| `evidenceStatus` | ขอบเขตหลักฐานของ engagement |
| `sequenceHint` | ใช้เมื่อลำดับรู้แต่วันที่ไม่ครบ |

ประวัติโอ๊ต:

1. FDI Intern — CityMETER: Schools, Students & Teachers
2. Part-time — Land Portfolio
3. Full-time — ดูแลทีม FDI, Land Portfolio และ Lead2Loan

Land Portfolio กับ Lead2Loan เป็นคนละ `workId`; Land Portfolio ผูกได้ทั้ง engagement Part-time และ Full-time

ช่วงบทบาทที่เพิ่มจาก owner-approved detail refinement:

- Praewa (`I0003`) และ Faze (`I0015`): FDI → Part-time
- Mos (`I0014`): FDI → Part-time พร้อม ijji
- Pat (`S0003`): FDI → Part-time → Full-time
- Grace (`I0018`): MSI 2025 → PDI 2026
- Dada (`I0029`): Impvest 2025 → MSI 2026; ใบ certificate สะกดนามสกุลต่างจาก registry เล็กน้อยจึงคง canonical registry spelling และติด owner-review note

สหกิจศึกษาใน public core มีเพียง `I0003`, `I0030`, `I0031`, `I0034`, `I0036`, `I0039` ส่วนผู้เข้าร่วมรายที่ 7 ตาม owner instruction ยังอยู่ใน private Shortlisted recruitment เพราะยังไม่มี started engagement และ contribution ที่ยืนยัน ห้ามสร้าง public person/work เพื่อให้จำนวนครบ

## works และ contributions

### works

| Field | หน้าที่ |
|---|---|
| `workId` | canonical work ID |
| `parentProduct` | brand/product/partner ที่งานอยู่ภายใต้ขอบเขตนั้น |
| `moduleSlug` | canonical CityMETER module slug หรือ null หากยังเทียบไม่ได้ |
| `names.th/en` | ชื่อเต็มที่ใช้หน้า detail |
| `shortNames.th/en` | ชื่อบน card/chip |
| `type` | module, product, research, partner deliverable, community ฯลฯ |
| `scopeLayer` | `shared_landometer`, `product_specific`, `partner_specific` |
| `authorityStatus` | ความสอดคล้องกับ release/หลักฐาน |
| `evidenceNote` | incompatibility หรือข้อจำกัดที่ต้องแสดง/เก็บไว้ |
| `catalogUrl.th/en` | URL catalog ที่ยืนยันแล้วแยกภาษา; null หากยังไม่มี exact route |
| `destinationUrl` | URL ปลายทางเฉพาะงานเมื่อมีหลักฐาน exact; ปัจจุบัน null เมื่อมีเพียง catalog route |
| `linkEvidence.linkScope` | `exact_module`, `exact_product`, `evidence_only`, `broader_catalog`, `unverified_no_link` |
| `linkEvidence.sourceRef` | แหล่งยืนยัน route โดยไม่อ้างว่าลิงก์กว้างคือหน้ารายละเอียดเฉพาะงาน |
| `linkEvidence.evidenceUrl` | URL หลักฐานที่ไม่ใช่ catalog/destination เช่นหลักฐานรางวัล CityCell |

Locale Insight Intelligence Layer อยู่ใน `shared_landometer` แต่ attribution ของบุคคลใน capability นี้ไม่พิสูจน์ว่า implementation เดียวกันถูกใช้ในทุกผลิตภัณฑ์ ส่วน CityMETER dataset module อยู่ใน `product_specific`

### contributions

| Field | กติกา |
|---|---|
| `contributionId` | unique row ID |
| `personId` | FK → people |
| `workId` | FK → works |
| `engagementId` | FK → engagements หรือ null เมื่อผูกช่วงบทบาทไม่ได้อย่างปลอดภัย |
| `role.th/en` | FDI=`Software development`, PDI=`Product development`, MSI=`Go-to-market`; CityCell=`Team member`; program อื่นคง role ตามหลักฐานและห้ามยกระดับเอง |
| `period` | start/end/label ตาม precision ของหลักฐาน |
| `evidenceStatus` | ดูตารางด้านล่าง |
| `sourceRef` | แหล่งข้อมูลระดับ record |

Evidence status:

| ค่า | ความหมาย |
|---|---|
| `sheet_recorded` | มีใน snapshot |
| `owner_supplied` | เจ้าของข้อมูลระบุในคำสั่งปัจจุบัน |
| `owner_and_sheet_confirmed` | มีทั้งในชีตและคำสั่งเจ้าของ |
| `owner_detail_required` | เจ้าของยืนยันว่ามีผลงาน แต่หลักฐานไม่พอระบุชื่อโครงการ |

ทุกคนต้องมี contribution อย่างน้อย 1 record หากยังไม่ทราบชื่อโครงการ ให้ใช้ work ชนิด `administrative_placeholder` และ `owner_detail_required` เท่านั้น ห้ามแต่งชื่อ project เพื่อให้ผ่าน QA

## CityMETER canonical mapping

ตารางนี้ map เฉพาะชื่อที่เทียบกับ current release ได้แล้ว

| Source concept | Canonical module slug | ชื่อ canonical EN |
|---|---|---|
| Company | `dataset-registered-companies-status-capital` | Registered Companies: Status & Capital |
| Hotel | `dataset-hotel-market` | Hotel Supply, Rates & Seasonality |
| Factory | `dataset-factories-workers-investment` | Factories, Workers & Investment |
| School | `dataset-schools-students-teachers` | Schools, Students & Teachers |
| Cars | `dataset-registered-cars` | Registered Cars |
| พื้นที่น้ำท่วมซ้ำซาก | `dataset-flood-recurrent` | Flood: Recurrent |
| Land Appraisal | `dataset-land-appraisal` | Land Appraisal & Title Deeds |
| หมื่นไร่ | `dataset-crop-area-output` | Agriculture: Crop Area & Output (10,000 Rai) |
| EIA | `dataset-eia-projects` | EIA Projects & Reports |
| Municipal revenue | `dataset-municipal-revenue` | Municipal Revenue |
| RoadDNA | `dataset-road-network-archetypes` | Road Network Archetypes |
| Tourism | `dataset-tourism-demand-spending` | Tourism Demand: Visitors & Spending |
| Gas station | `dataset-fuel-stations` | Fuel Stations: Count, Density & Fuel Types |
| Flood Recent | `dataset-flood-latest-observed` | Flood: Latest Observed |
| Shopping centers | `dataset-shopping-centers` | Shopping Centers: Supply, GLA & Market Segment |
| Locale insights | `dataset-locale-insights` | Locale Insights |
| Government agencies and workforces | `dataset-government-agencies-workforce` | Government Agencies & Workforce |
| 3D Buildings | `dataset-buildings` | Buildings: Footprint, GFA & Height |

ข้อยกเว้น:

- “Shopping centers and venues” ถูก map เฉพาะ Shopping Centers; ไม่รวม venues จนกว่าจะมีขอบเขตแยก
- Flood forecasting ยังไม่ map เพราะ official modules แยก DWR forecast-depth กับ Google flash-flood risk
- CityScan, CityMETER Playbook for FDI, DWR Runoff, GISTDA Urban Flood, `CityMETER: RUGON` และ CityCell เป็น product/partner-specific deliverable ไม่ใช่ canonical CityMETER dataset module
- ชื่อ work ของ CityCell ใช้ exact `CityCell: Machine learning model for nationwide land appraisal`; evidence link ยังชี้ไปหลักฐานรางวัลเท่านั้น
- ชื่อ CityMETER รุ่นเก่าใน snapshot ที่ยังเทียบ release ไม่ได้ใช้ `sheet_recorded_not_current_release_authority`

## achievements

Achievement แยกจาก contribution และรองรับผู้รับหลายคนด้วย `recipientPersonIds`

Hack Land Value Hackathon:

- `achievementId`: `A0001`
- ผู้รับ: `S0001` โอ๊ต, `P0001` เสก, `I0016` มุก (Pitcha)
- `workId`: `work-citycell-model`
- วันที่เป็น null และ `dateVerificationStatus=owner_detail_required` จนกว่าจะยืนยัน

## certificates

`certificates` เป็น public projection จาก inventory ที่ผ่าน review ใน `data/approved/certificate-assets.json` ไม่ได้อนุมานจาก QR code หรือชื่อไฟล์ และยังไม่ใช่ tab ที่แก้ผ่าน normalized Sheet exporter ใน release นี้ เมื่อ import Sheet roundtrip ตัว normalizer จึง preserve dimension นี้จาก reviewed baseline เดิม

Governed inventory ชุดนี้มี 26 ใบเท่านั้น: FDI 12 ใบ, MSI 5 ใบ, IMP 8 ใบ และ PDI 1 ใบ การเปลี่ยนจำนวนหรือ program distribution ต้องผ่านการแก้ inventory, schema และ validator พร้อมกัน

| Field | กติกา |
|---|---|
| `certificateId` | unique ID ที่รวม `personId` และ printed credential ID; credential ID อย่างเดียวไม่ใช่ key เพราะ `IMP25007` ซ้ำใน source |
| `personId` | FK → people |
| `credentialId` | รหัสที่พิมพ์บน certificate เก็บตามภาพ ห้ามแก้เพื่อบังคับ unique |
| `programCode` | `FDI`, `PDI`, `MSI`, `IMP`; ใช้กำหนด role label exact: Software development, Product development, Go-to-market, Consulting Partner |
| `title.th/en` | ชื่อ certificate สองภาษา |
| `roleLabel.th/en` | role label exact ตาม program และเป็นภาษาอังกฤษทั้งสอง UI locale |
| `awardedOn` | วันที่ที่พิมพ์บนภาพ เป็น certificate fact ไม่ใช่ engagement timeline โดยอัตโนมัติ |
| `printedWorkTitle` | ชื่อ work ที่พิมพ์บนภาพ เก็บเพื่ออธิบาย evidence เท่านั้น |
| `workIds` | reviewed FK → works; QR “Try …” label ไม่สร้าง contribution ใหม่ |
| `publicPath`, `downloadFilename` | local PNG และชื่อไฟล์ดาวน์โหลดที่ปลอดภัย |
| `sha256`, `bytes`, `mimeType` | integrity/media contract ของภาพ hi-res ต้นฉบับ |
| publication gate | `verificationStatus=verified`, `rightsStatus=cleared`, `publicationStatus=publishable`, `publicationBasis=owner_authorized_public_certificate`, scoped owner approval; `consentStatus=pending` ไม่ถูกอ้างเป็น individual consent |
| review flags | เก็บ printed credential collision, name-spelling review และ date-evidence conflict โดยไม่แก้ canonical person name/timeline |

ไฟล์ต้นฉบับที่กรอกแล้ว 26 ใบถูก copy byte-for-byte ไป `public/assets/certificates/`; automation template ที่ยังไม่กรอกถูก exclude ชัดเจน Dada ใช้ canonical registry spelling ต่อไปพร้อม `nameSpellingStatus=owner_review_required` ส่วน Hana เก็บ printed date `2025-11-13` พร้อม `printed_date_conflicts_with_program_code` และห้ามใช้วันนั้นอนุมานช่วง PDI 2026

## socialProfiles และ assets

### Publication gate

Enum สำหรับ workflow ของ social/asset candidate ต้องใช้ค่าชุดนี้เท่านั้น:

| Gate | Allowed values |
|---|---|
| `verification_status` | `owner_review_required`, `verified`, `rejected`, `missing` |
| `consent_status` | `granted`, `pending`, `denied` |
| `rights_status` | `cleared`, `pending`, `denied`, `revoked` |
| `publication_basis` (social) | `individual_consent`, `owner_authorized_public_profile_link`, null |
| `publication_basis` (portrait) | `individual_consent`, `owner_authorized_public_profile_portrait`, null |
| `owner_approval_status` | `granted` หรือว่างเมื่อไม่มี owner basis |
| `publication_status` | `publishable`, `withheld_pending_*`, `withdrawn` |

`withheld_pending_*` คือ family ของสถานะที่ระบุเหตุผลว่ารอ gate ใด เช่น `withheld_pending_consent` หรือสถานะรวมที่ schema รองรับ ไม่ใช่ wildcard value ที่ผู้ใช้พิมพ์ลง cell และทุกค่ากลุ่มนี้ต้องถูก withheld ส่วน `withdrawn` หมายถึงเคยมี record แต่ถอนออกจากการเผยแพร่แล้ว

Social URL เผยแพร่ได้เมื่อ `verificationStatus=verified`, `publicationStatus=publishable` และผ่านอย่างใดอย่างหนึ่ง:

1. `consentStatus=granted` และ `publicationBasis=individual_consent`; หรือ
2. `publicationBasis=owner_authorized_public_profile_link` พร้อม `ownerApproval.status=granted` และ scope `public_profile_link_only`

Portrait เผยแพร่ได้เมื่อ `verificationStatus=verified`, `rightsStatus=cleared`, `publicationStatus=publishable`, มี local `publicPath`/SHA-256 ที่ตรวจได้ และผ่านอย่างใดอย่างหนึ่ง:

1. `consentStatus=granted` และ `publicationBasis=individual_consent`; หรือ
2. `publicationBasis=owner_authorized_public_profile_portrait` พร้อม `ownerApproval.status=granted` และ scope `public_profile_portrait`

Owner basis เป็นการตัดสินใจเผยแพร่ของเจ้าของ directory เฉพาะลิงก์หรือ portrait รายการนั้น ไม่ใช่ consent ของบุคคล ดังนั้น `consentStatus` ยังคง `pending` และห้ามเปลี่ยน label เป็น consent ปัจจุบันมี LinkedIn 45 ราย, GitHub 12 ราย, Facebook 1 ราย และ local portrait 41 รายที่ผ่าน exact identity + owner basis; รายการอื่นต้องเป็น null/fallback

Candidate URL/handle ที่ยังไม่ผ่าน gate, portrait source/CDN URL, evidence, permission record และ review noteเก็บเฉพาะใน ignored raw snapshot/private report เท่านั้น URL ที่ผ่าน gate ถูก copy เป็น `publicUrl`; portrait ถูก normalize เป็น local JPEG ภายใต้ `public/assets/people/<personId>.jpg` และ public JSON เก็บ local path/hash โดย `sourceUrl=null` เสมอ Exporter merge candidate/review fields เดิมกลับเฉพาะ private workbook เพื่อให้ roundtrip ไม่ทำข้อมูลสูญหาย

ข้อมูล email, phone, chat handle, private CV/file ID และค่าจาก private contact source ไม่ถูก ingest หรือ emit ใน generated/public data

## โครงสร้าง Google Sheet ที่แนะนำ

แยก tab ตาม grain ห้ามเก็บรายการหลายค่าแบบ comma-separated ใน cell เดียว

| Tab | หนึ่งแถวหมายถึง | Primary key |
|---|---|---|
| `people_registry` | คนหนึ่งคน | `person_id` |
| `profile_statements` | ข้อความ objective/work style หนึ่ง version | `statement_id` |
| `engagements` | หนึ่งช่วงบทบาท | `engagement_id` |
| `institutions` | หนึ่งสถาบัน | `institution_id` |
| `programs` | หนึ่งหลักสูตร/field | `program_id` |
| `education` | คน–สถาบัน–หลักสูตรหนึ่งความสัมพันธ์ | `education_record_id` |
| `works` | หนึ่ง work/module/project | `work_id` |
| `contributions` | คน–ผลงาน–engagement หนึ่งความสัมพันธ์ | `contribution_id` |
| `achievements` | หนึ่งรางวัล/ความสำเร็จ | `achievement_id` |
| `person_achievements` | หนึ่งผู้รับต่อ achievement | `person_achievement_id` |
| `social_profiles` | หนึ่ง platform ต่อคน | `social_profile_id` |
| `assets` | หนึ่ง portrait asset ต่อคน | `asset_id` |
| `enums` | enum และ data validation | `enum_group + value` |

### คอลัมน์สำคัญที่ต้องเพิ่ม/รักษา

- `people_registry`: `person_id`, names, `current_status`, `consent_public`, materialized bio fields, provenance/approval/review fields, `current_statement_id`
- `profile_statements`: versioned TH/EN text, publication/source basis, source type/ref, author/derivation/evidence scope and confidence, approval/review/consent/publication status, `supersedes_statement_id`
- `engagements`: `engagement_id`, `person_id`, `category`, `program_code`, `role_title_th/en`, `start`, `end`, `status`, `evidence_status`, `academic_placement_type`
- `education`: FK 3 ตัว, `is_primary`, qualification, structured degree program, separate award status/verification, evidence scope
- `works`: localized names, `parent_product`, `module_slug`, `type`, `scope_layer`, `authority_status`, `catalog_url_th/en`, `destination_url`, `link_scope`, `url_source_ref`, `link_evidence_url`
- `contributions`: FK person/work/engagement, role, period, evidence status/source/note
- `social_profiles`: private candidate, approved `public_url`, identity verification, consent, `publication_basis`, owner approval fields, publication status, source note
- `assets`: private source URL, governed local path, identity verification, consent, rights, `publication_basis`, owner approval, hash/media metadata, publication status

### Data validation

ใช้ dropdown จาก tab `lists` สำหรับ enum ทุกช่อง และใช้ protected range กับ:

- canonical IDs
- institution/program canonical names
- work/module slug
- consent/verification/rights status
- formula/QA columns

ห้ามแก้ ID หลัง assign หากพบคนซ้ำให้ merge relation เข้าหา canonical person record แทนการออก ID ใหม่

### QA views ที่ควรมี

1. คนที่ไม่มี contribution
2. FK ที่หา parent ไม่เจอ
3. social/asset ที่ขอเผยแพร่แต่ gate ไม่ครบ
4. institution/program alias ที่ยัง map ไม่ได้
5. work ที่ `authorityStatus` ยัง unresolved
6. bio ที่ยัง `owner_pending`, ไม่มี current statement, หรือ provenance ไม่ระบุว่า first-person/factual fallback
7. exact co-op set ต่างจาก public 6 IDs หรือมี candidate-only person หลุดเข้า core
8. degree ที่ UI จะสื่อว่าได้รับแล้วแต่ `awardStatus/personalAwardVerified` ไม่รองรับ
9. engagement ongoing แต่มี end dateผ่านแล้ว หรือ completed แต่ไม่มีเหตุผล/ช่วงเวลา
10. nickname ซ้ำ โดยแสดง `personId` คู่กันเสมอ

## Build และ verification

รัน normalize โดยระบุขอบเขตไฟล์ชัดเจน (ค่าเหล่านี้คือ default ของ `npm run normalize`):

```sh
node tools/normalize-data.mjs \
  --input data/raw/google-sheet-snapshot.json \
  --output-dir data/generated
```

สร้าง payload สำหรับ authorized local Sheet writeback โดยระบุทั้ง raw snapshot และ public projection:

```sh
node tools/export-sheet-tabs.mjs \
  --snapshot data/raw/google-sheet-snapshot.json \
  --site-data data/generated/site-data.json \
  --output /private/tmp/landom-sheet-tabs-v3.4.0.json
```

เพิ่ม `<tab-name>` ต่อท้ายคำสั่ง exporter เมื่อต้องการเพียง tab เดียว และใช้ `--output` ไปยัง private path เสมอสำหรับ payload เต็ม Payload อาจมี private social/asset candidates และ internal contacts จึงห้ามบันทึกลง repository, terminal/CI log หรือ public artifact การนำ payload ไปเขียน Google Sheet ต้องทำใน authorized local session หลังตรวจ spreadsheet เป้าหมายแล้วเท่านั้น; CI ต้องไม่เรียก Google Sheet remote ไม่ว่าทางอ่านหรือเขียน

รัน data QA:

```sh
node --test tests/data-model.test.mjs
```

Generator เป็น deterministic: snapshot เดิมและกติกาเดิมต้องสร้าง JSON byte-for-byte เหมือนเดิม Tests ตรวจ unique IDs, orphan FKs, minimum contribution, Oat role history, CityMETER mapping, education conflict, achievement recipients และ privacy gates
