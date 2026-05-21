import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const require = createRequire(import.meta.url)
const ElectronStore = require('electron-store')
const store = new ElectronStore.default()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'CodeX — SAP Code Generator',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  win.loadURL('http://localhost:5173')
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('save-api-key', (_, key) => {
  store.set('apiKey', key)
  return true
})

ipcMain.handle('get-api-key', () => {
  return store.get('apiKey', '')
})

ipcMain.handle('generate-code', async (_, { framework, entity, pattern, description }) => {
  const apiKey = store.get('apiKey')
  if (!apiKey) throw new Error('API key not set. Please go to Settings and add your Anthropic API key.')

  const Anthropic = require('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey })

  const { buildPrompt } = await import(`./src/prompts/${framework}.js`)
  const prompt = buildPrompt({ entity, pattern, description })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    messages: [{ role: 'user', content: prompt }]
  })

  return message.content[0].text
})

ipcMain.handle('save-files', async (_, { files }) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Choose folder to save generated files'
  })
  if (!filePaths || !filePaths[0]) return null
  files.forEach(({ name, content }) => {
    fs.writeFileSync(path.join(filePaths[0], name), content, 'utf8')
  })
  return filePaths[0]
})