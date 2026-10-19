'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const favorite = document.getElementById('favoriteBtn');
  const mapBtn = document.getElementById('mapBtn');
  const copyAddress = document.getElementById('copyAddress');
  const paymentToggle = document.getElementById('paymentToggle');
  const paymentDetails = document.getElementById('paymentDetails');
  const pageContent = document.getElementById('pageContent');

  let toastTimer;

  function announce(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  if (favorite) {
    favorite.addEventListener('click', () => {
      const active = favorite.getAttribute('aria-pressed') === 'true';
      const newState = !active;

      favorite.setAttribute('aria-pressed', String(newState));

      favorite.setAttribute(
        'aria-label',
        newState
          ? 'Remover Big Variedades dos favoritos'
          : 'Adicionar Big Variedades aos favoritos'
      );

      announce(
        newState
          ? 'Big Variedades adicionada aos favoritos.'
          : 'Loja removida dos favoritos.'
      );
    });
  }

  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      const address = 'Av. Senador Hermenegildo, 474, Centro';

      const url = new URL('https://www.google.com/maps/search/');

      url.searchParams.set('api', '1');
      url.searchParams.set('query', address);

      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    });
  }

  if (copyAddress) {
    copyAddress.addEventListener('click', async () => {
      const address =
        'Av. Senador Hermenegildo, 474, ao lado da Igreja Cristã Evangélica, Centro.';

      try {
        if (!navigator.clipboard?.writeText) {
          throw new Error('Clipboard indisponível');
        }

        await navigator.clipboard.writeText(address);

        announce('Endereço copiado para a área de transferência.');
      } catch {
        const field = document.createElement('textarea');

        field.value = address;
        field.setAttribute('readonly', '');
        field.setAttribute('aria-label', 'Endereço da loja');

        field.style.position = 'fixed';
        field.style.left = '-9999px';
        field.style.top = '0';

        document.body.appendChild(field);
        field.select();

        let copied = false;

        try {
          copied = document.execCommand('copy');
        } catch {
          copied = false;
        }

        field.remove();

        announce(
          copied
            ? 'Endereço copiado para a área de transferência.'
            : 'Não foi possível copiar automaticamente. Endereço: ' + address
        );
      }
    });
  }

  if (paymentToggle && paymentDetails) {
    paymentToggle.addEventListener('click', () => {
      const expanded =
        paymentToggle.getAttribute('aria-expanded') === 'true';

      paymentToggle.setAttribute('aria-expanded', String(!expanded));

      paymentDetails.hidden = expanded;
    });
  }

  const tabButtons = [...document.querySelectorAll('.tab')];

  const tabPanels = {
    info: document.getElementById('panel-info'),
    products: document.getElementById('panel-products'),
    reviews: document.getElementById('panel-reviews')
  };

  function selectTab(name) {
    if (!tabPanels[name]) return;

    tabButtons.forEach((btn) => {
      const selected = btn.dataset.panel === name;

      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-selected', String(selected));
      btn.tabIndex = selected ? 0 : -1;
    });

    Object.entries(tabPanels).forEach(([key, panel]) => {
      if (panel) panel.hidden = key !== name;
    });

    if (pageContent) pageContent.scrollTop = 0;
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      selectTab(btn.dataset.panel);
    });

    btn.addEventListener('keydown', (event) => {
      const validKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

      if (!validKeys.includes(event.key)) return;

      event.preventDefault();

      let next = index;

      if (event.key === 'ArrowRight')
        next = (index + 1) % tabButtons.length;

      if (event.key === 'ArrowLeft')
        next = (index - 1 + tabButtons.length) % tabButtons.length;

      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabButtons.length - 1;

      tabButtons[next].focus();
      selectTab(tabButtons[next].dataset.panel);
    });
  });

  const productsInfo = document.getElementById('productsInfo');
  const reviewsInfo = document.getElementById('reviewsInfo');

  if (productsInfo) {
    productsInfo.addEventListener('click', () => {
      announce('Os produtos reais precisam ser conectados ao sistema.');
    });
  }

  if (reviewsInfo) {
    reviewsInfo.addEventListener('click', () => {
      announce('As avaliações reais precisam ser conectadas ao sistema.');
    });
  }

  const searchWrap = document.getElementById('searchWrap');
  const searchInput = document.getElementById('storeSearch');
  const searchHint = document.getElementById('searchHint');
  const searchBtn = document.getElementById('searchBtn');
  const closeSearch = document.getElementById('closeSearch');

  function clearSearch() {
    if (!searchInput || !searchHint) return;

    searchInput.value = '';

    document.querySelectorAll('#panel-info .searchable').forEach((element) => {
      element.hidden = false;
    });

    searchHint.textContent =
      'Digite uma palavra, como “horário” ou “endereço”.';
  }

  if (searchBtn && searchWrap && searchInput) {
    searchBtn.addEventListener('click', () => {
      searchWrap.hidden = !searchWrap.hidden;

      if (!searchWrap.hidden) searchInput.focus();
      else clearSearch();
    });
  }

  if (closeSearch && searchWrap) {
    closeSearch.addEventListener('click', () => {
      searchWrap.hidden = true;
      clearSearch();

      if (searchBtn) searchBtn.focus();
    });
  }

  if (searchInput && searchHint) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value
        .trim()
        .toLocaleLowerCase('pt-BR');

      let matches = 0;

      document.querySelectorAll('#panel-info .searchable').forEach((element) => {
        const content = (
          (element.dataset.search || '') +
          ' ' +
          element.innerText
        ).toLocaleLowerCase('pt-BR');

        const found = !query || content.includes(query);

        element.hidden = !found;

        if (found) matches++;
      });

      if (!query) {
        searchHint.textContent =
          'Digite uma palavra, como “horário” ou “endereço”.';
      } else if (matches > 0) {
        searchHint.textContent = `${matches} seção(ões) encontrada(s).`;
      } else {
        searchHint.textContent =
          'Nenhuma informação encontrada. Tente outro termo.';
      }

      if (tabPanels.info && tabPanels.info.hidden) {
        selectTab('info');
      }
    });
  }

  const backBtn = document.getElementById('backBtn');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        announce('Você já está na tela da loja.');
      }
    });
  }

  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach((item) => {
        const active = item === btn;

        item.classList.toggle('selected', active);

        if (active) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      });

      const destination = btn.dataset.nav;

      if (destination === 'Início') {
        selectTab('info');

        if (pageContent) pageContent.scrollTop = 0;

        announce('Você está na página da loja.');
      } else {
        announce(`${destination}: área demonstrativa neste protótipo.`);
      }
    });
  });
});