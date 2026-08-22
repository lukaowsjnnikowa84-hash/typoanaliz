/* ============================
   ИКОНКИ ДЕТСКИХ ТИПОВ
============================ */

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
    <h2>Тип ${typeData.id}</h2>

    <div class="divider"></div>

    <p><strong>Эмоции:</strong> ${typeData.analysis.emotional_rhythm || typeData.analysis.emotions}</p>
    <p><strong>Мышление:</strong> ${typeData.analysis.thinking}</p>
    <p><strong>Сильные стороны:</strong> ${typeData.analysis.strengths}</p>
    <p><strong>Риски:</strong> ${typeData.analysis.risks}</p>
    <p><strong>Тень:</strong> ${typeData.analysis.shadow}</p>

    <div class="divider"></div>

    <p><strong>Профессии:</strong> ${typeData.analysis.professions}</p>

    <div class="divider"></div>

    <p><strong>Совет:</strong> ${typeData.analysis.advice}</p>
    <p><strong>Прогноз:</strong> ${typeData.analysis.forecast}</p>

    <div class="divider"></div>

    <p><strong>Близкие типы:</strong></p>
    <ul>
      ${typeData.close_types
        .map((t) => `<li>Тип ${t.id}: ${t.reason}</li>`)
        .join("")}
    </ul>
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
