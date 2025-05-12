const API_KEY = 'pub_8501869c09275ad14ce7a068052c754a53d05';

async function getNews(category = 'top') {
  const url = category === 'all'
    ? `https://newsdata.io/api/1/news?country=ru&language=ru&apikey=${API_KEY}`
    : `https://newsdata.io/api/1/news?country=ru&language=ru&category=${category}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const articles = data.results || [];
    renderNews(articles);
  } catch (err) {
    console.error('Ошибка при получении новостей:', err);
    renderNews([]); // пустой вывод
  }
}

function renderNews(articles) {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';

  const validArticles = articles;

  if (!validArticles.length) {
    container.innerHTML = '<p>Нет новостей с изображениями по выбранной категории.</p>';
    return;
  }

  validArticles.forEach((article) => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${article.image_url || '/img/Заглушка.png'}"  alt="Изображение" class="news-image" />
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || 'Описание отсутствует'}</p>
        <a href="${article.link}" target="_blank">Читать далее</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Обработчик подписки
async function subscribe(email, category) {
  const response = await fetch('/subscribe.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `email=${encodeURIComponent(email)}&category=${encodeURIComponent(category)}`
  });
  const result = await response.text();
  document.getElementById('subscribe-msg').textContent = result;
}

// Обработчик кнопок
document.addEventListener('DOMContentLoaded', () => {
  
  const nav = document.getElementById('category-filter');

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      document.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
      e.target.classList.add('active');
  
      const { category } = e.target.dataset;
      getNews(category);
    }
  });

document.querySelector('.subscribe button').addEventListener('click', () => {
    const email = document.getElementById('subscribe-email').value;
    const category = document.getElementById('category-select').value;
    if (email && category) {
      subscribe(email, category);
    } else {
      document.getElementById('subscribe-msg').textContent = 'пожалуйста, заполните все поля.';
    }
  });

  getNews(); // Загрузить "top" по умолчанию
});

export default getNews;
