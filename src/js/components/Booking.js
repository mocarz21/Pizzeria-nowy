import { templates, select, settings, classNames } from '../settings.js';
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
  
    const startDateParam = settings.db.dateStartParamKey + '=' +  utils.dateToStr(thisBooking.AmountWidgetDate.minDate); 
    const endDateParam = settings.db.dateEndParamKey   + '=' +  utils.dateToStr(thisBooking.AmountWidgetDate.maxDate);
    const params = {
      booking: [
        startDateParam,   
        endDateParam
      ],
      eventCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam
        
      ],
      eventRepeat: [
        endDateParam,
        settings.db.repeatParam
      ]
    };

    const urls = {
      booking:      settings.db.url + '/' +settings.db.booking + '?' + params.booking.join('&'),
      eventCurrent: settings.db.url + '/' +settings.db.event   + '?' + params.eventCurrent.join('&'), 
      eventRepeat:  settings.db.url + '/' +settings.db.event   + '?' + params.eventRepeat.join('&'),
    };
   
    Promise.all([
      fetch(urls.booking), 
      fetch(urls.eventCurrent),
      fetch(urls.eventRepeat)
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventCurrentResponse = allResponses[1];
        const eventRepeatResponse = allResponses[2];
        
        return Promise.all ([ 
          bookingsResponse.json(),
          eventCurrentResponse.json(),
          eventRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventCurrent, eventRepeat]){  
       
        thisBooking.parseData(bookings, eventCurrent, eventRepeat);
      });
  }
  parseData(bookings, eventCurrent, eventRepeat){
    const thisBooking= this;

    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    
    }
    for(let item of eventCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    
    }

    const minDate = thisBooking.AmountWidgetDate.minDate;
    const maxDate = thisBooking.AmountWidgetDate.maxDate;

    for(let item of eventRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate ; loopDate <= maxDate; loopDate = utils.addDays(loopDate,1))
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);

      }
    }
    thisBooking.updateDom();
  }
  makeBooked(date, hour, duration, table ){
    const thisBooking= this;

    if( typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock +=0.5){
      
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
    
    // console.log('thisBooking', typeof thisBooking.booked[thisBooking.date][thisBooking.hour]);
    
  }


  updateDom(){
    const thisBooking = this;

    thisBooking.date = thisBooking.AmountWidgetDate.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.TimeWidget.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      || 
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){ // niemozna było sprawdzic tego  drugiego warunku odrazu ?
    
      allAvailable = true;
    
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId =parseInt(tableId)
      }
      if(
        !allAvailable 
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      }else{
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
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
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.AmountWidgetPeople = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.AmountWidgetHours = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.AmountWidgetDate = new DatePicker(thisBooking.dom.pickDate);
    thisBooking.TimeWidget = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('update',function(){
      thisBooking.updateDom();
    });
  }
}
export default Booking;