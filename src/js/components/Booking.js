import { templates, select, settings } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    
  }
  getData(){
    const thisBooking = this;
    console.log('abcdefgh  ',thisBooking);
    const startDateParam = settings.db.dateStartParamKey + '=' +  utils.dateToStr(thisBooking.AmountWidgetDate.minDate); 
    const endDateParam = settings.db.dateEndParamKey   + '=' +  utils.dateToStr(thisBooking.AmountWidgetDate.maxDate);
    const params = {
      booking: [
        startDateParam,   
        endDateParam
      ],
      eventCurrent: [
        startDateParam,
        endDateParam, 
        settings.db.notRepeatParam,
      ],
      eventRepeat: [
        endDateParam,
        settings.db.repeatParam
      ]
    };

    console.log('abcdefgh  ',thisBooking.AmountWidgetDate.minDate);
    console.log('abcdefgh  ',params);

    const urls = {
      booking:      settings.db.url + '/' +settings.db.booking + '?' + params.booking.join('&'),
      eventCurrent: settings.db.url + '/' +settings.db.event   + '?' + params.eventCurrent.join('&'), 
      eventRepeat:  settings.db.url + '/' +settings.db.event   + '?' + params.eventRepeat.join('&'),
    };
    console.log('eventCurrent',urls.eventCurrent);
    Promise.all([
      fetch(urls.booking), 
      fetch(urls.eventCurrent),
      fetch(urls.eventRepeat)
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventCurrentResponse = allResponses[1];
        const eventRepeatResponse = allResponses[2];
        console.log('bookingsResponse',bookingsResponse);
        console.log('eventCurrentResponse',eventCurrentResponse);
        console.log('eventRepeatResponse',eventRepeatResponse);
        return Promise.all ([ 
          bookingsResponse.json(),
          eventCurrentResponse.json(),
          eventRepeatResponse.json(),
        ]);
      })
      .then(function([bookings,eventCurrent,eventRepeat]){  
        console.log('bookings',bookings);
        console.log('eventCurrent',eventCurrent);
        console.log('eventRepeat',eventRepeat);
      });
  }
  render(element){
    const thisBooking = this;
    const generateHtml =templates.bookingWidget();
    thisBooking.dom ={};
    thisBooking.dom.wrapper = element;
    element.innerHTML = generateHtml;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.pickDate =  thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.AmountWidgetPeople = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.AmountWidgetHours = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.AmountWidgetDate = new DatePicker(thisBooking.dom.pickDate);
    thisBooking.TimeWidget = new HourPicker(thisBooking.dom.hourPicker);
  }
}
export default Booking;