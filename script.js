/* ============================
   ДЕТСКИЕ ИКОНКИ
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
  const birthInput = document.getElementById("birthdate").value;

  if (!birthInput) {
    document.getElementById("result").innerHTML =
      "<p>Пожалуйста, выберите дату рождения.</p>";
    return;
  }

  const birthDate = new Date(birthInput);
  const data = await loadData();

  const typeId = getTypeIdByDate(birthDate, data.date_ranges);

  if (!typeId) {
    document.getElementById("result").innerHTML =
      "<p>Тип не найден. Проверьте дату.</p>";
    return;
  }

  const typeData = data.types.find((t) => t.id === typeId);

  document.getElementById("result").innerHTML = renderResult(typeData);
}

/* ============================
   ДЕТИ — ВЫВОД КАРТОЧКИ
============================ */

function renderChildrenResult(typeData) {
  return `
    <div class="child-card">
      <h2>
        <span class="child-icon">${childIcons[typeData.type]}</span>
        Тип ${typeData.type} — ${typeData.name}
      </h2>

      <div class="child-divider"></div>

      <p><strong>Эмоции:</strong> ${typeData.emotions.join(", ")}</p>
      <p><strong>Мышление:</strong> ${typeData.thinking.join(", ")}</p>
      <p><strong>Сильные стороны:</strong> ${typeData.strengths.join(", ")}</p>
      <p><strong>Риски:</strong> ${typeData.risks.join(", ")}</p>
      <p><strong>Тени:</strong> ${typeData.shadow.join(", ")}</p>

      <div class="child-divider"></div>

      <p><strong>Совет родителям:</strong> ${typeData.advice.join(", ")}</p>
      <p><strong>Прогноз:</strong> ${typeData.forecast}</p>

      <div class="child-divider"></div>

      <p><strong>Сферы проявления ребёнка:</strong> ${typeData.child_domains.join(", ")}</p>

      <div class="child-divider"></div>

      <p><strong>Профессиональные сферы:</strong> ${typeData.professional_domains.join(", ")}</p>

      <div class="child-divider"></div>

      <p><strong>Во взрослом возрасте часто бывают:</strong> ${typeData.adult_roles.join(", ")}</p>
    </div>
  `;
}

/* ============================
   ДЕТИ — ОПРЕДЕЛЕНИЕ ТИПА
============================ */

async function calculateChildrenType() {
  const birthInput = document.getElementById("child_birthdate").value;

  if (!birthInput) {
    document.getElementById("child_result").innerHTML =
      "<p>Пожалуйста, выберите дату рождения ребёнка.</p>";
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

  const typeData = data.types.find((t) => t.type === typeId);
  const icon = childIcons[typeData.type];

  document.getElementById("child_result").innerHTML =
    renderChildrenResult(typeData);
}

/* ============================
   ДЕТИ — ВЫБОР ТИПА ВРУЧНУЮ
============================ */

function showChildType(typeId) {
  loadChildrenData().then((data) => {
    const typeData = data.types.find((t) => t.type === typeId);
    document.getElementById("child_result").innerHTML =
      renderChildrenResult(typeData);
  });
}

/* ============================
   ПЕРЕКЛЮЧАТЕЛЬ МОДУЛЕЙ
============================ */

function showAdult() {
  document.querySelector(".container-adult").style.display = "block";
  document.querySelector(".container-child").style.display = "none";

  document.querySelectorAll(".switcher button")[0].classList.add("active");
  document.querySelectorAll(".switcher button")[1].classList.remove("active");
}

function showChild() {
  document.querySelector(".container-adult").style.display = "none";
  document.querySelector(".container-child").style.display = "block";

  document.querySelectorAll(".switcher button")[1].classList.add("active");
  document.querySelectorAll(".switcher button")[0].classList.remove("active");
}
