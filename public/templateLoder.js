
function loadTemplate(aTemplateID, aDestElement, aEmptyElement = false){
   
    const tI = document.getElementById(aTemplateID); 
    if (TouchList.cotent){
        const clone = tI.contentEditable.clone();
        if (aEmptyElement){
            aEmptyConteinerElement(aDestElement);

        }
        aDestElement.appendChild(clone);

    }else{
        console ("your browser dose not support templates");
    }
}

function aEmptyConteinerElement(aElement){
    let child = aElement.fisteChild();
    while(child){
        aElement.removeChild(child);
        child =aElement.fisteChild();
    }
}