# Product Brief — CityMETER

**Document type:** Product Brief  
**Product:** CityMETER  
**Master brand:** Landometer  
**Role in ecosystem:** City Intelligence Base Layer / Urban Data Platform / Map-first Spatial Decision Product / Agent-ready City Data Foundation  
**Version:** Landometer-aligned v6  
**Date:** 2026-06-30  
**Source alignment:**

- `Product_Brief_CityMETER_Landometer_Aligned_v5.md`
- `Landometer_Master_Brand_Brief_v0_5_2_brand_statement_restored_product_brief_order.md`
- `citymeter_location_insights_search_llm_agent_priority_v3.md`
- `ijji_design_system_v0_3_4_integrated_progress_memory_outcome_ledger.md` เฉพาะหลักคิด action-first, evidence discipline, summary-first/detail-later และ progress/outcome loop ที่เกี่ยวข้องกับ ecosystem

**Purpose:** ใช้เป็นเอกสารอ้างอิงสำหรับ positioning, product strategy, dataset communication, Search / LLM / Agent readiness, sales material, landing page, proposal, product UI และ AI context ของ CityMETER โดยให้สอดคล้องกับ Landometer master brand: **Visualize City, Shape Tomorrow. / Land · Location · Living · Local Decisions · Local Decisions / Measure What Matters. Make It Actionable. / Clear · Grounded · Energetic**

---

## 0. Document Control

### 0.1 What This Version Updates

เอกสาร v6 นี้คงโครงสร้างหลักจาก CityMETER Product Brief v5 ไว้ ได้แก่:

```text
Product Statement → Brand DNA → Brand Voice → Brand Visual
```

แต่ปรับให้สอดคล้องกับ context sources ใหม่ใน 5 เรื่องหลัก:

1. **เพิ่ม Local Decisions เป็น outcome layer**  
   CityMETER ยังยืนบน Land · Location · Living · Local Decisions แต่ต้องชัดขึ้นว่าเป้าหมายสุดท้ายคือการช่วยผู้ใช้ตัดสินใจเรื่องพื้นที่จริง ไม่ใช่แค่ดูข้อมูลเมือง

2. **ย้ำบทบาท CityMETER เป็น City Intelligence Base Layer**  
   CityMETER คือฐานข้อมูลเมืองและ spatial intelligence ที่ต่อยอดไปยัง CityWiki, CityChat, ijji, land/property tools และ bespoke solutions

3. **เพิ่ม Search / LLM / Agent readiness**  
   CityMETER ต้องไม่ใช่แค่ platform ที่คนเปิดดูเอง แต่ต้องพร้อมเป็นแหล่งข้อมูลที่ search engine อ่านได้, LLM อ้างอิงได้ และ AI agent เรียกใช้เพื่อทำงานต่อได้

4. **จัด priority dataset และ content ตาม demand channel**  
   P0 ของ CityMETER ในมุม Search / LLM / Agent ได้แก่ Hotel/Tourism, Land/Deed/Parcel, Flood/PM2.5/Environment Risk, Property/Residential Location และต่อด้วย Locale Insight / POI, Commute/Transit, Population/Demographics เป็น standard context

5. **ปรับ brand personality ให้ตรงกับ Master Brand**  
   จากเดิมที่ CityMETER มีคำอธิบายแบบ Deep / Clear / Easy / Caring / Practical ให้จัดกลับเข้ากับ master traits: **Clear · Grounded · Energetic** โดยเก็บพฤติกรรมที่ดีเดิมไว้ในรายละเอียด

### 0.2 What to Keep from v5

| สิ่งที่ดีอยู่แล้ว | เหตุผลที่ควรเก็บ |
|---|---|
| Product Statement แบบ Highlight → Who → What → Which → How | ทำให้ positioning ครบ ตั้งแต่ pain, solution, alternatives, differentiation |
| Dataset Product Statement Template | สำคัญมากต่อการทำ dataset ใหม่ให้ไม่กลายเป็น data dictionary |
| Source / Method / Limitation discipline | เป็น trust foundation ของ CityMETER และควรเป็น product habit ถาวร |
| Land · Location · Living · Local Decisions | เป็น territory หลักของ Landometer และทำให้ CityMETER ไม่แคบเป็น GIS tool |
| Map-first / decision-ready visual rules | เป็นหัวใจของ CityMETER UX |
| Flood: Recurrent example | เป็นตัวอย่างที่ดีของการแปลง raw hazard data ให้เป็น decision layer |

### 0.3 Operating Rule for This Brief

ทุกครั้งที่ทีมสร้าง CityMETER dataset, landing page, insight card, API feed, proposal หรือ AI response ให้เริ่มจากคำถามนี้ก่อน:

> **ผู้ใช้กำลังตัดสินใจอะไรเกี่ยวกับพื้นที่จริง และ CityMETER ช่วยให้เขาเห็น เข้าใจ เปรียบเทียบ ลงมือ หรืออธิบายการตัดสินใจนั้นได้ดีขึ้นอย่างไร**

ไม่ควรเริ่มจาก:

> “เรามี dataset อะไรบ้าง”

---

## 1. Product Statement

### 1.1 Highlight

**CityMETER คือ City Intelligence Base Layer ของ Landometer ที่ทำให้ “สิ่งสำคัญของพื้นที่จริง” มองเห็น วัดได้ เปรียบเทียบได้ และนำไปตัดสินใจได้บนแผนที่**

CityMETER รวมข้อมูลด้าน **Land, Location, Living และ Local Decisions** ให้กลายเป็น spatial decision layers บนแผนที่ เพื่อช่วยธุรกิจ หน่วยงานรัฐ ท้องถิ่น และทีมวิเคราะห์ **screen, compare, prioritize และ act** ได้ดีกว่าการตัดสินใจจากประสบการณ์เฉพาะจุด ข้อมูลกระจัดกระจาย หรือรายงานที่ใช้ต่อยาก

CityMETER ไม่ได้เป็นเพียง map viewer, dashboard, open-data portal หรือ GIS layer แต่เป็น **map-first spatial decision platform** ที่ช่วยให้ผู้ใช้เห็นว่าแต่ละพื้นที่มีบริบท โอกาส ความเสี่ยง ข้อจำกัด และ action ที่ควรทำต่ออย่างไร

**Main line**

> **Visualize City, Shape Tomorrow.**

**Product promise**

> **Measure what matters in every place. Make it actionable on a map, in insight pages, and through agent-ready outputs.**

**Thai working line**

> **วัดสิ่งสำคัญของพื้นที่จริง แล้วแปลงเป็นการตัดสินใจที่ลงมือได้ ทั้งบนแผนที่ หน้า insight และ agent feed**

---

### 1.2 Who — ใครคือผู้ใช้ และปัญหาของพวกเขาคืออะไร

CityMETER ถูกออกแบบมาสำหรับคนที่ต้องตัดสินใจเกี่ยวกับ **“พื้นที่จริง”** และผลของการตัดสินใจนั้นมีต้นทุนสูง ทั้งในเชิงเงิน เวลา ความปลอดภัย ความน่าเชื่อถือ และผลกระทบต่อเมือง

#### 1. ธุรกิจ นักลงทุน และผู้พัฒนาอสังหาริมทรัพย์ที่ต้องเลือกพื้นที่

เช่น real estate developer, retailer, restaurant chain, hotel, logistics, insurance, bank และธุรกิจที่ต้องเลือกทำเลหรือขยายสาขา

**Functional needs**

- ต้อง screen และ compare หลายพื้นที่อย่างรวดเร็ว
- ต้องเข้าใจ demand, access, competition, risk และข้อจำกัดของพื้นที่
- ต้องอธิบายเหตุผลของการเลือกหรือไม่เลือกทำเลให้ผู้บริหาร นักลงทุน ลูกค้า หรือ partner เชื่อได้
- ต้องลดความเสี่ยงของการซื้อที่ดิน เปิดสาขา รับประกัน ปล่อยกู้ หรือพัฒนาโครงการผิดพื้นที่

**Emotional needs**

- กลัวตัดสินใจผิดจากข้อมูลไม่ครบ
- ไม่มั่นใจว่าประสบการณ์ส่วนตัวหรือข้อมูลจากนายหน้าพอหรือไม่
- กลัวตอบไม่ได้เมื่อถูกถามว่า “ทำไมเลือกที่นี่” หรือ “รู้ความเสี่ยงนี้มาก่อนหรือไม่”
- ต้องการหลักฐานที่สื่อสารง่ายพอจะใช้คุยกับทีมที่ไม่ใช่นักวิเคราะห์

**Trigger / voice in head**

> “ทำเลนี้ดีจริง หรือแค่ดูดีตอนลงพื้นที่?”  
> “เรามองข้ามความเสี่ยงอะไรอยู่ไหม?”  
> “มีข้อมูลพอไหมที่จะ justify decision นี้?”

**Value proposition**

CityMETER ช่วยให้การตัดสินใจเรื่องทำเลมีหลักฐานเชิงพื้นที่ที่เห็นภาพ เปรียบเทียบได้ และใช้สื่อสารต่อได้ ไม่ใช่พึ่ง gut feeling หรือข้อมูลจากแหล่งเดียว

---

#### 2. หน่วยงานรัฐ ท้องถิ่น และทีมบริหารเมือง

เช่น เทศบาล อบต. จังหวัด หน่วยงานด้านผังเมือง ภัยพิบัติ โครงสร้างพื้นฐาน บริการสาธารณะ และ smart city

**Functional needs**

- ต้องเห็นปัญหาและทรัพยากรของเมืองบนแผนที่เดียว
- ต้องจัดลำดับพื้นที่ที่ควรดูแลก่อน เช่น พื้นที่เสี่ยง พื้นที่เปราะบาง พื้นที่ขาดบริการ หรือพื้นที่ที่ได้รับผลกระทบ
- ต้องสื่อสารข้อมูลกับผู้บริหาร ประชาชน หน่วยงานอื่น หรือทีมปฏิบัติการให้เข้าใจตรงกัน
- ต้องเริ่มใช้ข้อมูลเมืองได้เร็ว แม้ข้อมูลภายในยังไม่สมบูรณ์ทั้งหมด

**Emotional needs**

- รู้สึกว่าข้อมูลมีเยอะ แต่กระจัดกระจายและใช้ไม่ทันสถานการณ์
- กลัวถูกมองว่าตัดสินใจไม่โปร่งใสหรือไม่มีหลักฐาน
- ต้องการเครื่องมือที่ทำให้ทีมเล็ก ๆ ทำงานได้เหมือนมี data team ใหญ่ขึ้น
- อยากให้ข้อมูลเมืองไม่ใช่เรื่องไกลตัวของเจ้าหน้าที่หรือประชาชน

**Trigger / voice in head**

> “พื้นที่ไหนควรได้งบก่อน?”  
> “เรามีหลักฐานพอไหมที่จะอธิบายกับประชาชน?”  
> “ข้อมูลที่มีอยู่จะเอามาใช้จริงได้อย่างไร?”

**Value proposition**

CityMETER ช่วยให้ท้องถิ่นและหน่วยงานเมืองเปลี่ยนข้อมูลที่กระจัดกระจายให้เป็นภาพรวมบนแผนที่ เพื่อจัดลำดับ วางแผน และสื่อสารการตัดสินใจได้ดีขึ้น

---

#### 3. ที่ปรึกษา นักวางแผน นักวิเคราะห์ และทีมกลยุทธ์

เช่น urban planner, market analyst, consultant, policy team, research team และทีม strategy ที่ต้องทำ spatial analysis ซ้ำหลายครั้ง

**Functional needs**

- ต้องหา clean และจัดข้อมูล spatial จากหลายแหล่งให้เร็วขึ้น
- ต้องวิเคราะห์พื้นที่หลายมิติ โดยไม่เริ่มจากศูนย์ทุกครั้ง
- ต้องทำ comparison, scenario, ranking และ evidence-based recommendation
- ต้องแปลงข้อมูลเทคนิคให้เป็นเรื่องที่ client หรือ stakeholder เข้าใจ

**Emotional needs**

- เหนื่อยกับการใช้เวลามากไปกับ data preparation ก่อนถึง insight
- กังวลว่า analysis จะถูก challenge เรื่อง source, method หรือ assumption
- อยากมี common platform ที่ทีมใช้ reference เดียวกันได้
- อยากยกระดับงานจาก report เฉพาะกิจให้กลายเป็น repeatable workflow

**Trigger / voice in head**

> “ต้องเริ่มหา shapefile / Excel / PDF ใหม่อีกแล้วใช่ไหม?”  
> “ข้อมูลชุดนี้อธิบายที่มาและข้อจำกัดได้ชัดพอหรือยัง?”  
> “จะทำให้ stakeholder เข้าใจเร็วขึ้นได้อย่างไร?”

**Value proposition**

CityMETER ช่วยให้ทีมวิเคราะห์มี city data foundation และ map-first workflow ที่ใช้ซ้ำได้ ตรวจสอบได้ และสื่อสาร insight ได้เร็วขึ้น

---

#### 4. Search users, LLM users และ AI agents ที่ต้องการคำตอบเชิงพื้นที่

กลุ่มนี้ไม่ใช่ persona แบบเดิมทั้งหมด แต่เป็น **ช่องทางการค้นพบและการใช้งานใหม่** ที่ CityMETER ต้องออกแบบรองรับ เพราะผู้ใช้จำนวนมากจะไม่เริ่มจากการเข้า platform โดยตรง แต่อาจเริ่มจาก Google Search, AI answer engine หรือ agent ที่ได้รับมอบหมายให้ทำงาน

**Functional needs**

- Search users ต้องการหน้า location insight ที่ค้นเจอ อ่านง่าย และตอบคำถามเฉพาะพื้นที่
- LLM users ต้องการคำตอบหลายมิติ เช่น “ย่านนี้เหมาะอยู่ไหม”, “ทำเลนี้เหมาะเปิดร้านไหม”, “พื้นที่นี้น้ำท่วมซ้ำซากไหม”
- AI agents ต้องการ structured data เพื่อ compare, shortlist, generate brief, monitor alert, export report หรือเรียก workflow ต่อ

**Emotional needs**

- ไม่อยากไล่อ่านหลายเว็บเพื่อประกอบคำตอบเอง
- ต้องการคำตอบที่มีที่มา ไม่ใช่ AI ตอบลอย ๆ
- ต้องการให้ระบบช่วยทำงานต่อ ไม่ใช่แค่ให้ข้อมูลอ่าน

**Trigger / voice in head**

> “ช่วยเทียบย่าน A กับย่าน B ให้หน่อย”  
> “สรุปความเสี่ยงทำเลนี้ให้เป็น brief ได้ไหม”  
> “ถ้าพื้นที่นี้เริ่มเสี่ยงน้ำท่วม ช่วยแจ้งเตือนได้ไหม”  
> “ทำ due diligence เบื้องต้นของแปลงนี้ให้หน่อย”

**Value proposition**

CityMETER ต้องทำให้ข้อมูลเมืองเป็น **askable, citable และ callable**: คนค้นหาเจอได้, LLM อ้างอิงได้ และ agent เรียกใช้เพื่อสร้าง output ต่อได้

---

**Core pain**

> คนตัดสินใจเรื่องเมืองไม่ได้ขาด “ข้อมูล” เสมอไป  
> แต่ขาดข้อมูลที่ถูกเชื่อมโยงกับพื้นที่จริง เห็นบนแผนที่ เข้าใจง่าย ตรวจสอบที่มาได้ และนำไปลงมือได้ทันที

---

### 1.3 What — CityMETER แก้ปัญหานี้อย่างไร

CityMETER ทำหน้าที่เป็น **city data foundation + spatial intelligence interface + agent-ready output layer** ของ Landometer โดยเปลี่ยนข้อมูลเมืองที่กระจัดกระจายให้กลายเป็น decision layers ที่ผู้ใช้เปิดดู เปรียบเทียบ ตีความ และนำไปใช้ตัดสินใจได้

CityMETER ทำงานผ่าน 5 ชั้นหลัก

#### 1. Data Foundation — รวมและจัดระเบียบข้อมูลพื้นที่จริง

CityMETER รวบรวมข้อมูลจากหลายแหล่ง เช่น official data, open data, geospatial data, platform data, field data, partner data และ derived data แล้วจัดให้อยู่ในรูปแบบที่ map-ready และ decision-ready มากขึ้น

หลักสำคัญคือ CityMETER ต้องไม่ทำให้ข้อมูลดู “วิเศษ” หรือ “ลอย” แต่ต้องบอกให้ผู้ใช้รู้ว่า:

- ข้อมูลมาจากแหล่งใด
- coverage และช่วงเวลาคืออะไร
- metric ใดเป็นข้อมูลต้นทาง
- metric ใดเป็นค่าคำนวณ
- insight ใดเป็นการ infer หรือ classification
- limitation สำคัญที่ควรรู้คืออะไร

#### 2. Spatial Intelligence — เปลี่ยนข้อมูลเป็นความเข้าใจเชิงพื้นที่

CityMETER ไม่หยุดที่การวางข้อมูลบนแผนที่ แต่ช่วยแปลงข้อมูลให้เป็น spatial intelligence เช่น

- pattern — พื้นที่ไหนมีลักษณะคล้ายกัน
- cluster — สิ่งใดกระจุกตัวอยู่ตรงไหน
- gap — พื้นที่ไหนขาดบริการหรือโอกาส
- risk — พื้นที่ไหนมีความเสี่ยงซ้ำซากหรือควรเฝ้าระวัง
- opportunity — พื้นที่ไหนมี potential ที่ควรศึกษาเพิ่ม
- priority — พื้นที่ไหนควรจัดลำดับก่อน
- comparison — พื้นที่ A กับ B ต่างกันอย่างไร

#### 3. Product Interface — ทำให้ผู้ใช้เห็นและใช้งานได้จริง

CityMETER ทำให้ข้อมูลเมืองเข้าใจง่ายผ่าน map-first interface และ visual components เช่น

- map layer
- tooltip
- insight card
- ranking
- timeline
- comparison view
- dashboard summary
- report-ready screenshot
- dataset-specific product statement

ผู้ใช้ไม่ควรต้องเป็น GIS expert จึงจะเริ่มเข้าใจพื้นที่ได้

#### 4. Action & Learning Loop — ทำให้ข้อมูลนำไปสู่การตัดสินใจและการเรียนรู้

CityMETER ต้องช่วยให้ผู้ใช้ไปไกลกว่า “เห็นข้อมูล” ไปสู่การตัดสินใจ เช่น

- screen พื้นที่
- compare ทำเล
- prioritize พื้นที่
- monitor สถานการณ์
- assess risk
- allocate resource
- plan investment
- communicate with stakeholders
- decide what to do next

---

#### 5. Discovery & Agent Interface — ทำให้ข้อมูลถูกค้นพบ อ้างอิง และเรียกใช้ได้

CityMETER ต้องออกแบบข้อมูลและเนื้อหาให้รองรับ 3 ช่องทางที่ต่างกัน:

| Channel | สิ่งที่ผู้ใช้ทำ | CityMETER ต้องเตรียมอะไร |
|---|---|---|
| **Search** | ค้น keyword เช่น น้ำท่วมบางนา, โรงแรมเกาะช้าง, ข้อมูลที่ดินแสนสุข | static/SSR landing page, HTML table, title/meta, FAQ schema, sitemap, source note |
| **LLM** | ถามคำถามหลายมิติ เช่น ย่านนี้เหมาะอยู่ไหม, ทำเลนี้เสี่ยงอะไร | askable page, answer block 5–8 บรรทัด, source/freshness/limitation, llms.txt, citation-friendly summary |
| **Agent** | สั่งให้ระบบ compare, shortlist, alert, generate report, export CSV/PDF | structured API/feed, consistent fields, confidence, last_updated, action endpoint, exportable output |

CityMETER จึงควรเป็นทั้ง:

- **human-readable** — คนเปิดอ่านและเข้าใจได้
- **machine-readable** — search/LLM/agent อ่านโครงสร้างและข้อมูลได้
- **decision-readable** — อ่านแล้วรู้ว่าจะตัดสินใจหรือทำอะไรต่อ

---

CityMETER จัดข้อมูลหลักภายใต้ 3 แกนของ Landometer และ 1 outcome layer

#### Land — เข้าใจที่ดินและศักยภาพพื้นที่

ข้อมูลด้าน Land ช่วยให้ผู้ใช้เข้าใจข้อเท็จจริงเชิงพื้นที่ ขอบเขต ศักยภาพ และข้อจำกัดของที่ดินหรือพื้นที่เป้าหมาย

ตัวอย่าง layer:

- ขอบเขตพื้นที่
- การใช้ประโยชน์ที่ดิน
- ผังเมือง
- แปลงที่ดิน
- อาคาร
- โครงสร้างพื้นฐาน
- ข้อจำกัดเชิงพื้นที่
- บริบทการพัฒนาโดยรอบ

ใช้ตอบคำถาม เช่น

- พื้นที่นี้พัฒนาอะไรได้บ้าง
- ข้อจำกัดของพื้นที่คืออะไร
- พื้นที่ใดควรเป็น priority
- ทำเลใดมีศักยภาพเชิงพื้นที่สูงกว่า
- พื้นที่นี้ควรถือ รอ พัฒนา ขาย หรือศึกษาเพิ่ม

#### Location — เข้าใจทำเล ผู้คน และการแข่งขัน

ข้อมูลด้าน Location ช่วยให้ผู้ใช้เข้าใจ demand, access, competition, catchment และพฤติกรรมการใช้พื้นที่

ตัวอย่าง layer:

- POI
- competitor
- catchment
- demographic
- traffic persona
- access
- surrounding amenities
- venue locale
- neighborhood context
- demand context

ใช้ตอบคำถาม เช่น

- ใครอยู่รอบพื้นที่นี้
- ลูกค้าน่าจะเป็นกลุ่มไหน
- คู่แข่งอยู่ตรงไหน
- พื้นที่นี้เหมาะกับร้าน สาขา หรือโครงการแบบใด
- ทำเลนี้แพ้หรือชนะทำเลอื่นตรงไหน
- traffic ของพื้นที่นี้เป็น traffic แบบไหน และมี quality เหมาะกับธุรกิจหรือไม่

#### Living — เข้าใจคุณภาพชีวิต ความเสี่ยง และสถานการณ์เมือง

ข้อมูลด้าน Living ช่วยให้ผู้ใช้เข้าใจความเสี่ยง คุณภาพชีวิต ความพร้อมของเมือง และสถานการณ์ที่ส่งผลต่อผู้คน ทรัพย์สิน และการวางแผน

ตัวอย่าง layer:

- น้ำท่วมซ้ำซาก
- น้ำท่วมล่าสุด
- พื้นที่เฝ้าระวัง
- อาคาร
- ประชากร
- โรงพยาบาล
- โรงเรียน
- เหตุการณ์สาธารณภัย
- แผ่นดินไหว
- public service
- community-level data

ใช้ตอบคำถาม เช่น

- พื้นที่นี้เสี่ยงอะไร
- มีคน อาคาร โรงเรียน โรงพยาบาล หรือทรัพย์สินใดได้รับผลกระทบ
- พื้นที่ไหนควรได้รับการจัดการก่อน
- เมืองควรเตรียมรับมือหรือวางแผนระยะยาวอย่างไร
- การตัดสินใจด้านธุรกิจหรือพื้นที่จะกระทบคุณภาพชีวิตอย่างไร

#### Local Decisions — แปลงข้อมูลเป็นการตัดสินใจเรื่องพื้นที่จริง

Local Decisions ไม่ใช่ dataset family แยกจาก Land / Location / Living แต่เป็น **outcome layer** ของ CityMETER

ตัวอย่าง decision workflows:

- เลือกซื้อ / ถือ / พัฒนา / ขายที่ดิน
- เลือกทำเลเปิดสาขา
- จัดอันดับพื้นที่เสี่ยงที่ควรดูแลก่อน
- สร้าง hotel compset และ tourism catchment
- เทียบย่านสำหรับการอยู่อาศัย
- ทำ flood-risk brief รายพื้นที่
- ทำ land due diligence pack
- rank hotel locales
- shortlist properties by criteria
- compare locations by risk, access, demand, population และ competition
- monitor risk zones และ alert เมื่อสถานการณ์เปลี่ยน


---

### 1.4 Which — ก่อนหน้านี้ผู้ใช้แก้ปัญหานี้ด้วยอะไร และข้อจำกัดคืออะไร

CityMETER ไม่ได้แข่งกับ “แผนที่” เพียงอย่างเดียว แต่แข่งกับทุกวิธีที่ผู้ใช้ใช้แก้ปัญหาการตัดสินใจเรื่องพื้นที่ในปัจจุบัน

#### Present competitors / current alternatives

| ทางเลือกที่ผู้ใช้ใช้จริง | ผู้ใช้ใช้เพื่ออะไร | จุดแข็ง | Gap ที่ CityMETER ต้องชนะ |
|---|---|---|---|
| ประสบการณ์ส่วนตัวและ network | ตัดสินใจเร็วจากความคุ้นเคย | เร็ว มีบริบทเชิงพื้นที่จริง | bias สูง เปรียบเทียบยาก อธิบายให้ stakeholder เชื่อได้ไม่พอ |
| Google Maps, Google Search, social media, field visit | ดูสภาพพื้นที่จริง ค้นหาสิ่งรอบตัว | เข้าถึงง่าย เห็นภาพปัจจุบัน | เห็นว่า “มีอะไร” แต่ไม่ชัดว่า “แปลว่าอะไรต่อการตัดสินใจ” |
| Excel, PDF, Shapefile, รายงานราชการ, open data | หา evidence และข้อมูลอ้างอิง | มีข้อมูลเชิงลึกและอาจน่าเชื่อถือ | กระจัดกระจาย ไม่ map-ready ไม่ decision-ready ใช้เวลามาก |
| Consultant, GIS team, feasibility study | วิเคราะห์เชิงลึกแบบ project-based | ละเอียด ปรับตามโจทย์ได้ | ต้นทุนสูง ใช้เวลานาน ใช้ซ้ำยาก มักจบเป็น report |
| BI dashboard / generic map platform | ดูตัวเลขหรือ spatial layer | จัดข้อมูลได้ดีในบางองค์กร | ไม่ได้ออกแบบเฉพาะบริบทเมืองไทย / Land-Location-Living / decision workflow ของผู้ใช้ |
| Internal local knowledge | ใช้ความรู้จากคนในพื้นที่ | มีบริบทท้องถิ่นสูง | ตรวจสอบยาก สื่อสารกับคนนอกยาก และไม่เป็นระบบสำหรับการตัดสินใจซ้ำ |
| LINE group, Facebook group, call center, forms | รับเรื่อง สื่อสาร หรือรวบรวมข้อมูลพื้นที่ | คนคุ้นเคย ใช้เร็ว | ไม่ structured, ไม่ map-linked, prioritize ยาก, feedback loop อ่อน |
| Generic AI / chatbot | ถามเร็ว สรุปเร็ว ช่วยคิดเบื้องต้น | ใช้ง่าย ตอบเป็นภาษา natural | ไม่ grounded กับ CityMETER data, spatial object, source, confidence, limitation และ action endpoint |
| Real-estate / travel / review portal | ค้น property, hotel, POI, review, listing | มี inventory และ demand สูง | มักแยกจาก risk, land, public service, flood, population และ local context หลาย layer |

#### Aspirational competitors / quality benchmarks

CityMETER ควรใช้ aspirational competitors เป็น **quality benchmark** ไม่ใช่เพียงรายชื่อคู่แข่ง

| Benchmark type | สิ่งที่ควรเรียนรู้หรือเทียบให้ถึง |
|---|---|
| Global geospatial / map platform | map UX, layer management, performance, annotation, export-ready workflow |
| Real estate / location intelligence platform | site comparison, catchment analysis, demand signal, stakeholder-ready output |
| Risk intelligence / insurance model | risk communication, source clarity, uncertainty note, portfolio-level decision support |
| Mobility / foot traffic analytics platform | movement pattern, temporal comparison, persona/context interpretation |
| Government open-data portal ที่ดี | metadata, source transparency, public trust, reproducibility, limitation note |
| AI-native decision platform | recommendation ที่ grounded กับ data source, method, assumption, confidence และ next action |
| Programmable API / agent tool platform | structured output, stable schema, action endpoint, exportable brief, logging และ feedback loop |

**Expected quality bar for CityMETER**

CityMETER ต้องให้คุณภาพที่ดีขึ้นใน 7 เรื่อง:

1. **Map-readiness** — เปิดดูและเข้าใจ spatial pattern ได้ทันที
2. **Decision-readiness** — ไม่ใช่แค่มีข้อมูล แต่บอกได้ว่าควรใช้ตัดสินใจอะไร
3. **Source clarity** — รู้แหล่งข้อมูล วิธีคำนวณ และข้อจำกัด
4. **Comparability** — เปรียบเทียบพื้นที่ได้เป็นระบบ
5. **Actionability** — มี next step ที่ชัด
6. **Multi-layer context** — เชื่อม Land, Location, Living ได้
7. **Communication quality** — ใช้สื่อสารกับ stakeholder ได้ ไม่ใช่ใช้เฉพาะในทีม data
8. **Search / LLM discoverability** — ถูกค้นพบและอ้างอิงได้ด้วยโครงสร้างเนื้อหาที่อ่านง่าย
9. **Agent callability** — มี structured output ที่ agent ใช้ compare, shortlist, alert หรือ generate report ต่อได้
10. **Learning loop potential** — มีช่องทางให้ feedback, correction, decision history หรือ outcome กลับมาพัฒนาระบบในอนาคต

---

### 1.5 How — CityMETER ชนะตรงไหน และต่อยอดอะไรได้บ้าง

CityMETER ชนะด้วยการเป็น **map-first spatial decision platform** ที่ถอด DNA ของ Landometer มาใช้กับข้อมูลเมืองโดยตรง: **Measure what matters. Make it actionable.**

#### Winning strategy

1. **Measure what matters, not everything**  
   CityMETER ไม่ควรทำให้ผู้ใช้จมกับข้อมูล แต่ต้องเลือกวัดสิ่งที่มีผลต่อ decision จริงของแต่ละ use case

2. **Make city data actionable on a map**  
   ทุก dataset ต้องถูกเล่าในฐานะ decision layer ที่ช่วยให้ผู้ใช้เห็น เปรียบเทียบ จัดลำดับ และลงมือ ไม่ใช่แค่ข้อมูลที่วางบนแผนที่

3. **Connect Land · Location · Living · Local Decisions**  
   จุดแข็งของ CityMETER คือการเห็นเมืองหลายมิติพร้อมกัน เช่น ที่ดิน + ทำเล + คน + ความเสี่ยง + บริการสาธารณะ

4. **Turn scattered data into shared spatial context**  
   CityMETER ทำให้ทีมธุรกิจ ทีมรัฐ ทีมท้องถิ่น และ stakeholder หลายฝ่ายคุยกันบนภาพพื้นที่เดียวกัน

5. **Be source-aware and limitation-aware**  
   CityMETER ต้องบอก source, method, calculation, inference และ limitation แบบสั้น กระชับ เพื่อสร้าง trust และลด overclaim

6. **Work across scales**  
   ใช้งานได้ตั้งแต่ระดับประเทศ จังหวัด อำเภอ ตำบล อปท. ย่าน พื้นที่รอบทำเล แปลงที่ดิน อาคาร จุดสนใจ และ grid/H3 เมื่อเหมาะสม

7. **Design for Search, LLM, and Agent from the beginning**  
   ทุก priority dataset ควรมี human page, answer block, structured data, metadata และ agent feed ที่สอดคล้องกัน ไม่ใช่ทำเป็นงานแยกภายหลัง

8. **Create ecosystem leverage**  
   CityMETER เป็น foundation ที่ต่อยอดไปยัง CityWiki, CityChat, ijji, land/property tools, LocationPOST, proposals, reports และ bespoke solutions ของ Landometer ได้

9. **Support action and learning, not one-off reports only**  
   เมื่อตัดสินใจแล้ว ระบบควรมีทางให้ save, watch, export, assign, broadcast, report outcome หรือ record decision reason เพื่อให้การใช้ข้อมูลรอบต่อไปดีขึ้น

#### Core advantage

> CityMETER ไม่ได้ขาย “แผนที่”  
> แต่ขายความสามารถในการเห็นเมืองเป็นระบบ วัดสิ่งสำคัญของพื้นที่จริง และตัดสินใจด้วยหลักฐานที่ใช้ต่อได้

#### Positioning summary

**CityMETER is Landometer’s map-first urban data platform that turns Land, Location, Living, and Local Decisions data into spatial decision layers.**  
It helps businesses, governments, local organizations, and analysts see what matters in every place, understand the source and limitation of the data, compare alternatives, prioritize action, and make better decisions about where to invest, build, expand, protect, and act first.

ภาษาไทยแบบสั้น:

> **CityMETER คือแพลตฟอร์มข้อมูลเมืองของ Landometer ที่ช่วยให้ผู้ใช้เห็น วัด และตัดสินใจเรื่องพื้นที่ผ่านข้อมูล Land, Location, Living และ Local Decisions บนแผนที่เดียว พร้อมสื่อสารที่มาข้อมูล วิธีคำนวณ และข้อจำกัดอย่างชัดเจน**

---

### 1.6 Dataset Product Statement Template & Guideline

ส่วนนี้ใช้เป็น **template และ guideline สำหรับร่าง Product Statement ของแต่ละ dataset ที่จะแสดงใน CityMETER** ในอนาคต เช่น Flood: Recurrent, Flood: Recent, Earthquake, Building, Population, Hospital, School, POI, Venue Locale, Road/Transit, Public Service, Hazard Event หรือ dataset เฉพาะอุตสาหกรรมอื่น ๆ

หัวข้อนี้ถูกวางเป็น subsection ภายใต้ **1. Product Statement** เพื่อให้เอกสารยังคงโครงสร้างหลักแบบเดียวกับ Product Brief ของ product อื่นใน Landometer ecosystem โดยไม่เพิ่มหัวข้อหลักใหม่

#### 1.6.1 Purpose of Dataset Product Statement

Dataset Product Statement ไม่ใช่ data dictionary และไม่ใช่ technical specification แต่เป็นเอกสารที่ทำให้ทีม product, data, sales, marketing และ implementation เข้าใจตรงกันว่า dataset นี้เป็น **decision layer** ที่ช่วยให้ผู้ใช้ตัดสินใจเรื่องพื้นที่ได้ดีขึ้นอย่างไร

ต้องตอบให้ได้ชัดว่า:

- dataset นี้มีจุดเด่นเฉพาะอะไรที่ dataset อื่นใน CityMETER หรือทางเลือกอื่นยังให้ไม่ได้
- dataset นี้ช่วยใคร และช่วยในสถานการณ์ตัดสินใจแบบไหน
- ผู้ใช้มี **functional needs** และ **emotional needs** อะไร
- เสียงในหัวหรือ trigger อะไรทำให้ผู้ใช้เริ่มอยากเปิด dataset นี้
- dataset นี้แสดงข้อมูลอะไร แหล่งข้อมูลคืออะไร และมีข้อจำกัดอะไร
- metric ใดเป็นข้อมูลดิบ metric ใดเป็นค่าคำนวณ และ insight ใดเป็นการ infer
- ผู้ใช้เคยใช้ทางเลือกใดแก้ปัญหานี้ ทั้งทางเลือกที่มีอยู่จริงในตลาด และทางเลือก aspirational ที่ใช้เป็น benchmark คุณภาพ
- CityMETER ทำให้ dataset นี้มีคุณค่ามากขึ้นอย่างไร
- เมื่อนำไปดูบนแผนที่แล้วควรนำไปสู่ decision หรือ action แบบใด

**หลักคิดสำคัญ**

> Every dataset in CityMETER should not be presented as “data we have.”  
> It should be presented as “a decision layer that helps users see, compare, prioritize, and act with confidence.”

ภาษาไทย:

> ทุก dataset ใน CityMETER ไม่ควรถูกเล่าว่า “เรามีข้อมูลอะไร” เท่านั้น  
> แต่ต้องเล่าว่า “ข้อมูลนี้ช่วยให้ผู้ใช้ตัดสินใจเรื่องพื้นที่ได้ดีขึ้นอย่างไร และทำไม dataset นี้จึงควรมีอยู่ใน CityMETER”

---

#### 1.6.2 Standard Dataset Product Statement Structure

ทุก dataset ควรใช้โครงเดียวกัน เพื่อให้ CityMETER มีภาษาการสื่อสารที่สม่ำเสมอ

```markdown
# Product Statement — CityMETER Dataset: [Dataset Name]

## 1) Highlight

[Dataset Name] คือ [คำอธิบายสั้น 1–2 ประโยค] ที่ช่วยให้ [กลุ่มผู้ใช้หลัก] เห็น/เข้าใจ/ประเมิน [ปัญหาหรือบริบทเชิงพื้นที่] เพื่อ [decision หรือ action ที่ dataset นี้สนับสนุน]

จุดเด่นที่สุดของ dataset นี้คือ [unique advantage] ซึ่งช่วยให้ผู้ใช้เห็น [สิ่งที่ dataset อื่นใน CityMETER หรือทางเลือกในตลาดยังให้ไม่ได้ / ให้ได้ไม่ดีพอ]

## 2) Description

### 2.1 Who — ใครคือผู้ใช้ และปัญหาของพวกเขาคืออะไร

Dataset นี้ออกแบบมาสำหรับ [user groups] ที่ต้องตัดสินใจเรื่อง [decision context]

ให้ขยี้ผู้ใช้เป็น 4 ชั้นเสมอ:

1. **Functional needs** — ผู้ใช้ต้องทำงานอะไรให้สำเร็จ เช่น screen พื้นที่, ประเมินความเสี่ยง, จัดลำดับ priority, เปรียบเทียบทำเล, อธิบายเหตุผลให้ผู้บริหาร/ลูกค้า/ประชาชนเชื่อ
2. **Emotional needs** — ผู้ใช้รู้สึกขาดอะไรหรือกังวลอะไร เช่น กลัวตัดสินใจผิด, ไม่มั่นใจในข้อมูล, กลัวอธิบายไม่ได้, กลัวมองข้ามความเสี่ยง, อยากมีหลักฐานที่จับต้องได้
3. **Trigger / voice in head** — เหตุผลเริ่มต้นที่ทำให้ผู้ใช้อยากเปิด dataset นี้ เช่น “พื้นที่นี้เคยมีปัญหาจริงไหม?”, “ถ้าฉันเลือกผิด ใครจะรับผิดชอบ?”, “มีหลักฐานพอไหมที่จะเสนอผู้บริหาร?”, “ทำไมพื้นที่นี้ควรได้งบก่อนพื้นที่อื่น?”
4. **Value proposition** — dataset นี้ช่วยเติมสิ่งที่ผู้ใช้ขาดอย่างไร และทำให้เขาตัดสินใจมั่นใจขึ้นอย่างไร

### 2.2 What — dataset นี้แสดงอะไร และช่วยแก้ปัญหาอย่างไร

Dataset นี้แสดง [data elements / metrics / layers] บนแผนที่ เพื่อให้ผู้ใช้สามารถ [analyze / compare / screen / monitor / prioritize]

ควรระบุอย่างน้อย:

- แหล่งข้อมูล
- ช่วงเวลาของข้อมูล
- ระดับพื้นที่หรือ spatial granularity
- metric สำคัญ
- อะไรคือข้อมูลดิบ
- อะไรคือค่าคำนวณ
- อะไรคือ insight หรือ inference
- วิธีตีความเบื้องต้น
- ข้อจำกัดที่ควรระวัง
- layer หรือ dataset อื่นที่ควรใช้ประกอบ

ควรมี **Data Clarity Note** สั้น ๆ ในทุก dataset เช่น:

> Data Clarity: ข้อมูลหลักมาจาก [source]; metric หลักคำนวณจาก [method]; insight/ranking เป็นการ infer เพื่อช่วยจัดลำดับ ไม่ใช่ค่าความจริงสมบูรณ์ 100%

### 2.3 Which — ก่อนหน้านี้ผู้ใช้แก้ปัญหานี้ด้วยอะไร และข้อจำกัดคืออะไร

เลือก Which จากทางเลือกที่ผู้ใช้ใช้เพื่อแก้ **problem statement เดียวกับที่อธิบายใน What** ไม่ใช่เลือก competitor กว้าง ๆ ตามหมวดธุรกิจ

ควรระบุ 2 กลุ่ม:

1. **Present competitors / current alternatives**  
   ทางเลือกที่ผู้ใช้ใช้จริงในปัจจุบัน เช่น Google Maps, official report, PDF, Excel, shapefile, field survey, consultant, internal dashboard, GIS team, local knowledge, industry platform, data provider หรือ web portal ของหน่วยงานรัฐ

2. **Aspirational competitors / quality benchmarks**  
   ทางเลือกหรือมาตรฐานคุณภาพที่เราอยากเทียบให้ถึง แม้อาจไม่ใช่คู่แข่งตรงในตลาดไทย เช่น global best-in-class map platform, risk intelligence platform, mobility analytics platform, real estate intelligence platform, insurance risk model หรือ government open-data benchmark

สำหรับแต่ละ competitor ควรอธิบายสั้น ๆ ว่า:

- ผู้ใช้ใช้มันเพื่ออะไร
- จุดแข็งของทางเลือกนั้นคืออะไร
- gap ที่ยังแก้ pain ของผู้ใช้ไม่พอคืออะไร
- คุณภาพใดที่ dataset นี้ควรเทียบให้ถึงหรือชนะให้ได้ เช่น speed, spatial granularity, source clarity, actionability, UX, comparability, map-readiness, update frequency หรือ stakeholder communication

### 2.4 How — dataset นี้ชนะตรงไหน และต่อยอดอะไรได้บ้าง

Dataset นี้ชนะด้วยการ [differentiation] เช่น แสดงบนแผนที่ เปรียบเทียบหลายพื้นที่ได้เร็ว เชื่อมกับ layer อื่น สรุปเป็น ranking ได้ ใช้ทำ screening ได้ หรือใช้ติดตามสถานการณ์ได้

ต้องเชื่อมกลับไปที่ 3 เรื่อง:

1. **ชนะความกังวลของผู้ใช้** — dataset ช่วยให้ผู้ใช้มั่นใจขึ้น อธิบายได้ดีขึ้น หรือลดความเสี่ยงของการตัดสินใจอย่างไร
2. **ชนะทางเลือกเดิม** — dataset ทำสิ่งใดได้ดีกว่า Which เช่น เร็วกว่า เห็นเชิงพื้นที่กว่า รวมข้อมูลกว่า ใช้งานซ้ำได้กว่า หรือสื่อสารต่อได้ง่ายกว่า
3. **ชนะในระบบ CityMETER** — dataset นี้ต่อยอดกับ layer อื่นอย่างไร เพื่อสร้าง insight ที่ลึกกว่า dataset เดี่ยว

Dataset นี้ช่วยต่อยอดไปสู่ decision/action เช่น screen, prioritize, monitor, compare, assess risk, allocate resource, communicate with stakeholders, plan investment หรือ intervention
```

---

#### 1.6.3 Required Metadata Block

ทุก dataset ควรมี metadata block เพื่อให้ทีม product, data, sales, marketing, implementation และ AI agents เข้าใจตรงกัน

```yaml
dataset_id: ""
dataset_name_en: ""
dataset_name_th: ""
category: "Land | Location | Living"
outcome_layer: "Local Decisions"
status: "concept | prototype | beta | active | archived"

positioning:
  one_line_highlight: ""
  unique_advantage: ""
  unique_vs_other_citymeter_datasets: ""
  unique_vs_competitors: ""

users:
  primary_users:
    - ""
  decision_contexts:
    - ""
  functional_needs:
    - ""
  emotional_needs:
    - ""
  trigger_voice_in_head:
    - ""
  value_proposition: ""

competitor_landscape:
  present_competitors:
    - name: ""
      how_users_use_it: ""
      strength: ""
      gap: ""
  aspirational_competitors:
    - name: ""
      benchmark_quality: ""
      what_to_learn_or_match: ""
  expected_quality_bar:
    - ""

primary_decisions:
  - ""
primary_questions:
  - ""

channel_readiness:
  search:
    priority: "P0 | P1 | P2 | P3"
    target_queries:
      - ""
    required_page_blocks:
      - "title/meta"
      - "summary"
      - "map"
      - "HTML table"
      - "FAQ"
      - "source/limitation"
    schema_types:
      - "Dataset"
      - "Place"
      - "FAQPage"
  llm:
    priority: "P0 | P1 | P2 | P3"
    askable_questions:
      - ""
    answer_block: ""
    citation_note: ""
    freshness_note: ""
  agent:
    priority: "P0 | P1 | P2 | P3"
    actionability_score: 0
    possible_actions:
      - "compare_locations"
      - "generate_report"
      - "monitor_alert"
      - "shortlist"
      - "export"
    required_fields:
      - "location_id"
      - "lat"
      - "lon"
      - "confidence"
      - "last_updated"

primary_decision_actions:
  - "screen"
  - "compare"
  - "prioritize"
  - "monitor"
  - "export"

data_sources:
  - name: ""
    owner: ""
    url_or_reference: ""
    data_type: "raw | official | open | partner | derived | inferred"

spatial_granularity: "country | province | district | subdistrict | local authority | community | parcel | building | point | grid | H3 | locale"
temporal_coverage: ""
update_frequency: "real-time | daily | weekly | monthly | yearly | ad hoc | static"
last_updated: "YYYY-MM-DD"

key_metrics:
  - ""
visual_layers:
  - "choropleth"
  - "heatmap"
  - "point"
  - "polygon"
  - "timeline"
  - "ranking"
recommended_pairing_layers:
  - ""

data_transparency:
  raw_fields:
    - ""
  calculated_metrics:
    - ""
  inferred_outputs:
    - ""
  recommended_actions:
    - ""
  source_note: ""
  calculation_note: ""
  inference_note: ""
  confidence_note: ""
  limitation_summary: ""

known_limitations:
  - ""
methodology_note: ""
example_use_cases:
  - ""
owner_team: ""
last_reviewed: "YYYY-MM-DD"
```

---

#### 1.6.4 Dataset Data Clarity Rule

ทุก dataset ควรสื่อสารที่มาของข้อมูลให้สั้นและชัด โดยแยก 4 ชั้นเสมอเมื่อเกี่ยวข้อง

| Layer | ความหมาย | วิธีสื่อสารที่แนะนำ |
|---|---|---|
| Raw data | ข้อมูลต้นทางที่นำเข้ามา | “มาจากแหล่งข้อมูล...” |
| Calculated metric | ค่าที่ CityMETER คำนวณต่อจากข้อมูลต้นทาง | “คำนวณจาก...” |
| Inferred insight | ข้อสรุป คะแนน ranking หรือ classification ที่ตีความจากข้อมูล | “ประเมิน/จัดกลุ่มจาก...” |
| Recommended action | ข้อเสนอว่าควร screen, monitor, compare, avoid, visit หรือ export ต่อ | “ใช้เพื่อช่วยจัดลำดับ/ชี้ประเด็น ไม่ใช่คำสั่งแทนการตัดสินใจของผู้ใช้” |

หลักการคือ **บอกให้พอเข้าใจ ไม่ต้องอธิบายจนซับซ้อน** เพื่อให้ผู้ใช้รู้ว่าควรเชื่อ ใช้ และระวังข้อมูลอย่างไร

ตัวอย่าง format สั้น ๆ:

> **Source:** [ชื่อแหล่งข้อมูล], coverage [ช่วงเวลา/พื้นที่]  
> **Calculated:** [metric] คำนวณจาก [วิธีสั้น ๆ]  
> **Inferred:** [score/ranking/class] ใช้เพื่อช่วยจัดลำดับ ไม่ใช่ข้อสรุปแทนการสำรวจภาคสนาม  
> **Action:** ใช้เพื่อ [screen/compare/prioritize/monitor]  
> **Limitation:** [ข้อจำกัดสำคัญ 1 ข้อ]

---

#### 1.6.5 Dataset Naming Guideline

ชื่อ dataset ควรทำให้ผู้ใช้เข้าใจเร็วว่า dataset นี้เกี่ยวกับอะไร และใช้ตัดสินใจเรื่องใด

**Naming principles**

1. **สั้น ชัด และจำง่าย** — หลีกเลี่ยงชื่อที่ยาวเหมือนชื่อรายงานราชการ
2. **สะท้อน decision value** — ชื่อควรบอกว่า dataset ช่วยมอง risk, demand, access, competition, readiness หรือ opportunity แบบไหน
3. **รองรับทั้งภาษาอังกฤษและภาษาไทย** — ชื่อภาษาไทยต้องเป็นภาษาธรรมชาติ ไม่ใช่แปลตรงตัวจนแข็ง
4. **ใช้ colon เมื่อเป็น dataset family** — เช่น Flood: Recurrent, Flood: Recent, Transit: Road, Risk: Earthquake, Hotel: Location Intelligence
5. **หลีกเลี่ยงคำว่า “data” ถ้าไม่จำเป็น** — ให้ชื่อสื่อความหมายของ decision layer มากกว่า raw data

| Dataset family | English name | Thai working name | Decision meaning |
|---|---|---|---|
| Flood | Flood: Recurrent | น้ำท่วมซ้ำซาก | พื้นที่ที่เคยเกิดน้ำท่วมซ้ำหลายปี |
| Flood | Flood: Recent | น้ำท่วมล่าสุด | พื้นที่น้ำท่วมจากเหตุการณ์ล่าสุด |
| Flood | Flood: Forecasting | พื้นที่เฝ้าระวังน้ำท่วม | พื้นที่ที่ควรเตรียมรับมือตามสัญญาณคาดการณ์ |
| Disaster | Disaster Events | เหตุการณ์สาธารณภัย | เหตุการณ์ภัยพิบัติในพื้นที่จริง |
| Risk | Earthquake: ShakeMap | แผนที่แรงสั่นสะเทือน | ความรุนแรงของแรงสั่นสะเทือนในพื้นที่ |
| Building | Building Footprint | ข้อมูลอาคาร | ตำแหน่งและขอบเขตอาคาร |
| Population | Population Context | บริบทประชากร | จำนวนและโครงสร้างประชากรในพื้นที่ |
| Health | Hospital Access | การเข้าถึงโรงพยาบาล | ความพร้อมและระยะใกล้ไกลของบริการสาธารณสุข |
| Education | School Context | บริบทโรงเรียน | ตำแหน่งโรงเรียนและจำนวนผู้เรียนเมื่อมีข้อมูล |
| Location | Venue Locale | ทำเลประเภทอาคารรวมร้าน | อาคารหรือพื้นที่ที่มีร้านหลายร้านอยู่ร่วมกัน |
| Location | Locale Insight | อินไซต์ย่าน | persona, foot traffic, POI, demand และบริบทย่าน |
| Hotel | Hotel: Location Intelligence | ทำเลโรงแรมและการท่องเที่ยว | hotel density, compset, tourism catchment, seasonality |
| Transit | Transit: Road | บริบทถนนและการเข้าถึง | รูปแบบถนนที่มีผลต่อการเข้าถึงและ traffic |
| Land | Land / Deed / Parcel | ที่ดิน โฉนด และรูปแปลง | due diligence, ownership/transaction context, parcel screening |

---

#### 1.6.6 Writing Guideline for Dataset Product Statement

**Do**

- เริ่มจาก **unique value ของ dataset** ไม่ใช่ data source
- เขียน Highlight ให้ตอบว่า dataset นี้มีอะไรที่ dataset อื่นหรือ Which ยังให้ไม่ได้
- ขยี้ Who ให้เห็นทั้ง functional needs, emotional needs และ trigger voice in head
- เขียนให้เห็นว่า user รู้สึกขาดอะไรอยู่ และ dataset นี้เติมช่องว่างนั้นอย่างไร
- เลือก Which จากทางเลือกที่ผู้ใช้ใช้แก้ problem เดียวกันจริง ๆ
- ใส่ทั้ง present competitors และ aspirational competitors เพื่อกำหนด expected quality bar
- แยก raw data, calculated metric, inferred insight และ recommended action ให้ชัด
- ระบุ source, method, confidence และ limitation อย่างสั้น กระชับ ตรงไปตรงมา
- เชื่อม dataset นี้กับ layer อื่นใน CityMETER เมื่อเหมาะสม
- ระบุ Search / LLM / Agent use อย่างน้อยใน dataset ที่เป็น P0/P1
- ใช้ภาษาที่ทำให้เห็น action ต่อ เช่น screen, prioritize, monitor, compare, assess, allocate, protect, expand

**Don’t**

- อย่าเล่าว่า “เรามีข้อมูล...” โดยไม่บอกว่าช่วยตัดสินใจอะไร
- อย่าเขียน Who แบบรายชื่ออาชีพอย่างเดียวโดยไม่เห็น pain, need และ trigger
- อย่ามอง emotional needs เป็นเรื่องนุ่มนิ่ม ให้ถือเป็นเหตุผลสำคัญที่ทำให้ผู้ใช้เริ่มใช้งาน
- อย่าเลือก competitor จากหมวดสินค้าเท่านั้น ให้เลือกจากวิธีที่ผู้ใช้แก้ปัญหาจริง
- อย่าใส่ aspirational competitor เพื่ออวด ให้ใช้เพื่อกำหนด quality benchmark ที่ทีมต้องทำให้ถึง
- อย่าใช้ศัพท์เทคนิคเยอะโดยไม่มีคำแปลเชิง business หรือ policy
- อย่า overclaim ว่าข้อมูลแม่น 100%
- อย่าผสมข้อมูลดิบ ค่าคำนวณ และ inference เข้าด้วยกันโดยไม่บอกผู้ใช้
- อย่าซ่อน limitation ของข้อมูล
- อย่าทำให้ dataset ดูเหมือน raw GIS layer ที่ต้องให้ผู้เชี่ยวชาญตีความเอง
- อย่าทำ agent feed ที่ไม่มี confidence, last_updated, source หรือ limitation

---

#### 1.6.7 Dataset Product Statement Quality Checklist

| Checklist | Yes/No |
|---|---|
| Highlight บอก unique advantage ที่ dataset อื่นหรือ Which ยังให้ไม่ได้ |  |
| บอกได้ชัดว่า dataset นี้ช่วยใครและช่วยตัดสินใจเรื่องอะไร |  |
| Who มี functional needs ชัดเจน |  |
| Who มี emotional needs หรือความกังวลของผู้ใช้ชัดเจน |  |
| มี trigger voice in head ที่ทำให้เข้าใจว่า user เริ่มใช้งานเพราะอะไร |  |
| Value proposition เชื่อมกับสิ่งที่ผู้ใช้รู้สึกขาดอยู่ |  |
| อธิบาย data source, coverage, spatial granularity และ update frequency ได้ |  |
| แยก raw data, calculated metric และ inferred insight ได้ |  |
| มี source/method/limitation note แบบสั้น |  |
| Which เลือกจากทางเลือกที่ผู้ใช้ใช้แก้ problem เดียวกันจริง |  |
| มี present competitors หรือ current alternatives |  |
| มี aspirational competitors หรือ quality benchmark |  |
| อธิบาย gap และ expected quality bar ได้ |  |
| อธิบายได้ว่า CityMETER ทำให้ dataset นี้มีประโยชน์ขึ้นอย่างไร |  |
| เชื่อมกับ dataset/layer อื่นได้เมื่อจำเป็น |  |
| มี example use cases อย่างน้อย 3 ข้อ |  |
| สำหรับ P0/P1 มี Search page requirement |  |
| สำหรับ P0/P1 มี LLM askable question และ answer block |  |
| สำหรับ P0/P1 มี Agent feed/action endpoint idea |  |
| อ่านแล้วไม่เหมือน data dictionary |  |
| อ่านแล้วทีม sales/marketing ใช้ต่อได้ |  |

---

#### 1.6.8 Mini Example — Flood: Recurrent

ตัวอย่างนี้เป็น working example เพื่อให้เห็นรูปแบบการเขียน ไม่ใช่ final statement ของ dataset

```markdown
# Product Statement — CityMETER Dataset: Flood: Recurrent

## 1) Highlight

Flood: Recurrent หรือ “น้ำท่วมซ้ำซาก” คือ dataset ที่ช่วยให้ผู้ใช้เห็นประวัติพื้นที่ที่เคยเกิดน้ำท่วมซ้ำหลายปีบนแผนที่ เพื่อประเมินความเสี่ยงเชิงพื้นที่ก่อนตัดสินใจลงทุน พัฒนา ซื้อขาย วางแผนป้องกัน หรือจัดลำดับพื้นที่ที่ควรดูแลก่อน

จุดเด่นที่สุดของ dataset นี้คือการเปลี่ยนข้อมูลน้ำท่วมในอดีตให้เป็น **ภาพความเสี่ยงซ้ำซากที่เปรียบเทียบพื้นที่ได้** ไม่ใช่แค่ดูเหตุการณ์น้ำท่วมรายครั้งหรือข่าวย้อนหลังแบบกระจัดกระจาย

## 2) Description

### 2.1 Who — ใครคือผู้ใช้ และปัญหาของพวกเขาคืออะไร

Dataset นี้ออกแบบมาสำหรับผู้ที่ต้องประเมินความเสี่ยงของพื้นที่ เช่น บริษัทประกันภัย ธนาคาร เจ้าของธุรกิจ real estate developer หน่วยงานท้องถิ่น และประชาชนที่กำลังตัดสินใจซื้อที่ดิน สร้างบ้าน หรือย้ายที่อยู่อาศัย

**Functional needs**

- ต้องรู้ว่าพื้นที่ใดเคยท่วมซ้ำบ่อยแค่ไหน
- ต้องเปรียบเทียบหลายพื้นที่ได้เร็ว
- ต้องจัดลำดับพื้นที่เสี่ยงเพื่อ screen, avoid, price, insure, protect หรือ prioritize budget
- ต้องมีหลักฐานบนแผนที่สำหรับอธิบายให้ผู้บริหาร ลูกค้า ประชาชน หรือ partner เข้าใจ

**Emotional needs**

- กลัวตัดสินใจซื้อ/ปล่อยกู้/รับประกัน/ลงทุนผิดพื้นที่
- ไม่มั่นใจว่าข้อมูลจากความทรงจำ ข่าวเก่า หรือคำบอกเล่าครบพอ
- อยากมีหลักฐานที่อธิบายได้ง่าย ไม่ใช่แค่ “เคยได้ยินว่าท่วม”

**Trigger voice in head**

> “พื้นที่นี้วันที่ไปดูไม่ท่วม แต่ในอดีตเคยท่วมซ้ำจริงไหม?”  
> “ถ้าเลือกผิด ความเสียหายจะตกอยู่กับใคร?”

**Value proposition**

Flood: Recurrent ช่วยเติมช่องว่างระหว่าง “รู้สึกว่าพื้นที่นี้อาจเสี่ยง” กับ “เห็นหลักฐานเชิงพื้นที่ที่เปรียบเทียบและสื่อสารต่อได้”

### 2.2 What — dataset นี้แสดงอะไร และช่วยแก้ปัญหาอย่างไร

Dataset นี้แสดงพื้นที่ที่เคยเกิดน้ำท่วมในอดีต โดยสรุปเป็นตัวชี้วัด เช่น จำนวนปีที่เคยท่วม พื้นที่ที่เคยถูกน้ำท่วม และสัดส่วนพื้นที่ที่ได้รับผลกระทบ เพื่อให้ผู้ใช้เห็นทั้งความถี่และขนาดผลกระทบของน้ำท่วมในแต่ละพื้นที่

**Data Clarity Note**

- **Raw data:** ขอบเขตพื้นที่น้ำท่วมรายปีจากแหล่งข้อมูลต้นทาง
- **Calculated metric:** จำนวนปีที่เคยท่วม พื้นที่น้ำท่วม และสัดส่วนพื้นที่ที่ได้รับผลกระทบ
- **Inferred insight:** ระดับความเสี่ยงหรือ ranking ใช้เพื่อช่วยจัดลำดับพื้นที่ ไม่ใช่การคาดการณ์น้ำท่วมแบบ real-time
- **Limitation:** ความแม่นยำขึ้นกับคุณภาพ ขอบเขต และช่วงเวลาของข้อมูลต้นทาง และควรใช้ร่วมกับข้อมูลพื้นที่จริงเมื่อมีการตัดสินใจมูลค่าสูง

### 2.3 Which — ก่อนหน้านี้ผู้ใช้แก้ปัญหานี้ด้วยอะไร และข้อจำกัดคืออะไร

**Present competitors / current alternatives**

- ข่าวเก่าและ social media post: เห็นเหตุการณ์จริง แต่ค้นย้อนหลังยาก กระจัดกระจาย และเปรียบเทียบหลายพื้นที่ไม่ได้
- รายงาน PDF หรือข้อมูลจากหน่วยงานรัฐ: น่าเชื่อถือ แต่หลายครั้งไม่ได้อยู่ในรูปแบบ map-ready หรือ decision-ready
- Google Maps / Street View / การลงพื้นที่: เห็นสภาพปัจจุบัน แต่ไม่บอกประวัติน้ำท่วมซ้ำหลายปี
- คำบอกเล่าของคนในพื้นที่: มีบริบทท้องถิ่นสูง แต่ตรวจสอบและสื่อสารกับ stakeholder ภายนอกได้ยาก
- consultant หรือทีม GIS เฉพาะกิจ: ทำได้ละเอียด แต่ใช้เวลานาน ต้นทุนสูง และไม่เหมาะกับการ screen หลายพื้นที่อย่างต่อเนื่อง

**Aspirational competitors / quality benchmarks**

- global flood risk platform: benchmark ด้านการสื่อสาร risk, map UX, scenario comparison และความชัดเจนของ limitation
- insurance / banking risk model: benchmark ด้านการแปลงข้อมูล hazard ให้เป็น decision layer ที่ใช้ประเมิน portfolio หรือ asset risk ได้
- government open-data portal ที่ดี: benchmark ด้าน source transparency, metadata, coverage และการตรวจสอบย้อนกลับ

### 2.4 How — dataset นี้ชนะตรงไหน และต่อยอดอะไรได้บ้าง

Flood: Recurrent ชนะด้วยการทำให้ประวัติน้ำท่วมที่เคยกระจัดกระจาย กลายเป็น layer บนแผนที่ที่เปรียบเทียบพื้นที่ได้เร็ว อ่านง่าย และเชื่อมกับข้อมูลอื่นใน CityMETER ได้

- **ชนะความกังวลของผู้ใช้:** ลดความไม่มั่นใจว่า “พื้นที่นี้เคยเสี่ยงจริงไหม” ด้วยหลักฐานเชิงพื้นที่ที่สื่อสารต่อได้
- **ชนะทางเลือกเดิม:** เร็วกว่าการค้นข่าวย้อนหลัง ชัดกว่าคำบอกเล่า และใช้งานซ้ำได้มากกว่า report เฉพาะกิจ
- **ชนะในระบบ CityMETER:** เมื่อนำไปจับคู่กับ Building, Population, Hospital, School, Road หรือ Property layer จะช่วยเห็นว่าใคร อะไร หรือ asset ใดอยู่ในพื้นที่เสี่ยงซ้ำซาก
```

---

### 1.7 Priority Dataset & Channel Strategy

ส่วนนี้ไม่ใช่ GTM plan ละเอียด แต่เป็น product priority ที่ควรรู้ใน Product Brief เพื่อให้ dataset, landing page, API และ agent feed ถูกออกแบบสอดคล้องกันตั้งแต่ต้น

#### 1.7.1 Channel Priority Matrix

| Topic Cluster | Search Priority | LLM Priority | Agent Priority | Overall Priority | Product implication |
|---|---|---|---|---|---|
| **Hotel / Tourism / ที่พัก** | P0 | P0 | P0 | **P0 ทำก่อนสุด** | ทำ Hotel Location Landing Page, compset, seasonality, tourism catchment, hotel density, rank hotel locales |
| **Land / Deed / Parcel** | P0 | P0/P1 | P1 | **P0** | ทำ land/deed/parcel due diligence page และ report endpoint |
| **Flood / PM2.5 / Environment Risk** | P0 | P1 | P0/P1 | **P0** | ทำ flood recurrent/recent/forecasting + risk summary + alert-ready feed |
| **Property / Condo / Residential RE** | P0/P1 | P0 | P0 | **P0** | ทำ property/location comparison, where-to-live, shortlist/export |
| **Food / Lifestyle / POI / Locale Insight** | P1 | P0 | P1 | **P1 แต่ควรทำเร็วใน Locale Insight** | ทำ amenity density, persona flow, time-of-day recommendations, local business context |
| **Commute / Transit / Walkability** | P1 | P1 | P1 | **P1** | ทำ road archetype, travel-time matrix, commute profile |
| **Population / Demographics** | P1/P2 | P1 | P2 | **P1 เป็น standard block** | ไม่จำเป็นต้องเริ่มเป็น standalone page เสมอ แต่ควรอยู่ในทุก location insight |
| **Schools / Healthcare / Family Livability** | P2 | P1/P2 | P2 | **P2** | ทำเมื่อ data/source governance พร้อม เริ่มเป็น section ใน locale page ก่อน |
| **Cost of Living / Jobs / Income** | P2 | P1/P2 | P2 | **P2** | ทำหลัง enrich rent/income/employment/spend dataset |
| **Safety / Crime / Noise** | P3 | P2/P3 | P3 | **P3** | ทำเฉพาะ risk-limited summary พร้อม governance, source limitation และ anti-stigmatization rule |

#### 1.7.2 Search-first Requirements

Search-first pages ทำเพื่อให้ข้อมูล CityMETER ถูกค้นเจอผ่าน Google และ long-tail keywords

ควรมี:

- URL ที่อ่านง่ายและมีพื้นที่ เช่น `/citymeter/th/flood/bangkok/bang-na`
- title/meta ที่ชัด เช่น `ข้อมูลน้ำท่วมซ้ำซาก เขตบางนา กรุงเทพมหานคร`
- HTML table ที่ search engine อ่านได้
- FAQPage schema สำหรับคำถาม keyword-based
- map หรือ static map preview
- source, coverage, last updated, limitation
- internal links ไปยัง related datasets และ related locations

#### 1.7.3 LLM-first Requirements

LLM-first pages ทำเพื่อให้ AI answer engines อ่านแล้วอ้างอิงหรือ paraphrase ได้อย่างปลอดภัย

ควรมี:

- หัวข้อเป็นคำถามจริง เช่น `พื้นที่นี้น้ำท่วมซ้ำซากไหม`, `ทำเลนี้เหมาะทำโรงแรมระดับไหน`, `ย่านนี้เหมาะเปิดร้านอาหารไหม`
- answer block 5–8 บรรทัด ที่สรุป signal → meaning → action → limitation
- source + freshness + limitation ชัดเจน
- FAQ ที่ตอบคำถามต่อเนื่อง
- `llms.txt` และ sitemap สำหรับ Askable Pages
- ไม่ใส่ข้อความฟันธงเกิน source

#### 1.7.4 Agent-first Requirements

Agent-first feeds ทำเพื่อให้ AI agent เรียกใช้เป็น tool ไม่ใช่แค่ crawl หน้าเว็บ

ควรมี:

- field สม่ำเสมอ เช่น `location_id`, `location_name`, `lat`, `lon`, `admin_area`, `risk_score`, `hotel_density`, `traffic_persona`, `parcel_count`, `flood_year_count`, `confidence`, `source`, `last_updated`
- endpoint/action เช่น `compare_locations`, `generate_due_diligence_report`, `get_alert_zones`, `shortlist_properties`, `rank_hotel_locales`
- output ที่ export ต่อได้ เช่น Markdown brief, CSV, PDF, shareable URL
- server logs / API calls / export count เพื่อวัด real usage
- confidence และ limitation ใน payload ไม่ใช่แค่ในหน้าเว็บ

---

## 2. Brand DNA

### 2.1 Brand Essence

**Measure What Matters. Make It Actionable.**

CityMETER คือการนำ brand essence ของ Landometer มาใช้กับข้อมูลเมืองอย่างชัดที่สุด: เมืองและพื้นที่จะตัดสินใจได้ดีขึ้น เมื่อสิ่งสำคัญในพื้นที่จริงถูกทำให้ **มองเห็น วัดได้ เข้าใจได้ และนำไปลงมือได้**

สำหรับ CityMETER ประโยคนี้หมายถึง:

- **Measure** — ทำให้บริบทเมืองที่เคยกระจัดกระจาย วัดยาก หรืออยู่คนละแหล่ง กลายเป็นข้อมูลที่จับต้องได้บนแผนที่
- **What Matters** — ไม่วัดทุกอย่างเพื่อความเยอะ แต่วัดสิ่งที่ส่งผลต่อการตัดสินใจจริง เช่น ความเสี่ยง ศักยภาพ demand access competition public service และ impact ต่อผู้คน
- **Make It Actionable** — ไม่หยุดที่ visualization แต่ช่วยให้ผู้ใช้รู้ว่าควร screen, compare, prioritize, protect, expand หรือ act อย่างไรต่อ

---

### 2.2 Brand Purpose

**ทำให้ข้อมูลเมืองและพื้นที่จริงกลายเป็นพลังในการตัดสินใจที่ดีขึ้น**

CityMETER ต้องการให้ธุรกิจ หน่วยงานรัฐ ท้องถิ่น และทีมวิเคราะห์เข้าถึงข้อมูลเมืองที่ใช้ตัดสินใจได้จริง ไม่ใช่ข้อมูลที่กระจัดกระจาย เข้าใจยาก หรืออยู่เฉพาะในมือผู้เชี่ยวชาญ

---

### 2.3 Brand Promise

**CityMETER ช่วยให้ผู้ใช้เห็นสิ่งสำคัญของแต่ละพื้นที่ เข้าใจที่มาของข้อมูล และตัดสินใจได้ว่าจะทำอะไรต่อ**

CityMETER สัญญาว่าจะไม่ทิ้งผู้ใช้ไว้กับ raw data, map layer หรือ dashboard ที่ดูดีแต่ใช้ต่อยาก แต่จะเปลี่ยนข้อมูลให้เป็นภาพ ความหมาย comparison, priority, decision และ action ที่เหมาะกับงานของผู้ใช้จริง

---

### 2.3A Brand Stack Translation

#### Mission / North Star — Visualize City, Shape Tomorrow.

CityMETER เป็น product ที่ทำให้ mission นี้จับต้องได้โดยตรง: ถ้าเรามองเห็นเมืองชัดขึ้น เราจะออกแบบ ตัดสินใจ และลงทุนกับอนาคตของเมืองได้ดีขึ้น

#### Territory / Scope — Land · Location · Living · Local Decisions

CityMETER คือพื้นที่ที่ Land, Location และ Living มารวมกันเป็น platform เดียว และถูกแปลงเป็น Local Decisions ที่ชัดเจน

- **Land** — ที่ดิน สินทรัพย์ ผังเมือง ขอบเขต สิทธิ ข้อจำกัด ความเสี่ยง และศักยภาพ
- **Location** — ทำเล การเข้าถึง traffic persona demand competition catchment และโอกาสทางธุรกิจ
- **Living** — คน ชุมชน บริการสาธารณะ ความปลอดภัย ภัยพิบัติ คุณภาพชีวิต และผลกระทบจริงต่อผู้ใช้พื้นที่
- **Local Decisions** — การเลือก ลงทุน ป้องกัน จัดลำดับ ลงมือ สื่อสาร และเรียนรู้จากผลลัพธ์ในพื้นที่จริง

#### Promise / Method — Measure What Matters. Make It Actionable.

CityMETER ต้องแปลงแต่ละ dataset ให้เป็นสิ่งที่วัดได้ เข้าใจได้ และนำไปตัดสินใจได้ ไม่ใช่แค่เป็นข้อมูลที่ “มีอยู่”

#### Culture / Rally Cry — Let us cultivate our city with data.

CityMETER ควรทำให้ข้อมูลเมืองเป็นเหมือนเครื่องมือเพาะปลูก: ค่อย ๆ ทำให้การตัดสินใจเรื่องพื้นที่ดีขึ้น โปร่งใสขึ้น และรับผิดชอบต่อเมืองมากขึ้นทีละรอบ

---

### 2.4 Brand Belief

1. **Every place has context.**  
   ไม่มีที่ดิน ทำเล หรือเมืองใดเป็นแค่จุดบนแผนที่ ทุกพื้นที่มีบริบท คน ความเสี่ยง โอกาส ข้อจำกัด และเรื่องราวของตัวเอง

2. **Meaningful data must be usable.**  
   ข้อมูลที่ดีไม่ใช่ข้อมูลที่เยอะที่สุด แต่คือข้อมูลที่ช่วยให้ผู้ใช้เข้าใจและตัดสินใจได้จริง

3. **Maps should reveal meaning, not just location.**  
   แผนที่ของ CityMETER ต้องช่วยให้ผู้ใช้เห็น pattern, relationship, priority และ action ไม่ใช่แค่ตำแหน่ง

4. **Better spatial decisions create better cities.**  
   การตัดสินใจเรื่องที่ดิน ทำเล ธุรกิจ บริการสาธารณะ และความเสี่ยงส่งผลต่อเมืองเสมอ เมื่อตัดสินใจดีขึ้น เมืองก็ดีขึ้น

5. **Local intelligence should not be limited to large organizations.**  
   ไม่ใช่แค่บริษัทใหญ่หรือรัฐขนาดใหญ่เท่านั้นที่ควรเข้าถึง city intelligence ท้องถิ่น ธุรกิจขนาดกลาง-เล็ก และทีมปฏิบัติงานก็ควรใช้ข้อมูลเมืองได้

6. **Trust comes from source clarity.**  
   ข้อมูลที่น่าเชื่อถือไม่ใช่แค่ข้อมูลที่ดูสวย แต่ต้องบอกที่มา วิธีคำนวณ การ infer และข้อจำกัดได้ชัดพอให้ผู้ใช้ตัดสินใจอย่างรับผิดชอบ

---

### 2.5 Brand Personality

CityMETER ใช้ brand personality เดียวกับ Landometer: **Clear · Grounded · Energetic** แต่แสดงออกผ่าน map, dataset, spatial insight, source-aware communication และ decision workflow

#### Clear

CityMETER ทำเรื่องเมืองและข้อมูลที่ซับซ้อนให้ชัด เห็นภาพ และนำไปคุยต่อได้

**Behavior**

- ใช้แผนที่ chart card และข้อความที่สื่อสารง่าย
- แยกให้ชัดว่าอะไรคือ raw data, calculated metric, inferred insight และ recommended action
- บอกว่าอะไรมั่นใจ อะไรควรตรวจสอบเพิ่ม
- ทำให้ผู้ใช้เปิด map แล้วเข้าใจ pattern สำคัญได้เร็ว
- มี summary-first / detail-later: สรุปก่อน รายละเอียดค่อยเปิดดูเพิ่ม

#### Grounded

CityMETER อยู่กับข้อมูลจริง บริบทจริง พื้นที่จริง และข้อจำกัดจริง

**Behavior**

- บอก source, method, coverage, date, confidence และ limitation ในทุก claim สำคัญ
- ไม่พูดเกินกว่าข้อมูลรองรับ
- ระวัง dataset ที่เกี่ยวกับภัยพิบัติ ประชากร สุขภาพ โรงเรียน ความปลอดภัย และชุมชน
- ไม่ใช้ AI หรือ score แบบลอย ๆ โดยไม่มี explanation
- ไม่ทำให้คนหรือพื้นที่ถูกตีตราอย่างหยาบเกินไป

#### Energetic

CityMETER ต้องไม่จบที่การดูข้อมูล แต่ชวนผู้ใช้ไปต่อด้วย decision และ action ที่เหมาะสม

**Behavior**

- จบ insight ด้วย next step เช่น compare, screen, monitor, export, visit, investigate, assign, broadcast
- ทำให้ output ใช้ต่อได้ใน sales deck, proposal, policy memo, public communication หรือ operational planning
- สนับสนุน feedback loop เมื่อมีข้อมูลใหม่หรือการตัดสินใจรอบถัดไป
- ทำให้ผู้ใช้รู้สึกว่า “เริ่มดูและคุยต่อได้เลย” ไม่ใช่ “ต้องรอ data team ก่อน”

### 2.6 Brand Tension

CityMETER ต้องยืนอยู่ระหว่าง tension เหล่านี้ให้ดี

| Tension | สิ่งที่ต้องรักษาสมดุล |
|---|---|
| Data-rich vs Easy-to-use | ข้อมูลลึก แต่ต้องไม่ทำให้ผู้ใช้รู้สึกหนักหรือเริ่มไม่ถูก |
| Technical credibility vs Human communication | ต้องน่าเชื่อถือทาง data แต่พูดภาษาคนตัดสินใจจริง |
| Map beauty vs Decision clarity | แผนที่ต้องสวยพอใช้สื่อสาร แต่ insight ต้องชัดกว่า decorative design |
| Platform breadth vs Clear entry point | มีหลาย dataset ได้ แต่ผู้ใช้ต้องรู้ว่าจะเริ่มจาก layer ไหนและเพื่อ decision อะไร |
| Evidence-based vs Overconfidence | ใช้ข้อมูลช่วยตัดสินใจ แต่ไม่เคลมเกิน source, method และ limitation |
| National coverage vs Local relevance | ทำได้ทั้งประเทศ แต่ต้องยังมีความหมายกับพื้นที่ท้องถิ่นและ use case จริง |

---

## 3. Brand Voice

### 3.1 Voice Principle

**CityMETER speaks like a clear-minded city data partner: visual, grounded, source-aware, and action-oriented.**

ภาษาไทย:

> **พูดเหมือนคู่คิดด้านข้อมูลเมืองที่อ่านแผนที่ออก อธิบายตรง ใช้ได้จริง และรับผิดชอบต่อข้อมูล**

CityMETER ไม่ควรพูดเหมือนขาย software หรือ GIS tool อย่างเดียว แต่ควรพูดเหมือนคนที่ช่วยผู้ใช้ “อ่านเมืองออก” และตัดสินใจได้ดีขึ้น โดยไม่ปิดบังที่มาของข้อมูล วิธีคำนวณ การ infer และข้อจำกัดที่ควรรู้

---

### 3.2 Tone of Voice

#### ใช้โทนแบบ

- ชัดเจน แต่ไม่แข็ง
- มีหลักฐาน แต่ไม่เย็นชา
- ฉลาด แต่ไม่อวดฉลาด
- map-first แต่ไม่ technical เกินจำเป็น
- ชวนลงมือทำ ไม่ใช่แค่ชวนดูข้อมูล
- กล้าชี้ให้เห็นประเด็นสำคัญ แต่บอกข้อจำกัดตรงไปตรงมา
- อธิบาย source, method และ limitation แบบสั้น กระชับ

#### หลีกเลี่ยงโทนแบบ

- Data jargon หนักเกินไป
- ขายฝันเกินข้อมูล
- พูดเหมือน dashboard ทั่วไป
- ใช้คำว่า AI / smart / data platform แบบลอย ๆ โดยไม่โยงกับ dataset, method หรือ decision
- เคลมว่าแม่นยำ 100%
- ผสมข้อมูลดิบ ค่าคำนวณ และ inference โดยไม่บอกผู้ใช้
- ทำให้ผู้ใช้รู้สึกผิดที่ยังไม่ใช้ข้อมูล

---

### 3.3 Messaging Pillars

#### Pillar 1: See clearly

CityMETER ช่วยให้ผู้ใช้เห็นพื้นที่จริงอย่างชัดเจน ทั้งที่ดิน ทำเล คน ความเสี่ยง บริการสาธารณะ และโอกาส

**Sample message**

> ก่อนตัดสินใจเรื่องพื้นที่ ต้องเห็นพื้นที่ให้ครบกว่าที่ตาเห็น

#### Pillar 2: Understand context

CityMETER อธิบายว่าข้อมูลแต่ละ layer มีความหมายอย่างไร เชื่อมกันอย่างไร และมีข้อจำกัดอะไร

**Sample message**

> ข้อมูลเมืองจะมีค่าก็ต่อเมื่อช่วยให้เห็นบริบท ไม่ใช่แค่เห็นตัวเลข

#### Pillar 3: Decide with confidence

CityMETER เปลี่ยนข้อมูลหลาย layer ให้กลายเป็น comparison, priority, risk signal, opportunity signal และ decision support

**Sample message**

> ไม่ใช่แค่รู้ว่ามีอะไรอยู่ตรงนั้น แต่เข้าใจว่าพื้นที่นี้ควรอยู่ตรงไหนในลำดับการตัดสินใจ

#### Pillar 4: Act and learn

CityMETER ช่วยให้ insight ไปต่อเป็น action, export, alert, report, assign, broadcast หรือ learning loop ได้

**Sample message**

> ข้อมูลที่ดีควรช่วยให้ทีมรู้ว่าจะทำอะไรต่อ และเรียนรู้อะไรกลับมาจากการลงมือ

#### Pillar 5: Make source and limitation clear

CityMETER ต้องสื่อสาร source, method, calculation, inference, confidence และ limitation ให้เข้าใจง่าย เพื่อให้ผู้ใช้ใช้ข้อมูลอย่างมั่นใจและรับผิดชอบ

**Sample message**

> ทุก dataset ควรบอกได้ว่าอะไรคือข้อมูลต้นทาง อะไรคือค่าที่คำนวณ และอะไรคือข้อสรุปจากการตีความ

### 3.4 Messaging Architecture

#### Master Brand Layer

ใช้เมื่อต้องเชื่อม CityMETER กลับไปยัง Landometer

> Landometer helps measure what matters in real places and make it actionable.

#### Product Layer

ใช้เมื่อพูดถึง CityMETER ในฐานะ product

> CityMETER turns Land, Location, Living, and Local Decisions data into map-based decision layers.

#### Dataset Layer

ใช้เมื่อพูดถึง dataset เฉพาะ

> Flood: Recurrent helps users see where flooding has repeatedly happened, so they can screen, prioritize, and communicate spatial risk more clearly.

#### Channel Layer

ใช้เมื่อพูดถึง Search / LLM / Agent readiness

> CityMETER makes location insight searchable, askable, citable, and callable.

#### Proof Layer

ใช้เมื่อแสดง source, method, metric หรือ limitation

> Source: [data source]. Calculated from [method]. Ranking is an inferred signal for prioritization, not a real-time prediction.

---

### 3.5 Sample Key Messages

#### สำหรับ Real Estate Developer

> ก่อนซื้อที่ดินหรือพัฒนาโครงการ CityMETER ช่วยให้เห็นศักยภาพ ข้อจำกัด ความเสี่ยง และบริบทรอบพื้นที่ เพื่อให้การตัดสินใจใหญ่ไม่พึ่งแค่ความรู้สึกหรือข้อมูลจากแหล่งเดียว

#### สำหรับ Retail / Restaurant / Branch Expansion

> CityMETER ช่วยให้ธุรกิจเข้าใจว่าทำเลนี้เหมาะกับลูกค้ากลุ่มไหน แข่งกับใคร เข้าถึงยากง่ายแค่ไหน และมีความเสี่ยงอะไร ก่อนตัดสินใจเปิดสาขาใหม่

#### สำหรับ Insurance / Bank

> CityMETER ช่วยประเมินความเสี่ยงเชิงพื้นที่ เช่น น้ำท่วมซ้ำซาก อาคาร ประชากร และบริบทโดยรอบ เพื่อสนับสนุนการประเมินทรัพย์สิน หลักประกัน และ portfolio risk พร้อมบอก source และ limitation ของข้อมูลอย่างชัดเจน

#### สำหรับ Local Government

> CityMETER ช่วยให้ท้องถิ่นเห็นข้อมูลเมืองบนแผนที่เดียว ทั้งพื้นที่เสี่ยง ประชากร อาคาร โรงเรียน โรงพยาบาล และเหตุการณ์สาธารณภัย เพื่อวางแผน จัดลำดับความสำคัญ และสื่อสารกับประชาชนได้ดีขึ้น

#### สำหรับ Consultant / Analyst

> CityMETER ช่วยลดเวลาการเตรียมข้อมูล และทำให้ spatial analysis มี common reference ที่ตรวจสอบ source, method และ limitation ได้ เพื่อให้ทีมวิเคราะห์ไปถึง insight และ recommendation ได้เร็วขึ้น

#### สำหรับ Search / LLM / Agent

> CityMETER ทำให้ location insight ไม่ได้อยู่แค่ในแผนที่ แต่ถูกค้นเจอได้ อ่านโดย AI ได้ อ้างอิงที่มาได้ และเรียกใช้เป็น structured feed เพื่อสร้าง report, comparison, alert หรือ shortlist ต่อได้

---

### 3.6 Do / Don’t

#### Do

- เริ่มจาก decision problem ของผู้ใช้
- ใช้แผนที่เป็นตัวเล่าเรื่อง แต่ให้ insight เป็นจุดหมาย
- แสดงให้เห็นว่า data ช่วยตัดสินใจอะไร
- สื่อสาร functional needs และ emotional needs ของผู้ใช้
- บอก source, method และ limitation แบบสั้น
- แยก raw data, calculated metric, inferred insight และ recommendation
- ยก use case ชัดเจน
- จบด้วย next step หรือ action ที่ควรทำต่อ

#### Don’t

- อย่าพูดว่าเป็น data platform เฉย ๆ โดยไม่บอกว่าช่วยตัดสินใจอะไร
- อย่าใช้ศัพท์ GIS หนักเกินไปกับ audience ธุรกิจหรือท้องถิ่น
- อย่าขายว่าแม่น 100%
- อย่าทำให้ CityMETER ดูเป็นแค่ map viewer
- อย่าเล่าเฉพาะ feature จนลืม outcome
- อย่าซ่อนข้อจำกัดของข้อมูล
- อย่าสื่อสาร dataset เหมือน raw GIS layer ที่รอให้ผู้ใช้ตีความเอง

---

## 4. Visual Application — CityMETER under Landometer Visual Guide

### 4.1 Visual Principle

CityMETER ใช้ **Landometer Brand Visual Guidelines** เป็น visual system หลักทั้งหมด ทั้ง logo, color palette, typography, layout mood และ graphic elements

ดังนั้น CityMETER ไม่ควรถูกออกแบบให้ดูเป็นแบรนด์แยก แต่ควรถูกมองเป็น **product application ของ Landometer** ที่นำ visual identity เดียวกันมาใช้กับงาน map, data visualization, dashboard, product screenshot, sales deck และ social content

**Principle หลัก**

> CityMETER should look unmistakably Landometer — but expressed through maps, data layers, and spatial decision-making.

ภาษาไทย:

> CityMETER ต้องดูเป็น Landometer อย่างชัดเจน แต่เล่าผ่านแผนที่ ชั้นข้อมูล และการตัดสินใจเชิงพื้นที่

---

### 4.2 Visual DNA

CityMETER แสดง visual DNA ของ Landometer ผ่าน 5 แนวทาง

#### Map-first

แผนที่เป็น hero visual หลัก เพราะ CityMETER อ่านเมืองผ่านพื้นที่จริง

#### Layered

แสดงให้เห็นว่าเมืองไม่ได้มีมิติเดียว แต่เกิดจาก layer ของ Land, Location, Living และ Local Decisions ซ้อนกัน

#### Human-scale

แม้ข้อมูลจะใหญ่ระดับประเทศ ภาพและข้อความควรพาผู้ใช้กลับมาเห็นผลต่อพื้นที่จริง คนจริง ธุรกิจจริง และการตัดสินใจจริง

#### Evidence-based

ทุก visual ควรมี source / method / limitation note เมื่อจำเป็น เพื่อสร้าง trust และลดการ overclaim

#### Modular

ออกแบบ visual ให้ reusable ได้กับ dataset หลายชุด เช่น insight card, legend, ranking, timeline, comparison block และ decision summary

#### Action-first

ทุก primary visual ต้องตอบให้ได้ว่า signal นี้ควรนำไปสู่ action อะไร เช่น compare, screen, monitor, visit, export, alert หรือ assign

---

### 4.3 Brand System Relationship

| Layer | บทบาท |
|---|---|
| Landometer | Master brand / visual identity / trust anchor |
| CityMETER | Urban Data Platform / product experience / map-first data application |
| Dataset modules | เช่น Flood: Recurrent, Flood: Recent, Earthquake, POI, Population, Building |
| Use-case communication | เช่น site selection, flood risk, local planning, branch expansion |

ดังนั้นในงานสื่อสารควรใช้:

- **Landometer logo** เป็น brand anchor
- **CityMETER name** เป็น product name
- **Landometer color and typography system** เป็น visual foundation
- **Map/data visualization** เป็น product expression

ไม่ควรสร้าง CityMETER logo, palette หรือ font set แยกโดยไม่จำเป็น

---

### 4.4 Logo Usage

CityMETER ควรใช้ร่วมกับ **Landometer logo** ตาม guideline หลัก

หลักการใช้งาน:

- ให้ Landometer logo มีความชัดเจนในฐานะผู้พัฒนาและเจ้าของ platform
- ไม่ปรับสี logo เอง ยกเว้นกรณี grayscale ตาม guideline
- ไม่วาง logo ซ้อนกับ graphic หรือ map layer ที่ทำให้อ่านยาก
- ควรมี clear space รอบ logo
- ในเอกสาร sales / proposal / deck ให้ใช้รูปแบบ “CityMETER by Landometer” หรือ “Landometer presents CityMETER”

ตัวอย่าง wording:

> CityMETER by Landometer  
> Powered by Landometer’s urban data platform  
> A spatial intelligence platform by Landometer

---

### 4.5 Color Usage

#### Core Colors from Landometer Master Brand

| Token | Color | Role |
|---|---|---|
| `brand.blue` | `#1D4497` | trust, selected state, decision confidence |
| `brand.beige` | `#EFEFD0` | warm context, neutral midpoint |
| `surface.canvas` | `#F8F4E8` | main warm page background |
| `surface.card` | `#FFFCF4` | main card surface |
| `text.primary` | `#1E2230` | main readable text |
| `text.secondary` | `#5F635A` | secondary copy and metadata |
| `text.tertiary` | `#6F6A5D` | axes, legends, timestamps, token values |

#### Color Rules

- สีไม่ได้ใช้เพื่อความสวยอย่างเดียว ต้องช่วยให้ user ตัดสินใจดีขึ้น
- ห้ามใช้สีเป็น encoding เดียวของข้อมูลสำคัญ ต้องมี label, value, pattern, shape หรือ grouping
- ไม่ใช้ muted text สำหรับ metadata สำคัญ เช่น source, date, limitation
- สีแผนที่และ chart ต้องผ่าน contrast และ harmony check
- สี risk ต้องระวังไม่ให้สร้างความตื่นตระหนกเกินข้อมูล
- ใช้ palette ที่แยก risk / opportunity / selected / neutral ให้ชัด

### 4.6 Typography

| Role | Font direction |
|---|---|
| Logo / brand display | Arvo Bold |
| Thai heading | IBM Plex Sans Thai Looped Bold |
| Thai body | Bai Jamjuree Regular |
| English body / UI copy | Bai Jamjuree Regular / SemiBold |
| Technical labels / numbers | JetBrains Mono |

Numeric values must use tabular numbers where possible:

```css
.number,
.metric,
.table-number,
.legend-value,
.timestamp,
.coordinate,
.token,
.hex-code {
  font-family: "JetBrains Mono", "SFMono-Regular", "Roboto Mono", "Noto Sans Mono", monospace;
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

### 4.7 CityMETER Visual Expression

แม้ CityMETER ใช้ visual guide เดียวกับ Landometer แต่ควรมี **product expression** ที่จำง่าย

> **Map-first, data-layered, decision-ready, source-aware**

องค์ประกอบภาพหลักของ CityMETER ควรมี 6 แบบ

1. **Map Hero**  
   ใช้แผนที่เป็นภาพหลัก แสดงพื้นที่จริง layer จริง และ pattern ที่อ่านออก

2. **Data Layer Stack**  
   แสดงว่า CityMETER รวมข้อมูลหลายมิติ เช่น Land, Location, Living

3. **Insight Card**  
   แปลงข้อมูลบนแผนที่ให้เป็นข้อความที่ตัดสินใจได้ เช่น “พื้นที่นี้มีประวัติน้ำท่วมซ้ำซากสูงกว่าค่าเฉลี่ยจังหวัด”

4. **Ranking / Comparison**  
   ใช้เปรียบเทียบพื้นที่ ทำเล เขต จังหวัด หรือ asset หลายแห่ง

5. **Data Clarity Note**  
   แสดง source, calculated metric, inferred output และ limitation แบบสั้นเมื่อจำเป็น

6. **Decision Summary**  
   สรุปว่า insight นี้ควรนำไปสู่ action อะไร เช่น screen, prioritize, avoid, monitor, expand, protect

---

### 4.8 Data Visualization Rules for CityMETER

#### Map

- ใช้ tertiary palette เป็นหลักสำหรับ map layer
- ใช้สีไม่เกินจำเป็น เพื่อไม่ให้แผนที่รก
- ทุก map ต้องมี legend ที่อ่านง่าย
- ควรมี tooltip หรือ callout ที่แปลค่าข้อมูลเป็นภาษาคนตัดสินใจ
- ถ้าเป็น risk map ควรมี scale ที่ชัด เช่น Low / Medium / High / Very High
- หลีกเลี่ยงสีที่ทำให้ผู้ใช้ตีความผิด เช่น ใช้แดงกับข้อมูลที่ไม่ใช่ warning
- ควรมี source/method/limitation note เมื่อ map ถูกใช้เพื่อการตัดสินใจสำคัญ

#### Chart

- ใช้ tertiary palette สำหรับ category / series
- ใช้ Landometer Blue กับ key metric หรือ highlight
- ใช้ Beige / white / grayscale เป็น background เพื่อให้ data เด่น
- Chart ควรตอบคำถามเดียวให้ชัด ไม่ใส่ข้อมูลเยอะจนกลายเป็น report
- ถ้า chart มาจาก calculation หรือ inference ให้มี note สั้น ๆ กำกับ

#### Product Screenshot

- Screenshot ควรถูกวางใน Landometer frame
- ควรมี annotation / callout สั้น ๆ
- ไม่ควรใช้ raw screenshot ที่ดูรกโดยไม่มี hierarchy
- ควร crop ให้เห็น decision moment เช่น map + tooltip + summary card
- ควรมี caption ที่บอกว่า screenshot นี้ช่วยตัดสินใจอะไร

#### Dataset Card

ทุก dataset card ควรมีข้อมูลขั้นต่ำ:

- Dataset name
- One-line value
- Category: Land / Location / Living
- Best used for: screen / compare / prioritize / monitor / assess risk / plan
- Data clarity: source + calculated/inferred + limitation สั้น ๆ

---

### 4.9 Layout Direction

CityMETER layout ควรใช้หลัก

> **Decision problem → Map proof → Insight → Data clarity → Next action**

โครงที่เหมาะสำหรับ poster / deck / social post คือ:

1. Headline ที่บอก decision problem
2. Map หรือ visual proof
3. Insight card
4. Supporting metric
5. Data clarity note สั้น ๆ
6. CTA หรือ next step

ตัวอย่าง structure:

> ก่อนเปิดสาขาใหม่  
> ดูแค่จำนวนคนรอบทำเลอาจยังไม่พอ  
> CityMETER ช่วยให้เห็นทั้งลูกค้า คู่แข่ง การเข้าถึง และความเสี่ยงของพื้นที่  
> พร้อมระบุที่มาและข้อจำกัดของข้อมูล  
> เพื่อเลือกทำเลจากหลักฐาน ไม่ใช่ความรู้สึก

---

### 4.10 Visual Do / Don’t

#### Do

- ใช้ Landometer Blue และ Beige เป็น brand anchor
- ใช้ tertiary palette กับ maps/charts
- ใช้ Landometer typography ตาม guideline
- ทำให้ map อ่านง่ายก่อนสวย
- แปล data เป็น insight เสมอ
- ใช้ callout เพื่อชี้ pattern สำคัญ
- แสดง source / methodology / limitation note เมื่อจำเป็น
- ทำให้ screenshot มี decision message ไม่ใช่แค่ภาพระบบ

#### Don’t

- อย่าสร้าง CityMETER color palette แยกเอง
- อย่าทำ CityMETER logo ใหม่โดยไม่จำเป็น
- อย่าใช้สี map แบบ random
- อย่าให้ screenshot รกจนคนไม่เห็น insight
- อย่าใช้ dashboard visual ที่ดู generic จนไม่รู้ว่าเป็น Landometer
- อย่าใช้ gradient / color เยอะจนแย่งความสำคัญจาก data
- อย่าทำให้ CityMETER ดูเป็น GIS tool เฉพาะผู้เชี่ยวชาญเกินไป
- อย่าตัด source/method/limitation ออกเมื่อ visual ถูกใช้เพื่อประกอบ decision สำคัญ


---

## 5. AI / Agent Context Appendix

> Appendix นี้เพิ่มเพื่อให้ Product Brief ใช้เป็น context สำหรับ AI/agent ได้ดีขึ้น โดยยังคงโครงสร้างหลัก Product Statement → Brand DNA → Brand Voice → Brand Visual ไว้

### 5.1 AI Context Capsule

CityMETER is Landometer’s map-first city intelligence base layer. It turns Land, Location, and Living data into spatial decision layers for real-place decisions. It is not just a GIS tool, map viewer, dashboard, open-data portal, or AI wrapper. It helps users see, understand, compare, prioritize, act, and explain decisions about land, location, risk, public service, local business, hotel/tourism, and living context. CityMETER must always communicate source, method, confidence, limitation, and recommended next action when making important claims.

### 5.2 Role-specific AI Instructions

#### Strategy / Product

- Start from user decision, not dataset inventory
- Identify whether the use case is Search-first, LLM-first, Agent-first, or platform-first
- Keep Land / Location / Living as categories and Local Decisions as outcome
- Prefer P0 topics first: Hotel/Tourism, Land/Deed/Parcel, Flood/PM2.5/Environment Risk, Property/Residential
- Avoid overextending sensitive topics such as crime, safety, noise without governance

#### Data / Engineering

- Every dataset needs source, temporal coverage, spatial granularity, update frequency, last_updated, confidence, limitation
- Separate raw data, calculated metric, inferred insight, and recommended action
- Design stable IDs and fields for agent callability
- Use structured outputs that can support map, landing page, API, report, and AI answer block from one source

#### Design / UI

- Every map/card/chart must answer: what to notice, what it means, what to do next, what evidence supports it
- Use summary-first/detail-later
- Keep source and limitation visible near important claims
- Avoid dense first-view dashboards

#### Marketing / Content

- Use copy formula: user → decision → CityMETER helps → data/method → outcome → source/limitation
- Build askable pages and FAQ around real questions
- Make P0 landing pages searchable, citable, and shareable
- Do not use “AI” as a vague selling point; connect it to grounded CityMETER data and actions

#### Sales / Proposal

- Frame CityMETER as decision infrastructure, not just data subscription
- Show before/after: scattered data → map-based insight → decision/action
- Use source-aware proof points
- Tie CityMETER to the client’s actual workflow: screen, compare, prioritize, monitor, export, report, assign, broadcast

### 5.3 Final Operating Rule

> **CityMETER should make every important place easier to see, understand, compare, prioritize, act on, and explain — with source, method, confidence, and limitation clearly available.**
