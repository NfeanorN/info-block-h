import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const base = "http://c55.aig2.almamed.kz";

const DEPT_KK = {
  "Женская консультация": "Әйелдер консультациясы",
  "Отделение специализированной помощи": "Мамандандырылған көмек бөлімшесі",
  "Отделение участковой службы": "Учаскелік қызмет бөлімшесі",
};

const SPEC_KK = {
  "Акушер-гинеколог": "Акушер-гинеколог",
  Эндокринолог: "Эндокринолог",
  Оториноларинголог: "Оториноларинголог",
  Офтальмолог: "Офтальмолог",
  Невропатолог: "Невропатолог",
  "Детский хирург": "Балалар хирургі",
  Хирург: "Хирург",
  Кардиолог: "Кардиолог",
  Травматолог: "Травматолог",
  Маммолог: "Маммолог",
  "Сосудистый хирург": "Тамыр хирургі",
  Онколог: "Онколог",
  Физиотерапевт: "Физиотерапевт",
  Стоматолог: "Стоматолог",
  Инфекционист: "Инфекционист",
  Фтизиатр: "Фтизиатр",
  Эпидемиолог: "Эпидемиолог",
  Дерматовенеролог: "Дерматовенеролог",
  Уролог: "Уролог",
  Ревматолог: "Ревматолог",
  Пульмонолог: "Пульмонолог",
  Гастроэнтеролог: "Гастроэнтеролог",
  Нефролог: "Нефролог",
  "Врач общей практики": "Жалпы практика дәрігері",
  Педиатр: "Педиатр",
};

const SLIDE_META = {
  ОСМС: {
    ru: "Обязательное социальное медицинское страхование. Статус и взносы — egov.kz / fms.kz.",
    kk: "Міндетті әлеуметтік медициналық сақтандыру. Мәртебе мен жарналар — egov.kz / fms.kz.",
    kkTitle: "МӘМС",
  },
  "Маршрут онкологического пациента": {
    ru: "Маршрут онкологического пациента: скрининг, диагностика и маршрутизация в ГП №25.",
    kk: "Онкологиялық пациент маршруты: скрининг, диагностика және №25 ҚЕ-де бағыттау.",
    kkTitle: "Онкологиялық пациент маршруты",
  },
  "Маршрут пациента (женщины)": {
    ru: "Маршрут пациентки: прикрепление, осмотры и направления в женской консультации.",
    kk: "Әйел пациент маршруты: тіркелу, қаралу және әйелдер консультациясындағы жолдамалар.",
    kkTitle: "Пациент маршруты (әйелдер)",
  },
  "Маршрут пациента (мужчины)": {
    ru: "Маршрут пациента: прикрепление, профилактика и направления к специалистам.",
    kk: "Ер пациент маршруты: тіркелу, профилактика және мамандарға жолдама.",
    kkTitle: "Пациент маршруты (ерлер)",
  },
  "Онко-скрининги": {
    ru: "Онкоскрининги по возрасту и показаниям. Запись — Call-центр 310-00-25.",
    kk: "Жасы мен көрсеткіш бойынша онкоскринингтер. Жазылу — Call-орталық 310-00-25.",
    kkTitle: "Онко-скринингтер",
  },
  Инсульт: {
    ru: "Признаки инсульта — действуйте быстро. При острых симптомах звоните 103.",
    kk: "Инсульт белгілері — тез әрекет етіңіз. Жедел белгілерде 103-ке қоңырау шалыңыз.",
    kkTitle: "Инсульт",
  },
  Корь: {
    ru: "Корь: вакцинация и профилактика. Уточните статус прививок в поликлинике.",
    kk: "Қызылша: вакцинация және профилактика. Екпе мәртебесін емханада нақтылаңыз.",
    kkTitle: "Қызылша",
  },
};

const LEGAL_TITLE_FIX = {
  "202016~1": {
    ru: "Правила оказания медицинской помощи в рамках ОСМС",
    kk: "МӘМС шеңберінде медициналық көмек көрсету қағидалары",
  },
  "ЗРК ФСМСЗакон Республики Казахстан от 16 ноября 2015 года № 405-V ЗРК": {
    ru: "Закон РК «Об обязательном социальном медицинском страховании» от 16.11.2015 № 405-V",
    kk: "ҚР «Міндетті әлеуметтік медициналық сақтандыру туралы» Заңы 16.11.2015 № 405-V",
  },
  "О ЗДОРОВЬЕ НАРОДА И СИСТЕМЕ ЗДРАВООХРАНЕНИЯ Кодекс Республики Казахстан от 7 июля 2020 года № 360-VI ЗРК": {
    ru: "Кодекс РК «О здоровье народа и системе здравоохранения» от 07.07.2020 № 360-VI",
    kk: "ҚР «Халық денсаулығы және денсаулық сақтау жүйесі туралы» кодексі 07.07.2020 № 360-VI",
  },
  Госпрограммы: {
    ru: "Государственные программы",
    kk: "Мемлекеттік бағдарламалар",
  },
  "Государственные символы Республики Казахстан": {
    ru: "Государственные символы Республики Казахстан",
    kk: "Қазақстан Республикасының мемлекеттік рәміздері",
  },
};

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

function parseSchedule(raw) {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
  const schedule = {};
  for (const d of days) {
    const v = (raw[d] || "").trim();
    if (v) schedule[d] = v.replace(/-/g, "–");
  }
  return schedule;
}

function parseDoctorName(name) {
  const clean = name.replace(/\s+/g, " ").trim();
  const onVacation = /отпуск/i.test(clean);
  let note;
  if (/взрослый/i.test(clean)) note = { ru: "ВЗРОСЛЫЙ", kk: "ЕРЕГЕК" };
  const display = clean
    .replace(/\s*ОТПУСК\s*/gi, " ")
    .replace(/\s*ВЗРОСЛЫЙ\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { display, onVacation, note };
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

function cleanTitle(raw) {
  return raw.replace(/\s+/g, " ").replace(/~\d+$/, "").trim();
}

function localizeLegal(title) {
  const fixed = LEGAL_TITLE_FIX[title];
  if (fixed) return fixed;
  const hasKk = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/.test(title);
  return { ru: title, kk: hasKk ? title : title };
}

function tsValue(value, indent = 0) {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return "undefined";
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => `${pad}  ${tsValue(v, indent + 1)}`);
    return `[\n${items.join(",\n")}\n${pad}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).filter((k) => value[k] !== undefined);
    if (keys.length === 0) return "{}";
    const items = keys.map(
      (k) => `${pad}  ${k}: ${tsValue(value[k], indent + 1)}`,
    );
    return `{\n${items.join(",\n")}\n${pad}}`;
  }
  return JSON.stringify(value);
}

async function main() {
  const divisions = await getJson(`${base}/doctor_display/division/list?showall=true`);
  const departments = [];
  const specialties = [];
  const doctors = [];

  for (const div of divisions) {
    const deptId = String(div.id);
    const ru = div.name.trim();
    departments.push({
      id: deptId,
      name: { ru, kk: DEPT_KK[ru] || ru },
    });

    const sectors = await getJson(
      `${base}/doctor_display/sector/list?division_id=${deptId}`,
    );

    for (const sec of sectors) {
      const specId = String(sec.id);
      const ruName = sec.name.replace(/\s+/g, " ").trim();
      const kkName =
        SPEC_KK[ruName] ||
        ruName
          .replace(/ВОП/gi, "ЖТД")
          .replace(/педиатрия/gi, "педиатрия");
      specialties.push({
        id: specId,
        name: { ru: ruName, kk: kkName },
        departmentId: deptId,
      });

      const docs = await getJson(
        `${base}/doctor_display/doctor/list?sector_id=${specId}&show_active=0`,
      );

      for (const doc of docs) {
        const { display, onVacation, note } = parseDoctorName(doc.name);
        const schedule = parseSchedule(doc);
        const item = {
          id: String(doc.id),
          name: display,
          specialtyId: specId,
          departmentId: deptId,
          room: String(doc.room || "—"),
          schedule,
        };
        if (onVacation) item.onVacation = true;
        if (note) item.note = note;
        doctors.push(item);
      }
    }
  }

  const specIdsWithDoctors = new Set(doctors.map((d) => d.specialtyId));
  const specialtiesFiltered = specialties.filter((s) =>
    specIdsWithDoctors.has(s.id),
  );

  const npiHtml = await (await fetch(`${base}/infomat/npi`)).text();
  const legalDocs = [];
  const seen = new Set();
  const rowRe =
    /<td[^>]*>\s*([^<]+?)\s*<\/td>\s*<td[^>]*>\s*<a href="([^"]+)"/g;
  let m;
  while ((m = rowRe.exec(npiHtml))) {
    const rawTitle = cleanTitle(m[1]);
    const href = m[2];
    if (!rawTitle || rawTitle.length < 3) continue;
    const id = href.includes("doc=")
      ? `doc-${href.split("doc=")[1]}`
      : href.includes("sub=")
        ? `sub-${href.split("sub=")[1]}`
        : `npi-${legalDocs.length + 1}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const titles = localizeLegal(rawTitle);
    legalDocs.push({
      id,
      title: titles,
      body: {
        ru: "Нормативно-правовой документ поликлиники. Полный текст доступен на информационном стенде и по запросу в регистратуре.",
        kk: "Емхананың нормативтік-құқықтық құжаты. Толық мәтін ақпарат стендінде және тіркеуде сұрау бойынша қолжетімді.",
      },
    });
  }

  const homeHtml = await (await fetch(`${base}/infomat`)).text();
  const slides = [];
  const slideRe =
    /<div class="main-slider__title">([^<]+)<\/div>\s*<img src="([^"]+)"/g;
  while ((m = slideRe.exec(homeHtml))) {
    const title = m[1].trim();
    let img = m[2].replace(/\\/g, "/");
    if (img.startsWith("/")) img = `${base}${img}`;
    else img = `${base}/${img}`;
    slides.push({ title, img });
  }

  const feedDir = path.join(root, "public", "brand", "feed", "almamed");
  fs.mkdirSync(feedDir, { recursive: true });
  const infoSlides = [];
  const usedTitles = new Set();

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    if (usedTitles.has(s.title) && s.title === "ОСМС") continue;
    usedTitles.add(s.title);

    const ext = path.extname(new URL(s.img).pathname) || ".jpg";
    const file = `slide-${i + 1}${ext}`;
    try {
      await download(s.img, path.join(feedDir, file));
      const meta = SLIDE_META[s.title];
      infoSlides.push({
        id: `slide-${i + 1}`,
        title: {
          ru: s.title,
          kk: meta?.kkTitle || s.title,
        },
        body: {
          ru:
            meta?.ru ||
            "Информационный материал инфомата. Подробности — в регистратуре / Call-центр.",
          kk:
            meta?.kk ||
            "Инфомат ақпараттық материалы. Толығырақ — тіркеу / Call-орталық.",
        },
        badge: {
          ru: s.title,
          kk: meta?.kkTitle || s.title,
        },
        image: `/brand/feed/almamed/${file}`,
      });
    } catch (e) {
      console.warn("skip image", s.img, e.message);
    }
  }

  try {
    await download(
      `${base}/infomat-box/images/main-page-slider/bribe.png`,
      path.join(root, "public", "brand", "feed", "bribe.png"),
    );
  } catch {
  }

  const outPath = path.join(root, "src", "lib", "data", "clinicData.generated.ts");
  const header = `import type { Department, Doctor, InfoSlide, LegalDoc, Specialty } from "@/lib/types";

`;

  const body = [
    `export const departments: Department[] = ${tsValue(departments)};`,
    `export const specialties: Specialty[] = ${tsValue(specialtiesFiltered)};`,
    `export const doctors: Doctor[] = ${tsValue(doctors)};`,
    `export const legalDocs: LegalDoc[] = ${tsValue(legalDocs)};`,
    `export const infoSlidesFromSite: InfoSlide[] = ${tsValue(infoSlides)};`,
  ].join("\n\n");

  fs.writeFileSync(outPath, header + body + "\n", "utf8");
  console.log(
    `OK: ${departments.length} depts, ${specialtiesFiltered.length}/${specialties.length} specs, ${doctors.length} doctors, ${legalDocs.length} docs, ${infoSlides.length} slides`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
