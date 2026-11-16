import { renderApp } from './render.js';
import { createSearch } from './search.js';

const container = document.createElement('div');
container.className = 'container';

const heading = document.createElement('h1');
heading.textContent = 'Поиск стран';

const input = document.createElement('input');
input.className = 'search';
input.type = 'search';
input.placeholder = 'Введите название страны...';

const content = document.createElement('div');

const search = createSearch((state) => {
  renderApp(content, state, () => search.retry());
});

input.addEventListener('input', () => {
  search.input(input.value);
});

container.append(heading, input, content);
document.body.appendChild(container);
