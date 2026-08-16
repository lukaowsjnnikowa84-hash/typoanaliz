async function loadData() {
    const response = await fetch("data.json");
    return await response.json();
}

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

function renderResult(typeData) {
    return `
        <h2>Тип ${typeData.id}: ${typeData.name}</h2>

        <div class="divider"></div>

        <p><strong>Эмоциональный ритм:</strong> ${typeData.analysis.emotional_rhythm}</p>
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
                .map(t => `<li>Тип ${t.id}: ${t.reason}</li>`)
                .join("")}
        </ul>
    `;
}

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

    const typeData = data.types.find(t => t.id === typeId);

    document.getElementById("result").innerHTML = renderResult(typeData);
}
