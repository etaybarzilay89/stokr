/**
 * Created by etay on 18/07/2017.
 */
(function () {

  let changePresentationEnum = {
    'percentage' : 0,
    'change' : 1,
    'capital' : 2,
    'length' : 3
  };
  let contentEnum = {
    'search' : 0,
    'stocks' : 1,
    'filter' : 2,
    'settings' : 3,
    'length' : 4
  };

  window.Stoker = window.Stoker || {};
  const view = window.Stoker.view;
  const model = window.Stoker.model;


  function dispatchEvents(e) {
    const target = e.target;
    const currentTarget = e.currentTarget;

    if (currentTarget.classList.contains('app-header'))
    {
      dispatchHeaderEvents(e);
    }

    if (target.classList.contains('daily-change')) {
      model.toggleChange();
    }

    let targetDataSymbol = target.getAttribute('data-symbol');
    if (target.classList.contains('icon-reverse')) {
      model.shiftStocks(targetDataSymbol, 'down');
    } else if (target.classList.contains('icon-arrow')) {
      model.shiftStocks(targetDataSymbol, 'up');
    }

    view.renderHtmlPage(model.getState());
  }
  function dispatchHeaderEvents(e) {
    const target = e.target;

    if (target.classList.contains('selected')) {
      model.updateScreen(contentEnum.stocks);
      return;
    }
    if (target.classList.contains('search')) {
      model.updateScreen(contentEnum.search);
    }
    if (target.classList.contains('filter')) {
      model.updateScreen(contentEnum.filter);
    }
    if (target.classList.contains('settings')) {
      model.updateScreen(contentEnum.settings);
    }
  }
  function init() {
    const state = model.getState();
    view.init(dispatchEvents, contentEnum, changePresentationEnum);
    model.init(contentEnum, changePresentationEnum);
    view.renderHtmlPage(state);
  }

  init();
})();


