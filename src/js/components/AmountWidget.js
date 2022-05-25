import {select, settings} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element){
    super(element,settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);                        // nie rozumiem za bardzo co tu sie dzieje (rozumiem ze zostaje przekazany argument element zeby był dostępny w metodzie getElements ale po zapisie nie bardzo wiem jak to sie dzieje i do końca po co )
    //thisWidget.setValue(1);
    thisWidget.initActions();
   
    
                      
  } 
  getElements(){                               //czemu po tym kroku thisWidget pokazuje konkretny element w console a wczesniej pokazywało pusty obiekt a teraz wskazuje na diva ?
    const thisWidget = this;
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    
  }



  isValid(value){
    return !isNaN(value) 
    && value <= settings.amountWidget.defaultMax 
    && value >= settings.amountWidget.defaultMin;
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }
  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function(){
      //thisWidget.setValue(thisWidget.value);
      thisWidget.value = thisWidget.dom.input.value;
    
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    
    
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      
      thisWidget.setValue(Number(thisWidget.value)  + 1);
    
    });
  }
  

}
export default AmountWidget;