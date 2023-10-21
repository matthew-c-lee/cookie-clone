var totalIncome = 0;

gameLoopAdjustment = 100;

initializeGameData().then(() => {
    setInterval(function () {
        gameData.cookies += totalIncome;

        totalIncome = calculateIncome();

        document.getElementById("totalIncome").innerHTML = Number((totalIncome * gameLoopAdjustment).toFixed(2));
        document.getElementById("cookies").innerHTML = Number(gameData.cookies.toFixed(2));
    }, 10)

    setInterval(function () {
        saveGameData();
    }, 10000)
});

function calculateIncome() {
    totalIncome = 0;
    for (var buildingName in gameData.buildings) {
        totalIncome += gameData.buildings[buildingName].amount * (gameData.buildings[buildingName].income / gameLoopAdjustment);
    }

    return totalIncome;
}

async function initializeGameData() {
    try {
        initializeBuildings()
    } catch (error) {
        console.error('Error in initializeGameData:', error);
        // Handle errors, perhaps with fallback values or user notifications
    }
}

async function saveGameData() {
    fetch('/update-game-data', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
    })
}

function initializeBuildings() {
    
    for (var buildingName in gameData.buildings) {
        document.getElementById(`${buildingName}Cost`).innerHTML = gameData.buildings[buildingName].cost;
        document.getElementById(`${buildingName}Amount`).innerHTML = gameData.buildings[buildingName].amount;
    }
}

async function fetchData() {
    try {
        const response = await fetch('data/building_data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;  // This will allow you to handle the error in your calling function
    }
}

function buyBuilding(buildingName) {
    if (gameData.cookies >= gameData.buildings[buildingName].cost) {
        gameData.cookies -= gameData.buildings[buildingName].cost;
        gameData.buildings[buildingName].amount++;
        gameData.buildings[buildingName].cost = Math.round(gameData.buildings[buildingName].cost * 1.15);

        document.getElementById(`${buildingName}Cost`).innerHTML = gameData.buildings[buildingName].cost;
        document.getElementById(`${buildingName}Amount`).innerHTML = gameData.buildings[buildingName].amount;
    }
}

function addToCookies(amount) {
    gameData.cookies += amount;
    document.getElementById("cookies").innerHTML = Number(gameData.cookies.toFixed(2));
}
