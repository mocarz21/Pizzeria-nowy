import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

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
    
    console.log('element',element);

  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.AmountWidgetPeople = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.AmountWidgetHours = new AmountWidget(thisBooking.dom.hoursAmount);

  }
}
export default Booking;