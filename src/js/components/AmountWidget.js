import {select, settings} from '../settings.js';
class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);                        // nie rozumiem za bardzo co tu sie dzieje (rozumiem ze zostaje przekazany argument element zeby był dostępny w metodzie getElements ale po zapisie nie bardzo wiem jak to sie dzieje i do końca po co )
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
    
  } 
  getElements(element){                               //czemu po tym kroku thisWidget pokazuje konkretny element w console a wczesniej pokazywało pusty obiekt a teraz wskazuje na diva ?
    const thisWidget = this;
    
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    thisWidget.value = settings.amountWidget.defaultValue;
  }
  announce(){
    const thisWidget = this;
    
    const event = new CustomEvent('update',{bubbles: true});
    thisWidget.element.dispatchEvent(event);
  }
  setValue(value){
    
    const thisWidget = this;               
    //thisWidget.value = settings.amountWidget.defaultValue;
    const newValue = parseInt(value);
    
    

    if (thisWidget.value !== newValue && !isNaN(newValue) && thisWidget.value <= settings.amountWidget.defaultMax && thisWidget.value >= settings.amountWidget.defaultMin) {
      thisWidget.value = newValue;
    }
    thisWidget.announce();
    thisWidget.input.value = thisWidget.value;
  }
  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.value);
    
    });
    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    
    
    });
    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      console.log('thisWidget.input.value',thisWidget.input.value);
      thisWidget.setValue(Number(thisWidget.value)  + 1);
    
    });
  }

}
export default AmountWidget;