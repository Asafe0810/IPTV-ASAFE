// Main JavaScript - IPTV DO ASAFE

document.addEventListener('DOMContentLoaded', function() {
    console.log('IPTV DO ASAFE - Carregado com sucesso!');
    
    // Inicializar barra de busca
    initializeSearch();
    
    // Atualizar horários dos jogos
    updateGameTimes();
    
    // Scroll suave para âncoras
    setupSmoothScroll();
    
    // Botão para voltar ao topo
    setupBackToTop();
    
    // Efeitos visuais nos cards
    setupCardEffects();
});

// Função para rolar para o topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Inicializar sistema de busca
function initializeSearch() {
    const searchInputs = document.querySelectorAll('#navbarSearch, #navbarSearchMobile');
    
    searchInputs.forEach(input => {
        // Busca ao pressionar Enter
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Busca em tempo real
        input.addEventListener('input', function() {
            if (this.value.length >= 2) {
                performSearch();
            } else if (this.value.length === 0) {
                clearSearchResults();
            }
        });
    });
}

// Realizar busca
function performSearch() {
    const searchInput = document.querySelector('#navbarSearch') || document.querySelector('#navbarSearchMobile');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm || searchTerm.length < 2) {
        clearSearchResults();
        return;
    }
    
    // Criar ou obter container de resultados
    let resultsContainer = document.querySelector('.search-results-container');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results-container';
        searchInput.parentNode.appendChild(resultsContainer);
    }
    
    // Buscar em jogos
    const games = document.querySelectorAll('.game-card');
    // Buscar em filmes/séries
    const movies = document.querySelectorAll('.movie-card');
    
    let resultsHTML = '';
    let foundResults = false;
    
    // Buscar em jogos
    games.forEach(game => {
        const teams = game.querySelectorAll('h5');
        const team1 = teams[0]?.textContent || '';
        const team2 = teams[1]?.textContent || '';
        const championship = game.querySelector('.card-header small')?.textContent || '';
        const link = game.querySelector('a')?.href || '#';
        const category = game.dataset.category || '';
        
        if (team1.toLowerCase().includes(searchTerm) || 
            team2.toLowerCase().includes(searchTerm) ||
            championship.toLowerCase().includes(searchTerm) ||
            category.toLowerCase().includes(searchTerm)) {
            
            foundResults = true;
            const badgeColor = category === 'futebol' ? 'danger' : 'primary';
            resultsHTML += `
                <div class="search-result-item">
                    <a href="${link}" target="_blank" class="d-block">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${team1} vs ${team2}</strong>
                                <div class="small text-muted">${championship}</div>
                            </div>
                            <span class="badge bg-${badgeColor}">${category.toUpperCase()}</span>
                        </div>
                    </a>
                </div>
            `;
        }
    });
    
    // Buscar em filmes/séries
    movies.forEach(movie => {
        const title = movie.dataset.title || '';
        const genre = movie.dataset.genre || '';
        const category = movie.dataset.category || '';
        const button = movie.querySelector('.btn-play');
        const onclick = button?.getAttribute('onclick') || '';
        // Extrair URL do onclick
        const urlMatch = onclick.match(/window\.open\('([^']+)'/);
        const link = urlMatch ? urlMatch[1] : '#';
        
        if (title.toLowerCase().includes(searchTerm) || 
            genre.toLowerCase().includes(searchTerm) ||
            category.toLowerCase().includes(searchTerm)) {
            
            foundResults = true;
            const typeBadge = category === 'filme' ? 'Filme' : 'Série';
            const badgeColor = category === 'filme' ? 'warning' : 'info';
            resultsHTML += `
                <div class="search-result-item">
                    <a href="${link}" target="_blank" class="d-block">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${title}</strong>
                                <div class="small text-muted">${genre} • ${typeBadge}</div>
                            </div>
                            <span class="badge bg-${badgeColor}">${typeBadge}</span>
                        </div>
                    </a>
                </div>
            `;
        }
    });
    
    if (!foundResults) {
        resultsHTML = '<div class="no-results">Nenhum resultado encontrado</div>';
    } else {
        resultsHTML = `<div class="search-header p-2 border-bottom">
                        <small class="text-muted">Resultados da busca:</small>
                      </div>` + resultsHTML;
    }
    
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.classList.add('show');
    
    // Fechar resultados ao clicar fora
    setTimeout(() => {
        document.addEventListener('click', closeSearchResults);
    }, 100);
}

// Limpar resultados da busca
function clearSearchResults() {
    const resultsContainer = document.querySelector('.search-results-container');
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
        resultsContainer.innerHTML = '';
    }
}

// Fechar resultados da busca
function closeSearchResults(e) {
    const searchInputs = document.querySelectorAll('#navbarSearch, #navbarSearchMobile');
    const resultsContainer = document.querySelector('.search-results-container');
    
    let isClickInsideSearch = false;
    searchInputs.forEach(input => {
        if (input.contains(e.target)) {
            isClickInsideSearch = true;
        }
    });
    
    if (resultsContainer && !resultsContainer.contains(e.target) && !isClickInsideSearch) {
        resultsContainer.classList.remove('show');
        document.removeEventListener('click', closeSearchResults);
    }
}

// Atualizar horários dos jogos
function updateGameTimes() {
    const gameTimes = document.querySelectorAll('.text-muted .bi-clock');
    
    gameTimes.forEach(element => {
        const timeElement = element.closest('.text-muted');
        if (timeElement && timeElement.textContent.includes('Ao Vivo')) {
            if (!timeElement.querySelector('.live-badge')) {
                const liveIndicator = document.createElement('span');
                liveIndicator.className = 'badge bg-danger ms-2';
                liveIndicator.textContent = 'LIVE';
                liveIndicator.style.animation = 'pulse 1.5s infinite';
                timeElement.appendChild(liveIndicator);
            }
        }
    });
}

// Scroll suave para âncoras
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Botão para voltar ao topo
function setupBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="bi bi-chevron-up"></i>';
    backToTopBtn.title = 'Voltar ao topo';
    backToTopBtn.onclick = scrollToTop;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

// Efeitos visuais nos cards
function setupCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// Adicionar animação CSS
const style = document.createElement('style');
style.textContent = `
    .search-results-container {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(40, 40, 40, 0.98);
        border: 1px solid var(--primary-color);
        border-radius: 0 0 8px 8px;
        max-height: 400px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
        backdrop-filter: blur(10px);
        margin-top: 1px;
    }
    
    .search-results-container.show {
        display: block;
    }
    
    .search-result-item {
        padding: 10px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: background 0.3s ease;
    }
    
    .search-result-item:hover {
        background: rgba(220, 53, 69, 0.1);
    }
    
    .search-result-item a {
        color: white;
        text-decoration: none;
    }
    
    .search-result-item:hover a {
        color: var(--primary-color);
    }
    
    .search-header {
        background: rgba(0, 0, 0, 0.2);
    }
    
    .no-results {
        padding: 20px;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
    }
    
    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top:hover {
        background: #ff0000;
        transform: translateY(-5px);
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Inicialização
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('IPTV DO ASAFE inicializado');
    console.log('Conteúdo disponível:');
    console.log('- 6 jogos de futebol');
    console.log('- 6 jogos de NBA');
    console.log('- 2 filmes em destaque');
    console.log('- 2 séries em destaque');
});

// Teclas de atalho
document.addEventListener('keydown', function(e) {
    // Ctrl + F para focar na busca
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('#navbarSearch') || document.querySelector('#navbarSearchMobile');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape para limpar busca
    if (e.key === 'Escape') {
        clearSearchResults();
        const searchInput = document.querySelector('#navbarSearch') || document.querySelector('#navbarSearchMobile');
        if (searchInput) {
            searchInput.value = '';
        }
    }
});