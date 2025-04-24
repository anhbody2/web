
const suggestionsList = {
    'Contanct': "contact.html",
    'BlueOcean Diamond': 'https://en.wikipedia.org/wiki/Banana',
    'Blueberry': 'https://en.wikipedia.org/wiki/Blueberry',
    'Cherry': 'https://en.wikipedia.org/wiki/Cherry',
    'Coconut': 'https://en.wikipedia.org/wiki/Coconut',
    'Grapes': 'https://en.wikipedia.org/wiki/Grape',
    'Lemon': 'https://en.wikipedia.org/wiki/Lemon',
    'Mango': 'https://en.wikipedia.org/wiki/Mango',
    'Orange': 'https://en.wikipedia.org/wiki/Orange_(fruit)',
    'Peach': 'https://en.wikipedia.org/wiki/Peach',
    'Pineapple': 'https://en.wikipedia.org/wiki/Pineapple',
    'Strawberry': 'https://en.wikipedia.org/wiki/Strawberry'
  };
  
  const input = document.getElementById('searchInput');
  const suggestionsBox = document.getElementById('suggestions');
  
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    console.log(query);
    suggestionsBox.innerHTML = '';
  
    if (query.length === 0) return;
  
    const filtered = Object.keys(suggestionsList).filter(item =>
      item.toLowerCase().includes(query)
    );
  
    filtered.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item;
      div.classList.add('suggestion-item');
      div.addEventListener('click', () => {
        window.location.href = suggestionsList[item]; 
      });
      suggestionsBox.appendChild(div);
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!document.querySelector('.search-container').contains(e.target)) {
      suggestionsBox.innerHTML = '';
    }
  });

  