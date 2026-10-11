# CityMETER + Landom — เริ่มจากไฟล์นี้

GitHub handoff r2 · 11 ตุลาคม 2026

เปิด [Handoff + Implementation Plan](CityMETER_Landom_Unified_Handoff_Implementation_Plan_2026-10-11.md) สำหรับคำอธิบายและขั้นตอนทำงาน ไฟล์นี้รวม JSON สำหรับ agent ไว้ในส่วนท้ายแล้ว หากใช้กับเครื่องมือให้อ่าน [JSON แยก](CityMETER_Landom_Unified_Handoff_Implementation_Plan_2026-10-11.json) ซึ่งมีข้อมูลเดียวกัน

1. อ่าน baseline และข้อกำหนด D01–D15 ก่อนเริ่ม
2. เลือกเฉพาะ T00–T12 ที่ตรง change ไม่ต้องสร้างส่วนที่เผยแพร่แล้วใหม่
3. ใช้ inventory 43 dataset และ stable IDs จับคู่เรื่อง แผนที่ และ contributor
4. ใช้ prompt P01–P05 ตามงาน เก็บผลตรวจตาม A00–A12 และคงรายการที่ยังไม่ได้ตรวจ
5. การแก้ Sheet, การเปลี่ยน public facts และการเผยแพร่ให้ทำตาม scope ที่ได้รับมอบหมาย เก็บหลักฐานคนละส่วน

แพ็กประกอบด้วย Markdown, JSON, ตัวตรวจเอกสาร, ภาพตัวอย่าง, release receipts และสำเนา reference ที่คง bytes/hash เดิมใน `authorities/`. ไม่มี source repositories, executable website หรือ supporting release logs ทั้งหมด ชื่อไฟล์อ้างอิงภายใน receipt ยังคง relative ต่อ release เดิม ดู `evidenceIndex` ใน JSON

เจ้าของงานอนุญาตให้เผยแพร่ฉบับรวมนี้ใน CityMETER และ Landom พร้อมลิงก์ README. มี workbook URLs อ้างอิงซึ่งยังต้องใช้สิทธิ์เข้าถึงตามเดิม ไม่มี raw contacts หรือ private applicant records. OD01 เพิ่มเครดิตเอิร์ธ (CEDT) ที่พัฒนา Locale Insight ต่อจากอิ๋ง โดยคงเครดิตงานเดิม

ตรวจความตรงกันของเอกสารและไฟล์ในแพ็ก โดยไม่ build เว็บหรือแก้ cloud:

```sh
python3 validate-handoff.py
```

เพิ่ม `--workspace` ชี้ project root เดิมเมื่อต้องการตรวจ hashes ของ Git blobs ที่ pinned baseline 90 ไฟล์ด้วย (ไม่ใช่ working tree หรือ HEAD ล่าสุด) แพ็กไม่แนบ repositories เหล่านั้น จึงบันทึกการตรวจส่วนนี้เป็น `not_run` ถ้าไม่มี workspace

ผลตรวจที่ใช้เตรียมแพ็กอยู่ใน [validation-report.json](validation-report.json) และ [package-manifest.json](package-manifest.json). การตรวจเอกสารผ่านไม่เท่ากับ application, accessibility, device หรือ full LDS conformance ผ่านทั้งหมด สถานะเหล่านั้นแยกไว้ใน handoff

ใช้กับ clone แยกได้ด้วย `--citymeter-repo /path/to/CityMETER --landom-repo /path/to/Landom`. ไม่จำเป็นต้องมี raw Sheet; สถานะ receipt ต้นฉบับแยกจากไฟล์ supporting logs ที่ไม่ได้แนบ.

[ดาวน์โหลดแพ็ก r2 สำหรับใช้แบบออฟไลน์](CityMETER_Landom_Unified_Handoff_2026-10-11_r2.zip) — มีเฉพาะเอกสารและ references ไม่รวม source apps.
