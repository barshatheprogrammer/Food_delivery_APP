document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const closeSearch = document.getElementById('close-search');
    const searchOverlay = document.getElementById('search-overlay');
    const globalSearch = document.getElementById('global-search');
    
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            if (globalSearch) globalSearch.focus();
        });
    }

    if (closeSearch && searchOverlay) {
        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }
});
