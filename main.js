
const {app, BrowserWindow} = require('electron')
const path  = require('path')

function createMainWindow() {
    const win = new BrowserWindow({
        height: 500,
        width: 700
    })

    win.loadFile(path.join(__dirname, 'game', 'index.html'))
}

app.whenReady().then(() => {
    createMainWindow()
    console.log('ready')
})