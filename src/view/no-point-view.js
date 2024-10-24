import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';

const NoPointsPhraseValue = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

function createNoPointTemplate(filterType) {
  return `<p class="trip-events__msg">
    ${NoPointsPhraseValue[filterType]}
  </p>`;
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
