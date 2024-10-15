import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getCapitalizedValue, humanizeDate } from '../utils/common.js';

const BLANK_POINT = {
  'id': null,
  'dateFrom': new Date(),
  'dateTo': new Date(),
  'basePrice': '',
  'destination': null,
  'isFavorite': false,
  'offers': [],
  'type': 'flight',
};

function createPointTypesTemplate(type, offers) {
  return offers.reduce((acc, pointType) => {
    const pointItem = `<div class="event__type-item">
        <input id="event-type-${pointType.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType.type}" ${pointType.type === type ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${pointType.type}" for="event-type-${pointType.type}-1">${getCapitalizedValue(pointType.type)}</label>
      </div>`;

    return acc + pointItem;
  }, '');
}

function createDestinationsListTemplate(destinations) {
  return destinations.reduce((acc, destination) => {
    const destinationOption = `<option value="${getCapitalizedValue(destination.name)}"></option>`;
    return acc + destinationOption;
  }, '');
}

function createControlButtonsTemplate(pointId) {
  return pointId !== null
    ? `<button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`
    : '<button class="event__reset-btn" type="reset">Cancel</button>';
}

function createOffersList(offers, pointOffers) {
  return offers.reduce((acc, offer) => {
    const offerItem = `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${pointOffers.includes(offer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.id}-1">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`;
    return acc + offerItem;
  }, '');
}

function createOffersTemplate(offers, point) {
  const pointOffersItems = offers.find((offer) => offer.type === point.type);

  if (pointOffersItems.offers.length === 0) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOffersList(pointOffersItems.offers, point.offers)}
            </div>
          </section>`;
}

function createPhotosTemplate(photos) {
  if (photos.length === 0) {
    return '';
  }

  const photoItems = photos.reduce((acc, photoItem) => {
    const photosList = `<img class="event__photo" src="${photoItem.src}" alt="Event photo">`;
    return acc + photosList;
  }, '');

  return `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photoItems}
      </div>
    </div>`;
}

function createDestinationTemplate(destinations, pointDestination) {
  const destinationItem = destinations.find((destination) => destination.id === pointDestination);

  if (!!destinationItem !== 'undefined') {
    return `<section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destinationItem.description}</p>
              ${createPhotosTemplate(destinationItem.pictures)}
            </section>`;
  }

  return '';
}

function getPointName(destinations, pointDestination) {
  const destinationItem = destinations.find((destination) => destination.id === pointDestination);

  if (typeof destinationItem !== 'undefined') {
    return getCapitalizedValue(destinationItem.name);
  }

  return '';
}

function createEditPointTemplate(point, offers, destinations) {
  const pointName = getPointName(destinations, point.destination);
  const pointTypesTemplate = createPointTypesTemplate(point.type, offers);
  const destinationsOptionsTemplate = createDestinationsListTemplate(destinations);
  const pointControlsTemplate = createControlButtonsTemplate(point.id);
  const offersTemplate = createOffersTemplate(offers, point);
  const destinationTemplate = createDestinationTemplate(destinations, point.destination);
  const dateFrom = humanizeDate(point.dateFrom, 'DD/MM/YY HH:MM');
  const dateTo = humanizeDate(point.dateTo, 'DD/MM/YY HH:MM');

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${point.isPointTypeListOpened ? 'checked' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${pointTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${getCapitalizedValue(point.type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointName}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsOptionsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${pointControlsTemplate}
        </header>
        <section class="event__details">
          ${offersTemplate}

          ${destinationTemplate}
        </section>
      </form>
    </li>`;
}

export default class PointEditView extends AbstractStatefulView {
  #offers = [];
  #destinations = [];
  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor({ point = BLANK_POINT, offers, destinations, onFormSubmit, onCloseClick }) {
    super();
    this._setState(PointEditView.parsePointtoState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offers, this.#destinations);
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointtoState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    if (this._state.id !== null) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
    }
    this.element.querySelector('.event__type-toggle').addEventListener('click', this.#pointTypeListToggleHandler);
    this.element.querySelector('.event__type-list').addEventListener('click', this.#pointTypeClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('keydown', this.#destinationKeydownHandler);
    this.element.querySelector('.event__input--destination').addEventListener('focusin', this.#destinationFocusinHandler);
    this.element.querySelector('.event__input--destination').addEventListener('focusout', this.#destinationFocusoutHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('#event-start-time-1').addEventListener('focusout', this.#startTimeFocusoutHandler);
    this.element.querySelector('#event-end-time-1').addEventListener('focusout', this.#endTimeFocusoutHandler);
    this.element.querySelector('.event__input--price').addEventListener('keydown', this.#priceKeydownHandler);
  }

  #priceKeydownHandler = (evt) => {
    const numberRegex = /^\d+$/;
    if (!numberRegex.exec(evt.target.value)) {
      evt.preventDefault();
      return;
    }

    this._setState({
      basePrice: evt.target.value,
    });
  };

  #endTimeFocusoutHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      dateTo: evt.target.value,
    });
  };

  #startTimeFocusoutHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      dateFrom: evt.target.value,
    });
  };

  #destinationKeydownHandler = (evt) => {
    evt.preventDefault();
  };

  #destinationFocusinHandler = (evt) => {
    evt.preventDefault();
    evt.target.value = '';
  };

  #destinationFocusoutHandler = (evt) => {
    evt.preventDefault();
    evt.target.value = this.#destinations.find((destination) => destination.id === this._state.destination).name;
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const currentDestinationItem = this.#destinations.find((destination) => destination.name.toLowerCase() === destinationName.toLowerCase());

    this.updateElement({
      destination: currentDestinationItem.id,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #pointTypeListToggleHandler = () => {
    this._setState({
      isPointTypeListOpened: !this._state.isPointTypeListOpened,
    });
  };

  #pointTypeClickHandler = (evt) => {
    if (!evt.target.classList.contains('event__type-input')) {
      return;
    }
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
    });
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  static parsePointtoState(point) {
    return { ...point,
      isPointTypeListOpened: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isPointTypeListOpened;

    return point;
  }
}
