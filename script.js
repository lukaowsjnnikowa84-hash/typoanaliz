// Загружаем JSON
async function loadChildrenData() {
  const response = await fetch("data/children.json");
  const data = await response.json();
  return data;
}

// Определение типа по ДНЮ рождения
async function calculateChildrenType() {
  const birthInput = document.getElementById("child_birthdate").value;

  if (!birthInput) {
    alert("Пожалуйста, выберите дату рождения.");
    return;
  }

  const birthDate = new Date(birthInput);
  const day = birthDate.getDate(); // ← ключ

  const data = await loadChildrenData();

  const range = data.date_ranges.find((r) => {
    if (r.range.includes("-")) {
      const [min, max] = r.range.split("-").map(Number);
      return day >= min && day <= max;
    } else {
      return day === Number(r.range);
    }
  });

  if (!range) {
    alert("День рождения вне диапазона анализа.");
    return;
  }

  showChildType(range.type_id);
}

// Показ типа
async function showChildType(typeId) {
  const data = await loadChildrenData();
  const type = data.types.find((t) => t.id === typeId);

  if (!type) {
    alert("Тип не найден.");
    return;
  }

  const result = document.getElementById("child_result");

  console.log("TYPE OBJECT:", type);

  result.innerHTML = `
  <div class="child-card">
    <h2>
      <span class="child-avatar">${type.icon}</span>
      Тип ${type.id} — ${type.name}
    </h2>

    <p><strong>Кратко:</strong> ${type.short}</p>

    <h3 data-section="profile">Профиль</h3>
    <ul>${type.profile.map((p) => `<li>${p}</li>`).join("")}</ul>

    <h3 data-section="emotions">Эмоции</h3>
    <ul>${type.emotions.map((e) => `<li>${e}</li>`).join("")}</ul>

    <h3 data-section="thinking">Мышление</h3>
    <ul>${type.thinking.map((t) => `<li>${t}</li>`).join("")}</ul>

    <h3 data-section="strengths">Сильные стороны</h3>
    <ul>${type.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>

    <h3 data-section="risks">Риски</h3>
    <ul>${type.risks.map((r) => `<li>${r}</li>`).join("")}</ul>

    <h3 data-section="shadow">Тень</h3>
    <ul>${type.shadow.map((s) => `<li>${s}</li>`).join("")}</ul>

    <h3 data-section="inclinations">Наклонности</h3>
    <ul>${type.inclinations.map((i) => `<li>${i}</li>`).join("")}</ul>

    <h3 data-section="future">Профессиональное будущее</h3>
    <ul>${type.future_profession.map((f) => `<li>${f}</li>`).join("")}</ul>

    <h3 data-section="advice">Советы родителям</h3>
    <ul>${type.advice.map((a) => `<li>${a}</li>`).join("")}</ul>

    <h3 data-section="forecast">Прогноз</h3>
    <p>${type.forecast.join("")}</p>

  </div>
`;

  // Анимация появления карточки при прокрутке
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  observer.observe(document.getElementById("child_result"));
}
