const c = document.getElementById('canvas')
const ctx = c.getContext('2d')

let winY = null;
let winX = null;

let selectedWeapon = null;
let selectedCharacter = null;

let playing = false;

document.querySelectorAll('.carouselOption').forEach((item) => {
    item.addEventListener('click', () => {

        if (item.getAttribute('data-type') === 'character') {
            if (item === selectedCharacter) {

            } else {
                if (selectedCharacter) {selectedCharacter.classList.remove("selected")}
                item.classList.add('selected')
                selectedCharacter = item
            }
        }

        if (item.getAttribute('data-type') === 'weapon') {
            if (item === selectedWeapon) {

            } else {
                if (selectedWeapon) {selectedWeapon.classList.remove("selected")}
                item.classList.add('selected')
                selectedWeapon = item
            }
        }
    })

    let desBox = null;
    item.addEventListener('mouseover', () => {
        desBox = document.createElement('div')
        desBox.classList.add('desBox')
        desBox.innerHTML = item.getAttribute('data-desc')
        item.appendChild(desBox)
    })

    item.addEventListener('mouseout', () => {
        desBox.remove()
    })
})

document.getElementById('startGame').addEventListener('click', () => {
    startRound()
})


function startRound() {
    if (selectedCharacter === null || selectedWeapon === null) {
        console.log('sel stuff')
    } else {
        document.getElementById('startingMenu').style.display = 'none'
        requestAnimationFrame(drawFrame)
        usingThisGunNumber = selectedWeapon.id
        currentGun = guns[selectedWeapon.id]
        player = characters[selectedCharacter.id]
        document.getElementById('currentGunDisplay').innerHTML = currentGun.name
        console.log(player)
        playing = true
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('invTab01').addEventListener('click', () => {diplayInvContent('char')})
    document.getElementById('invTab02').addEventListener('click', () => {diplayInvContent('pack')})
    document.getElementById('invTab03').addEventListener('click', () => {diplayInvContent('map')})
    document.getElementById('invTab04').addEventListener('click', () => {diplayInvContent('stats')})
    document.getElementById('invTab05').addEventListener('click', () => {diplayInvContent('set')})
})

document.addEventListener('wheel', (e) => {
    if (!invOpen) {return;}
    if (e.deltaY > 0) {
        mapSize += 2
    } else if (e.deltaY < 0 && mapSize > 3) {
        mapSize -= 2
    }
    diplayInvContent('map')
})


const invDisplayArea = document.getElementById('invContent')
let mapSize = 3
const items = [
    {
        name: "Bandages",
        desc: "Grants extra defence if you are bellow 60 health. Benifits will disappear after healing above the threshhold.",
        values: [0.2, 60, true],
        modifiedStats: ['defence'],
    },
    {
        name: "Expensive bullets",
        desc: "Increase damage by x1.5 for 100 shots.",
        values: [1.5, 100, true],
        modifiedStats: ['dmg'],
    },
    {
        name: "Injector",
        desc: "Boost speed and dodge chance for a short time.",
        values: [30, 500, true],
        modifiedStats: ['speed', 'dodgeChance'],
    },
]


const statModifyers = {
    defence: [0, 0, false], //Defense gained | required threshhold for effect | remove after threshold
    speed: [0, 0, false],
    dodgeChance: [0, 0, false],
    dmg: [0, 0, false],
}

const equipSlotsName = [
    'Head',
    'Neck',
    'Body',
    'Hands',
    'Pants',
    'Shoes',
    'Weapon',
    'Secondary',
]

function diplayInvContent(page) {
    invDisplayArea.replaceChildren()
    switch (page) {
        case 'char':
            try {
                const charSplash = document.createElement('div')
                charSplash.style.backgroundImage = `URL(${player.splash})`
                charSplash.classList.add('charSplash')
                invDisplayArea.appendChild(charSplash)

                const equipSlots = document.createElement('div')
                equipSlots.classList.add('equipSlots')

                for (let i = 0; i < equipSlotsName.length; i++) {
                    const equipSlot = document.createElement('div')
                    equipSlot.classList.add('equipSlot')
                    equipSlot.innerHTML = equipSlotsName[i]
                    equipSlots.appendChild(equipSlot)
                }

                charSplash.appendChild(equipSlots)
            } catch (error) {}
        break;
        case 'pack':
            console.log(statModifyers)
            const newElement1 = document.createElement('div')
            newElement1.classList.add('mapContainer')

            const itemUseWindow = document.createElement('div')
            itemUseWindow.style.display = 'none'
            itemUseWindow.classList.add('itemUseWindow')

            const itemUseWindowTitle = document.createElement('h1')
            const itemUseWindowPg = document.createElement('p')


            const useItemButton = document.createElement('button')
            useItemButton.innerHTML = 'use'
            const closeItemWinButton = document.createElement('button')
            closeItemWinButton.innerHTML = 'close'

            itemUseWindow.appendChild(itemUseWindowTitle)
            itemUseWindow.appendChild(itemUseWindowPg)

            itemUseWindow.appendChild(useItemButton)
            itemUseWindow.appendChild(closeItemWinButton)

            closeItemWinButton.addEventListener('click', () => {
                itemUseWindow.style.display = 'none'
            })
            

            for (let i = 0; i < items.length; i++) {
                const newItem = document.createElement('div')

                newItem.classList.add('packItem')
                newItem.innerHTML = items[i].name

                newItem.addEventListener('click', () => {
                    itemUseWindowTitle.innerHTML = items[i].name
                    itemUseWindowPg.innerHTML = items[i].desc
                    itemUseWindow.style.display = 'block'

                    const newUseItemButton = useItemButton.cloneNode(true)
                    useItemButton.replaceWith(newUseItemButton)

                    newUseItemButton.addEventListener('click', () => {

                        console.log('a')
                    
                        itemUseWindow.style.display = 'none'

                        for (const stat of items[i].modifiedStats) {
                            statModifyers[stat] = items[i].values
                        }

                        items.splice(i, 1)
                        diplayInvContent('pack')
                    })
                })

                newElement1.appendChild(newItem)
            }
            
            invDisplayArea.appendChild(itemUseWindow)
            invDisplayArea.appendChild(newElement1)
        break;
        case 'map':
            const newElement = document.createElement('div')
            newElement.classList.add('mapContainer')

            
            const stepsFromCenter = (mapSize - 3) / 2 + 1

            let placementXoffset = placementX - stepsFromCenter
            let placementYoffset = placementY - stepsFromCenter

            let newLineAfter = mapSize;

            console.log(placementX, placementY, placementXoffset, placementYoffset)

            for (let i = 0; i < mapSize * mapSize; i++) {
                let newTile = document.createElement('div')
                newTile.classList.add('mapTile')

                if (newLineAfter === 0) {
                    placementYoffset++
                    placementXoffset = placementX - stepsFromCenter
                    newLineAfter = mapSize
                }
                

                const miniMapTile = mapTiles.find(tile => tile.index === `${placementXoffset} ${placementYoffset}`)

                console.log(miniMapTile)
                
                if (miniMapTile) {
                    newTile.style.background = miniMapTile.color
                    newTile.innerHTML = `${placementXoffset} / ${placementYoffset}`
                } else {
                    newTile.style.background = 'black'
                    newTile.innerHTML = `unexplored`
                }

                
                
                newTile.style.flexBasis = (100 / mapSize -1) + '%'
                newElement.appendChild(newTile)

                placementXoffset++
                newLineAfter--
            }

            invDisplayArea.appendChild(newElement)
        break;
        case 'stats':
            invDisplayArea.innerHTML = `
                Hits Taken: ${playerStats.hitsTaken} <br>
                Enimies Killed: ${playerStats.enemiesKilled} <br>
                Damage Delt: ${playerStats.damageDelt} <br>
                Damage Taken: ${playerStats.healthLost} <br>
                Life Stolen: ${playerStats.healthGained} <br>
                Ammo Expended: ${Math.round(playerStats.ammoUsed)} <br>
            `
        break;
        case 'set':
            invDisplayArea.innerHTML = `shift = switch weapon <br> t = talk to things <br> these are 100% settings`
        break;
        default:
            alert('x')
        break;
    }
}
diplayInvContent('char')

const characters = [
    {
        name: "Jerry",
        splash: "players/jerry_splash.webp",
        color: "blue",
        health: 100,
        ammo: 100,
        grace: 0,
        size: 50,
        posX: window.innerWidth / 2 - 50,
        posY: window.innerHeight / 2 - 50,
        speed: 10,
        defence: 0.4,
        ammoUsage: 1,
        lifeStealChance: 0,
        lifeStealAmount: 1,
        critChance: 25,
        critMultiplyer: 4,
    },
    {
        name: "Gary",
        splash: "players/gary_splash.webp",
        color: "yellow",
        health: 100,
        ammo: 100,
        grace: 0,
        size: 40,
        posX: window.innerWidth / 2 - 50,
        posY: window.innerHeight / 2 - 50,
        speed: 7,
        defence: 1.5,
        ammoUsage: 0.4,
        lifeStealChance: 0,
        lifeStealAmount: 1,
        critChance: 10,
        critMultiplyer: 2,
    },
    {
        name: "Mary",
        splash: "players/mary_splash.webp",
        color: "red",
        health: 100,
        ammo: 100,
        grace: 0,
        size: 50,
        posX: window.innerWidth / 2 - 50,
        posY: window.innerHeight / 2 - 50,
        speed: 10,
        defence: 0.7,
        ammoUsage: 1,
        lifeStealChance: 20,
        lifeStealAmount: 2.5,
        critChance: 10,
        critMultiplyer: 2
    }
]



let player = null;
const playerStattemplate = {
    hitsTaken: 0,
    healthLost: 0,
    healthGained: 0,
    ammoUsed: 0,
    enemiesKilled: 0,
    damageDelt: 0
}
let playerStats = playerStattemplate

function checkSize() {
    winY = window.innerHeight
    winX = window.innerWidth

    c.height = winY
    c.width = winX
}
checkSize()

window.addEventListener('resize', () => {
    checkSize()
})

let invOpen = false;

document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case "w":
            movingUp = true
        break;
        case "s":
            moveingDown = true
        break;
        case "d":
            moevingLeft = true
        break;
        case "a":
            movingRight = true
        break;

        case "e":
            document.getElementById('realInv').classList.remove('slideIn')
            document.getElementById('realInv').classList.remove('slideOut')

            if (!invOpen) {
                playSound('sound/gamePaused.mp3', 1)
                document.getElementById('inv').style.display = 'block'
                document.getElementById('realInv').classList.add('slideIn')
                invOpen = true
            } else {
                document.getElementById('realInv').classList.add('slideOut')
                setTimeout(() => {
                    document.getElementById('inv').style.display = 'none'
                    invOpen = false
                    requestAnimationFrame(drawFrame)
                }, 700)
            }
        break;

        case 'shift':
            console.log('switch weapon')
            let tempWep = secondaryGun
            secondaryGun = currentGun
            currentGun = tempWep
            document.getElementById('currentGunDisplay').innerHTML = currentGun.name
        break;

        case 't':
            for (const npc of currentTile.npcs) {
                if (checkCol(npc, player)) {
                    dialogPosition = 0
                    fillDialog(npc)
                }
            }
            
        break;
    }
})

document.addEventListener('keyup', (e) => {
    switch (e.key.toLowerCase()) {
        case "w":
            movingUp = false
        break;
        case "s":
            moveingDown = false
        break;
        case "d":
            moevingLeft = false
        break;
        case "a":
            movingRight = false
        break;
    }
})

let dialogPosition = 0
function fillDialog(npc) {

    const dialogDisplay = document.getElementById('dialogDisplay')
    dialogDisplay.replaceChildren()

    if (!npc.dialog[player.name][dialogPosition]) {
        console.log('out')
        document.getElementById('dialog').style.display = 'none'
        dialogDisplay.replaceWith(dialogDisplay.cloneNode(true))
        return;
    }

    dialogDisplay.addEventListener('click', () => {
        dialogPosition++
        fillDialog(npc, dialogPosition)
    })

    const dialogTitle = document.createElement('h1')
    dialogTitle.innerHTML = npc.name

    console.log(npc.dialog[player.name])

    const dialogParagraph = document.createElement('p')
    dialogParagraph.innerHTML = npc.dialog[player.name][dialogPosition].text

    dialogDisplay.appendChild(dialogTitle)
    dialogDisplay.appendChild(dialogParagraph)

    for (let i = 0; i < npc.dialog[player.name][dialogPosition].options.length; i++) {
        const dialogChoices = document.createElement('span')
        dialogChoices.innerHTML = npc.dialog[player.name][dialogPosition].options[i].text
        dialogDisplay.appendChild(dialogChoices)
    }

    document.getElementById('dialog').style.display = 'flex'
}

let movingUp = false;
let moveingDown = false;
let moevingLeft = false;
let movingRight = false;

const guns = [
    {
        name: 'pistol',
        posX: null,
        posY: null,
        size: 10,
        speed: 2,
        X: null,
        Y: null,
        color: 'gray',
        source: "player",
        dmg: 10,
        peirce: 2,
        cost: 1,
        lockOut: 300,
        amount: 1,
        spread: 1,
        delay: 1,
        critChance: 10,
        critMultiplyer: 2.1,
        critRequirement: 'none',
        shotSE: ["pistolShot.mp3", 1],
        fadeTime: 1000,
    },
    {
        name: 'sniper',
        posX: null,
        posY: null,
        size: 15,
        speed: 10,
        X: null,
        Y: null,
        color: 'gray',
        source: "player",
        dmg: 60,
        peirce: 10,
        cost: 20,
        lockOut: 1500,
        amount: 1,
        spread: 1,
        delay: 1,
        critChance: 100,
        critMultiplyer: 6.2,
        critRequirement: 'far',
        shotSE: ["pistolShot.mp3", 1],
        fadeTime: 5000,
    },
    {
        name: 'machine gun',
        posX: null,
        posY: null,
        size: 2.5,
        speed: 7,
        X: null,
        Y: null,
        color: 'gray',
        source: "player",
        dmg: 10,
        peirce: 0,
        cost: 0.5,
        lockOut: 50,
        amount: 5,
        spread: 20,
        delay: 50,
        critChance: 1,
        critMultiplyer: 1.4,
        critRequirement: 'none',
        shotSE: ["pistolShot.mp3", 0.1],
        fadeTime: 500,
    },
    {
        name: 'shotgun',
        posX: null,
        posY: null,
        size: 7,
        speed: 7,
        X: null,
        Y: null,
        color: 'gray',
        source: "player",
        dmg: 70,
        peirce: 1,
        cost: 5,
        lockOut: 2000,
        amount: 10,
        spread: 5,
        delay: 3,
        critChance: 100,
        critMultiplyer: 5.9,
        critRequirement: 'close',
        shotSE: ["pistolShot.mp3", 0.1],
        fadeTime: 120,
    },
    {
        name: 'unarmed',
        posX: null,
        posY: null,
        size: 60,
        speed: 0,
        X: null,
        Y: null,
        color: 'gray',
        source: "player",
        dmg: 70,
        peirce: 500,
        cost: -0.2,
        lockOut: 300,
        amount: 1,
        spread: 0,
        delay: 0,
        critChance: 10,
        critMultiplyer: 1.5,
        critRequirement: 'none',
        shotSE: ["pistolShot.mp3", 0.5],
        fadeTime: 20,
    }
];

let currentGun = null;
let secondaryGun = guns[4];

let usingThisGunNumber = 0
let shotLockout = false;

let projectiles = []

let currentlyShooting = false;
let mouseEvent = null;
document.addEventListener('mousedown', (e) => {
    currentlyShooting = true
})

document.addEventListener('mousemove', (e) => {
    mouseEvent = e
})

document.addEventListener('mouseup', (e) => {
    currentlyShooting = false
})



function createBullet() {

    const e = mouseEvent

    if (playing === false || player.ammo < currentGun.cost || shotLockout) return;

    for (let i = 0; i < currentGun.amount; i++) {

        if (player.ammo < currentGun.cost) return;

        let varience = Math.floor(Math.random() * currentGun.spread) + 1

        if (Math.floor(Math.random() * 2) === 0) {
            varience = varience * -1
        }

        if (player.ammo > 0) {
            const newBullet  = {
                name: currentGun.name,
                posX: player.posX + (player.size / 2),
                posY: player.posY + (player.size / 2),
                size: currentGun.size,
                speed: currentGun.speed,
                X: ((player.posX + (player.size / 2) - e.clientX) + (i * varience + 1)) / (25 - currentGun.speed),
                Y: ((player.posY + (player.size / 2) - e.clientY) + (i * varience + 1)) / (25 - currentGun.speed),
                color: currentGun.color,
                source: currentGun.source,
                dmg: currentGun.dmg,
                peirce: currentGun.peirce,
                cost: currentGun.cost,
                amount: currentGun.amount,
                fadeTime: currentGun.fadeTime,
            }

            if (currentGun.speed === 0) {
                newBullet.X = 0
                newBullet.Y = 0
            }

            setTimeout(() => {
                projectiles.push(newBullet)
                playSound('sound/' + currentGun.shotSE[0], currentGun.shotSE[1])
            }, i * currentGun.delay)
            player.ammo -= (currentGun.cost * player.ammoUsage + 0.1)
            playerStats.ammoUsed += currentGun.cost * player.ammoUsage + 0.1
            ammoRegenLockout = 60;
            shotLockout = true;
        }

        setTimeout(() => {
            shotLockout = false;
        }, currentGun.lockOut);
    }
}

function playSound(path, vol) {
    const audio = new Audio(path)
    audio.volume = vol
    audio.addEventListener('ended', () => {
        audio.remove()
    })
    audio.play()
}

const particles = []

let enemies = []

const npcs = []

document.getElementById('gameOverScreenContinue').addEventListener('click', () => {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('startingMenu').style.display = 'block'
    playerStats = playerStattemplate
    player.health = 100
    mapTiles = []
    placementX = 0;
    placementY = 0;
    placementOfLastCycle = '0 0'
    currentTile = '0 0'
    document.getElementById('hitIndicator').style.boxShadow = `0px 0px 0vw 0vw red inset`
})

let placementX = 0;
let placementY = 0;
let placementOfLastCycle = '0 0'

let mapTiles = [];

const tileTypes = [
    "open",
    "village",
    "sanctuary",
    "outpost",
    "tresure"
]

const posibleBioms = [
    {
        name: "planes",
        color: "#94ff85",
        groundDeco: [
            {
                image: new Image(),
                path: 'tileParts/planes/grass01.png',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/grass02.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/grass03.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/flower01.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/flower02.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/flower03.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/flower04.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/flower05.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
            {
                image: new Image(),
                path: 'tileParts/planes/flower06.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
        ],
        physicalObj: [
            {
                image: new Image(),
                path: 'tileParts/planes/tree01.png',
                posX: 0,
                posY: 0,
                width: 150,
                height: 150,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 13,
                    offSetY: 140,
                    width: 80,
                    height: 10,
                },
                health: 5000,
                obsorption: 100,
                hitSounds: ['sound/treehit01.mp3', 'sound/treehit02.mp3', 'sound/treehit03.mp3', 'sound/treehit04.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
            {
                image: new Image(),
                path: 'tileParts/planes/tree02.png',
                posX: 0,
                posY: 0,
                width: 150,
                height: 150,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 43,
                    offSetY: 140,
                    width: 43,
                    height: 10,
                },
                health: 5000,
                obsorption: 100,
                hitSounds: ['sound/treehit01.mp3', 'sound/treehit02.mp3', 'sound/treehit03.mp3', 'sound/treehit04.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
            {
                image: new Image(),
                path: 'tileParts/planes/bush01.webp',
                posX: 0,
                posY: 0,
                width: 100,
                height: 70,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 0,
                    offSetY: 60,
                    width: 100,
                    height: 10,
                },
                health: 1000,
                obsorption: 80,
                hitSounds: ['sound/bushhit01.mp3', 'sound/bushhit02.mp3', 'sound/bushhit03.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
            {
                image: new Image(),
                path: 'tileParts/planes/bush02.png',
                posX: 0,
                posY: 0,
                width: 100,
                height: 70,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 0,
                    offSetY: 60,
                    width: 100,
                    height: 10,
                },
                health: 1000,
                obsorption: 80,
                hitSounds: ['sound/bushhit01.mp3', 'sound/bushhit02.mp3', 'sound/bushhit03.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
        ],

    },
    // {
    //     name: "forest",
    //     color: "#3da92f",
    //     groundDeco: [],
    //     physicalObj: [],
    // },
    {
        name: "desert",
        color: "#bf9f2d",
        groundDeco: [
            {
                image: new Image(),
                path: 'tileParts/desert/grass01.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
        ],
        physicalObj: [
            {
                image: new Image(),
                path: 'tileParts/desert/tree01.webp',
                posX: 0,
                posY: 0,
                width: 180,
                height: 130,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 50,
                    offSetY: 120,
                    width: 35,
                    height: 10,
                },
                health: 5000,
                obsorption: 100,
                hitSounds: ['sound/treehit01.mp3', 'sound/treehit02.mp3', 'sound/treehit03.mp3', 'sound/treehit04.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
            {
                image: new Image(),
                path: 'tileParts/desert/tree02.webp',
                posX: 0,
                posY: 0,
                width: 110,
                height: 150,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 0,
                    offSetY: 130,
                    width: 70,
                    height: 20,
                },
                health: 5000,
                obsorption: 100,
                hitSounds: ['sound/treehit01.mp3', 'sound/treehit02.mp3', 'sound/treehit03.mp3', 'sound/treehit04.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
            {
                image: new Image(),
                path: 'tileParts/desert/cactus01.webp',
                posX: 0,
                posY: 0,
                width: 60,
                height: 80,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 20,
                    offSetY: 60,
                    width: 25,
                    height: 30,
                },
                health: 2500,
                obsorption: 100,
                hitSounds: ['sound/treehit01.mp3', 'sound/treehit02.mp3', 'sound/treehit03.mp3', 'sound/treehit04.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
        ],
    },
    {
        name: "volcanic",
        color: "#5a0000",
        groundDeco: [
            {
                image: new Image(),
                path: 'tileParts/volcanic/log01.webp',
                posX: 0,
                posY: 0,
                width: 15,
                height: 15
            },
        ],
        physicalObj: [
            {
                image: new Image(),
                path: 'tileParts/volcanic/tree01.webp',
                posX: 0,
                posY: 0,
                width: 100,
                height: 150,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: 20,
                    offSetY: 140,
                    width: 55,
                    height: 10,
                },
                health: 5000,
                obsorption: 100,
                hitSounds: ['sound/treehit01.mp3', 'sound/treehit02.mp3', 'sound/treehit03.mp3', 'sound/treehit04.mp3'],
                deathSounds: ['sound/treedeath01.mp3', 'sound/treedeath02.mp3']
            },
        ],
    },
    // {
    //     name: "arctic",
    //     color: "#b1fff7",
    //     groundDeco: [],
    //     physicalObj: [],
    // }
]

for (const biom of posibleBioms) {
    for (const groundObj of biom.groundDeco) {
        groundObj.image.src = groundObj.path
        console.log(groundObj.image.src)
    }
    for (const physObj of biom.physicalObj) {
        physObj.image.src = physObj.path
        console.log(physObj.image.src)
    }
}

function createNewMapTile() {
    console.log('Creating new map tile for position ', placementX, placementY)

    const tileEnemeies = createEnemy(Math.floor(Math.random() * 5 + 1), 'mechanic', 2)

    const tileBiom = posibleBioms[Math.floor(Math.random() * posibleBioms.length)]

    const groundDebris = createTileTerrain(tileBiom.groundDeco, 60)
    const tileObjects = createTileTerrain(tileBiom.physicalObj, 8)

    const tileNPCs = []
    tileNPCs.push(createNPC(1, 'merchant'))

    mapTiles.push(
        {
            index: `${placementX} ${placementY}`,
            type: "village",
            biom: tileBiom.name,
            color: tileBiom.color,
            objects: tileObjects,
            groundDeco: groundDebris,
            enemies: tileEnemeies,
            npcs: tileNPCs,
            enemySpawnChance: 400
        }
    )
}

function createTileTerrain(array, amount) {
    const objects = []
    console.log('choosing from', array)
    for(let i = 0; i < amount; i++) {
        const newObjectTemplate = array[Math.floor(Math.random() * array.length)]
        
        let newObject;
        if (newObjectTemplate.colider) {
            newObject = {
                image: newObjectTemplate.image,
                posX: 0,
                posY: 0,
                width: newObjectTemplate.width,
                height: newObjectTemplate.height,
                size: newObjectTemplate.width,
                colider: {
                    posX: 0,
                    posY: 0,
                    offSetX: newObjectTemplate.colider.offSetX,
                    offSetY: newObjectTemplate.colider.offSetY,
                    width: newObjectTemplate.colider.width,
                    height: newObjectTemplate.colider.height,
                },
                health: newObjectTemplate.health,
                maxHealth: newObjectTemplate.health,
                healthBarViewTime: 0,
                obsorption: newObjectTemplate.obsorption,
                hitSounds: newObjectTemplate.hitSounds,
                deathSounds: newObjectTemplate.deathSounds,
            }
        } else {
            newObject = {
                image: newObjectTemplate.image,
                posX: 0,
                posY: 0,
                width: newObjectTemplate.width,
                height: newObjectTemplate.height,
                size: newObjectTemplate.width
            }
        }

        

        function setObjectPosition() {
            newObject.posX = Math.floor(Math.random() * (c.width - newObject.width))
            newObject.posY = Math.floor(Math.random() * (c.height - newObject.height))

            if (newObject.colider) {
                newObject.colider.posX = newObject.posX + newObject.colider.offSetX
                newObject.colider.posY = newObject.posY + newObject.colider.offSetY
            }
            

            for (const image of objects) {
                if (checkCol(image, newObject)) {
                    setObjectPosition()
                }
            }
        }
        setObjectPosition()

        objects.push(newObject)
        console.log('placed', newObject)
    }

    return(objects)
}

const enemyImages = [
    {
        image: new Image(),
        path: 'enemies/spinner.webp'
    }
]

for (const e of enemyImages) {
    e.image.src = e.path
}

let ammoProgression = 0;
let ammoRegenLockout = 0;

let lastEval = null;
let injuredVinettLinger = 0;

let currentTile = '0 0'
function drawFrame() {
    if (invOpen) return

    document.getElementById('healthStat').style.background = `linear-gradient(to right, green ${player.health}%, black ${player.health - 5}%)`
    document.getElementById('healthNum').innerHTML = player.health
    document.getElementById('ammoStat').style.background = `linear-gradient(to left, grey ${Math.round(player.ammo)}%, black ${Math.round(player.ammo) - 5}%)`
    document.getElementById('ammoNum').innerHTML = Math.round(player.ammo)

    if (player.health < 1) {
        playing = false;
        enemies = [];
        document.getElementById('playerStatView').innerHTML = `
        Hits Taken: ${playerStats.hitsTaken} <br>
        Enimies Killed: ${playerStats.enemiesKilled} <br>
        Damage Delt: ${playerStats.damageDelt} <br>
        Damage Taken: ${playerStats.healthLost} <br>
        Life Stolen: ${playerStats.healthGained} <br>
        Ammo Expended: ${Math.round(playerStats.ammoUsed)} <br>
        `
        playSound('sound/gameOver.mp3', 1)
        document.getElementById('gameOver').style.display = 'block';
        return;
    }

    

    if (player.grace > 40) {
        const playerHealthEval = (100 - player.health) * 0.1
        document.getElementById('hitIndicator').style.boxShadow = `0px 0px ${playerHealthEval * 2}vw ${playerHealthEval}vw red inset`
        lastEval = playerHealthEval
        injuredVinettLinger = Math.round(playerHealthEval * 50)
    } else if(lastEval > 0 && injuredVinettLinger < 1) {
        document.getElementById('hitIndicator').style.boxShadow = `0px 0px ${lastEval}vw ${lastEval}vw red inset`
        lastEval -= 0.2
    }
    injuredVinettLinger--
    //console.log(injuredVinettLinger)

    if (statModifyers.speed[1] < 1) {
        statModifyers.speed = [0,0, false]
    }
    statModifyers.speed[1]--


    if (movingUp) {
        player.posY -= (player.speed + statModifyers.speed[0])
    }

    if (player.posY < 0) {
        player.posY = c.height - player.size
        placementY--
        console.log(`Canged tiles\nX: ${placementX}\nY: ${placementY}`)
    }

    if (moveingDown) {
        player.posY += (player.speed + statModifyers.speed[0])
    }

    if (player.posY > (c.height - player.size)) {
        player.posY = 0
        placementY++
        console.log(`Canged tiles\nX: ${placementX}\nY: ${placementY}`)
    }

    if (moevingLeft) {
        player.posX += (player.speed + statModifyers.speed[0])
    }

    if (player.posX > (c.width - player.size)) {
        player.posX = 0
        placementX++
        console.log(`Canged tiles\nX: ${placementX}\nY: ${placementY}`)
    }

    if (movingRight) {
        player.posX -= (player.speed + statModifyers.speed[0])
    }

    if (player.posX < 0) {
        player.posX = c.width - player.size
        placementX--
        console.log(`Canged tiles\nX: ${placementX}\nY: ${placementY}`)
    }

    if (placementOfLastCycle !== `${placementX} ${placementY}`) {
        projectiles = [];
        for (const enemy of enemies) {
            currentTile.enemies.push(enemy)
        }
        enemies = [];
        player.grace = 50
    }
    placementOfLastCycle = `${placementX} ${placementY}`

    if (mapTiles.some(tile => tile.index === `${placementX} ${placementY}`)) {
        
    } else {
        createNewMapTile()
        requestAnimationFrame(drawFrame)
        return;
    }

    const tilePosition = mapTiles.findIndex(tile => tile.index === `${placementX} ${placementY}`);
    currentTile = mapTiles[tilePosition]

    if (currentlyShooting) {
        createBullet()
    }

    ctx.clearRect(0,0, c.width, c.height)

    ctx.fillStyle = currentTile.color
    ctx.fillRect(0,0, c.width, c.height)

    for(const obj of currentTile.groundDeco) {
        ctx.drawImage(obj.image, obj.posX, obj.posY, obj.width, obj.height)
    }



    ctx.fillStyle = player.color
    ctx.fillRect(player.posX, player.posY, player.size, player.size)

    player.grace--

    if (ammoRegenLockout < 1) {
        if (player.ammo < 100) {
            ammoProgression++
        }

        if (ammoProgression > 5) {
            ammoProgression = 0
            player.ammo++
        }
    } else {
        ammoRegenLockout--
    }

    function checkCritRequirement(target) {
        switch(currentGun.critRequirement) {
            case "none":
                return true;
            break;
            case 'close':
                return(Math.abs(player.posX - target.posX) <= 150 && Math.abs(player.posY - target.posY) <= 150)
            break;
            case 'far':
                return (Math.abs(player.posX - target.posX) > 600 || Math.abs(player.posY - target.posY) > 600)
            break;
            default:
                console.log('No requirement found', currentGun)
                return true;
            break;
        }
    }
    
    for (let i2 = 0; i2 < projectiles.length; i2++) {
        const projectile = projectiles[i2]

        projectile.fadeTime--
        if (projectile.fadeTime < 0) {
            projectiles.splice(i2, 1)
        }

        if (projectile.posX < 0 || projectile.posX > c.width || projectile.posY < 0 || projectile.posY > c.height) {
            projectiles.splice(i2, 1)
            i2--
            continue
        }

        const doesThisBulletPassThroughStuff = Math.floor(Math.random() * 100)

        for(let i3 = 0; i3 < currentTile.objects.length; i3++) {
            const obj = currentTile.objects[i3]

            if (checkCol(obj.colider, projectile) && obj.obsorption > doesThisBulletPassThroughStuff) {
                projectiles.splice(i2, 1)
                i2--
                obj.health -= projectile.dmg
                obj.healthBarViewTime = 60
                playSound(obj.hitSounds[Math.floor(Math.random() * obj.hitSounds.length)], 0.5)
                particles.push({
                    type: "text",
                    content: projectile.dmg,
                    color: 'red',
                    size: 15,
                    posX: obj.colider.posX + (obj.colider.width / 2),
                    posY: obj.colider.posY + (obj.colider.height / 2),
                    direction: 'up right',
                    speed1: 0.2,
                    speed2: 0.5,
                    duration: 50,
                })
                if (obj.health < 0) {
                    currentTile.objects.splice(i3, 1)
                    playSound(obj.deathSounds[Math.floor(Math.random() * obj.deathSounds.length)], 0.5)
                }
                continue
            }
        }

        ctx.beginPath();
        ctx.arc(projectile.posX, projectile.posY, projectile.size, 0, 2 * Math.PI);
        ctx.fillStyle = projectile.color;
        ctx.fill();

        projectile.posY += projectile.Y * -1
        projectile.posX += projectile.X * -1

        function handleBulletsHittingEnemies(enemyArray) {
            for (let i = 0; i < enemyArray.length; i++) {
                const enemy = enemyArray[i]

                if (enemy.grace < 1) {
                    if (checkCol(enemy, projectile)) {
                        console.log(`${enemy.name} was killed its position was ${i}`)
                        playSound(enemy.hitSounds[Math.floor(Math.random() * enemy.hitSounds.length)], 0.4)

                        if ((Math.floor(Math.random() * 100) + 1) < (player.critChance + currentGun.critChance) && checkCritRequirement(enemy)) {
                            enemy.health -= (projectile.dmg * player.critMultiplyer) * currentGun.critMultiplyer
                            particles.push({
                                type: "text",
                                content: (projectile.dmg * player.critMultiplyer) * currentGun.critMultiplyer,
                                color: 'gold',
                                size: 35,
                                posX: enemy.posX,
                                posY: enemy.posY,
                                direction: 'up right',
                                speed1: 0.2,
                                speed2: 0.5,
                                duration: 50,
                            })
                        } else {
                            enemy.health -= projectile.dmg
                            particles.push({
                                type: "text",
                                content: projectile.dmg,
                                color: 'red',
                                size: 30,
                                posX: enemy.posX,
                                posY: enemy.posY,
                                direction: 'up right',
                                speed1: 0.2,
                                speed2: 0.5,
                                duration: 50,
                            })
                        }

                        enemy.grace = 5

                        projectile.peirce--
                        if (projectile.peirce < 0) {
                            projectiles.splice(i2, 1)
                        }

                        if (enemy.health <= 0) {
                            console.log(`${enemy.name} was killed its position was ${i}`)
                            playSound(enemy.deathSounds[Math.floor(Math.random() * enemy.deathSounds.length)], 0.5)
                            enemyArray.splice(i, 1)

                            if (Math.floor(Math.random() * 100) + 1 < player.lifeStealChance) {
                                const proposedHealth = player.health + (1 * player.lifeStealAmount)
                                playerStats.healthGained += 1 * player.lifeStealAmount

                                particles.push({
                                    type: "text",
                                    content: Math.round(1 * player.lifeStealAmount),
                                    color: 'green',
                                    posX: player.posX,
                                    posY: player.posY,
                                    direction: 'up right',
                                    speed1: 0.2,
                                    speed2: 0.5,
                                    duration: 50,
                                })

                                if (Math.round(proposedHealth) > 100) {
                                    player.health = 100
                                } else {
                                    player.health = Math.round(proposedHealth)
                                }
                            }

                            playerStats.enemiesKilled++
                            playerStats.damageDelt += projectile.dmg
                        }
                    }
                }
            }
        }

        handleBulletsHittingEnemies(enemies)
        handleBulletsHittingEnemies(currentTile.enemies)
    }

    for (const enemy of enemies) {

        ctx.drawImage(enemyImages[0].image, enemy.posX, enemy.posY, enemy.size, enemy.size)

        ctx.fillStyle = 'grey'
        ctx.fillRect(enemy.posX, enemy.posY - 15, enemy.size, 10)
        ctx.fillStyle = 'green'
        const enemyPercentHealth = Math.round((enemy.health / enemy.maxHealth) * enemy.size)

        ctx.fillRect(enemy.posX, enemy.posY - 15, enemyPercentHealth, 10) 

        if (enemy.posX > player.posX && enemy.posX !== player.posX) {
            enemy.posX -= enemy.speed
        } 
        
        if (enemy.posX < player.posX && enemy.posX !== player.posX) {
            enemy.posX += enemy.speed
        }

        if (enemy.posY > player.posY && enemy.posY !== player.posY) {
            enemy.posY -= enemy.speed
        } 
        
        if (enemy.posY < player.posY && enemy.posY !== player.posY) {
            enemy.posY += enemy.speed
        }

        for (object of currentTile.objects) {
            if (checkCol(enemy, object.colider)) {
                const side = checkSide(enemy, object.colider)

                if (side[0] === 'bottom') {
                    enemy.posY += enemy.speed
                }
                if (side[0] === 'top') {
                    enemy.posY -= enemy.speed
                }
            }

            if (checkCol(enemy, object.colider)) {
                const side = checkSide(enemy, object.colider)

                if (side[1] === 'left') {
                    enemy.posX -= enemy.speed
                }
                if (side[1] === 'right') {
                    enemy.posX += enemy.speed
                }
            }
        }

        enemy.grace--

        if (player.health > statModifyers.defence[1]) {
            statModifyers.defence = [0,0, false]
        }

        if (player.grace < 1) {
            if (checkCol(enemy, player)) {
                console.log(`Player was hit by ${enemy.name} for ${enemy.dmg} damage`)
                player.health -= Math.round((enemy.dmg * (player.defence - statModifyers.defence[0])))
                player.grace = 50
                playerStats.hitsTaken++
                playerStats.healthLost += Math.round((enemy.dmg * (player.defence - statModifyers.defence[0])))
            }
        }
    }

    for (const enemy of currentTile.enemies) {
        ctx.drawImage(enemyImages[0].image, enemy.posX, enemy.posY, enemy.size, enemy.size)

        ctx.fillStyle = 'grey'
        ctx.fillRect(enemy.posX, enemy.posY - 15, enemy.size, 10)
        ctx.fillStyle = 'green'
        const enemyPercentHealth = Math.round((enemy.health / enemy.maxHealth) * enemy.size)
        ctx.fillRect(enemy.posX, enemy.posY - 15, enemyPercentHealth, 10) 



        if (enemy.posX > player.posX && enemy.posX !== player.posX) {
            enemy.posX -= enemy.speed
        } 
        
        if (enemy.posX < player.posX && enemy.posX !== player.posX) {
            enemy.posX += enemy.speed
        }

        if (enemy.posY > player.posY && enemy.posY !== player.posY) {
            enemy.posY -= enemy.speed
        } 
        
        if (enemy.posY < player.posY && enemy.posY !== player.posY) {
            enemy.posY += enemy.speed
        }

        for (object of currentTile.objects) {
            if (checkCol(enemy, object.colider)) {
                const side = checkSide(enemy, object.colider)

                if (side[0] === 'bottom') {
                    enemy.posY += enemy.speed
                }
                if (side[0] === 'top') {
                    enemy.posY -= enemy.speed
                }
            }

            if (checkCol(enemy, object.colider)) {
                const side = checkSide(enemy, object.colider)

                if (side[1] === 'left') {
                    enemy.posX -= enemy.speed
                }
                if (side[1] === 'right') {
                    enemy.posX += enemy.speed
                }
            }
        }
        
        enemy.grace--

        //console.log(checkCol(enemy, player))

        if (player.grace < 1) {
            if (checkCol(enemy, player)) {
                console.log(`Player was hit by ${enemy.name} for ${enemy.dmg} damage`)
                player.health -= Math.round((enemy.dmg * (player.defence - statModifyers.defence[0])))
                player.grace = 50
                playerStats.hitsTaken++
                playerStats.healthLost += Math.round((enemy.dmg * (player.defence - statModifyers.defence[0])))
            }
        }
    }

    for (const npc of currentTile.npcs) {
        ctx.fillStyle = 'black'
        ctx.fillRect(npc.posX, npc.posY, npc.width, npc.height)
    }

    if (Math.floor(Math.random() * currentTile.enemySpawnChance) === 0) {
        const newRoamingEnemys = createEnemy(Math.floor(Math.random() * 3) + 1, 'mechanic', 1) //createEnemy(0, 1)//

        for (const enemy of newRoamingEnemys) {
            enemies.push(enemy)
        }

        // if (Math.floor(Math.random() * 100) < 10) {enemyDamageRamp++}
        // if (Math.floor(Math.random() * 100) < 20) {enemyHealthRamp++}
        // if (Math.floor(Math.random() * 100) < 1) {enemySpeedRamp++}
        // if (Math.floor(Math.random() * 100) < 5) {enemySizeRamp++}
    }

    for(const obj of currentTile.objects) {
        ctx.drawImage(obj.image, obj.posX, obj.posY, obj.width, obj.height)

        if (obj.healthBarViewTime > 0) {
            ctx.fillStyle = 'grey'
            ctx.fillRect(obj.posX, obj.posY - 15, obj.width, 10)
            ctx.fillStyle = 'green'
            const objPercentHealth = Math.round((obj.health / obj.maxHealth) * obj.size)
            ctx.fillRect(obj.posX, obj.posY - 15, objPercentHealth, 10) 
            obj.healthBarViewTime--
        }
        


        if (checkCol(player, obj.colider)) {
            const side = checkSide(player, obj.colider)

            if (movingUp && side[0] === 'bottom') {
                player.posY += (player.speed + statModifyers.speed[0])
            }
            if (moveingDown && side[0] === 'top') {
                player.posY -= (player.speed + statModifyers.speed[0])
            }

            if (moevingLeft && side[1] === 'left') { //at the point of writing this I have just lerned moving left and right vars are
                player.posX -= (player.speed + statModifyers.speed[0])         //not labeled correctly. Oops ;-;
            }
            if (movingRight && side[1] === 'right') {
                player.posX += (player.speed + statModifyers.speed[0])
            }
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]

        switch (particle.type) {
            case "text":
                ctx.font = `${particle.size}px Arial`
                ctx.fillStyle = particle.color
                particle.posX += particle.speed1
                particle.posY -= particle.speed2
                particle.duration--
                ctx.fillText(particle.content, particle.posX, particle.posY)

                if (particle.duration < 0) {
                    particles.splice(i, 1)
                }
            break;
            default:
                console.log('Particle exists with no type: ', particle)
            break;
        }
    }

    requestAnimationFrame(drawFrame)
}


function checkCol(item01, item02) {
    let i1Width = item01.size
    let i1Height = item01.size
    if (item01.width) {
        i1Width = item01.width
        i1Height = item01.height
    }

    let i2Width = item02.size
    let i2Height = item02.size
    if (item02.width) {
        i2Width = item02.width
        i2Height = item02.height
    }

    if (
        item01.posX + i1Width >= item02.posX &&
        item01.posX <= item02.posX + i2Width &&

        item01.posY + i1Height >= item02.posY &&
        item01.posY <= item02.posY + i2Height
    ) {
        return(true)
    } else {
        return(false)
    }
}

function checkSide(item01, item02) { //ITEM 1 MUST BE PLAYER
    const reply = []
    if (item01.posY + (item01.size / 2) > item02.posY + (item02.height / 2)) {
        reply.push('bottom')
    } else {
        reply.push('top')
    }

    if (item01.posX + (item01.size / 2) > item02.posX + (item02.width / 2)) {
        reply.push('right')
    } else {
        reply.push('left')
    }

    return(reply)
}

function createNPC() {
    const newNPC = {
        name: "Stub",
        type: 'merchant',
        src: "",
        posX: 100,
        posY: 100,
        width: 30,
        height: 60,
        dialog: {
            Jerry: [
                {
                    text: "Would you like to purchase something?",
                    options: [
                        {
                            text: "yes",
                            script: null
                        },
                        {
                            text: "no",
                            script: null
                        }
                    ]
                }
            ],
            Gary: [
                {
                    text: "Good to see youre still alive my friend...",
                    options: []
                },
                {
                    text: "always happy to do business with a long term client :3",
                    options: [
                        {
                            text: "Buy",
                            script: null
                        },
                        {
                            text: "Sell",
                            script: null
                        },
                        {
                            text: "Leave",
                            script: null
                        }
                    ]
                }
            ],
            Mary: [
                {
                    text: "I dont serve monsters. Beat it if you know whats good for you.",
                    options: []
                }
            ]
        }
    }
    //npcs.push(newNPC)
    return(newNPC)
}

let enemyHealthRamp = 0;
let enemyDamageRamp = 0;
let enemySpeedRamp = 0;
let enemySizeRamp = 0;

function createEnemy(amount, boss, level) {
    console.log(`Building ${amount} level ${level} ${boss} enemies \nPosible choices:`)
    console.log(enemyTemplates[boss][level])
    const posibleEnemies = enemyTemplates[boss][level]
    const newEnemies = []

    for (let i = 0; i < amount; i++) {
        const randomPosition = Math.floor(Math.random() * 4)
        let topLocation = null;
        let leftLocation = null;

        switch (randomPosition) {
            case 0:
                topLocation = -100 - 40
                leftLocation = Math.floor(Math.random() * window.innerWidth)
            break;a
            case 1:
                topLocation = window.innerHeight + 50
                leftLocation = Math.floor(Math.random() * window.innerWidth)
            break;
            case 2:
                topLocation = Math.floor(Math.random() * window.innerHeight)
                leftLocation = window.innerWidth + 50
            break;
            case 2:
                topLocation = Math.floor(Math.random() * window.innerHeight)
                leftLocation = 0 - 40
            break;
        }

        const enemyTemplate = posibleEnemies[Math.floor(Math.random() * posibleEnemies.length)]

        newEnemies.push({
            name: enemyTemplate.name,
            posX: leftLocation,
            posY: topLocation,
            size: enemyTemplate.size + enemySizeRamp,
            color: 'red',
            speed: enemyTemplate.speed + enemySpeedRamp,
            dmg: enemyTemplate.dmg + enemyDamageRamp,
            maxHealth: enemyTemplate.health + enemyHealthRamp,
            health: enemyTemplate.health + enemyHealthRamp,
            grace: 0,
            hitSounds: enemyTemplate.hitSounds,
            deathSounds: enemyTemplate.deathSounds
        })
    }

    return(newEnemies)
}

const enemyTemplates = {
    mechanic: {
        1: [
            {
                name: 'Blade Spinner',
                image: 'x',
                size: 40,
                speed: 2,
                dmg: 7,
                health: 10,
                hitSounds: ['sound/metalhit01.mp3', 'sound/metalhit02.mp3', 'sound/metalhit03.mp3', 'sound/metalhit04.mp3'],
                deathSounds: ['sound/metaldeath01.mp3', 'sound/metaldeath02.mp3', 'sound/metaldeath03.mp3']
            },
            {
                name: 'Inhanced Gloop',
                image: 'x',
                size: 40,
                speed: 2,
                dmg: 2,
                health: 30,
                hitSounds: ['sound/fleshhit.mp3', 'sound/metalhit01.mp3'],
                deathSounds: ['sound/fleshkill01.mp3', 'sound/fleshkill02.mp3', 'sound/fleshkill03.mp3', 'sound/fleshkill04.mp3']
            },
        ],
        2: [
            {
                name: 'Sword launcher',
                image: 'x',
                size: 40,
                speed: 2,
                dmg: 7,
                health: 10,
                hitSounds: ['sound/metalhit01.mp3', 'sound/metalhit02.mp3', 'sound/metalhit03.mp3', 'sound/metalhit04.mp3'],
                deathSounds: ['sound/metaldeath01.mp3', 'sound/metaldeath02.mp3', 'sound/metaldeath03.mp3']
            },
            {
                name: 'Tangle wire',
                image: 'x',
                size: 40,
                speed: 3,
                dmg: 15,
                health: 70,
                hitSounds: ['sound/metalhit01.mp3', 'sound/metalhit02.mp3', 'sound/metalhit03.mp3', 'sound/metalhit04.mp3'],
                deathSounds: ['sound/metaldeath01.mp3', 'sound/metaldeath02.mp3', 'sound/metaldeath03.mp3']
            },
            {
                name: 'Impaler',
                image: 'x',
                size: 40,
                speed: 4,
                dmg: 20,
                health: 200,
                hitSounds: ['sound/metalhit01.mp3', 'sound/metalhit02.mp3', 'sound/metalhit03.mp3', 'sound/metalhit04.mp3'],
                deathSounds: ['sound/metaldeath01.mp3', 'sound/metaldeath02.mp3', 'sound/metaldeath03.mp3']
            },
            {
                name: 'Flail whirler',
                image: 'x',
                size: 40,
                speed: 2,
                dmg: 30,
                health: 400,
                hitSounds: ['sound/metalhit01.mp3', 'sound/metalhit02.mp3', 'sound/metalhit03.mp3', 'sound/metalhit04.mp3'],
                deathSounds: ['sound/metaldeath01.mp3', 'sound/metaldeath02.mp3', 'sound/metaldeath03.mp3']
            },
        ],
        3: [
            {
                name: 'Cleanup Crew',
                image: 'x',
                size: 40,
                speed: 2,
                dmg: 2,
                health: 12,
                hitSounds: ['sound/metalhit01.mp3', 'sound/metalhit02.mp3', 'sound/metalhit03.mp3', 'sound/metalhit04.mp3'],
                deathSounds: ['sound/metaldeath01.mp3', 'sound/metaldeath02.mp3', 'sound/metaldeath03.mp3']
            },
        ]
    },
    infection: {},
    hivemind: {},
}