# Location Intelligence Profile for LDS v0.9.7

**Separate optional profile · Human + Machine · standalone-0.9.7-r1**

ใช้คู่กับ `Landometer-Design-System-v0.9.7.md` ฉบับเต็ม สำหรับงาน Location Intelligence เท่านั้น กฎผลิตภัณฑ์ของ ijji, CityChat หรือ CityWiki ยังใช้ Add-on แยกตามงาน ไม่รวม profile นี้เป็นกฎธุรกิจของ LDS กลาง

This separate profile requires the complete LDS 0.9.7 base identified by the exact hash below. It contains 16 location roles, 12 quantitative recipes and four evidence-led SWOT lenses. It cannot establish source facts, official population, customer behaviour, statutory risk or permission to open a branch.

## Color and theme contract

ใช้ LIGHT HEX ต้นฉบับเดียวกันบนพื้นสว่างและมืด: anchors, 41-sample LUT, classes และ role accents ต้องไม่เปลี่ยน ค่าสูงของ sequential เข้มขึ้นในทั้งสองธีม ห้ามใช้สูตร dark ที่ทดลองไว้ ห้ามกลับทิศหรือปรับ opacity เพื่อเปลี่ยนค่าที่สื่อข้อมูล หาก contrast ไม่พอ ให้ปรับตัวอักษร เส้นแบ่ง หรือพื้นรองที่เป็นกลาง โดยคงสีข้อมูลเดิม

The prototype dark formula is superseded. Light and dark role HEX and numerical samples are identical, with the same data direction. This does not promise universal 3:1 fill contrast or sixteen color-only distinctions. Preserve full labels, units, denominators, signs, non-color markers and accessible values. The declared class thresholds must match the renderer, legend, table and export.

## Evidence and metric definitions

### li.demand — ความต้องการซื้อ / Demand

**ชนิด / Kind:** sequential · **หน่วย / Unit:** ครั้งซื้อ/เดือน ในหมวดธุรกิจที่กำหนด

**ตัวตั้ง / Numerator:** จำนวนโอกาสซื้อในหมวดที่เกี่ยวข้อง โดยประกาศส่วนที่สังเกตจริงและส่วนที่ประมาณ

**ตัวหาร / Denominator:** ช่วงเวลา 1 เดือน; ไม่ใช่ density และไม่หารประชากรโดยปริยาย

**ความหมาย / Meaning:** มีโอกาสซื้อรวมมากกว่า ไม่ได้ยืนยันยอดขายของสาขาใหม่

**ขอบเขตหลักฐาน / Evidence boundary:** POI ประชากร การเดินทางและ Locale Insight เป็นบริบท/proxy ได้ตามขอบเขต ไม่ใช่จำนวนลูกค้าจริง ต้องกำหนดธุรกิจ กลุ่มเป้าหมาย ช่วงเวลา และฐานข้อมูล

**ตัวช่วย / Cue:** DM / circle; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** แบบจำลองได้ 1,200 ครั้งซื้อ/เดือน โดยระบุหมวด พื้นที่ และสมมติฐานความถี่

### li.supply — กำลังให้บริการที่มีอยู่ / Supply

**ชนิด / Kind:** sequential · **หน่วย / Unit:** ครั้งให้บริการ/เดือน หรือหน่วยกำลังบริการที่เทียบ demand ได้

**ตัวตั้ง / Numerator:** กำลังให้บริการที่เปิดดำเนินงานจริง แยก own/competitor/unknown และระบุการประมาณกำลัง

**ตัวหาร / Denominator:** ช่วงเวลาเดียวกับ demand; ไม่ใช่จำนวนร้านอย่างเดียว

**ความหมาย / Meaning:** มีทางเลือกหรือกำลังบริการมากกว่า ไม่ได้แปลว่าแข่งรุนแรงกว่าเสมอ

**ขอบเขตหลักฐาน / Evidence boundary:** จำนวน POI ไม่ยืนยัน capacity, utilization หรือ market share; ต้องจัดการร้านปิด ร้านซ้ำ หลายผู้เช่าและแบรนด์ที่ไม่ทราบ

**ตัวช่วย / Cue:** SP / square; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ตรวจร้านและประมาณกำลังรวม 900 ครั้งให้บริการ/เดือน; ถ้ามีเพียง 9 POIs ให้เรียกว่า 9 จุดบริการ

### li.market_size — ขนาดตลาด / Market size

**ชนิด / Kind:** sequential · **หน่วย / Unit:** บาท/เดือน หรือสกุลเงิน/ช่วงเวลาที่ระบุ

**ตัวตั้ง / Numerator:** ยอดใช้จ่ายรวมในหมวดและขอบเขตที่กำหนด; หากประมาณใช้จำนวนโอกาสซื้อ × ค่าใช้จ่ายต่อครั้งที่มีหลักฐาน

**ตัวหาร / Denominator:** ช่วงเวลาเดียวกัน และ market definition เดียวกัน

**ความหมาย / Meaning:** มูลค่าตลาดรวมสูงกว่า ไม่ใช่รายได้ที่สาขาใหม่จะได้

**ขอบเขตหลักฐาน / Evidence boundary:** แยก total/serviceable/obtainable market; รายได้ทั่วไปหรือประชากรไม่ได้เป็น market size โดยตรง และ catchment ซ้อนทับต้องไม่บวกซ้ำ

**ตัวช่วย / Cue:** MS / hexagon; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** 1,200 ครั้งซื้อ/เดือน × 300 บาท/ครั้ง = ตลาดประมาณ 360,000 บาท/เดือน

### li.strength — จุดแข็ง / Strength

**ชนิด / Kind:** none · **หน่วย / Unit:** รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ

**ตัวตั้ง / Numerator:** Not applicable: evidence lens

**ตัวหาร / Denominator:** Not applicable: evidence lens

**ความหมาย / Meaning:** ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability

**ขอบเขตหลักฐาน / Evidence boundary:** SWOT เป็น lens ไม่ใช่ตัวแปรที่มีหน่วยโดยธรรมชาติ ต้องมี business strategy/cohort และหลักฐาน; ถ้าไม่มี rubric ให้ใช้รายการข้อความ ไม่สร้าง gradient

**ตัวช่วย / Cue:** ST / cross; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ตัวอย่างสมมติ: พื้นที่หน้าร้านของกิจการเอื้อต่อรูปแบบบริการที่กำหนด มีหลักฐานตรวจพื้นที่

### li.weakness — จุดอ่อน / Weakness

**ชนิด / Kind:** none · **หน่วย / Unit:** รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ

**ตัวตั้ง / Numerator:** Not applicable: evidence lens

**ตัวหาร / Denominator:** Not applicable: evidence lens

**ความหมาย / Meaning:** ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability

**ขอบเขตหลักฐาน / Evidence boundary:** ไม่ถือว่า weakness = 100 − strength; ใช้คนละชุดหลักฐานได้ และต้องไม่ยกระดับ missing ให้เป็นจุดอ่อนจริง

**ตัวช่วย / Cue:** WK / triangle; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ตัวอย่างสมมติ: เวลาให้บริการปัจจุบันไม่ครอบคลุมช่วงที่ตั้งเป้า ยังต้องตรวจ staffing constraint

### li.opportunity — โอกาสภายนอก / Opportunity

**ชนิด / Kind:** none · **หน่วย / Unit:** รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ

**ตัวตั้ง / Numerator:** Not applicable: evidence lens

**ตัวหาร / Denominator:** Not applicable: evidence lens

**ความหมาย / Meaning:** ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability

**ขอบเขตหลักฐาน / Evidence boundary:** บริการน้อยไม่ยืนยัน unmet demand; แผนโครงการในอนาคตไม่เท่ากับเปิดจริง ต้องแยก observed/proxy/hypothesis และ next validation

**ตัวช่วย / Cue:** OP / diamond; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ตัวอย่างสมมติ: พบความต้องการบริการบางช่วงที่ยังรองรับไม่พอ เป็น hypothesis รอ field validation

### li.threat — ภัยคุกคามต่อธุรกิจ / Threat

**ชนิด / Kind:** none · **หน่วย / Unit:** รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ

**ตัวตั้ง / Numerator:** Not applicable: evidence lens

**ตัวหาร / Denominator:** Not applicable: evidence lens

**ความหมาย / Meaning:** ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability

**ขอบเขตหลักฐาน / Evidence boundary:** แยกความไม่แน่นอนทางธุรกิจออกจาก hazard/risk assessment ทางการ; ห้ามใช้ Locale Insight ตัดสิน risk หรือเติมข้อมูลที่ขาด

**ตัวช่วย / Cue:** TH / triangle; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ตัวอย่างสมมติ: มีประกาศเปิดคู่แข่งในบริเวณที่เกี่ยวข้อง ต้องตรวจสถานะและผลต่อธุรกิจ

### li.market_share — ส่วนแบ่งตลาด / Market share

**ชนิด / Kind:** sequential · **หน่วย / Unit:** % ของยอดขาย/ปริมาณซื้อในตลาดเดียวกัน

**ตัวตั้ง / Numerator:** ยอดขายหรือปริมาณซื้อของแบรนด์/เครือข่ายในตลาดที่กำหนด

**ตัวหาร / Denominator:** ยอดขายหรือปริมาณซื้อของทั้งตลาด รวมผู้เล่นที่เกี่ยวข้อง ในหมวด พื้นที่ เวลาและหน่วยเดียวกัน

**ความหมาย / Meaning:** ได้ส่วนแบ่งของตลาดที่นิยามมากกว่า ไม่ได้บอกว่าตลาดใหญ่หรือกำไรดี

**ขอบเขตหลักฐาน / Evidence boundary:** จำนวนสาขา/จำนวน POI ไม่ใช่ sales market share; ถ้าใช้ share of outlets ให้เปลี่ยนชื่อ metric และระบุว่าเป็น proxy อีกชนิดหนึ่ง

**ตัวช่วย / Cue:** SH / circle; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ยอดขายแบรนด์ 120,000 จากตลาดรวม 1,000,000 บาท = 12%

### li.spending_readiness — ความพร้อมใช้จ่าย / Spending readiness

**ชนิด / Kind:** sequential · **หน่วย / Unit:** % ของกลุ่มตัวอย่างเป้าหมายที่ผ่านนิยามความพร้อม

**ตัวตั้ง / Numerator:** น้ำหนักผู้ตอบที่มีทั้งงบสำหรับหมวดสินค้าและเจตนาซื้อในช่วงเวลาที่ประกาศ

**ตัวหาร / Denominator:** น้ำหนักผู้ตอบกลุ่มเป้าหมายที่ให้คำตอบใช้ได้ทั้งหมด พร้อม sample/coverage

**ความหมาย / Meaning:** มีผู้ตอบที่ผ่านนิยามความพร้อมมากกว่าในตัวอย่าง/แบบจำลองนี้ ไม่ใช่ยอดซื้อที่รับประกัน

**ขอบเขตหลักฐาน / Evidence boundary:** รายได้ ราคาทรัพย์สินหรือ Locale Insight เพียงอย่างเดียวไม่ใช่ความพร้อมซื้อจริง; แยก affordability, intention และ observed spend และแสดง sampling/model uncertainty

**ตัวช่วย / Cue:** SR / pentagon; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ผู้ตอบเข้าเงื่อนไข 70 จาก 200 คน = 35% ของกลุ่มตัวอย่างนี้; ไม่อนุมานเป็นทุกคนในพื้นที่

### li.demand_growth — การเปลี่ยนแปลงอุปสงค์ / Demand growth

**ชนิด / Kind:** diverging · **หน่วย / Unit:** % เปลี่ยนแปลงเทียบช่วงฐานที่ระบุ

**ตัวตั้ง / Numerator:** Demand ช่วงปัจจุบัน − Demand ช่วงฐานที่เปรียบเทียบกันได้

**ตัวหาร / Denominator:** Demand ช่วงฐาน; หากเป็นศูนย์ให้รายงานผลต่างจริงหรือ not-defined ห้ามหารศูนย์

**ความหมาย / Meaning:** ค่าบวกสูงคือ demand เพิ่มมากกว่า ไม่ได้ยืนยันกำไรหรือความยั่งยืน

**ขอบเขตหลักฐาน / Evidence boundary:** คงหมวด พื้นที่ ฤดูกาลและวิธีวัดให้เทียบได้; ประชากรเติบโตไม่ใช่ demand growth ของทุกหมวด

**จุดอ้างอิง / Pivot:** 0 — ไม่เปลี่ยนจากช่วงฐานที่ระบุ; Must be declared; do not infer statistical significance from the central class.

**ตัวช่วย / Cue:** GR / diamond; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** 1,100 เทียบ 1,000 ครั้งซื้อ/เดือน = +10%

### li.accessibility — การเข้าถึงกลุ่มเป้าหมาย / Accessibility

**ชนิด / Kind:** sequential · **หน่วย / Unit:** % ของ demand เป้าหมายที่เดินทางถึงภายในเงื่อนไข

**ตัวตั้ง / Numerator:** Demand weight ในพื้นที่ที่ถึง site ภายในเวลา/ระยะทาง/โหมดตามเครือข่ายที่กำหนด

**ตัวหาร / Denominator:** Demand weight ทั้งหมดในขอบเขตอ้างอิงเดียวกัน

**ความหมาย / Meaning:** ครอบคลุม demand เป้าหมายภายในเงื่อนไขได้มากกว่า

**ขอบเขตหลักฐาน / Evidence boundary:** วงกลมรัศมีไม่ใช่ travel-time catchment; ระบุ network/time/mode, barriers และความไม่แน่นอน ไม่ยืนยันว่าคนจะเดินทางมาจริง

**ตัวช่วย / Cue:** AC / cross; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** Demand weight 650 จาก 1,000 อยู่ใน 15 นาทีตามโหมดที่ระบุ = 65%

### li.competitive_pressure — แรงกดดันจากคู่แข่ง / Competitive pressure

**ชนิด / Kind:** sequential · **หน่วย / Unit:** % กำลังบริการคู่แข่งเทียบ demand; อาจเกิน 100%

**ตัวตั้ง / Numerator:** กำลังบริการของคู่แข่งที่เกี่ยวข้องในหน่วยเดียวกับ demand

**ตัวหาร / Denominator:** Demand ที่นิยามในช่วงเวลาและ catchment เดียวกัน

**ความหมาย / Meaning:** คู่แข่งมี capacity ต่อ demand มากกว่า ไม่ใช่ความรุนแรงหรือโอกาสแพ้ที่วัดได้โดยตรง

**ขอบเขตหลักฐาน / Evidence boundary:** ห้ามใช้จำนวนร้านแทน capacity โดยไม่เปลี่ยนชื่อเป็น proxy; ต้องดูชนิดสินค้า ราคา positioning และunknown capacity; demand 0 ทำให้ ratio ไม่กำหนด

**ตัวช่วย / Cue:** CP / square; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** กำลังคู่แข่ง 900 ต่อ demand 1,200 ครั้ง/เดือน = 75%

### li.service_gap — ช่องว่างกำลังบริการ / Service gap

**ชนิด / Kind:** diverging · **หน่วย / Unit:** % demand ที่ยังไม่มี capacity รองรับ; อาจติดลบ

**ตัวตั้ง / Numerator:** Demand − Supply ที่เทียบหน่วย ช่วงเวลาและพื้นที่ตรงกัน

**ตัวหาร / Denominator:** Demand ในขอบเขตเดียวกัน; ต้องมากกว่าศูนย์

**ความหมาย / Meaning:** ค่าบวกสูงคือช่องว่าง demand มากกว่า; ค่าลบคือกำลังเกินตามนิยาม ไม่ใช่ดี/เสียสากล

**ขอบเขตหลักฐาน / Evidence boundary:** ไม่หักคะแนน percentile หรือคะแนนคนละหน่วยเข้าด้วยกัน; gap ไม่ยืนยันยอดขายที่คว้าได้ ต้องสำรวจบริการทดแทน การเดินทางและprice fit

**จุดอ้างอิง / Pivot:** 0 — Demand และ Supply เท่ากันในหน่วยที่เปรียบเทียบได้; Declare tolerance; positive gap is not automatically a business opportunity.

**ตัวช่วย / Cue:** GP / hexagon; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** Demand 1,200 − Supply 900 = +300 ครั้ง/เดือน หรือ gap +25%; ค่าลบคือ capacity เกิน demand ตามแบบจำลอง

### li.cannibalization — การดึงยอดจากเครือข่ายเดิม / Own-network cannibalization

**ชนิด / Kind:** sequential · **หน่วย / Unit:** % ยอด/ครั้งซื้อสาขาใหม่ที่คาดว่าย้ายจากสาขาตนเอง

**ตัวตั้ง / Numerator:** ยอดซื้อหรือครั้งซื้อที่ model คาดว่าจะย้ายจากสาขาเดิมของตนเองมายังสาขาใหม่

**ตัวหาร / Denominator:** ยอดซื้อหรือครั้งซื้อทั้งหมดที่ model คาดสำหรับสาขาใหม่

**ความหมาย / Meaning:** สัดส่วนย้ายจากเครือข่ายเดิมมากกว่า; ไม่ใช่จำนวนลูกค้าใหม่หรือความเสียหายจริงที่เกิดแล้ว

**ขอบเขตหลักฐาน / Evidence boundary:** Catchment overlap อย่างเดียวเป็น overlap proxy ไม่ใช่ cannibalization; ต้องมีตัวเลือกทางเลือก baseline และ counterfactual model พร้อมผลระดับเครือข่าย

**ตัวช่วย / Cue:** CN / circle; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** คาดการณ์ 300 จาก 1,000 ครั้งซื้อสาขาใหม่ย้ายจากเครือข่ายเดิม = 30% ภายใต้ scenario นี้

### li.occupancy_cost — ภาระค่าใช้พื้นที่ / Occupancy cost

**ชนิด / Kind:** sequential · **หน่วย / Unit:** % ค่าใช้พื้นที่ต่อรายได้ในช่วงเดียวกัน

**ตัวตั้ง / Numerator:** ค่าเช่า ค่าส่วนกลาง และรายการ occupancy ที่ประกาศ

**ตัวหาร / Denominator:** รายได้ site ในช่วงเดียวกัน; แสดงว่าจริงหรือคาดการณ์ และ denominator ต้องมากกว่าศูนย์

**ความหมาย / Meaning:** รายได้ส่วนที่ต้องใช้จ่ายกับพื้นที่มากกว่า; ไม่มีกำแพงผ่าน/ไม่ผ่านสากล

**ขอบเขตหลักฐาน / Evidence boundary:** ราคาเช่าต่อตร.ม.เป็นคนละ metric กับภาระต่อรายได้; ห้ามใช้รายได้คาดการณ์เหมือนรายได้จริง และอย่าสรุปว่าค่าเช่าถูกคือ site ดี

**ตัวช่วย / Cue:** OC / square; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** ค่าใช้พื้นที่ 12,000 ต่อรายได้ 100,000 บาท/เดือน = 12%

### li.unit_economics — ส่วนต่างจากการดำเนินงาน / Site operating margin

**ชนิด / Kind:** diverging · **หน่วย / Unit:** % ส่วนต่างรายได้หลังต้นทุนดำเนินงานที่ระบุ

**ตัวตั้ง / Numerator:** รายได้ − ต้นทุนดำเนินงาน site ตาม cost scope ที่ประกาศ

**ตัวหาร / Denominator:** รายได้ในช่วงเดียวกัน; denominator ต้องมากกว่าศูนย์

**ความหมาย / Meaning:** ค่าบวกสูงคือเหลือส่วนต่างดำเนินงานมากกว่า; ค่าลบคือรายได้ต่ำกว่าต้นทุนใน scope

**ขอบเขตหลักฐาน / Evidence boundary:** ไม่เรียกว่า net profit หากยังไม่รวม capex, depreciation, financing, tax หรือ HQ allocation; ใช้ sensitivity/uncertainty และอย่ารวมรายรับต่างช่วง

**จุดอ้างอิง / Pivot:** 0 — รายได้เท่ากับต้นทุนที่รวมในนิยามนี้; Declare tolerance; break-even is scoped, not company-level profitability.

**ตัวช่วย / Cue:** UE / diamond; show the full label.

**ตัวอย่างสมมติ / Synthetic illustration:** รายได้ 100,000 − ต้นทุน 85,000 บาท/เดือน = +15% operating margin ใน scenario นี้

## Shared safeguards

- **requiredContext**: business_profile, metric_definition, geographic_unit_id_and_geometry, catchment_definition, comparison_cohort, source_vintage, coverage, numerator_unit, denominator_unit_when_applicable, period, classification_thresholds, direction, evidence_state, uncertainty, next_validation
- **evidenceStates**: observed, derived-from-observed, modelled, proxy, hypothesis, user-judgment, missing, unverified, suppressed, not-applicable
- **localeInsight**: Contextual prior for planning, field validation, engagement and prioritization only. Require locale_id-to-municipality/community/service-boundary crosswalk before aggregation. Not official population, eligibility, statutory boundary, risk determination or proof of actual behaviour.
- **comparison**: Compute ratios from aggregated raw values with compatible boundaries; do not average local ratios or percentiles into a new geography. Preserve source counts, overlapping catchments, unknown cases and zero-denominator handling.
- **swot**: The four SWOT categories are lenses, not four natural scalar measures. Use text/evidence first. Scores require explicit criteria, weights, coverage and a named comparison. Strength/weakness are internal; opportunity/threat external. None is automatically a probability. In this preview the four lenses are categorical and useScale=none; optionalFutureRubric is future guidance, not an active numeric measure.
- **scoring**: Eligibility filters and ranking weights are different. Weight-only edits must not silently change eligible membership. Missing is not zero and is not a negative fact.
- **palette**: Supporting-palette size counts useful color roles, not uniquely named metrics. Exact duplicate and near-duplicate whole routes must be tested globally, while adjacent/overlaid metrics need a separate selected-screen test. Reuse is allowed across separately labeled contexts when semantics agree; no unlimited globally distinguishable rainbow claim.
- **darkTheme**: Keep data HEX; use labels, meaningful boundaries or a neutral backplate. Test actual surfaces and sizes. No automatic 3:1, CVD or full accessibility claim. The original light HEX and numerical direction are unchanged on both themes; no derived dark formula.
- **bannedHues**: No purple or brown at anchors or intermediate LUT values. Numeric gates and visual appearance are separate; clay-band warnings remain visible.
- **nonColorCues**: Always show the full metric label, unit, numerator/denominator and legend. Two-letter+shape pair is supplementary; repeated shapes are intentional and their short labels distinguish them.
- **fixture**: All examples in this file are synthetic illustrations. No figures describe a real site or customer group.

## Exact color records

The machine block supplies all role colors, three anchors, exact 41-sample LUTs and class samples. SWOT has no numerical gradient. Exact visual aliases to Story are disclosed; a reused route never makes two metrics semantically interchangeable. A separate product Add-on remains applicable where its product rules are needed.

<!-- LDS_MACHINE_BEGIN -->
```json
{
"document":{"schemaVersion":"lds-standalone-document-1","documentId":"location-intelligence-profile-lds-0.9.7-r1","documentRevision":"standalone-0.9.7-r1","documentKind":"profile","title":"Location Intelligence Profile for LDS v0.9.7","dsVersion":"0.9.7","releaseRef":"v0.9.7-owner.1","colorSetId":"color-srgb-10","product":"location-intelligence","humanSha256":"105cf9eff33a794267fa08ba9cc38b01c17c039b3b08b91862fef511a68e7fdd","requiredNormativeFiles":2},
"release":{"dsVersion":"0.9.7","releaseRef":"v0.9.7-owner.1","colorSetId":"color-srgb-10","signatureStatus":"unsigned","signedRelease":false,"normativeDependency":"Landometer-Design-System-v0.9.7.md"},
"baseDocument":{"documentId":"lds-0.9.7-landometer-standalone-r1","path":"Landometer-Design-System-v0.9.7.md","sha256":"d3085cbc0a50195f1cbf0c77b1d77c0d19b84364daf2948eb367348d65432d96","dsVersion":"0.9.7","releaseRef":"v0.9.7-owner.1","colorSetId":"color-srgb-10"},
"locationProfile":{
"schemaVersion":"lds-location-profile-0.9.7-1",
"releaseRef":"v0.9.7-owner.1",
"colorSetId":"color-srgb-10",
"profileId":"location-intelligence-0.9.7",
"status":"owner-approved",
"baseDocument":{"documentId":"lds-0.9.7-landometer-standalone-r1","path":"Landometer-Design-System-v0.9.7.md","sha256":"d3085cbc0a50195f1cbf0c77b1d77c0d19b84364daf2948eb367348d65432d96","dsVersion":"0.9.7","releaseRef":"v0.9.7-owner.1","colorSetId":"color-srgb-10"},
"semantics":{
"schema":"location-colour-study-metric-semantics-1",
"status":"owner-approved-location-profile",
"baseStudy":"LDS 0.9.7",
"nameTh":"กรอบความหมายสีสำหรับ Location Intelligence",
"scope":"Separate optional Location Intelligence profile; quantitative business definitions do not override factual evidence, the complete LDS base, or other products.",
"metricCount":16,
"sharedRules":{
"requiredContext":["business_profile","metric_definition","geographic_unit_id_and_geometry","catchment_definition","comparison_cohort","source_vintage","coverage","numerator_unit","denominator_unit_when_applicable","period","classification_thresholds","direction","evidence_state","uncertainty","next_validation"],
"evidenceStates":["observed","derived-from-observed","modelled","proxy","hypothesis","user-judgment","missing","unverified","suppressed","not-applicable"],
"localeInsight":"Contextual prior for planning, field validation, engagement and prioritization only. Require locale_id-to-municipality/community/service-boundary crosswalk before aggregation. Not official population, eligibility, statutory boundary, risk determination or proof of actual behaviour.",
"comparison":"Compute ratios from aggregated raw values with compatible boundaries; do not average local ratios or percentiles into a new geography. Preserve source counts, overlapping catchments, unknown cases and zero-denominator handling.",
"swot":"The four SWOT categories are lenses, not four natural scalar measures. Use text/evidence first. Scores require explicit criteria, weights, coverage and a named comparison. Strength/weakness are internal; opportunity/threat external. None is automatically a probability. In this preview the four lenses are categorical and useScale=none; optionalFutureRubric is future guidance, not an active numeric measure.",
"scoring":"Eligibility filters and ranking weights are different. Weight-only edits must not silently change eligible membership. Missing is not zero and is not a negative fact.",
"palette":"Supporting-palette size counts useful color roles, not uniquely named metrics. Exact duplicate and near-duplicate whole routes must be tested globally, while adjacent/overlaid metrics need a separate selected-screen test. Reuse is allowed across separately labeled contexts when semantics agree; no unlimited globally distinguishable rainbow claim.",
"darkTheme":"Keep data HEX; use labels, meaningful boundaries or a neutral backplate. Test actual surfaces and sizes. No automatic 3:1, CVD or full accessibility claim. The original light HEX and numerical direction are unchanged on both themes; no derived dark formula.",
"bannedHues":"No purple or brown at anchors or intermediate LUT values. Numeric gates and visual appearance are separate; clay-band warnings remain visible.",
"nonColorCues":"Always show the full metric label, unit, numerator/denominator and legend. Two-letter+shape pair is supplementary; repeated shapes are intentional and their short labels distinguish them.",
"fixture":"All examples in this file are synthetic illustrations. No figures describe a real site or customer group."
},
"metrics":[
{
"id":"li.demand",
"labelTh":"ความต้องการซื้อ",
"labelEn":"Demand",
"role":"modelled-or-observed-quantity",
"group":"market-fundamentals",
"unit":"ครั้งซื้อ/เดือน ในหมวดธุรกิจที่กำหนด",
"numerator":"จำนวนโอกาสซื้อในหมวดที่เกี่ยวข้อง โดยประกาศส่วนที่สังเกตจริงและส่วนที่ประมาณ",
"denominator":"ช่วงเวลา 1 เดือน; ไม่ใช่ density และไม่หารประชากรโดยปริยาย",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"แบบจำลองได้ 1,200 ครั้งซื้อ/เดือน โดยระบุหมวด พื้นที่ และสมมติฐานความถี่"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"มีโอกาสซื้อรวมมากกว่า ไม่ได้ยืนยันยอดขายของสาขาใหม่",
"evidenceBoundary":"POI ประชากร การเดินทางและ Locale Insight เป็นบริบท/proxy ได้ตามขอบเขต ไม่ใช่จำนวนลูกค้าจริง ต้องกำหนดธุรกิจ กลุ่มเป้าหมาย ช่วงเวลา และฐานข้อมูล",
"nonColorCue":{"shortLabel":"DM","shape":"circle","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"activity","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["market-fundamentals","demand-trend","market-structure"],
"recommendedMarker":{"text":"D","shape":"circle","alwaysShowFullLabel":true,"shortLabel":"DM"}
},
{
"id":"li.supply",
"labelTh":"กำลังให้บริการที่มีอยู่",
"labelEn":"Supply",
"role":"observed-or-modelled-capacity",
"group":"market-fundamentals",
"unit":"ครั้งให้บริการ/เดือน หรือหน่วยกำลังบริการที่เทียบ demand ได้",
"numerator":"กำลังให้บริการที่เปิดดำเนินงานจริง แยก own/competitor/unknown และระบุการประมาณกำลัง",
"denominator":"ช่วงเวลาเดียวกับ demand; ไม่ใช่จำนวนร้านอย่างเดียว",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ตรวจร้านและประมาณกำลังรวม 900 ครั้งให้บริการ/เดือน; ถ้ามีเพียง 9 POIs ให้เรียกว่า 9 จุดบริการ"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"มีทางเลือกหรือกำลังบริการมากกว่า ไม่ได้แปลว่าแข่งรุนแรงกว่าเสมอ",
"evidenceBoundary":"จำนวน POI ไม่ยืนยัน capacity, utilization หรือ market share; ต้องจัดการร้านปิด ร้านซ้ำ หลายผู้เช่าและแบรนด์ที่ไม่ทราบ",
"nonColorCue":{"shortLabel":"SP","shape":"square","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"count","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["market-fundamentals","market-structure"],
"recommendedMarker":{"text":"S","shape":"square","alwaysShowFullLabel":true,"shortLabel":"SP"}
},
{
"id":"li.market_size",
"labelTh":"ขนาดตลาด",
"labelEn":"Market size",
"role":"modelled-or-observed-monetary-quantity",
"group":"market-fundamentals",
"unit":"บาท/เดือน หรือสกุลเงิน/ช่วงเวลาที่ระบุ",
"numerator":"ยอดใช้จ่ายรวมในหมวดและขอบเขตที่กำหนด; หากประมาณใช้จำนวนโอกาสซื้อ × ค่าใช้จ่ายต่อครั้งที่มีหลักฐาน",
"denominator":"ช่วงเวลาเดียวกัน และ market definition เดียวกัน",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"1,200 ครั้งซื้อ/เดือน × 300 บาท/ครั้ง = ตลาดประมาณ 360,000 บาท/เดือน"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"มูลค่าตลาดรวมสูงกว่า ไม่ใช่รายได้ที่สาขาใหม่จะได้",
"evidenceBoundary":"แยก total/serviceable/obtainable market; รายได้ทั่วไปหรือประชากรไม่ได้เป็น market size โดยตรง และ catchment ซ้อนทับต้องไม่บวกซ้ำ",
"nonColorCue":{"shortLabel":"MS","shape":"hexagon","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"price","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["market-fundamentals","site-economics"],
"recommendedMarker":{"text":"M","shape":"hexagon","alwaysShowFullLabel":true,"shortLabel":"MS"}
},
{
"id":"li.strength",
"labelTh":"จุดแข็ง",
"labelEn":"Strength",
"role":"internal-evidence-lens",
"group":"swot-lenses",
"unit":"รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ",
"numerator":null,
"denominator":null,
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ตัวอย่างสมมติ: พื้นที่หน้าร้านของกิจการเอื้อต่อรูปแบบบริการที่กำหนด มีหลักฐานตรวจพื้นที่"},
"useScale":"none",
"scaleCondition":"Categorical evidence-lens role only in this preview. A future explicit numeric rubric requires a separate contract and review.",
"pivot":null,
"highMeaning":"ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability",
"evidenceBoundary":"SWOT เป็น lens ไม่ใช่ตัวแปรที่มีหน่วยโดยธรรมชาติ ต้องมี business strategy/cohort และหลักฐาน; ถ้าไม่มี rubric ให้ใช้รายการข้อความ ไม่สร้าง gradient",
"nonColorCue":{"shortLabel":"ST","shape":"cross","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"count","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["swot-internal","swot-positive-evidence"],
"recommendedMarker":{"text":"+","shape":"cross","alwaysShowFullLabel":true,"shortLabel":"ST"},
"optionalFutureRubric":{"unit":"หลักฐานจุดแข็ง; คะแนน rubric 0–100 เฉพาะเมื่อมีเกณฑ์","numerator":"ผลรวมค่าน้ำหนัก × ระดับข้อได้เปรียบภายในตาม rubric ที่ประกาศ","denominator":"ผลรวมน้ำหนักที่มีหลักฐานครบตามเกณฑ์ coverage; ไม่เปลี่ยนน้ำหนักเงียบเมื่อ missing","scaleCondition":"Render a scale only for an explicitly defined scalar rubric; otherwise use non-quantitative evidence cards."}
},
{
"id":"li.weakness",
"labelTh":"จุดอ่อน",
"labelEn":"Weakness",
"role":"internal-evidence-lens",
"group":"swot-lenses",
"unit":"รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ",
"numerator":null,
"denominator":null,
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ตัวอย่างสมมติ: เวลาให้บริการปัจจุบันไม่ครอบคลุมช่วงที่ตั้งเป้า ยังต้องตรวจ staffing constraint"},
"useScale":"none",
"scaleCondition":"Categorical evidence-lens role only in this preview. A future explicit numeric rubric requires a separate contract and review.",
"pivot":null,
"highMeaning":"ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability",
"evidenceBoundary":"ไม่ถือว่า weakness = 100 − strength; ใช้คนละชุดหลักฐานได้ และต้องไม่ยกระดับ missing ให้เป็นจุดอ่อนจริง",
"nonColorCue":{"shortLabel":"WK","shape":"triangle","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"count","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["swot-internal","swot-negative-evidence"],
"recommendedMarker":{"text":"−","shape":"triangle","alwaysShowFullLabel":true,"shortLabel":"WK"},
"optionalFutureRubric":{"unit":"หลักฐานจุดอ่อน; คะแนน rubric 0–100 เฉพาะเมื่อมีเกณฑ์","numerator":"ผลรวมค่าน้ำหนัก × ระดับข้อจำกัดภายในหรือช่องว่างจาก requirement","denominator":"ผลรวมน้ำหนักที่ประเมินได้ตามเกณฑ์ coverage เดียวกัน","scaleCondition":"Render a scale only for an explicitly defined scalar rubric; otherwise use non-quantitative evidence cards."}
},
{
"id":"li.opportunity",
"labelTh":"โอกาสภายนอก",
"labelEn":"Opportunity",
"role":"external-evidence-and-hypothesis-lens",
"group":"swot-lenses",
"unit":"รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ",
"numerator":null,
"denominator":null,
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ตัวอย่างสมมติ: พบความต้องการบริการบางช่วงที่ยังรองรับไม่พอ เป็น hypothesis รอ field validation"},
"useScale":"none",
"scaleCondition":"Categorical evidence-lens role only in this preview. A future explicit numeric rubric requires a separate contract and review.",
"pivot":null,
"highMeaning":"ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability",
"evidenceBoundary":"บริการน้อยไม่ยืนยัน unmet demand; แผนโครงการในอนาคตไม่เท่ากับเปิดจริง ต้องแยก observed/proxy/hypothesis และ next validation",
"nonColorCue":{"shortLabel":"OP","shape":"diamond","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"growth","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["swot-external","swot-positive-evidence"],
"recommendedMarker":{"text":"O","shape":"diamond","alwaysShowFullLabel":true,"shortLabel":"OP"},
"optionalFutureRubric":{"unit":"หลักฐาน/สมมติฐานโอกาส; คะแนน rubric 0–100 เฉพาะเมื่อมีเกณฑ์","numerator":"ผลรวมค่าน้ำหนัก × ขนาดหรือความเกี่ยวข้องของโอกาสภายนอกตาม rubric","denominator":"ผลรวมน้ำหนักตาม coverage ที่ประกาศ; แสดง confidence ต่างหาก","scaleCondition":"Render a scale only for an explicitly defined scalar rubric; do not interpret the score as probability or projected revenue."}
},
{
"id":"li.threat",
"labelTh":"ภัยคุกคามต่อธุรกิจ",
"labelEn":"Threat",
"role":"external-evidence-and-hypothesis-lens",
"group":"swot-lenses",
"unit":"รายการหลักฐาน/สมมติฐานที่จัดประเภท; ไม่มี scalar โดยธรรมชาติ",
"numerator":null,
"denominator":null,
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ตัวอย่างสมมติ: มีประกาศเปิดคู่แข่งในบริเวณที่เกี่ยวข้อง ต้องตรวจสถานะและผลต่อธุรกิจ"},
"useScale":"none",
"scaleCondition":"Categorical evidence-lens role only in this preview. A future explicit numeric rubric requires a separate contract and review.",
"pivot":null,
"highMeaning":"ไม่ใช้สูง/ต่ำกับ lens นี้โดยตรง; แสดงหลักฐาน ความเกี่ยวข้องและสถานะ ไม่อนุมานเป็นคะแนนหรือ probability",
"evidenceBoundary":"แยกความไม่แน่นอนทางธุรกิจออกจาก hazard/risk assessment ทางการ; ห้ามใช้ Locale Insight ตัดสิน risk หรือเติมข้อมูลที่ขาด",
"nonColorCue":{"shortLabel":"TH","shape":"triangle","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"risk","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["swot-external","swot-negative-evidence"],
"recommendedMarker":{"text":"T","shape":"triangle","alwaysShowFullLabel":true,"shortLabel":"TH"},
"optionalFutureRubric":{"unit":"หลักฐาน/สมมติฐานภัยคุกคาม; คะแนน rubric 0–100 เฉพาะเมื่อมีเกณฑ์","numerator":"ผลรวมค่าน้ำหนัก × ระดับ exposure/impact ตาม rubric ที่ประกาศ","denominator":"ผลรวมน้ำหนักตาม coverage ที่ประกาศ; probability ต้องมี model แยกถ้าจะรายงาน","scaleCondition":"A risk-family visual analogy is permitted only for a defined evidence-backed threat rubric; otherwise use non-quantitative evidence cards."}
},
{
"id":"li.market_share",
"labelTh":"ส่วนแบ่งตลาด",
"labelEn":"Market share",
"role":"observed-or-modelled-ratio",
"group":"commercial-position",
"unit":"% ของยอดขาย/ปริมาณซื้อในตลาดเดียวกัน",
"numerator":"ยอดขายหรือปริมาณซื้อของแบรนด์/เครือข่ายในตลาดที่กำหนด",
"denominator":"ยอดขายหรือปริมาณซื้อของทั้งตลาด รวมผู้เล่นที่เกี่ยวข้อง ในหมวด พื้นที่ เวลาและหน่วยเดียวกัน",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ยอดขายแบรนด์ 120,000 จากตลาดรวม 1,000,000 บาท = 12%"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"ได้ส่วนแบ่งของตลาดที่นิยามมากกว่า ไม่ได้บอกว่าตลาดใหญ่หรือกำไรดี",
"evidenceBoundary":"จำนวนสาขา/จำนวน POI ไม่ใช่ sales market share; ถ้าใช้ share of outlets ให้เปลี่ยนชื่อ metric และระบุว่าเป็น proxy อีกชนิดหนึ่ง",
"nonColorCue":{"shortLabel":"SH","shape":"circle","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"count","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["commercial-readiness"],
"recommendedMarker":{"text":"%","shape":"circle","alwaysShowFullLabel":true,"shortLabel":"SH"}
},
{
"id":"li.spending_readiness",
"labelTh":"ความพร้อมใช้จ่าย",
"labelEn":"Spending readiness",
"role":"observed-or-modelled-behavioural-ratio",
"group":"customer-readiness",
"unit":"% ของกลุ่มตัวอย่างเป้าหมายที่ผ่านนิยามความพร้อม",
"numerator":"น้ำหนักผู้ตอบที่มีทั้งงบสำหรับหมวดสินค้าและเจตนาซื้อในช่วงเวลาที่ประกาศ",
"denominator":"น้ำหนักผู้ตอบกลุ่มเป้าหมายที่ให้คำตอบใช้ได้ทั้งหมด พร้อม sample/coverage",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ผู้ตอบเข้าเงื่อนไข 70 จาก 200 คน = 35% ของกลุ่มตัวอย่างนี้; ไม่อนุมานเป็นทุกคนในพื้นที่"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"มีผู้ตอบที่ผ่านนิยามความพร้อมมากกว่าในตัวอย่าง/แบบจำลองนี้ ไม่ใช่ยอดซื้อที่รับประกัน",
"evidenceBoundary":"รายได้ ราคาทรัพย์สินหรือ Locale Insight เพียงอย่างเดียวไม่ใช่ความพร้อมซื้อจริง; แยก affordability, intention และ observed spend และแสดง sampling/model uncertainty",
"nonColorCue":{"shortLabel":"SR","shape":"pentagon","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"activity","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["commercial-readiness"],
"recommendedMarker":{"text":"R","shape":"pentagon","alwaysShowFullLabel":true,"shortLabel":"SR"}
},
{
"id":"li.demand_growth",
"labelTh":"การเปลี่ยนแปลงอุปสงค์",
"labelEn":"Demand growth",
"role":"signed-change",
"group":"market-dynamics",
"unit":"% เปลี่ยนแปลงเทียบช่วงฐานที่ระบุ",
"numerator":"Demand ช่วงปัจจุบัน − Demand ช่วงฐานที่เปรียบเทียบกันได้",
"denominator":"Demand ช่วงฐาน; หากเป็นศูนย์ให้รายงานผลต่างจริงหรือ not-defined ห้ามหารศูนย์",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"1,100 เทียบ 1,000 ครั้งซื้อ/เดือน = +10%"},
"useScale":"diverging",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":{"value":0,"meaningTh":"ไม่เปลี่ยนจากช่วงฐานที่ระบุ","neutralInterval":"Must be declared; do not infer statistical significance from the central class."},
"highMeaning":"ค่าบวกสูงคือ demand เพิ่มมากกว่า ไม่ได้ยืนยันกำไรหรือความยั่งยืน",
"evidenceBoundary":"คงหมวด พื้นที่ ฤดูกาลและวิธีวัดให้เทียบได้; ประชากรเติบโตไม่ใช่ demand growth ของทุกหมวด",
"nonColorCue":{"shortLabel":"GR","shape":"diamond","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"delta","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["demand-trend"],
"recommendedMarker":{"text":"Δ","shape":"diamond","alwaysShowFullLabel":true,"shortLabel":"GR"}
},
{
"id":"li.accessibility",
"labelTh":"การเข้าถึงกลุ่มเป้าหมาย",
"labelEn":"Accessibility",
"role":"network-based-ratio",
"group":"site-and-network",
"unit":"% ของ demand เป้าหมายที่เดินทางถึงภายในเงื่อนไข",
"numerator":"Demand weight ในพื้นที่ที่ถึง site ภายในเวลา/ระยะทาง/โหมดตามเครือข่ายที่กำหนด",
"denominator":"Demand weight ทั้งหมดในขอบเขตอ้างอิงเดียวกัน",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"Demand weight 650 จาก 1,000 อยู่ใน 15 นาทีตามโหมดที่ระบุ = 65%"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"ครอบคลุม demand เป้าหมายภายในเงื่อนไขได้มากกว่า",
"evidenceBoundary":"วงกลมรัศมีไม่ใช่ travel-time catchment; ระบุ network/time/mode, barriers และความไม่แน่นอน ไม่ยืนยันว่าคนจะเดินทางมาจริง",
"nonColorCue":{"shortLabel":"AC","shape":"cross","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"count","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["site-network"],
"recommendedMarker":{"text":"A","shape":"cross","alwaysShowFullLabel":true,"shortLabel":"AC"}
},
{
"id":"li.competitive_pressure",
"labelTh":"แรงกดดันจากคู่แข่ง",
"labelEn":"Competitive pressure",
"role":"capacity-to-demand-ratio",
"group":"commercial-position",
"unit":"% กำลังบริการคู่แข่งเทียบ demand; อาจเกิน 100%",
"numerator":"กำลังบริการของคู่แข่งที่เกี่ยวข้องในหน่วยเดียวกับ demand",
"denominator":"Demand ที่นิยามในช่วงเวลาและ catchment เดียวกัน",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"กำลังคู่แข่ง 900 ต่อ demand 1,200 ครั้ง/เดือน = 75%"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"คู่แข่งมี capacity ต่อ demand มากกว่า ไม่ใช่ความรุนแรงหรือโอกาสแพ้ที่วัดได้โดยตรง",
"evidenceBoundary":"ห้ามใช้จำนวนร้านแทน capacity โดยไม่เปลี่ยนชื่อเป็น proxy; ต้องดูชนิดสินค้า ราคา positioning และunknown capacity; demand 0 ทำให้ ratio ไม่กำหนด",
"nonColorCue":{"shortLabel":"CP","shape":"square","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"count","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["market-structure"],
"recommendedMarker":{"text":"C","shape":"square","alwaysShowFullLabel":true,"shortLabel":"CP"}
},
{
"id":"li.service_gap",
"labelTh":"ช่องว่างกำลังบริการ",
"labelEn":"Service gap",
"role":"signed-demand-supply-gap",
"group":"market-dynamics",
"unit":"% demand ที่ยังไม่มี capacity รองรับ; อาจติดลบ",
"numerator":"Demand − Supply ที่เทียบหน่วย ช่วงเวลาและพื้นที่ตรงกัน",
"denominator":"Demand ในขอบเขตเดียวกัน; ต้องมากกว่าศูนย์",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"Demand 1,200 − Supply 900 = +300 ครั้ง/เดือน หรือ gap +25%; ค่าลบคือ capacity เกิน demand ตามแบบจำลอง"},
"useScale":"diverging",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":{"value":0,"meaningTh":"Demand และ Supply เท่ากันในหน่วยที่เปรียบเทียบได้","neutralInterval":"Declare tolerance; positive gap is not automatically a business opportunity."},
"highMeaning":"ค่าบวกสูงคือช่องว่าง demand มากกว่า; ค่าลบคือกำลังเกินตามนิยาม ไม่ใช่ดี/เสียสากล",
"evidenceBoundary":"ไม่หักคะแนน percentile หรือคะแนนคนละหน่วยเข้าด้วยกัน; gap ไม่ยืนยันยอดขายที่คว้าได้ ต้องสำรวจบริการทดแทน การเดินทางและprice fit",
"nonColorCue":{"shortLabel":"GP","shape":"hexagon","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"balance","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["market-structure"],
"recommendedMarker":{"text":"G","shape":"hexagon","alwaysShowFullLabel":true,"shortLabel":"GP"}
},
{
"id":"li.cannibalization",
"labelTh":"การดึงยอดจากเครือข่ายเดิม",
"labelEn":"Own-network cannibalization",
"role":"counterfactual-modelled-ratio",
"group":"site-and-network",
"unit":"% ยอด/ครั้งซื้อสาขาใหม่ที่คาดว่าย้ายจากสาขาตนเอง",
"numerator":"ยอดซื้อหรือครั้งซื้อที่ model คาดว่าจะย้ายจากสาขาเดิมของตนเองมายังสาขาใหม่",
"denominator":"ยอดซื้อหรือครั้งซื้อทั้งหมดที่ model คาดสำหรับสาขาใหม่",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"คาดการณ์ 300 จาก 1,000 ครั้งซื้อสาขาใหม่ย้ายจากเครือข่ายเดิม = 30% ภายใต้ scenario นี้"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"สัดส่วนย้ายจากเครือข่ายเดิมมากกว่า; ไม่ใช่จำนวนลูกค้าใหม่หรือความเสียหายจริงที่เกิดแล้ว",
"evidenceBoundary":"Catchment overlap อย่างเดียวเป็น overlap proxy ไม่ใช่ cannibalization; ต้องมีตัวเลือกทางเลือก baseline และ counterfactual model พร้อมผลระดับเครือข่าย",
"nonColorCue":{"shortLabel":"CN","shape":"circle","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"count","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["site-network"],
"recommendedMarker":{"text":"N","shape":"circle","alwaysShowFullLabel":true,"shortLabel":"CN"}
},
{
"id":"li.occupancy_cost",
"labelTh":"ภาระค่าใช้พื้นที่",
"labelEn":"Occupancy cost",
"role":"modelled-or-observed-cost-ratio",
"group":"site-economics",
"unit":"% ค่าใช้พื้นที่ต่อรายได้ในช่วงเดียวกัน",
"numerator":"ค่าเช่า ค่าส่วนกลาง และรายการ occupancy ที่ประกาศ",
"denominator":"รายได้ site ในช่วงเดียวกัน; แสดงว่าจริงหรือคาดการณ์ และ denominator ต้องมากกว่าศูนย์",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"ค่าใช้พื้นที่ 12,000 ต่อรายได้ 100,000 บาท/เดือน = 12%"},
"useScale":"sequential",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":null,
"highMeaning":"รายได้ส่วนที่ต้องใช้จ่ายกับพื้นที่มากกว่า; ไม่มีกำแพงผ่าน/ไม่ผ่านสากล",
"evidenceBoundary":"ราคาเช่าต่อตร.ม.เป็นคนละ metric กับภาระต่อรายได้; ห้ามใช้รายได้คาดการณ์เหมือนรายได้จริง และอย่าสรุปว่าค่าเช่าถูกคือ site ดี",
"nonColorCue":{"shortLabel":"OC","shape":"square","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"price","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["site-economics"],
"recommendedMarker":{"text":"$","shape":"square","alwaysShowFullLabel":true,"shortLabel":"OC"}
},
{
"id":"li.unit_economics",
"labelTh":"ส่วนต่างจากการดำเนินงาน",
"labelEn":"Site operating margin",
"role":"signed-modelled-or-observed-margin",
"group":"site-economics",
"unit":"% ส่วนต่างรายได้หลังต้นทุนดำเนินงานที่ระบุ",
"numerator":"รายได้ − ต้นทุนดำเนินงาน site ตาม cost scope ที่ประกาศ",
"denominator":"รายได้ในช่วงเดียวกัน; denominator ต้องมากกว่าศูนย์",
"example":{"status":"synthetic-illustration-not-a-real-location","textTh":"รายได้ 100,000 − ต้นทุน 85,000 บาท/เดือน = +15% operating margin ใน scenario นี้"},
"useScale":"diverging",
"scaleCondition":"Use only with the stated metric, evidence, unit and comparable geographic/time scope.",
"pivot":{"value":0,"meaningTh":"รายได้เท่ากับต้นทุนที่รวมในนิยามนี้","neutralInterval":"Declare tolerance; break-even is scoped, not company-level profitability."},
"highMeaning":"ค่าบวกสูงคือเหลือส่วนต่างดำเนินงานมากกว่า; ค่าลบคือรายได้ต่ำกว่าต้นทุนใน scope",
"evidenceBoundary":"ไม่เรียกว่า net profit หากยังไม่รวม capex, depreciation, financing, tax หรือ HQ allocation; ใช้ sensitivity/uncertainty และอย่ารวมรายรับต่างช่วง",
"nonColorCue":{"shortLabel":"UE","shape":"diamond","alwaysShowTextLabel":true},
"relatedExistingFamily":{"id":"balance","relationship":"Semantic starting point only; not approval to copy colors or rename the released family."},
"coDisplayGroups":["site-economics"],
"recommendedMarker":{"text":"E","shape":"diamond","alwaysShowFullLabel":true,"shortLabel":"UE"}
}
],
"sourceContracts":["/Users/montri/.codex/skills/develop-location-expansion/SKILL.md","/Users/montri/.codex/skills/develop-location-expansion/references/model.md","Project AGENTS.md: Locale Insight contextual-prior rule"],
"counts":{"userRequested":9,"additional":7,"sequential":9,"diverging":3,"categoricalEvidenceLenses":4,"quantitativeMetrics":12,"themeScaleRecordsExpected":24},
"coDisplayGroups":{"market-fundamentals":["li.demand","li.supply","li.market_size"],"swot-internal":["li.strength","li.weakness"],"swot-external":["li.opportunity","li.threat"],"swot-positive-evidence":["li.strength","li.opportunity"],"swot-negative-evidence":["li.weakness","li.threat"],"commercial-readiness":["li.market_share","li.spending_readiness"],"demand-trend":["li.demand","li.demand_growth"],"market-structure":["li.demand","li.supply","li.competitive_pressure","li.service_gap"],"site-network":["li.accessibility","li.cannibalization"],"site-economics":["li.market_size","li.occupancy_cost","li.unit_economics"]}
},
"semanticReferenceRoot":"JSON Pointer references resolve against this Location profile object, including when embedded as machine.locationProfile in the separate normative document.",
"roles":[
{"id":"li.demand","nameTh":"ความต้องการซื้อ","nameEn":"Demand","colorNameTh":"ฟ้ากิจกรรม","colorNameEn":"Active blue","lens":"metric","chromaRole":"focused","light":{"hex":"#25659A","oklch":{"L":0.4923013561434468,"C":0.10664971144799684,"H":247.30502563343},"labelHex":"#FFFFFF","labelContrast":6.1642},"baseVocabulary":{"kind":"exact-reuse","sourceId":"blue"},"semanticRef":"#/semantics/metrics/0","nonColorCue":{"shortLabel":"DM","shape":"circle","alwaysShowTextLabel":true},"notes":"Cool activity colour for purchase occasions; quantity is not realized sales.","dark":{"hex":"#25659A","oklch":{"L":0.4923013561434468,"C":0.10664971144799684,"H":247.30502563343},"labelHex":"#FFFFFF","labelContrast":6.1642},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.supply","nameTh":"กำลังให้บริการที่มีอยู่","nameEn":"Supply","colorNameTh":"ทีลบริการ","colorNameEn":"Service teal","lens":"metric","chromaRole":"supporting","light":{"hex":"#278E94","oklch":{"L":0.5929266367421221,"C":0.09035588239253886,"H":200.81817646794738},"labelHex":"#000000","labelContrast":5.3831},"baseVocabulary":{"kind":"location-extension","sourceId":null},"semanticRef":"#/semantics/metrics/1","nonColorCue":{"shortLabel":"SP","shape":"square","alwaysShowTextLabel":true},"notes":"A steady teal for verified service capacity, distinct from demand blue.","dark":{"hex":"#278E94","oklch":{"L":0.5929266367421221,"C":0.09035588239253886,"H":200.81817646794738},"labelHex":"#000000","labelContrast":5.3831},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.market_size","nameTh":"ขนาดตลาด","nameEn":"Market size","colorNameTh":"น้ำเงินหมึก","colorNameEn":"Editorial navy","lens":"metric","chromaRole":"quiet","light":{"hex":"#213E70","oklch":{"L":0.3691274920038391,"C":0.09308689579121017,"H":260.53917810926976},"labelHex":"#FFFFFF","labelContrast":10.565},"baseVocabulary":{"kind":"exact-reuse","sourceId":"navy"},"semanticRef":"#/semantics/metrics/2","nonColorCue":{"shortLabel":"MS","shape":"hexagon","alwaysShowTextLabel":true},"notes":"Deep editorial weight for aggregate market quantity; not obtainable revenue.","dark":{"hex":"#213E70","oklch":{"L":0.3691274920038391,"C":0.09308689579121017,"H":260.53917810926976},"labelHex":"#FFFFFF","labelContrast":10.565},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.strength","nameTh":"จุดแข็ง","nameEn":"Strength","colorNameTh":"เขียวใบไม้","colorNameEn":"Leaf","lens":"evidence","chromaRole":"supporting","light":{"hex":"#2B702F","oklch":{"L":0.485261851389689,"C":0.12050120546764558,"H":144.4212661626164},"labelHex":"#FFFFFF","labelContrast":6.0669},"baseVocabulary":{"kind":"exact-reuse","sourceId":"leaf"},"semanticRef":"#/semantics/metrics/3","nonColorCue":{"shortLabel":"ST","shape":"cross","alwaysShowTextLabel":true},"notes":"Internal strength evidence lens; green is a category cue, never a probability.","dark":{"hex":"#2B702F","oklch":{"L":0.485261851389689,"C":0.12050120546764558,"H":144.4212661626164},"labelHex":"#FFFFFF","labelContrast":6.0669},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.weakness","nameTh":"จุดอ่อน","nameEn":"Weakness","colorNameTh":"อำพันทบทวน","colorNameEn":"Review amber","lens":"evidence","chromaRole":"supporting","light":{"hex":"#DDA527","oklch":{"L":0.7551302354159086,"C":0.1453975517614426,"H":82.04736405277207},"labelHex":"#000000","labelContrast":9.4858},"baseVocabulary":{"kind":"location-extension","sourceId":null},"semanticRef":"#/semantics/metrics/4","nonColorCue":{"shortLabel":"WK","shape":"triangle","alwaysShowTextLabel":true},"notes":"Internal constraint evidence; attention without borrowing urgent threat red.","dark":{"hex":"#DDA527","oklch":{"L":0.7551302354159086,"C":0.1453975517614426,"H":82.04736405277207},"labelHex":"#000000","labelContrast":9.4858},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.opportunity","nameTh":"โอกาสภายนอก","nameEn":"Opportunity","colorNameTh":"มิ้นต์","colorNameEn":"Exchange mint","lens":"evidence","chromaRole":"supporting","light":{"hex":"#60C9AD","oklch":{"L":0.7655690880260398,"C":0.10655533312541268,"H":173.52036530176034},"labelHex":"#000000","labelContrast":10.4554},"baseVocabulary":{"kind":"exact-reuse","sourceId":"mint"},"semanticRef":"#/semantics/metrics/5","nonColorCue":{"shortLabel":"OP","shape":"diamond","alwaysShowTextLabel":true},"notes":"External opportunity evidence and hypotheses remain visibly qualified.","dark":{"hex":"#60C9AD","oklch":{"L":0.7655690880260398,"C":0.10655533312541268,"H":173.52036530176034},"labelHex":"#000000","labelContrast":10.4554},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.threat","nameTh":"ภัยคุกคามต่อธุรกิจ","nameEn":"Threat","colorNameTh":"แดงความเสี่ยง","colorNameEn":"Risk red","lens":"evidence","chromaRole":"urgent","light":{"hex":"#A40822","oklch":{"L":0.45649327741968,"C":0.18011138103897367,"H":22.714110012876166},"labelHex":"#FFFFFF","labelContrast":7.9656},"baseVocabulary":{"kind":"exact-reuse","sourceId":"red"},"semanticRef":"#/semantics/metrics/6","nonColorCue":{"shortLabel":"TH","shape":"triangle","alwaysShowTextLabel":true},"notes":"A focused clean red for evidence-backed external threat; not official hazard classification.","dark":{"hex":"#A40822","oklch":{"L":0.45649327741968,"C":0.18011138103897367,"H":22.714110012876166},"labelHex":"#FFFFFF","labelContrast":7.9656},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.market_share","nameTh":"ส่วนแบ่งตลาด","nameEn":"Market share","colorNameTh":"ฟ้าส่วนแบ่ง","colorNameEn":"Share azure","lens":"metric","chromaRole":"focused","light":{"hex":"#4B8FD8","oklch":{"L":0.6386327072385507,"C":0.13022682146794456,"H":251.98472671329102},"labelHex":"#000000","labelContrast":6.2197},"baseVocabulary":{"kind":"location-extension","sourceId":null},"semanticRef":"#/semantics/metrics/7","nonColorCue":{"shortLabel":"SH","shape":"circle","alwaysShowTextLabel":true},"notes":"Share of the explicitly defined market; never substitute outlet counts.","dark":{"hex":"#4B8FD8","oklch":{"L":0.6386327072385507,"C":0.13022682146794456,"H":251.98472671329102},"labelHex":"#000000","labelContrast":6.2197},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.spending_readiness","nameTh":"ความพร้อมใช้จ่าย","nameEn":"Spending readiness","colorNameTh":"ทองความพร้อม","colorNameEn":"Readiness gold","lens":"metric","chromaRole":"supporting","light":{"hex":"#BFA000","oklch":{"L":0.7124706948176123,"C":0.14630034362733504,"H":95.03755878569575},"labelHex":"#000000","labelContrast":8.2436},"baseVocabulary":{"kind":"exact-reuse","sourceId":"gold"},"semanticRef":"#/semantics/metrics/8","nonColorCue":{"shortLabel":"SR","shape":"pentagon","alwaysShowTextLabel":true},"notes":"Declared readiness evidence; gold must not imply wealthy people or guaranteed purchasing.","dark":{"hex":"#BFA000","oklch":{"L":0.7124706948176123,"C":0.14630034362733504,"H":95.03755878569575},"labelHex":"#000000","labelContrast":8.2436},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.demand_growth","nameTh":"การเปลี่ยนแปลงอุปสงค์","nameEn":"Demand growth","colorNameTh":"เขียวอ่อนการเปลี่ยนแปลง","colorNameEn":"Change lime leaf","lens":"metric","chromaRole":"supporting","light":{"hex":"#92B847","oklch":{"L":0.7316731240081499,"C":0.14704150702088775,"H":125.59420342250957},"labelHex":"#000000","labelContrast":9.1694},"baseVocabulary":{"kind":"location-extension","sourceId":null},"semanticRef":"#/semantics/metrics/9","nonColorCue":{"shortLabel":"GR","shape":"diamond","alwaysShowTextLabel":true},"notes":"A category accent only; its signed numerical scale retains separate decrease and increase poles.","dark":{"hex":"#92B847","oklch":{"L":0.7316731240081499,"C":0.14704150702088775,"H":125.59420342250957},"labelHex":"#000000","labelContrast":9.1694},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.accessibility","nameTh":"การเข้าถึงกลุ่มเป้าหมาย","nameEn":"Accessibility","colorNameTh":"ไซแอนการเข้าถึง","colorNameEn":"Access cyan","lens":"metric","chromaRole":"focused","light":{"hex":"#3DBBCD","oklch":{"L":0.7315808368201825,"C":0.10994604623201802,"H":208.8021216626632},"labelHex":"#000000","labelContrast":9.1881},"baseVocabulary":{"kind":"exact-reuse","sourceId":"cyan"},"semanticRef":"#/semantics/metrics/10","nonColorCue":{"shortLabel":"AC","shape":"cross","alwaysShowTextLabel":true},"notes":"Network and mode-specific access; not actual travel behaviour.","dark":{"hex":"#3DBBCD","oklch":{"L":0.7315808368201825,"C":0.10994604623201802,"H":208.8021216626632},"labelHex":"#000000","labelContrast":9.1881},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.competitive_pressure","nameTh":"แรงกดดันจากคู่แข่ง","nameEn":"Competitive pressure","colorNameTh":"คอรัล","colorNameEn":"Signal coral","lens":"metric","chromaRole":"focused","light":{"hex":"#F27642","oklch":{"L":0.7022422516632849,"C":0.1664540278633422,"H":42.08414409501679},"labelHex":"#000000","labelContrast":7.4455},"baseVocabulary":{"kind":"exact-reuse","sourceId":"coral"},"semanticRef":"#/semantics/metrics/11","nonColorCue":{"shortLabel":"CP","shape":"square","alwaysShowTextLabel":true},"notes":"Capacity-to-demand pressure is a measured ratio, not a threat probability.","dark":{"hex":"#F27642","oklch":{"L":0.7022422516632849,"C":0.1664540278633422,"H":42.08414409501679},"labelHex":"#000000","labelContrast":7.4455},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.service_gap","nameTh":"ช่องว่างกำลังบริการ","nameEn":"Service gap","colorNameTh":"แดงช่องว่าง","colorNameEn":"Gap scarlet","lens":"metric","chromaRole":"focused","light":{"hex":"#E45244","oklch":{"L":0.6336231374835729,"C":0.18394659966891994,"H":28.764055363453043},"labelHex":"#000000","labelContrast":5.5892},"baseVocabulary":{"kind":"location-extension","sourceId":null},"semanticRef":"#/semantics/metrics/12","nonColorCue":{"shortLabel":"GP","shape":"hexagon","alwaysShowTextLabel":true},"notes":"The warm accent identifies a signed gap; the actual scale shows surplus and unmet capacity separately.","dark":{"hex":"#E45244","oklch":{"L":0.6336231374835729,"C":0.18394659966891994,"H":28.764055363453043},"labelHex":"#000000","labelContrast":5.5892},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.cannibalization","nameTh":"การดึงยอดจากเครือข่ายเดิม","nameEn":"Own-network cannibalization","colorNameTh":"กุหลาบ","colorNameEn":"People rose","lens":"metric","chromaRole":"focused","light":{"hex":"#B72B63","oklch":{"L":0.5261698354257294,"C":0.18002764603195984,"H":1.7550720842876497},"labelHex":"#FFFFFF","labelContrast":5.9336},"baseVocabulary":{"kind":"exact-reuse","sourceId":"rose"},"semanticRef":"#/semantics/metrics/13","nonColorCue":{"shortLabel":"CN","shape":"circle","alwaysShowTextLabel":true},"notes":"Own-network transfer scenario; not a claim of observed customer loss.","dark":{"hex":"#B72B63","oklch":{"L":0.5261698354257294,"C":0.18002764603195984,"H":1.7550720842876497},"labelHex":"#FFFFFF","labelContrast":5.9336},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.occupancy_cost","nameTh":"ภาระค่าใช้พื้นที่","nameEn":"Occupancy cost","colorNameTh":"ส้มค่าใช้พื้นที่","colorNameEn":"Occupancy orange","lens":"metric","chromaRole":"focused","light":{"hex":"#D6600C","oklch":{"L":0.625955738427297,"C":0.16863167650941488,"H":47.27644390821022},"labelHex":"#000000","labelContrast":5.5377},"baseVocabulary":{"kind":"location-extension","sourceId":null},"semanticRef":"#/semantics/metrics/14","nonColorCue":{"shortLabel":"OC","shape":"square","alwaysShowTextLabel":true},"notes":"Cost burden uses warm orange without making a universal accept/reject judgement.","dark":{"hex":"#D6600C","oklch":{"L":0.625955738427297,"C":0.16863167650941488,"H":47.27644390821022},"labelHex":"#000000","labelContrast":5.5377},"themePolicy":"exact-original-light-HEX-in-both-themes"},
{"id":"li.unit_economics","nameTh":"ส่วนต่างจากการดำเนินงาน","nameEn":"Site operating margin","colorNameTh":"เขียวสน","colorNameEn":"Operating pine","lens":"metric","chromaRole":"quiet","light":{"hex":"#216D58","oklch":{"L":0.48256760086965717,"C":0.0812076788698979,"H":170.8794683732328},"labelHex":"#FFFFFF","labelContrast":6.1891},"baseVocabulary":{"kind":"location-extension","sourceId":null},"semanticRef":"#/semantics/metrics/15","nonColorCue":{"shortLabel":"UE","shape":"diamond","alwaysShowTextLabel":true},"notes":"Operating-margin category accent; break-even, loss and positive margin remain explicitly signed.","dark":{"hex":"#216D58","oklch":{"L":0.48256760086965717,"C":0.0812076788698979,"H":170.8794683732328},"labelHex":"#FFFFFF","labelContrast":6.1891},"themePolicy":"exact-original-light-HEX-in-both-themes"}
],
"scales":[
{
"scaleId":"li.demand",
"kind":"sequential",
"theme":"light",
"anchors":["#F1F5E5","#60C9AD","#25659A"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/0",
"designNote":"Paper-mint to active blue: demand stays outside the warm hazard lane.",
"classes":{"3":["#F1F5E5","#60C9AD","#25659A"],"5":["#F1F5E5","#AEDFC9","#60C9AD","#4097A6","#25659A"],"7":["#F1F5E5","#C3E6D1","#99D9C0","#60C9AD","#49A6A8","#3788A3","#25659A"],"9":["#F1F5E5","#D0EAD7","#AEDFC9","#8AD4BB","#60C9AD","#4FB0AA","#4097A6","#317EA0","#25659A"]},
"scaleVersion":"c58773acb4cf5d6996d6f18d568bf96768ce8db9b1e072a21ef439cb2ac11027",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"activity","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#F1F5E5","#EAF3E2","#E4F1DF","#DDEFDC","#D7ECDA","#D0EAD7","#C9E8D4","#C3E6D1","#BCE4CE","#B5E2CB","#AEDFC9","#A7DDC6","#A0DBC3","#99D9C0","#91D7BD","#8AD4BB","#82D2B8","#7AD0B5","#72CEB2","#69CBB0","#60C9AD","#5DC4AC","#59BFAC","#56BAAB","#53B5AB","#4FB0AA","#4CABA9","#49A6A8","#46A1A7","#439CA7","#4097A6","#3D92A5","#3A8DA4","#3788A3","#3483A1","#317EA0","#2F799F","#2C749E","#2A6F9D","#276A9B","#25659A"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.demand",
"kind":"sequential",
"theme":"dark",
"anchors":["#F1F5E5","#60C9AD","#25659A"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/0",
"designNote":"Paper-mint to active blue: demand stays outside the warm hazard lane.",
"classes":{"3":["#F1F5E5","#60C9AD","#25659A"],"5":["#F1F5E5","#AEDFC9","#60C9AD","#4097A6","#25659A"],"7":["#F1F5E5","#C3E6D1","#99D9C0","#60C9AD","#49A6A8","#3788A3","#25659A"],"9":["#F1F5E5","#D0EAD7","#AEDFC9","#8AD4BB","#60C9AD","#4FB0AA","#4097A6","#317EA0","#25659A"]},
"scaleVersion":"c58773acb4cf5d6996d6f18d568bf96768ce8db9b1e072a21ef439cb2ac11027",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"activity","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#F1F5E5","#EAF3E2","#E4F1DF","#DDEFDC","#D7ECDA","#D0EAD7","#C9E8D4","#C3E6D1","#BCE4CE","#B5E2CB","#AEDFC9","#A7DDC6","#A0DBC3","#99D9C0","#91D7BD","#8AD4BB","#82D2B8","#7AD0B5","#72CEB2","#69CBB0","#60C9AD","#5DC4AC","#59BFAC","#56BAAB","#53B5AB","#4FB0AA","#4CABA9","#49A6A8","#46A1A7","#439CA7","#4097A6","#3D92A5","#3A8DA4","#3788A3","#3483A1","#317EA0","#2F799F","#2C749E","#2A6F9D","#276A9B","#25659A"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.supply",
"kind":"sequential",
"theme":"light",
"anchors":["#EEF6F5","#87B5D4","#278E94"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/1",
"designNote":"Cool blue midpoint turns to steady service teal; show capacity units.",
"classes":{"3":["#EEF6F5","#87B5D4","#278E94"],"5":["#EEF6F5","#BAD5E5","#87B5D4","#5DA2B3","#278E94"],"7":["#EEF6F5","#CADFEA","#ABCCE0","#87B5D4","#6AA7BD","#4F9CAA","#278E94"],"9":["#EEF6F5","#D4E6ED","#BAD5E5","#A1C5DD","#87B5D4","#72ABC4","#5DA2B3","#4598A4","#278E94"]},
"scaleVersion":"671112f34b878219faf90fb3fd07cc05a919c134d798ff40fbc8ab278273c497",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#EEF6F5","#E9F3F3","#E4EFF2","#DEECF0","#D9E9EF","#D4E6ED","#CFE2EB","#CADFEA","#C5DCE8","#BFD9E7","#BAD5E5","#B5D2E3","#B0CFE2","#ABCCE0","#A6C8DE","#A1C5DD","#9CC2DB","#96BFD9","#91BBD7","#8CB8D6","#87B5D4","#83B3D1","#7FB1CD","#7BAFCA","#77ADC7","#72ABC4","#6EA9C0","#6AA7BD","#66A5BA","#61A3B7","#5DA2B3","#58A0B0","#549EAD","#4F9CAA","#4A9AA7","#4598A4","#4096A0","#3A949D","#34929A","#2E9097","#278E94"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.supply",
"kind":"sequential",
"theme":"dark",
"anchors":["#EEF6F5","#87B5D4","#278E94"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/1",
"designNote":"Cool blue midpoint turns to steady service teal; show capacity units.",
"classes":{"3":["#EEF6F5","#87B5D4","#278E94"],"5":["#EEF6F5","#BAD5E5","#87B5D4","#5DA2B3","#278E94"],"7":["#EEF6F5","#CADFEA","#ABCCE0","#87B5D4","#6AA7BD","#4F9CAA","#278E94"],"9":["#EEF6F5","#D4E6ED","#BAD5E5","#A1C5DD","#87B5D4","#72ABC4","#5DA2B3","#4598A4","#278E94"]},
"scaleVersion":"671112f34b878219faf90fb3fd07cc05a919c134d798ff40fbc8ab278273c497",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#EEF6F5","#E9F3F3","#E4EFF2","#DEECF0","#D9E9EF","#D4E6ED","#CFE2EB","#CADFEA","#C5DCE8","#BFD9E7","#BAD5E5","#B5D2E3","#B0CFE2","#ABCCE0","#A6C8DE","#A1C5DD","#9CC2DB","#96BFD9","#91BBD7","#8CB8D6","#87B5D4","#83B3D1","#7FB1CD","#7BAFCA","#77ADC7","#72ABC4","#6EA9C0","#6AA7BD","#66A5BA","#61A3B7","#5DA2B3","#58A0B0","#549EAD","#4F9CAA","#4A9AA7","#4598A4","#4096A0","#3A949D","#34929A","#2E9097","#278E94"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.market_size",
"kind":"sequential",
"theme":"light",
"anchors":["#F4F0E7","#7DBAC0","#213E70"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/2",
"designNote":"Intentional reuse of the accepted count route for a separately labelled aggregate quantity; not a unique hue identity.",
"classes":{"3":["#F4F0E7","#7DBAC0","#213E70"],"5":["#F4F0E7","#BAD5D4","#7DBAC0","#4C7A98","#213E70"],"7":["#F4F0E7","#CBDDD9","#A8CDCE","#7DBAC0","#5A8DA4","#3E688C","#213E70"],"9":["#F4F0E7","#D7E3DD","#BAD5D4","#9CC8CA","#7DBAC0","#649AAC","#4C7A98","#355C84","#213E70"]},
"scaleVersion":"c780e8dd920590325697d06bb8a87f568556f9f92356599f4b229f4bde519cd2",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"count","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#F4F0E7","#EEEDE5","#E8EBE3","#E3E8E1","#DDE5DF","#D7E3DD","#D1E0DB","#CBDDD9","#C5DAD7","#C0D8D6","#BAD5D4","#B4D2D2","#AED0D0","#A8CDCE","#A2CACC","#9CC8CA","#96C5C8","#90C2C6","#8ABFC4","#83BDC2","#7DBAC0","#78B3BC","#73ADB8","#6EA7B4","#69A0B0","#649AAC","#5F93A8","#5A8DA4","#5587A0","#50809C","#4C7A98","#477494","#436E90","#3E688C","#3A6288","#355C84","#315680","#2D507C","#294A78","#254474","#213E70"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.market_size",
"kind":"sequential",
"theme":"dark",
"anchors":["#F4F0E7","#7DBAC0","#213E70"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/2",
"designNote":"Intentional reuse of the accepted count route for a separately labelled aggregate quantity; not a unique hue identity.",
"classes":{"3":["#F4F0E7","#7DBAC0","#213E70"],"5":["#F4F0E7","#BAD5D4","#7DBAC0","#4C7A98","#213E70"],"7":["#F4F0E7","#CBDDD9","#A8CDCE","#7DBAC0","#5A8DA4","#3E688C","#213E70"],"9":["#F4F0E7","#D7E3DD","#BAD5D4","#9CC8CA","#7DBAC0","#649AAC","#4C7A98","#355C84","#213E70"]},
"scaleVersion":"c780e8dd920590325697d06bb8a87f568556f9f92356599f4b229f4bde519cd2",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"count","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#F4F0E7","#EEEDE5","#E8EBE3","#E3E8E1","#DDE5DF","#D7E3DD","#D1E0DB","#CBDDD9","#C5DAD7","#C0D8D6","#BAD5D4","#B4D2D2","#AED0D0","#A8CDCE","#A2CACC","#9CC8CA","#96C5C8","#90C2C6","#8ABFC4","#83BDC2","#7DBAC0","#78B3BC","#73ADB8","#6EA7B4","#69A0B0","#649AAC","#5F93A8","#5A8DA4","#5587A0","#50809C","#4C7A98","#477494","#436E90","#3E688C","#3A6288","#355C84","#315680","#2D507C","#294A78","#254474","#213E70"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.market_share",
"kind":"sequential",
"theme":"light",
"anchors":["#F0F4F9","#9BBBA6","#4B8FD8"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/7",
"designNote":"Sage midpoint turns to azure, while the percentage denominator defines meaning.",
"classes":{"3":["#F0F4F9","#9BBBA6","#4B8FD8"],"5":["#F0F4F9","#C5D7CF","#9BBBA6","#74A6C1","#4B8FD8"],"7":["#F0F4F9","#D2E0DB","#B8CFC2","#9BBBA6","#7FADBA","#68A0C9","#4B8FD8"],"9":["#F0F4F9","#DAE6E4","#C5D7CF","#B0C9BA","#9BBBA6","#87B1B4","#74A6C1","#609BCD","#4B8FD8"]},
"scaleVersion":"e18af290eee81d42e63269c261628f0fa108fcd48e5cbff02b407af95a712e51",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#F0F4F9","#ECF1F5","#E7EEF0","#E3EBEC","#DFE8E8","#DAE6E4","#D6E3E0","#D2E0DB","#CEDDD7","#C9DAD3","#C5D7CF","#C1D4CB","#BDD2C7","#B8CFC2","#B4CCBE","#B0C9BA","#ACC6B6","#A8C3B2","#A3C1AE","#9FBEAA","#9BBBA6","#97B9A9","#93B7AC","#8FB5AF","#8BB3B2","#87B1B4","#83AFB7","#7FADBA","#7BABBC","#78A9BF","#74A6C1","#70A4C4","#6CA2C6","#68A0C9","#649DCB","#609BCD","#5B99CF","#5796D2","#5394D4","#4F92D6","#4B8FD8"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.market_share",
"kind":"sequential",
"theme":"dark",
"anchors":["#F0F4F9","#9BBBA6","#4B8FD8"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/7",
"designNote":"Sage midpoint turns to azure, while the percentage denominator defines meaning.",
"classes":{"3":["#F0F4F9","#9BBBA6","#4B8FD8"],"5":["#F0F4F9","#C5D7CF","#9BBBA6","#74A6C1","#4B8FD8"],"7":["#F0F4F9","#D2E0DB","#B8CFC2","#9BBBA6","#7FADBA","#68A0C9","#4B8FD8"],"9":["#F0F4F9","#DAE6E4","#C5D7CF","#B0C9BA","#9BBBA6","#87B1B4","#74A6C1","#609BCD","#4B8FD8"]},
"scaleVersion":"e18af290eee81d42e63269c261628f0fa108fcd48e5cbff02b407af95a712e51",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#F0F4F9","#ECF1F5","#E7EEF0","#E3EBEC","#DFE8E8","#DAE6E4","#D6E3E0","#D2E0DB","#CEDDD7","#C9DAD3","#C5D7CF","#C1D4CB","#BDD2C7","#B8CFC2","#B4CCBE","#B0C9BA","#ACC6B6","#A8C3B2","#A3C1AE","#9FBEAA","#9BBBA6","#97B9A9","#93B7AC","#8FB5AF","#8BB3B2","#87B1B4","#83AFB7","#7FADBA","#7BABBC","#78A9BF","#74A6C1","#70A4C4","#6CA2C6","#68A0C9","#649DCB","#609BCD","#5B99CF","#5796D2","#5394D4","#4F92D6","#4B8FD8"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.spending_readiness",
"kind":"sequential",
"theme":"light",
"anchors":["#FFF5D8","#F3BC93","#BFA000"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/8",
"designNote":"Intentional reuse of accepted peach-to-gold vocabulary; readiness needs behavioural evidence and cannot be inferred from gold.",
"classes":{"3":["#FFF5D8","#F3BC93","#BFA000"],"5":["#FFF5D8","#FAD8B5","#F3BC93","#D9AE5F","#BFA000"],"7":["#FFF5D8","#FBE1C0","#F8D0AB","#F3BC93","#E0B370","#D1AA4D","#BFA000"],"9":["#FFF5D8","#FDE7C7","#FAD8B5","#F7CAA4","#F3BC93","#E6B57A","#D9AE5F","#CCA73F","#BFA000"]},
"scaleVersion":"4783a9b26dfb967223f8a88093330a8807db8c673e445b09397780a428029e47",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"built","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#FFF5D8","#FFF2D5","#FEEFD1","#FEECCE","#FDEACA","#FDE7C7","#FCE4C3","#FBE1C0","#FBDEBC","#FADBB9","#FAD8B5","#F9D6B2","#F9D3AF","#F8D0AB","#F7CDA8","#F7CAA4","#F6C7A1","#F5C59D","#F4C29A","#F4BF96","#F3BC93","#F0BB8E","#EEB989","#EBB884","#E8B77F","#E6B57A","#E3B475","#E0B370","#DEB16A","#DBB065","#D9AE5F","#D6AD59","#D3AC53","#D1AA4D","#CEA946","#CCA73F","#C9A638","#C7A42F","#C4A325","#C2A118","#BFA000"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.spending_readiness",
"kind":"sequential",
"theme":"dark",
"anchors":["#FFF5D8","#F3BC93","#BFA000"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/8",
"designNote":"Intentional reuse of accepted peach-to-gold vocabulary; readiness needs behavioural evidence and cannot be inferred from gold.",
"classes":{"3":["#FFF5D8","#F3BC93","#BFA000"],"5":["#FFF5D8","#FAD8B5","#F3BC93","#D9AE5F","#BFA000"],"7":["#FFF5D8","#FBE1C0","#F8D0AB","#F3BC93","#E0B370","#D1AA4D","#BFA000"],"9":["#FFF5D8","#FDE7C7","#FAD8B5","#F7CAA4","#F3BC93","#E6B57A","#D9AE5F","#CCA73F","#BFA000"]},
"scaleVersion":"4783a9b26dfb967223f8a88093330a8807db8c673e445b09397780a428029e47",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"built","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#FFF5D8","#FFF2D5","#FEEFD1","#FEECCE","#FDEACA","#FDE7C7","#FCE4C3","#FBE1C0","#FBDEBC","#FADBB9","#FAD8B5","#F9D6B2","#F9D3AF","#F8D0AB","#F7CDA8","#F7CAA4","#F6C7A1","#F5C59D","#F4C29A","#F4BF96","#F3BC93","#F0BB8E","#EEB989","#EBB884","#E8B77F","#E6B57A","#E3B475","#E0B370","#DEB16A","#DBB065","#D9AE5F","#D6AD59","#D3AC53","#D1AA4D","#CEA946","#CCA73F","#C9A638","#C7A42F","#C4A325","#C2A118","#BFA000"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.accessibility",
"kind":"sequential",
"theme":"light",
"anchors":["#EEF7FC","#92B4E6","#00858C"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/10",
"designNote":"Blue midpoint turns to cyan-teal for coverage under a stated network/mode/time condition.",
"classes":{"3":["#EEF7FC","#92B4E6","#00858C"],"5":["#EEF7FC","#BFD5F2","#92B4E6","#5C9DB8","#00858C"],"7":["#EEF7FC","#CDDFF5","#B2CBEE","#92B4E6","#6DA4C6","#4996AB","#00858C"],"9":["#EEF7FC","#D7E6F7","#BFD5F2","#A9C5EC","#92B4E6","#78A8CF","#5C9DB8","#3C91A2","#00858C"]},
"scaleVersion":"b849cb61e15a8a4e333941a1e4b5e38cb1278ba55d4d723bb622e55269eff73c",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#EEF7FC","#E9F4FB","#E5F0FA","#E0EDF9","#DBEAF8","#D7E6F7","#D2E3F6","#CDDFF5","#C9DCF4","#C4D9F3","#BFD5F2","#BBD2F1","#B6CFEF","#B2CBEE","#ADC8ED","#A9C5EC","#A4C1EB","#9FBEEA","#9BBBE8","#96B7E7","#92B4E6","#8DB2E1","#88AFDD","#82ADD8","#7DABD3","#78A8CF","#72A6CA","#6DA4C6","#67A1C1","#629FBD","#5C9DB8","#569AB4","#5098AF","#4996AB","#4393A6","#3C91A2","#348F9D","#2C8C99","#228A95","#168790","#00858C"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.accessibility",
"kind":"sequential",
"theme":"dark",
"anchors":["#EEF7FC","#92B4E6","#00858C"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/10",
"designNote":"Blue midpoint turns to cyan-teal for coverage under a stated network/mode/time condition.",
"classes":{"3":["#EEF7FC","#92B4E6","#00858C"],"5":["#EEF7FC","#BFD5F2","#92B4E6","#5C9DB8","#00858C"],"7":["#EEF7FC","#CDDFF5","#B2CBEE","#92B4E6","#6DA4C6","#4996AB","#00858C"],"9":["#EEF7FC","#D7E6F7","#BFD5F2","#A9C5EC","#92B4E6","#78A8CF","#5C9DB8","#3C91A2","#00858C"]},
"scaleVersion":"b849cb61e15a8a4e333941a1e4b5e38cb1278ba55d4d723bb622e55269eff73c",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#EEF7FC","#E9F4FB","#E5F0FA","#E0EDF9","#DBEAF8","#D7E6F7","#D2E3F6","#CDDFF5","#C9DCF4","#C4D9F3","#BFD5F2","#BBD2F1","#B6CFEF","#B2CBEE","#ADC8ED","#A9C5EC","#A4C1EB","#9FBEEA","#9BBBE8","#96B7E7","#92B4E6","#8DB2E1","#88AFDD","#82ADD8","#7DABD3","#78A8CF","#72A6CA","#6DA4C6","#67A1C1","#629FBD","#5C9DB8","#569AB4","#5098AF","#4996AB","#4393A6","#3C91A2","#348F9D","#2C8C99","#228A95","#168790","#00858C"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.competitive_pressure",
"kind":"sequential",
"theme":"light",
"anchors":["#FFF3DB","#E7B72C","#D85131"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/11",
"designNote":"Gold midpoint turns to clean coral; higher capacity ratio is not automatically danger.",
"classes":{"3":["#FFF3DB","#E7B72C","#D85131"],"5":["#FFF3DB","#F3D690","#E7B72C","#E28731","#D85131"],"7":["#FFF3DB","#F7DFA8","#F0CD78","#E7B72C","#E49530","#E07831","#D85131"],"9":["#FFF3DB","#F9E4B7","#F3D690","#EDC666","#E7B72C","#E59F2F","#E28731","#DE6D31","#D85131"]},
"scaleVersion":"34889b9d391b2a69910896c6d31fa920e3e7439da6004d2d81be80970b862207",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#FFF3DB","#FEF0D4","#FDEDCD","#FBEAC5","#FAE7BE","#F9E4B7","#F8E1AF","#F7DFA8","#F6DCA0","#F4D998","#F3D690","#F2D389","#F1D080","#F0CD78","#EECA6F","#EDC666","#ECC35D","#EBC053","#E9BD48","#E8BA3B","#E7B72C","#E7B22D","#E6AE2D","#E6A92E","#E6A42F","#E59F2F","#E59A2F","#E49530","#E39130","#E38C30","#E28731","#E18231","#E07D31","#E07831","#DF7231","#DE6D31","#DD6831","#DC6231","#DA5D31","#D95731","#D85131"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.competitive_pressure",
"kind":"sequential",
"theme":"dark",
"anchors":["#FFF3DB","#E7B72C","#D85131"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/11",
"designNote":"Gold midpoint turns to clean coral; higher capacity ratio is not automatically danger.",
"classes":{"3":["#FFF3DB","#E7B72C","#D85131"],"5":["#FFF3DB","#F3D690","#E7B72C","#E28731","#D85131"],"7":["#FFF3DB","#F7DFA8","#F0CD78","#E7B72C","#E49530","#E07831","#D85131"],"9":["#FFF3DB","#F9E4B7","#F3D690","#EDC666","#E7B72C","#E59F2F","#E28731","#DE6D31","#D85131"]},
"scaleVersion":"34889b9d391b2a69910896c6d31fa920e3e7439da6004d2d81be80970b862207",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#FFF3DB","#FEF0D4","#FDEDCD","#FBEAC5","#FAE7BE","#F9E4B7","#F8E1AF","#F7DFA8","#F6DCA0","#F4D998","#F3D690","#F2D389","#F1D080","#F0CD78","#EECA6F","#EDC666","#ECC35D","#EBC053","#E9BD48","#E8BA3B","#E7B72C","#E7B22D","#E6AE2D","#E6A92E","#E6A42F","#E59F2F","#E59A2F","#E49530","#E39130","#E38C30","#E28731","#E18231","#E07D31","#E07831","#DF7231","#DE6D31","#DD6831","#DC6231","#DA5D31","#D95731","#D85131"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.cannibalization",
"kind":"sequential",
"theme":"light",
"anchors":["#FFF0F0","#F0A07A","#B72B63"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/13",
"designNote":"Salmon midpoint turns to rose for a modelled own-network share; show scenario and counterfactual.",
"classes":{"3":["#FFF0F0","#F0A07A","#B72B63"],"5":["#FFF0F0","#F9C8B5","#F0A07A","#D56A70","#B72B63"],"7":["#FFF0F0","#FBD4C7","#F7BCA4","#F0A07A","#DD7A73","#CC596C","#B72B63"],"9":["#FFF0F0","#FCDCD3","#F9C8B5","#F5B498","#F0A07A","#E38575","#D56A70","#C64D6A","#B72B63"]},
"scaleVersion":"3f8e26fd576468d162b318cd114301b8829f17c8b85a96bf74788ae7411f592a",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#FFF0F0","#FFECEA","#FEE8E4","#FEE4DE","#FDE0D8","#FCDCD3","#FCD8CD","#FBD4C7","#FBD0C1","#FACCBB","#F9C8B5","#F8C4AF","#F8C0AA","#F7BCA4","#F6B89E","#F5B498","#F4B092","#F3AC8C","#F2A886","#F1A480","#F0A07A","#ED9B79","#EB9578","#E89077","#E58B76","#E38575","#E08074","#DD7A73","#DA7572","#D87071","#D56A70","#D2646F","#CF5F6D","#CC596C","#C9536B","#C64D6A","#C34768","#C04167","#BD3A66","#BA3364","#B72B63"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.cannibalization",
"kind":"sequential",
"theme":"dark",
"anchors":["#FFF0F0","#F0A07A","#B72B63"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/13",
"designNote":"Salmon midpoint turns to rose for a modelled own-network share; show scenario and counterfactual.",
"classes":{"3":["#FFF0F0","#F0A07A","#B72B63"],"5":["#FFF0F0","#F9C8B5","#F0A07A","#D56A70","#B72B63"],"7":["#FFF0F0","#FBD4C7","#F7BCA4","#F0A07A","#DD7A73","#CC596C","#B72B63"],"9":["#FFF0F0","#FCDCD3","#F9C8B5","#F5B498","#F0A07A","#E38575","#D56A70","#C64D6A","#B72B63"]},
"scaleVersion":"3f8e26fd576468d162b318cd114301b8829f17c8b85a96bf74788ae7411f592a",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#FFF0F0","#FFECEA","#FEE8E4","#FEE4DE","#FDE0D8","#FCDCD3","#FCD8CD","#FBD4C7","#FBD0C1","#FACCBB","#F9C8B5","#F8C4AF","#F8C0AA","#F7BCA4","#F6B89E","#F5B498","#F4B092","#F3AC8C","#F2A886","#F1A480","#F0A07A","#ED9B79","#EB9578","#E89077","#E58B76","#E38575","#E08074","#DD7A73","#DA7572","#D87071","#D56A70","#D2646F","#CF5F6D","#CC596C","#C9536B","#C64D6A","#C34768","#C04167","#BD3A66","#BA3364","#B72B63"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.occupancy_cost",
"kind":"sequential",
"theme":"light",
"anchors":["#FFF6DA","#EF9DAE","#D6600C"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/14",
"designNote":"Rose midpoint turns to orange, distinct from raw rent price; denominator is scoped revenue.",
"classes":{"3":["#FFF6DA","#EF9DAE","#D6600C"],"5":["#FFF6DA","#F9CAC4","#EF9DAE","#E3806D","#D6600C"],"7":["#FFF6DA","#FBD7CA","#F6BCBD","#EF9DAE","#E78981","#DF7757","#D6600C"],"9":["#FFF6DA","#FCE0CF","#F9CAC4","#F4B3B9","#EF9DAE","#E98F8E","#E3806D","#DD7148","#D6600C"]},
"scaleVersion":"e0647143fb39c5058fbed9cc66f2bc9e426f22b008bc95195f18aaa8a15522b3",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#FFF6DA","#FFF2D8","#FEEDD6","#FEE9D3","#FDE4D1","#FCE0CF","#FCDBCD","#FBD7CA","#FAD3C8","#FACEC6","#F9CAC4","#F8C5C2","#F7C1BF","#F6BCBD","#F5B8BB","#F4B3B9","#F3AFB7","#F2AAB5","#F1A6B2","#F0A2B0","#EF9DAE","#EE9AA8","#ED97A1","#EB959B","#EA9294","#E98F8E","#E88C87","#E78981","#E5867A","#E48373","#E3806D","#E27D66","#E07A5F","#DF7757","#DE7450","#DD7148","#DB6D3F","#DA6A36","#D9672C","#D7631F","#D6600C"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.occupancy_cost",
"kind":"sequential",
"theme":"dark",
"anchors":["#FFF6DA","#EF9DAE","#D6600C"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["less of stated metric","middle magnitude","more of stated metric"],
"pivotMeaning":null,
"semanticRef":"#/semantics/metrics/14",
"designNote":"Rose midpoint turns to orange, distinct from raw rent price; denominator is scoped revenue.",
"classes":{"3":["#FFF6DA","#EF9DAE","#D6600C"],"5":["#FFF6DA","#F9CAC4","#EF9DAE","#E3806D","#D6600C"],"7":["#FFF6DA","#FBD7CA","#F6BCBD","#EF9DAE","#E78981","#DF7757","#D6600C"],"9":["#FFF6DA","#FCE0CF","#F9CAC4","#F4B3B9","#EF9DAE","#E98F8E","#E3806D","#DD7148","#D6600C"]},
"scaleVersion":"e0647143fb39c5058fbed9cc66f2bc9e426f22b008bc95195f18aaa8a15522b3",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#FFF6DA","#FFF2D8","#FEEDD6","#FEE9D3","#FDE4D1","#FCE0CF","#FCDBCD","#FBD7CA","#FAD3C8","#FACEC6","#F9CAC4","#F8C5C2","#F7C1BF","#F6BCBD","#F5B8BB","#F4B3B9","#F3AFB7","#F2AAB5","#F1A6B2","#F0A2B0","#EF9DAE","#EE9AA8","#ED97A1","#EB959B","#EA9294","#E98F8E","#E88C87","#E78981","#E5867A","#E48373","#E3806D","#E27D66","#E07A5F","#DF7757","#DE7450","#DD7148","#DB6D3F","#DA6A36","#D9672C","#D7631F","#D6600C"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.demand_growth",
"kind":"diverging",
"theme":"light",
"anchors":["#CF5420","#F1F3EC","#3C9278"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["decrease","unchanged from stated baseline","increase"],
"pivotMeaning":{"value":0,"meaningTh":"ไม่เปลี่ยนจากช่วงฐานที่ระบุ","neutralInterval":"Must be declared; do not infer statistical significance from the central class."},
"semanticRef":"#/semantics/metrics/9",
"designNote":"Orange decrease versus green increase; sign does not imply universal benefit or harm.",
"classes":{"3":["#CF5420","#F1F3EC","#3C9278"],"5":["#CF5420","#E6A68B","#F1F3EC","#9AC2B0","#3C9278"],"7":["#CF5420","#E18F6E","#EBBDA8","#F1F3EC","#B4D1C2","#80B49F","#3C9278"],"9":["#CF5420","#DC7F5A","#E6A68B","#EDCDBB","#F1F3EC","#C6DACE","#9AC2B0","#6EAA94","#3C9278"]},
"scaleVersion":"e55ea18444907386aeced81c129cefb81f2f4dcf881edb10b22ee4d856086102",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"delta","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#CF5420","#D25D2E","#D5663A","#D76E46","#DA7750","#DC7F5A","#DE8764","#E18F6E","#E39778","#E49E82","#E6A68B","#E8AE95","#E9B69E","#EBBDA8","#ECC5B2","#EDCDBB","#EED4C5","#EFDCCF","#F0E4D8","#F1EBE2","#F1F3EC","#E8EEE6","#E0E9E0","#D7E4DA","#CEDFD4","#C6DACE","#BDD6C8","#B4D1C2","#ACCCBC","#A3C7B6","#9AC2B0","#92BDAA","#89B8A5","#80B49F","#77AF99","#6EAA94","#65A58E","#5BA088","#519C83","#47977D","#3C9278"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.demand_growth",
"kind":"diverging",
"theme":"dark",
"anchors":["#CF5420","#F1F3EC","#3C9278"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["decrease","unchanged from stated baseline","increase"],
"pivotMeaning":{"value":0,"meaningTh":"ไม่เปลี่ยนจากช่วงฐานที่ระบุ","neutralInterval":"Must be declared; do not infer statistical significance from the central class."},
"semanticRef":"#/semantics/metrics/9",
"designNote":"Orange decrease versus green increase; sign does not imply universal benefit or harm.",
"classes":{"3":["#CF5420","#F1F3EC","#3C9278"],"5":["#CF5420","#E6A68B","#F1F3EC","#9AC2B0","#3C9278"],"7":["#CF5420","#E18F6E","#EBBDA8","#F1F3EC","#B4D1C2","#80B49F","#3C9278"],"9":["#CF5420","#DC7F5A","#E6A68B","#EDCDBB","#F1F3EC","#C6DACE","#9AC2B0","#6EAA94","#3C9278"]},
"scaleVersion":"e55ea18444907386aeced81c129cefb81f2f4dcf881edb10b22ee4d856086102",
"intentionalVisualAliases":[{"study":"lds-story-study-20261001-r4","scaleId":"delta","theme":"light","scope":"Exact visual41-sample route only; independently labelled metric, units, denominator and evidence remain distinct."}],
"visualAliasPolicy":"Intentional reuse of accepted Story vocabulary; do not claim globally unique metric colours.",
"lut":["#CF5420","#D25D2E","#D5663A","#D76E46","#DA7750","#DC7F5A","#DE8764","#E18F6E","#E39778","#E49E82","#E6A68B","#E8AE95","#E9B69E","#EBBDA8","#ECC5B2","#EDCDBB","#EED4C5","#EFDCCF","#F0E4D8","#F1EBE2","#F1F3EC","#E8EEE6","#E0E9E0","#D7E4DA","#CEDFD4","#C6DACE","#BDD6C8","#B4D1C2","#ACCCBC","#A3C7B6","#9AC2B0","#92BDAA","#89B8A5","#80B49F","#77AF99","#6EAA94","#65A58E","#5BA088","#519C83","#47977D","#3C9278"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.service_gap",
"kind":"diverging",
"theme":"light",
"anchors":["#4885BC","#F1F3EC","#D44B3F"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["excess capacity","demand equals comparable supply","unmet capacity"],
"pivotMeaning":{"value":0,"meaningTh":"Demand และ Supply เท่ากันในหน่วยที่เปรียบเทียบได้","neutralInterval":"Declare tolerance; positive gap is not automatically a business opportunity."},
"semanticRef":"#/semantics/metrics/12",
"designNote":"Blue excess capacity versus warm unmet capacity; a positive gap is not automatically obtainable sales.",
"classes":{"3":["#4885BC","#F1F3EC","#D44B3F"],"5":["#4885BC","#9DBCD6","#F1F3EC","#EAA395","#D44B3F"],"7":["#4885BC","#84ABCE","#B6CCDD","#F1F3EC","#EEBBAF","#E58A7B","#D44B3F"],"9":["#4885BC","#73A0C9","#9DBCD6","#C7D7E1","#F1F3EC","#EFCBC0","#EAA395","#E1796A","#D44B3F"]},
"scaleVersion":"3722b7f60c687b12d6111497d2ca671afcf924e4eebe22439704ff7ef502e288",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#4885BC","#518BBF","#5A90C1","#6295C4","#6B9BC7","#73A0C9","#7BA6CC","#84ABCE","#8CB1D1","#94B6D3","#9DBCD6","#A5C1D8","#ADC7DA","#B6CCDD","#BED2DF","#C7D7E1","#CFDDE3","#D7E2E6","#E0E8E8","#E8EDEA","#F1F3EC","#F1EBE3","#F1E3DA","#F1DBD1","#F0D3C9","#EFCBC0","#EFC3B7","#EEBBAF","#EDB3A6","#EBAB9D","#EAA395","#E89B8C","#E79284","#E58A7B","#E38273","#E1796A","#DE7162","#DC6859","#D95F51","#D75548","#D44B3F"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.service_gap",
"kind":"diverging",
"theme":"dark",
"anchors":["#4885BC","#F1F3EC","#D44B3F"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["excess capacity","demand equals comparable supply","unmet capacity"],
"pivotMeaning":{"value":0,"meaningTh":"Demand และ Supply เท่ากันในหน่วยที่เปรียบเทียบได้","neutralInterval":"Declare tolerance; positive gap is not automatically a business opportunity."},
"semanticRef":"#/semantics/metrics/12",
"designNote":"Blue excess capacity versus warm unmet capacity; a positive gap is not automatically obtainable sales.",
"classes":{"3":["#4885BC","#F1F3EC","#D44B3F"],"5":["#4885BC","#9DBCD6","#F1F3EC","#EAA395","#D44B3F"],"7":["#4885BC","#84ABCE","#B6CCDD","#F1F3EC","#EEBBAF","#E58A7B","#D44B3F"],"9":["#4885BC","#73A0C9","#9DBCD6","#C7D7E1","#F1F3EC","#EFCBC0","#EAA395","#E1796A","#D44B3F"]},
"scaleVersion":"3722b7f60c687b12d6111497d2ca671afcf924e4eebe22439704ff7ef502e288",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#4885BC","#518BBF","#5A90C1","#6295C4","#6B9BC7","#73A0C9","#7BA6CC","#84ABCE","#8CB1D1","#94B6D3","#9DBCD6","#A5C1D8","#ADC7DA","#B6CCDD","#BED2DF","#C7D7E1","#CFDDE3","#D7E2E6","#E0E8E8","#E8EDEA","#F1F3EC","#F1EBE3","#F1E3DA","#F1DBD1","#F0D3C9","#EFCBC0","#EFC3B7","#EEBBAF","#EDB3A6","#EBAB9D","#EAA395","#E89B8C","#E79284","#E58A7B","#E38273","#E1796A","#DE7162","#DC6859","#D95F51","#D75548","#D44B3F"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.unit_economics",
"kind":"diverging",
"theme":"light",
"anchors":["#CD4D71","#F1F3EC","#48926C"],
"positions":[0,20,40],
"knots":null,
"canvas":"#F6F7F3",
"direction":["scoped operating shortfall","scoped operating break-even","positive scoped operating margin"],
"pivotMeaning":{"value":0,"meaningTh":"รายได้เท่ากับต้นทุนที่รวมในนิยามนี้","neutralInterval":"Declare tolerance; break-even is scoped, not company-level profitability."},
"semanticRef":"#/semantics/metrics/15",
"designNote":"Rose shortfall versus pine positive margin; zero includes only the stated cost scope.",
"classes":{"3":["#CD4D71","#F1F3EC","#48926C"],"5":["#CD4D71","#E6A3AC","#F1F3EC","#9EC2AA","#48926C"],"7":["#CD4D71","#DF8A9A","#EABBBF","#F1F3EC","#B7D1BD","#85B497","#48926C"],"9":["#CD4D71","#DB7A8E","#E6A3AC","#EDCBCC","#F1F3EC","#C7DACB","#9EC2AA","#74AA8B","#48926C"]},
"scaleVersion":"c48c60b3cf47c25906a8b7a23bd3ed037072b5be0007eb979ebc336ce8d00fe9",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#CD4D71","#D05777","#D3607D","#D66882","#D87188","#DB7A8E","#DD8294","#DF8A9A","#E292A0","#E49AA6","#E6A3AC","#E7ABB3","#E9B3B9","#EABBBF","#ECC3C5","#EDCBCC","#EED3D2","#EFDBD9","#F0E3DF","#F1EBE5","#F1F3EC","#E9EEE5","#E0E9DF","#D8E4D8","#D0DFD1","#C7DACB","#BFD5C4","#B7D1BD","#AFCCB7","#A6C7B1","#9EC2AA","#96BDA4","#8EB89D","#85B497","#7DAF91","#74AA8B","#6CA584","#63A07E","#5A9C78","#519772","#48926C"],
"themePolicy":"identical-light-values-on-both-themes"
},
{
"scaleId":"li.unit_economics",
"kind":"diverging",
"theme":"dark",
"anchors":["#CD4D71","#F1F3EC","#48926C"],
"positions":[0,20,40],
"knots":null,
"canvas":"#11191D",
"direction":["scoped operating shortfall","scoped operating break-even","positive scoped operating margin"],
"pivotMeaning":{"value":0,"meaningTh":"รายได้เท่ากับต้นทุนที่รวมในนิยามนี้","neutralInterval":"Declare tolerance; break-even is scoped, not company-level profitability."},
"semanticRef":"#/semantics/metrics/15",
"designNote":"Rose shortfall versus pine positive margin; zero includes only the stated cost scope.",
"classes":{"3":["#CD4D71","#F1F3EC","#48926C"],"5":["#CD4D71","#E6A3AC","#F1F3EC","#9EC2AA","#48926C"],"7":["#CD4D71","#DF8A9A","#EABBBF","#F1F3EC","#B7D1BD","#85B497","#48926C"],"9":["#CD4D71","#DB7A8E","#E6A3AC","#EDCBCC","#F1F3EC","#C7DACB","#9EC2AA","#74AA8B","#48926C"]},
"scaleVersion":"c48c60b3cf47c25906a8b7a23bd3ed037072b5be0007eb979ebc336ce8d00fe9",
"intentionalVisualAliases":[],
"visualAliasPolicy":"No exact Story41-sample route alias; near similarities are reported separately.",
"lut":["#CD4D71","#D05777","#D3607D","#D66882","#D87188","#DB7A8E","#DD8294","#DF8A9A","#E292A0","#E49AA6","#E6A3AC","#E7ABB3","#E9B3B9","#EABBBF","#ECC3C5","#EDCBCC","#EED3D2","#EFDBD9","#F0E3DF","#F1EBE5","#F1F3EC","#E9EEE5","#E0E9DF","#D8E4D8","#D0DFD1","#C7DACB","#BFD5C4","#B7D1BD","#AFCCB7","#A6C7B1","#9EC2AA","#96BDA4","#8EB89D","#85B497","#7DAF91","#74AA8B","#6CA584","#63A07E","#5A9C78","#519772","#48926C"],
"themePolicy":"identical-light-values-on-both-themes"
}
],
"counts":{"roles":16,"quantitativeMetrics":12,"sequential":9,"diverging":3,"categoricalEvidenceLenses":4,"themeRecords":24},
"themePolicy":{"required":true,"sourceTheme":"light","anchorsEqual":true,"lutEqual":true,"classesEqual":true,"valueDirectionEqual":true,"darkDerivationForbidden":true,"contrastRemedy":"Keep data HEX; use labels, meaningful boundaries or a neutral backplate. Test actual surfaces and sizes. No automatic 3:1, CVD or full accessibility claim."},
"intentionalVisualAliases":[
{"locationScale":"li.demand","storyScale":"activity","theme":"light","relationship":"Exact visual reuse; metric definitions and evidence remain separate."},
{"locationScale":"li.demand","storyScale":"activity","theme":"dark","relationship":"Exact visual reuse; metric definitions and evidence remain separate."},
{"locationScale":"li.market_size","storyScale":"count","theme":"light","relationship":"Exact visual reuse; metric definitions and evidence remain separate."},
{"locationScale":"li.market_size","storyScale":"count","theme":"dark","relationship":"Exact visual reuse; metric definitions and evidence remain separate."},
{"locationScale":"li.spending_readiness","storyScale":"built","theme":"light","relationship":"Exact visual reuse; metric definitions and evidence remain separate."},
{"locationScale":"li.spending_readiness","storyScale":"built","theme":"dark","relationship":"Exact visual reuse; metric definitions and evidence remain separate."},
{"locationScale":"li.demand_growth","storyScale":"delta","theme":"light","relationship":"Exact visual reuse; metric definitions and evidence remain separate."},
{"locationScale":"li.demand_growth","storyScale":"delta","theme":"dark","relationship":"Exact visual reuse; metric definitions and evidence remain separate."}
],
"approval":{"authority":"Montri","date":"2026-10-01","reference":"owner-message:2026-10-01:release-0.9.7-original-light-hex-on-both-themes","decision":"Adopt Story r4 and Location r2 LIGHT colors. Use each exact light anchor/LUT/class and role HEX unchanged on dark, with the same data direction; no derived dark formulas. Existing categorical palettes and decorative gradients retain their own contracts.","sourceHashes":{"approved-story-r4.json":"be696bc8f41520f85167678634407838ac5ed5c9bb9a802585146b0b2f36415f","approved-location-r2.json":"0906c14107ef20a2a42a5d1c830ffa56c0a88caca34d54096dc58b346faba279","approved-location-metrics.json":"44ad44d254262932812b61a5ca9e7a4b27c6ec89c7bfdc7da9eb0bb081a387e7"}},
"constraints":["No gradients for the four SWOT evidence lenses.","Spending readiness requires stated budget AND purchase intention, not spending power alone.","Role colors are not quantity scales; 16 unique HEX values are not a guarantee of 16 distinguishable hues.","Labels, metric definition, units, denominator and non-color cues remain mandatory.","Dark rendition formulas and their prototype contrast claims are superseded by the owner’s same-HEX decision."]
},
"assetFiles":[{"path":"assets/lds-0.9.7/machine/location-intelligence-0.9.7.css","bytes":100181,"sha256":"8d80360f8fef805e8b69aff67eb9b73df2babda379f19ccbec0beeb293a0999d","url":"https://montri-th.github.io/Landometer/v0.9.7/package/assets/lds-0.9.7/machine/location-intelligence-0.9.7.css"}],
"validationBoundary":"Metric/profile checks do not establish business facts, color-only accessibility, installed retrieval, user testing or signed artifact conformance."
}
```
<!-- LDS_MACHINE_END -->
