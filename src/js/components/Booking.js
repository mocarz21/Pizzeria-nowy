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
    thisBooking.markedTable();
    thisBooking.getData(); 
    thisBooking.initAction();   
    
    
    
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
      
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){ //nie pamietam po co jest typeof
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
        tableId =parseInt(tableId);
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
    for(let item of thisBooking.dom.tables){
      item.classList.remove(classNames.booking.marked);
    }
  }


  
  markedTable(){
    const thisBooking = this;

    let tableNumber = '';

    document.querySelector('.floor-plan').addEventListener('click', function(event){
      
   
      tableNumber = event.target.attributes[1];
     
      event.path[0].classList.toggle(classNames.booking.marked);
      thisBooking.remove(tableNumber);
    });

      
  
  }

  remove(tN){
    const thisBooking = this;
  
    
    for(let item of thisBooking.dom.tables){
      let tableNumber = item.getAttribute('data-table');

      
      if(tableNumber !== tN.value){
       
        item.classList.remove(classNames.booking.marked);
      }
      if(item.classList.contains(classNames.booking.tableBooked)){
        item.classList.remove(classNames.booking.marked);
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


    thisBooking.dom.inputPeopleAmount = thisBooking.dom.wrapper.querySelector('input[name="people"]');
    thisBooking.dom.inputkDate =thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisBooking.dom.inputHour = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisBooking.dom.inputHoursAmount = thisBooking.dom.wrapper.querySelector('input[name="hours"]');
    thisBooking.dom.inputPhone = thisBooking.dom.wrapper.querySelector('input[name="phone"]');
    thisBooking.dom.inputAdress = thisBooking.dom.wrapper.querySelector('input[name="address"]');
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector('.booking-form');
    thisBooking.dom.table = thisBooking.dom.wrapper.querySelector('.marked'); //czemu nie znajduje mi marked gdy w floor-plan znajduje i widac ze jest klasa marked
    thisBooking.dom.initStarters = document.querySelectorAll('input[name="starter"]');
    console.log('thisBooking.dom.table',thisBooking.dom.table);
    

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
  

  sendOrder(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking; 
    console.log(url);
    let reservation = {};
    
    reservation.table = thisBooking.dom.table; //powinna byc liczba ; popawic nie działa właściwie (pomysl był taki zeby sciagnac atrybut po klasie .marked)
    
    reservation.starters =[];

    for( let starter of thisBooking.dom.initStarters){   //?????? nie rozumiem tego zapisu z cart
      
      if(starter.checked ==true){
        reservation.starters.push(starter.value);
      }
      console.log('starter',starter);

    }
    reservation.date = thisBooking.dom.inputkDate.value;
    reservation.hour = thisBooking.dom.inputHour.value; 
    reservation.duration = thisBooking.dom.inputHoursAmount.value; //powinna byc liczba
    reservation.ppl = thisBooking.dom.inputPeopleAmount.value; //powinna byc liczba
    reservation.phone = thisBooking.dom.inputPhone.value;
    reservation.address = thisBooking.dom.inputAdress.value ; 

    console.log( ' spradznie co pobiera ',reservation.table);

    thisBooking.makeBooked(reservation.date, reservation.hour, reservation.duration, reservation.table); //nie działa
    

    const options ={        //wiem po co niewiem co sie dzieje
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation)
    };
    fetch(url, options);

    console.log(' reservation ',  reservation);
    console.log('thisBooking.dom.table',thisBooking.dom.table);
    console.log('thisBooking.booked',thisBooking.booked);
  }

  initAction(){
    const thisBooking = this;
    thisBooking.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisBooking.sendOrder();
      
    });

  
  }

}
export default Booking;