const adultIcons = {
  1: "⚡",
  2: "💛",
  3: "📐",
  4: "🎭",
  5: "📘",
  6: "🍃",
  7: "🔥",
  8: "❄️",
  9: "🌊",
  10: "🛡️",
  11: "🌙",
  12: "🎯",
};

const childIcons = {
  1: "⭐",
  2: "💛",
  3: "🔧",
  4: "🎨",
  5: "📘",
  6: "🌿",
  7: "🔥",
  8: "🧊",
  9: "🤝",
  10: "🛠",
  11: "🌙",
  12: "🎯",
};

/* ============================
   ЗАГРУЗКА ДАННЫХ
============================ */

async function loadData() {
  const response = await fetch("data/adult.json");
  return await response.json();
}

async function loadChildrenData() {
  const response = await fetch("data/children.json");
  return await response.json();
}

/* ============================
   ОПРЕДЕЛЕНИЕ ТИПА ПО ДАТЕ
============================ */

function getTypeIdByDate(date, dateRanges) {
  const day = date.getDate();

  for (const range of dateRanges) {
    const [start, end] = range.range.split("-").map(Number);

    if (end) {
      if (day >= start && day <= end) return range.type_id;
    } else {
      if (day === start) return range.type_id;
    }
  }

  return null;
}

/* ============================
   ВЗРОСЛЫЕ — ВЫВОД РЕЗУЛЬТАТА
============================ */

function renderResult(typeData) {
  return `
    <div class="adult-card">

      <h2 class="adult-title">
        <span class="adult-type-number">${adultIcons[typeData.id]} Тип ${typeData.id}</span>
        <span class="adult-type-name">${typeData.name}</span>
      </h2>

      <div class="gold-divider"></div>

      <div class="adult-section">
        <h3>Эмоции</h3>
        <p>${typeData.adult_analysis.emotions}</p>
      </div>

      <div class="adult-section">
        <h3>Мышление</h3>
        <p>${typeData.adult_analysis.thinking}</p>
      </div>

      <div class="adult-section">
        <h3>Сильные стороны</h3>
        <p>${typeData.adult_analysis.strengths}</p>
      </div>

      <div class="adult-section">
        <h3>Риски</h3>
        <p>${typeData.adult_analysis.risks}</p>
      </div>

      <div class="adult-section">
        <h3>Тень</h3>
        <p>${typeData.adult_analysis.shadow}</p>
      </div>

      <div class="adult-section">
        <h3>Совет</h3>
        <p>${typeData.adult_analysis.advice}</p>
      </div>

      <div class="gold-divider"></div>

      <div class="adult-section">
        <h3>Близкие типы</h3>
        <ul class="close-types">
          ${typeData.close_types
            .map((t) => `<li><strong>Тип ${t.id}</strong> — ${t.reason}</li>`)
            .join("")}
        </ul>
      </div>

    </div>
  `;
}

/* ============================
   ВЗРОСЛЫЕ — ОПРЕДЕЛЕНИЕ ТИПА
============================ */

async function calculateType() {
  const date1 = document.getElementById("birthdate").value;

  if (!date1) {
    document.getElementById("result").innerHTML =
      "<p>Введите дату рождения.</p>";
    return;
  }

  const data = await loadData();
  const typeId = getTypeIdByDate(new Date(date1), data.date_ranges);
  const typeData = data.types.find((t) => t.id === typeId);

  document.getElementById("result").innerHTML = renderResult(typeData);
}

/* ============================
   ДЕТИ — ПОЛНЫЙ ИНТЕРФЕЙС АНАЛИЗА
============================ */

function renderChildFullInterface() {
  return `
    <div class="child-analysis">

      <div class="header">
        <h2 id="type-name"></h2>
        <p id="type-short"></p>
      </div>

      <div class="tabs">
        <button data-tab="profile">Профиль</button>
        <button data-tab="emotions">Эмоции</button>
        <button data-tab="thinking">Мышление</button>
        <button data-tab="strengths">Сильные стороны</button>
        <button data-tab="risks">Риски</button>
        <button data-tab="shadow">Тень</button>
        <button data-tab="advice">Советы</button>
        <button data-tab="child_domains">Проявления</button>
        <button data-tab="future">Будущее ребёнка</button>
      </div>

      <div class="tab-content">
        <div id="profile" class="tab-block"></div>
        <div id="emotions" class="tab-block"></div>
        <div id="thinking" class="tab-block"></div>
        <div id="strengths" class="tab-block"></div>
        <div id="risks" class="tab-block"></div>
        <div id="shadow" class="tab-block"></div>
        <div id="advice" class="tab-block"></div>
        <div id="child_domains" class="tab-block"></div>

        <div id="future" class="tab-block">
          <h3>Прогноз развития</h3>
          <p id="forecast"></p>

          <h3>Взрослые роли</h3>
          <ul id="adult_roles"></ul>

          <h3>Профессиональные склонности</h3>
          <ul id="professional_domains"></ul>
        </div>
      </div>

    </div>
  `;
}

/* ============================
   ДЕТИ — ЗАПОЛНЕНИЕ ВКЛАДОК
============================ */

function fillList(id, items) {
  const block = document.getElementById(id);
  block.innerHTML =
    "<ul>" + items.map((i) => `<li>${i}</li>`).join("") + "</ul>";
}

async function loadChildType(typeId) {
  const data = await loadChildrenData();
  const type = data.types.find((t) => t.type === typeId);

  document.getElementById("type-name").textContent =
    `${childIcons[type.type]} ${type.name}`;
  document.getElementById("type-short").textContent = type.short_description;

  fillList("profile", [
    type.short_description,
    ...type.strengths,
    ...type.emotions,
  ]);

  fillList("emotions", type.emotions);
  fillList("thinking", type.thinking);
  fillList("strengths", type.strengths);
  fillList("risks", type.risks);
  fillList("shadow", type.shadow);
  fillList("advice", type.advice);
  fillList("child_domains", type.child_domains);

  document.getElementById("forecast").textContent = type.forecast;
  fillList("adult_roles", type.adult_roles);
  fillList("professional_domains", type.professional_domains);
}

/* ============================
   ДЕТИ — ОПРЕДЕЛЕНИЕ ТИПА
============================ */

async function calculateChildrenType() {
  const birthInput = document.getElementById("child_birthdate").value;

  if (!birthInput) {
    document.getElementById("child_result").innerHTML =
      "<p>Пожаложалуйста, выберите дату рождения ребёнка.</p>";
    return;
  }

  const birthDate = new Date(birthInput);
  const data = await loadChildrenData();

  const typeId = getTypeIdByDate(birthDate, data.date_ranges);

  if (!typeId) {
    document.getElementById("child_result").innerHTML =
      "<p>Тип не найден. Проверьте дату.</p>";
    return;
  }

  document.getElementById("child_result").innerHTML =
    renderChildFullInterface();
  loadChildType(typeId);

  document
    .querySelector('.tabs button[data-tab="profile"]')
    .classList.add("active");
  document.getElementById("profile").classList.add("active");
}

/* ============================
   ДЕТИ — ВЫБОР ТИПА ВРУЧНУЮ
============================ */

function showChildType(typeId) {
  document.getElementById("child_result").innerHTML =
    renderChildFullInterface();
  loadChildType(typeId);

  document
    .querySelector('.tabs button[data-tab="profile"]')
    .classList.add("active");
  document.getElementById("profile").classList.add("active");
}
/* ============================
   ВЗРОСЛЫЕ — СОВМЕСТИМОСТЬ
============================ */

async function loadCompatibility() {
  const response = await fetch("data/compatibility.json");
  return await response.json();
}

async function calculateCompatibility() {
  const date1 = document.getElementById("birthdate1").value;
  const date2 = document.getElementById("birthdate2").value;

  if (!date1 || !date2) {
    document.getElementById("result").innerHTML = `
      <div class="compat-card">
        <h2>Ошибка</h2>
        <p>Введите обе даты рождения для расчёта совместимости.</p>
      </div>
    `;
    return;
  }

  const adultData = await loadData();
  const compData = await loadCompatibility();

  const typeId1 = getTypeIdByDate(new Date(date1), adultData.date_ranges);
  const typeId2 = getTypeIdByDate(new Date(date2), adultData.date_ranges);

  const key = `${typeId1}-${typeId2}`;
  const compatibilityText = compData[key];

  document.getElementById("result").innerHTML = `
    <div class="compat-card">

      <div class="compat-icons">
        <div class="compat-icon">${adultIcons[typeId1]}</div>
        <div class="compat-plus">∞</div>
        <div class="compat-icon">${adultIcons[typeId2]}</div>
      </div>

      <div class="compat-divider"></div>

      <h2>Совместимость типов ${typeId1} и ${typeId2}</h2>
      <p>${compatibilityText || "Описание совместимости отсутствует."}</p>
    </div>
  `;
}

/* ============================
   ВЗРОСЛЫЕ — ИДЕАЛЬНЫЙ ПАРТНЁР
============================ */
async function loadIdealPartner() {
  const response = await fetch("data/ideal_partner.json");
  return await response.json();
}

async function calculateIdealPartner() {
  const date = document.getElementById("birthdate_partner").value;

  if (!date) {
    document.getElementById("result").innerHTML = `
      <div class="partner-card">
        <h2>Ошибка</h2>
        <p>Введите дату рождения, чтобы увидеть идеального партнёра.</p>
      </div>
    `;
    return;
  }

  const adultData = await loadData();
  const idealData = await loadIdealPartner();

  const typeId = getTypeIdByDate(new Date(date), adultData.date_ranges);
  const ideal = idealData[typeId];

  if (!ideal) {
    document.getElementById("result").innerHTML = `
      <div class="partner-card">
        <h2>Нет данных</h2>
        <p>Для этого типа нет информации об идеальном партнёре.</p>
      </div>
    `;
    return;
  }

  document.getElementById("result").innerHTML = `
    <div class="partner-card">
      <h2>Идеальный партнёр для типа ${typeId}</h2>
      <p><strong>Тип:</strong> ${ideal.type}</p>
      <p><strong>Почему подходит:</strong> ${ideal.reason}</p>
    </div>
  `;
}
