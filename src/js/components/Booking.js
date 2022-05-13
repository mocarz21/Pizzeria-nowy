import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();

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
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper)

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