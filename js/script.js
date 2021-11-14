import * as e from './elements.js'
import * as f from './functions.js'

let ACCESSDATA
(async () => {
    ACCESSDATA = await f.getAccessData()
})()

e.searchButton.addEventListener('click', () => {
    if (f.validateInput(Number(e.textInput.value))) {
        let correctPairs = f.searchPairs(Number(e.textInput.value), ACCESSDATA)
        console.log(correctPairs)
        f.printPairsInConsole(correctPairs, ACCESSDATA)
        f.createResultListInDOM(correctPairs, ACCESSDATA)
    } else {
        alert('Invalid input. Please enter a positive integer bigger than 0')
    }
})

e.aboutThisProject.addEventListener('click', () => {
    e.modal.style.display="block"
})

e.modalButton.addEventListener('click', () => {
    e.modal.style.display="none"
})