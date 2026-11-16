import { HttpError, searchCountries } from './api.js';
import { debounce } from './debounce.js';
export function createSearch(onUpdate, fetcher = searchCountries, delay = 300) {
    let controller = null;
    let lastQuery = '';
    let currentState = { status: 'idle' };
    function setState(next) {
        currentState = next;
        onUpdate(next);
    }
    async function runSearch(query) {
        if (!query || query !== lastQuery)
            return;
        const nextController = new AbortController();
        controller = nextController;
        try {
            const countries = await fetcher(query, nextController.signal);
            if (countries.length === 0) {
                setState({ status: 'empty', query });
            }
            else {
                setState({ status: 'success', countries });
            }
        }
        catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                return;
            }
            if (err instanceof DOMException && err.name === 'TimeoutError') {
                setState({ status: 'error', message: 'Превышено время ожидания ответа.' });
                return;
            }
            if (err instanceof HttpError) {
                setState({ status: 'error', message: `Ошибка сервера: ${err.status}` });
                return;
            }
            setState({ status: 'error', message: 'Ошибка сети. Проверьте подключение.' });
        }
        finally {
            if (controller === nextController) {
                controller = null;
            }
        }
    }
    const debouncedSearch = debounce((q) => {
        void runSearch(q);
    }, delay);
    return {
        getState: () => currentState,
        input(value) {
            const query = value.trim();
            lastQuery = query;
            if (controller) {
                controller.abort();
                controller = null;
            }
            if (!query) {
                setState({ status: 'idle' });
                return;
            }
            setState({ status: 'loading' });
            debouncedSearch(query);
        },
        retry() {
            if (!lastQuery)
                return;
            if (controller) {
                controller.abort();
            }
            setState({ status: 'loading' });
            void runSearch(lastQuery);
        },
    };
}
