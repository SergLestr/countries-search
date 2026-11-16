export function mapCountryResponse(raw) {
    const name = typeof raw.name === 'string' ? raw.name : (raw.name?.common ?? 'Неизвестно');
    const officialName = raw.officialName ?? (typeof raw.name === 'object' ? raw.name?.official : undefined) ?? name;
    const capital = Array.isArray(raw.capital)
        ? raw.capital.join(', ') || 'Нет столицы'
        : (raw.capital ?? 'Нет столицы');
    const languages = Array.isArray(raw.languages)
        ? raw.languages.map((l) => l.name ?? l.code ?? '').filter(Boolean)
        : raw.languages
            ? Object.values(raw.languages)
            : [];
    const currencies = Array.isArray(raw.currencies)
        ? raw.currencies
            .map((c) => (c.symbol ? `${c.name ?? c.code} (${c.symbol})` : (c.name ?? c.code ?? '')))
            .filter(Boolean)
        : raw.currencies
            ? Object.values(raw.currencies).map((c) => c.symbol ? `${c.name} (${c.symbol})` : (c.name ?? ''))
            : [];
    return {
        name,
        officialName,
        flagUrl: raw.flags?.svg ?? raw.flags?.png ?? '',
        flagEmoji: raw.flag ?? '',
        capital,
        region: raw.region ?? 'Неизвестно',
        population: raw.population ?? 0,
        area: raw.area ?? 0,
        borders: raw.borders ?? [],
        languages,
        currencies,
    };
}
