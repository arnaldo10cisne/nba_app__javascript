import * as e from './elements.js'


export const orderArray = arrayToOrder => {

    if (arrayToOrder.length > 1) {
        
        let half = Math.floor(arrayToOrder.length / 2)
        let leftArm = arrayToOrder.slice(0,half)
        let rightArm = arrayToOrder.slice(half)

        orderArray(leftArm)
        orderArray(rightArm)

        let i = 0
        let j = 0
        let k = 0

        while (i < leftArm.length && j < rightArm.length) {
            if (leftArm[i]["h_in"] < rightArm[j]["h_in"]) {
                arrayToOrder[k] = leftArm[i]
                i++
            } else {
                arrayToOrder[k] = rightArm[j]
                j++
            }
            k++     
        }

        while(i < leftArm.length) {
            arrayToOrder[k] = leftArm[i]
            i++
            k++
        }

        while (j < rightArm.length){
            arrayToOrder[k] = rightArm[j]
            j++
            k++
        }

        return arrayToOrder

    }
}


export const getAccessData = async () => {
    let response
    try {
        response = await fetch(e.DATA_URL)
        const rawData = await response.json()
        let arrayData = rawData["values"]
        arrayData = orderArray(arrayData)
        return arrayData
    } catch (error) {
        console.error(error)
        e.resultMessage.innerHTML = `<b>An error occurred while getting the information from the URL. Please try again at a later time</b>`
        e.searchButton.style.display = "none"
        e.textInput.style.display = "none"
    }
}


export const validateInput = input => {
    if (input == "") {
        return false
    } else {
        if (isNaN(input)) {
            return false
        } else {
            if (Number.isInteger(input)) {
                if (input >= 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    }
    
}


export const searchFirstResult = (list, start, end, objective) => {
    
    if (start > end) {
        return null
    }

    let split = Math.floor((start + end) / 2)

    if (split >= list.length) {
        return null
    }

    if (Number(list[split]["h_in"]) == objective) {
        return split
    } else if (Number(list[split]["h_in"]) < objective) {
        return searchFirstResult(list, split+1, end, objective)
    } else if (Number(list[split]["h_in"]) > objective) {
        return searchFirstResult(list, start, split-1, objective)
    }
}


export const searchPairs = (userInput, listOfPlayers) => {
    
    let arrayOfCorrectPairs = []
    console.log(userInput);
    console.log(listOfPlayers);

    for (let index = 0; index < listOfPlayers.length; index++) {
        const firstPlayer = listOfPlayers[index];
        const difference = userInput - Number(firstPlayer["h_in"])

        let firstResultPosition = searchFirstResult(listOfPlayers, 0, listOfPlayers.length, difference)

        if (firstResultPosition != null) {

            firstResultPosition = Number(firstResultPosition)

            let aux = 0
            let continueCheckingHeights = true

            while (true) {
                if (continueCheckingHeights && Number(listOfPlayers[firstResultPosition + aux]["h_in"]) == difference) {
                    if (listOfPlayers.indexOf(firstPlayer) <= firstResultPosition + aux) {
                        arrayOfCorrectPairs.push([listOfPlayers.indexOf(firstPlayer),firstResultPosition + aux])
                    }
                    if (firstResultPosition + aux < listOfPlayers.length - 1) {
                        aux++
                    } else {
                        continueCheckingHeights = false
                    }
                } else {
                    aux = 1
                    break
                }
            }
            continueCheckingHeights = true
            while (true) {
                if (firstResultPosition - aux == -1) {
                    continueCheckingHeights = false
                    aux = 0
                }
                if (continueCheckingHeights && Number(listOfPlayers[firstResultPosition - aux]["h_in"]) == difference) {
                    if (listOfPlayers.indexOf(firstPlayer) <= firstResultPosition - aux) {
                        arrayOfCorrectPairs.push([listOfPlayers.indexOf(firstPlayer),firstResultPosition - aux])
                    }
                    aux++
                } else {
                    break
                }
            }
        }
    }

    return arrayOfCorrectPairs
    
}

export const printPairsInConsole = (arrayOfPairs, completeData) => {
    
    console.clear()

    if (arrayOfPairs.length == 0) {
        e.resultMessage.innerHTML = "No matches found"
        console.log("No matches found");
    } else {
        console.log(`Oh, I can see that you want to check the console output, right?\nNo worries, there you go\n\nFinding two NBA players whose heights add up to ${Number(completeData[arrayOfPairs[0][0]]["h_in"]) + Number(completeData[arrayOfPairs[0][1]]["h_in"])} inches\n\nRESULTS:`)
    
        for (let index = 0; index < arrayOfPairs.length; index++) {
            const pair = arrayOfPairs[index];
            console.log(`Pair ${index+1}: ${completeData[pair[0]]["first_name"]} ${completeData[pair[0]]["last_name"]} (${completeData[pair[0]]["h_in"]} inches) | ${completeData[pair[1]]["first_name"]} ${completeData[pair[1]]["last_name"]} (${completeData[pair[1]]["h_in"]} inches)`)
        }
    }

}


export const createResultListInDOM = (correctPairs, ACCESSDATA) => {

    e.resultsContainer.innerHTML = ""
    if (correctPairs.length == 0) {
        e.resultMessage.innerHTML = `Finding two NBA players whose heights add up to ${e.textInput.value} inches<br><b>No matches found</b>`
    } else {
        e.resultMessage.innerHTML = `Finding two NBA players whose heights add up to ${e.textInput.value} inches<br>Showing <b>${correctPairs.length}</b> results: `
        e.resultsContainer.innerHTML = createResultCells(correctPairs, ACCESSDATA)
    }

}


export const createResultCells = (correctPairs, completeData) => {
    let content = ""
    for (let index = 0; index < correctPairs.length; index++) {
        const pair = correctPairs[index];
        content += `<div class="result_cell">
        <p class="result_number">Result <b>${index+1}</b></p>
        <div class="result_data">
            <div class="result_player">
                <p class="player_name">${completeData[pair[0]]["first_name"]} ${completeData[pair[0]]["last_name"]}</p>
                <p class="player_height">Height: ${completeData[pair[0]]["h_in"]} inches</p>
            </div>
            <div class="result_player">
                <p class="player_name">${completeData[pair[1]]["first_name"]} ${completeData[pair[1]]["last_name"]}</p>
                <p class="player_height">Height: ${completeData[pair[1]]["h_in"]} inches</p>
            </div>
        </div>
    </div>`
    }
    return content
}