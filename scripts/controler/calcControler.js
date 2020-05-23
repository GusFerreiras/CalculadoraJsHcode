class CalcControler{
    constructor(){
        this._numberOne = 0;
        this._operator = 1;
        this._numberTwo = 2;
        this._porcent = 3;
        this._locale = "pt-BR";
        this._operation = [0];
        this._oldOperation = [];
        this._currentDate;
        //El = Element(HTML)
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){
        this.setDisplayDateTime();
      setInterval(()=>{
        this.setDisplayDateTime();
      },1000)
    
    }



    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event,fn,false);

        })
    }

    clearAll(){
        this._operation=[0];
        this._oldOperation=[];
    }

    clearEntry(){
        this._operation.pop();
        if(this._operation.length<1)
            this._operation=[0];
    }

    setError(){
        this.displayCalc="error";
    }

    isOperator(value){
       if(['+','-','x','/'].indexOf(value)>-1){
            return  true;
       }
       else
            return false;
    }

    refreshDisplay(){
       this.displayCalc=this._operation.join("");
    }

    recalculate(){
        this._operation.push(this._oldOperation[this._operator]);
        this._operation.push(this._oldOperation[this._numberTwo]);
        if(this._oldOperation.length>3)
            this._operation.push(this._oldOperation[this._porcent]);
        this.calc();
    }

    calcIncrement(){
        this._operation.push(this._operation[this._numberOne]);
        this.calc();
    }

    calc(){
        if(this._operation.length==1){
            if(this._oldOperation.length<3)
                alert("Sem operações anteriores.");
            else
                this.recalculate();             
        }
        else if(this._operation.length==2){
            this.calcIncrement();
        }
        else{
            let removed = this._operation.length>3? this._operation.pop(): null;
            if(this._operation[this._operator]=="x")
                this._operation[this._operator]="*"; 
            let result = eval(this._operation.join(""));
            this._oldOperation = this._operation;
            if(removed == "%"){
                this._oldOperation.push(removed);
                result/=100;
            }
            this._operation = [];
            this._operation.push(result);
        }      
       
    }

     

    addOperation(value){
        
        if(isNaN(this.getLastElement(this._operation))){
            //Last element is a String
            if(this.isOperator(value)==true){
                if(this.getLastElement(this._operation)!="%")
                this._operation[this._operation.length-1]=value;
                else{
                    if(this._operation.length==3)
                    this.calc();
                }       
            }else if(isNaN(value)){
                //is a porcent

            }else{
                //Add Number
                this._operation.push(value);
            }

        }else{
            //Last element is a Number
            if(this.isOperator(value)==true ){
                if(this._operation.length==3){
                    this.calc();
                }
                this._operation.push(value);
                
            }
            else if(isNaN(value)){
                //is porcent
                this._operation.push(value);
            }
            else{
                //is a Number
            this.setLastOperation(value);
            }    
        }
    }

    setLastOperation(value){
        let newValue = this.getLastElement(this._operation).toString() + value.toString(); 
        this._operation.pop();
        this._operation.push(Number.parseFloat(newValue));
    }

    getLastElement(array){
        return array[array.length-1];
    }

    addDot(){
        let lastOpetation = this.getLastElement();

        if(this.isOperator(lastOpetation) || !lastOpetation){
            this.pushOperation('0.');

        }else{
            this.setLastOperation();
        }
        
    }

    execButton(textButton){
        switch(textButton){
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.clearEntry();
                break;
            case "soma":
                this.addOperation("+");
                break; 
            case "divisao":
                this.addOperation("/");
                break;    
            case "multiplicacao":
                this.addOperation("x");
                break;

            case "subtracao":
                this.addOperation("-");
                break;

            case "porcento":
                this.addOperation("%");
                break;
            case "ponto":
                this.addDot();
                break;
            case "igual":
             this.calc();
                break;

            // case '0':
            // case '1':
            // case '2':
            // case '3':
            // case '4':
            // case '5':
            // case '6':
            // case '7':
            // case '8':
            // case '9':
            //     this.addOperation(parseInt(textButton));
            //     break;

            default:
                //this.setError()
                this.addOperation(parseFloat(textButton));
                
                break;
            
        }
        this.refreshDisplay();
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((button, index) => {
            this.addEventListenerAll(button,"click drag",()=>{
                let textButton = button.className.baseVal.replace("btn-","");
                this.execButton(textButton);
            });

            this.addEventListenerAll(button, "mouseover mouseup mousedown", ()=>{
                button.style.cursor = "pointer";

            });
        }); 

       
    }
    
    setDisplayDateTime(){
        this.displayDate=this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime=this.currentDate.toLocaleTimeString(this._locale);
    }


    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }
    
    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML=value;
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML=value;
    }


    get currentDate(){
        
        return new Date;
    }

    set currentDate(value){
        this._currentDate = value;
    }
}