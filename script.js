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
/* ========================= */
/* ЗАГРУЗКА ДАННЫХ */
/* ========================= */

async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

/* ========================= */
/* ДЕТСКИЙ ТИПОАНАЛИЗ */
/* ========================= */

async function calculateChildrenType() {
  const dateInput = document.getElementById("child_birthdate").value;
  if (!dateInput) {
    alert("Введите дату рождения ребёнка");
    return;
  }

  const date = new Date(dateInput);
  const day = date.getDate();

  const data = await loadJSON("data/children.json");

  let found = data.find((item) => {
    if (item.range.includes("-")) {
      const [start, end] = item.range.split("-").map(Number);
      return day >= start && day <= end;
    }
    return Number(item.range) === day;
  });

  if (!found) {
    document.getElementById("child_result").innerHTML = "<p>Тип не найден</p>";
    return;
  }

  renderChild(found);
}

function showChildType(id) {
  loadJSON("data/children.json").then((data) => {
    const found = data.find((item) => item.id === id);
    renderChild(found);
  });
}

function renderChild(type) {
  document.getElementById("child_result").innerHTML = `
    <div class="child-card">
      <h2><span class="child-icon">${type.icon}</span>${type.name}</h2>
      <p class="child-short">${type.short}</p>

      <div class="child-analysis">
        <div class="header">
          <h2>${type.name}</h2>
          <p>${type.short}</p>
        </div>

        <div class="tabs">
          <button data-tab="profile" class="active">Профиль</button>
          <button data-tab="emotions">Эмоции</button>
          <button data-tab="thinking">Мышление</button>
          <button data-tab="strengths">Сильные стороны</button>
          <button data-tab="risks">Риски</button>
          <button data-tab="shadow">Тень</button>
          <button data-tab="advice">Советы родителям</button>
          <button data-tab="forecast">Будущее ребёнка</button>
        </div>

        <div id="profile" class="tab-block active">
          <ul>${type.profile.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>

        <div id="emotions" class="tab-block">
          <ul>${type.emotions.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>

        <div id="thinking" class="tab-block">
          <ul>${type.thinking.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>

        <div id="strengths" class="tab-block">
          <ul>${type.strengths.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>

        <div id="risks" class="tab-block">
          <ul>${type.risks.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>

        <div id="shadow" class="tab-block">
          <ul>${type.shadow.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>

        <div id="advice" class="tab-block">
          <ul>${type.advice.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>

        <div id="forecast" class="tab-block">
          <ul>${type.forecast.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>
      </div>
    </div>
  `;
}

/* ========================= */
/* ВЗРОСЛЫЙ ТИПОАНАЛИЗ */
/* ========================= */

async function calculateType() {
  const dateInput = document.getElementById("birthdate").value;
  if (!dateInput) {
    alert("Введите дату рождения");
    return;
  }

  const date = new Date(dateInput);
  const day = date.getDate();

  const data = await loadJSON("data/adult.json");

  let found = data.find((item) => {
    if (item.range.includes("-")) {
      const [start, end] = item.range.split("-").map(Number);
      return day >= start && day <= end;
    }
    return Number(item.range) === day;
  });

  if (!found) {
    document.getElementById("result").innerHTML = "<p>Тип не найден</p>";
    return;
  }

  renderAdult(found);
}

function renderAdult(type) {
  document.getElementById("result").innerHTML = `
    <div class="adult-card">
      <div class="adult-title">
        <span class="adult-type-number">${adultIcons[type.id]} Тип ${type.id}:</span>
        <span class="adult-type-name">${type.name}</span>
      </div>

      <div class="gold-divider"></div>

      <div class="adult-section">
        <h3>Профиль</h3>
        <p>${type.profile}</p>
      </div>

      <div class="adult-section">
        <h3>Эмоции</h3>
        <p>${type.emotions}</p>
      </div>

      <div class="adult-section">
        <h3>Мышление</h3>
        <p>${type.thinking}</p>
      </div>

      <div class="adult-section">
        <h3>Сильные стороны</h3>
        <p>${type.strengths}</p>
      </div>

      <div class="adult-section">
        <h3>Риски</h3>
        <p>${type.risks}</p>
      </div>

      <div class="adult-section">
        <h3>Тень</h3>
        <p>${type.shadow}</p>
      </div>

      <div class="adult-section">
        <h3>Советы</h3>
        <p>${type.advice}</p>
      </div>

      <div class="adult-section">
        <h3>Близкие типы</h3>
        <ul class="close-types">
          ${type.close_types.map((i) => `<li>${adultIcons[i]} Тип ${i}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

/* ========================= */
/* СОВМЕСТИМОСТЬ */
/* ========================= */

async function calculateCompatibility() {
  const d1 = document.getElementById("birthdate1").value;
  const d2 = document.getElementById("birthdate2").value;

  if (!d1 || !d2) {
    alert("Введите обе даты");
    return;
  }

  const type1 = await getAdultTypeByDate(d1);
  const type2 = await getAdultTypeByDate(d2);

  document.getElementById("compat_result").innerHTML = `
  <div class="compat-card">
    <h2>Совместимость ${adultIcons[type1.id]}${type1.id} и ${adultIcons[type2.id]}${type2.id}</h2>
    <p>${type1.compatibility?.[type2.id] || "Описание совместимости отсутствует."}</p>
  </div>
`;
}

async function getAdultTypeByDate(dateInput) {
  const date = new Date(dateInput);
  const day = date.getDate();
  const data = await loadJSON("data/adult.json");

  return data.find((item) => {
    if (item.range.includes("-")) {
      const [start, end] = item.range.split("-").map(Number);
      return day >= start && day <= end;
    }
    return Number(item.range) === day;
  });
}

/* ========================= */
/* ИДЕАЛЬНЫЙ ПАРТНЁР */
/* ========================= */

async function calculateIdealPartner() {
  const d = document.getElementById("birthdate_partner").value;
  if (!d) {
    alert("Введите дату рождения");
    return;
  }

  const type = await getAdultTypeByDate(d);

  document.getElementById("partner_result").innerHTML = `
    <div class="partner-card">
      <h2>Идеальный партнёр для типа ${type.id}</h2>
      <p>Тип ${type.partner}</p>
      <p><strong>Почему подходит:</strong> ${type.partner_reason}</p>
    </div>
  `;
  document.addEventListener("click", function (e) {
    if (e.target.matches(".tabs button")) {
      const tab = e.target.dataset.tab;

      // снять активность со всех кнопок
      document
        .querySelectorAll(".tabs button")
        .forEach((btn) => btn.classList.remove("active"));

      // активировать текущую кнопку
      e.target.classList.add("active");

      // скрыть все блоки
      document
        .querySelectorAll(".tab-block")
        .forEach((block) => block.classList.remove("active"));

      // показать нужный блок
      document.getElementById(tab).classList.add("active");
    }
  });
  document.addEventListener("click", function (e) {
    if (e.target.matches(".tabs button")) {
      const tab = e.target.dataset.tab;

      document
        .querySelectorAll(".tabs button")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      document
        .querySelectorAll(".tab-block")
        .forEach((block) => block.classList.remove("active"));
      document.getElementById(tab).classList.add("active");
    }
  });
}
