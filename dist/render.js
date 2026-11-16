export function renderApp(container, state, onRetry) {
    container.replaceChildren();
    if (state.status === 'idle') {
        return;
    }
    if (state.status === 'loading') {
        const box = document.createElement('div');
        box.className = 'message';
        box.textContent = 'Загрузка...';
        container.appendChild(box);
        return;
    }
    if (state.status === 'empty') {
        const box = document.createElement('div');
        box.className = 'message';
        box.textContent = `По запросу "${state.query}" ничего не найдено`;
        container.appendChild(box);
        return;
    }
    if (state.status === 'error') {
        const box = document.createElement('div');
        box.className = 'message error';
        const text = document.createElement('p');
        text.textContent = state.message;
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.type = 'button';
        btn.textContent = 'Повторить';
        btn.addEventListener('click', onRetry);
        box.append(text, btn);
        container.appendChild(box);
        return;
    }
    renderCards(container, state.countries, onRetry);
}
function renderCards(container, countries, onRetry) {
    const list = document.createElement('div');
    list.className = 'list';
    for (const country of countries) {
        const card = document.createElement('div');
        card.className = 'card';
        if (country.flagUrl) {
            const img = document.createElement('img');
            img.className = 'flag';
            img.src = country.flagUrl;
            img.alt = country.name;
            card.appendChild(img);
        }
        const title = document.createElement('h3');
        title.textContent = `${country.flagEmoji} ${country.name}`;
        const capital = document.createElement('p');
        capital.textContent = `Столица: ${country.capital}`;
        const region = document.createElement('p');
        region.textContent = `Регион: ${country.region}`;
        const pop = document.createElement('p');
        pop.textContent = `Население: ${country.population.toLocaleString('ru-RU')}`;
        card.append(title, capital, region, pop);
        card.addEventListener('click', () => {
            renderDetails(container, country, () => renderApp(container, { status: 'success', countries }, onRetry));
        });
        list.appendChild(card);
    }
    container.appendChild(list);
}
function renderDetails(container, country, onBack) {
    container.replaceChildren();
    const box = document.createElement('div');
    box.className = 'details';
    const backBtn = document.createElement('button');
    backBtn.className = 'btn';
    backBtn.type = 'button';
    backBtn.textContent = '← Назад';
    backBtn.addEventListener('click', onBack);
    const title = document.createElement('h2');
    title.textContent = `${country.flagEmoji} ${country.name} (${country.officialName})`;
    const lines = [
        `Столица: ${country.capital}`,
        `Регион: ${country.region}`,
        `Население: ${country.population.toLocaleString('ru-RU')}`,
        `Площадь: ${country.area.toLocaleString('ru-RU')} км²`,
        `Границы: ${country.borders.length ? country.borders.join(', ') : 'нет'}`,
        `Языки: ${country.languages.length ? country.languages.join(', ') : 'нет данных'}`,
        `Валюты: ${country.currencies.length ? country.currencies.join(', ') : 'нет данных'}`,
    ];
    box.append(backBtn, title);
    if (country.flagUrl) {
        const img = document.createElement('img');
        img.className = 'flag';
        img.src = country.flagUrl;
        img.alt = country.name;
        box.appendChild(img);
    }
    for (const line of lines) {
        const p = document.createElement('p');
        p.textContent = line;
        box.appendChild(p);
    }
    container.appendChild(box);
}
