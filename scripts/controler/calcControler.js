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
        this._isFirstOperation=true;
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
    }

    initialize(){
        this.setDisplayDateTime();
      setInterval(()=>{
        this.setDisplayDateTime();
      },1000)
    
    }

    initKeyBoard(){
        document.addEventListener('keyup',element=>{
            let keyPress = element.key.toString();
            switch(keyPress){
                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
                    this.clearEntry();
                    break;
                case "+":
                case "-":
                case "/":
                case "*":
                case "x":
                    this.addOperation(keyPress);
                    break;
                case '%':
                    this.addDotOrPercent('%')
                    break;
                case ".":
                case ",":
                    this.addDotOrPercent('.')
                    break;

                case "=":
                 this.calc();
                    break;

                case "Enter":
                 this.calc();
                   break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(keyPress);
                    break;

                default:
                    //when is a number
                    this.setError();
                    break;
                
            }
            this.refreshDisplay();
        });
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event,fn,false);

        })
    }

    clearAll(){
        this._operation=[0];
        this._oldOperation=[];
        this._isFirstOperation=true;
    }

    clearEntry(){
        this._operation.pop();
        if(this._operation.length<1)
            this._operation=[0];
        this._isFirstOperation=true;
    }

    setError(){
        this.displayCalc="error";
    }

    isOperator(value){
       if(['+','-','x','/','*'].indexOf(value)>-1){
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

    getNumberPercent(){
        let numberPercent = null;
        this._operation.forEach(element=>{
            if(element.toString().includes('%'))
                numberPercent=element.replace('%','');
        })
        return numberPercent;
        
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
            let numberPercent = this.getNumberPercent();
            if(this._operation[this._operator]=="x")
                this._operation[this._operator]="*"; 
            let equation = this._operation.join('');
            if(numberPercent!=null){
               equation=equation.replace(numberPercent.toString()+'%',(numberPercent/100).toString());
               console.log('equation=',equation);
            }
            let result = eval(equation);
            this._oldOperation = this._operation;
            this._operation = [];
            this._operation.push(result);
        }      
        this._isFirstOperation=true;
    }

     

    addOperation(value){
        let lastOperation = this.getLastElement(this._operation).toString(); 
        if(isNaN(lastOperation.replace('%',''))){
            //Last element is a String
            if(this.isOperator(value)==true){
                //change a operator
                this._operation[this._operation.length-1]=value;      
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
                //is a operator
                this._operation.push(value);
                
            }else{
                //is percent or a Number
                this.setLastOperation(value);
            }
        }
        this._isFirstOperation=false;
    }

    setLastOperation(value){
        let lastElement = this.getLastElement(this._operation).toString();
        console.log('value==',value)
        if(this._isFirstOperation==true && (value!='.' && value!='%')){
            
            lastElement='';
            console.log('value in if', value)
            /*because, if value is a dot and we do a replace
            "lastElement" the display just give the  dot.*/ 
        }
           
        let newValue = lastElement + value.toString(); 
        this._operation.pop();
        this._operation.push(newValue);
    }

    getLastElement(array){
        return array[array.length-1].toString();
    }

    operationNotExist(value){
        let lastElement = this.getLastElement(this._operation).toString();
        return lastElement.includes(value)? false: true;
    }

    addDotOrPercent(value){
        let lastOperation = this.getLastElement(this._operation);

        if(this.isOperator(lastOperation)){
            if(this.operationNotExist(value))
            this._operation.push('0'+value);
        }
        else{
            if(this.operationNotExist(value))
            this.setLastOperation(value)
        }
        this._isFirstOperation=false;
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
                this.addDotOrPercent('%');
                break;
            case "ponto":
                this.addDotOrPercent('.');
                break;
            case "igual":
             this.calc();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(textButton);
                break;


            default:
                //when is a number
                this.setError();
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