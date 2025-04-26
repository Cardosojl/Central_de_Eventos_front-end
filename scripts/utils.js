function appendElements(father, children) {
    if(children.length) {
        children.forEach(x => father.appendChild(x));
    } else {
        father.appendChild(children);
    }
}

function createElements(elementName, attributes, text) {
    const element = document.createElement(elementName);
    const attributesArray =  Object.entries(attributes);
    element.innerHTML = text || '';
    attributesArray.forEach(([key, value]) => element.setAttribute(key, value));    
    return element
}

function createContainer(elementName, attributes, elementsArray) {
    const element = document.createElement(elementName);
    const attributesArray =  Object.entries(attributes);
    appendElements(element, elementsArray);
    attributesArray.forEach(([key, value]) => element.setAttribute(key, value));    
    return element
}

function createSelect(optionsValues,optionsArray, selectedAtributeName, selectName, selectID) {
    const select = document.createElement('select');
    select.name = selectName;
    select.id = selectID;
    for(let i = 0; i < optionsArray.length; i++){
        const options = document.createElement('option');
        options.value = optionsValues[i];
        options.innerHTML = optionsArray[i];
        select.appendChild(options);
        if(optionsArray[i] == selectedAtributeName){
            options.selected = true;
        }
    }
    return select;
}

function range(first, last) {
    const result = [];
    for (let i = first; i <= last; i++) {
      result.push(i);
    }
    return result;
  }
