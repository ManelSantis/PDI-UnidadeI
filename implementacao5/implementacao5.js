const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
let srcImage = new Image
let imgData = null

fileinput.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage.src = URL.createObjectURL(e.target.files[0])
    if (fileinput.files[0].name.includes('.pgm')) {

      let widthImgPGM1 = 0
      let heightImgPGM1 = 0
      let reader = new FileReader()
      let values = []

      reader.onload = function (event) {
        let text = this.result
        let lines = text.split('\n')
        heightImgPGM1 += lines.length - 3
        for (let i = 3; i < lines.length; i++) {
          const aux = lines[i].split(' ')
          if (aux.length > 1) {
            widthImgPGM1 = aux.length
          }
          for (let j = 0; j < aux.length; j++) {
            values.push(aux[j])
          }
        }
        let data = getRGBfromInt(values)
        let newImgData = new ImageData(widthImgPGM1, heightImgPGM1)
        for (let i = 0; i < newImgData.data.length; i += 4) {
          newImgData.data[i] = data[i]
          newImgData.data[i + 1] = data[i + 1]
          newImgData.data[i + 2] = data[i + 2]
          newImgData.data[i + 3] = data[i + 3]
        }
        srcImage = imgDataToImg(newImgData, widthImgPGM1, heightImgPGM1)
        srcImage.onload = function () {
          canvas.width = srcImage.width
          canvas.height = srcImage.height
          ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
          imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
        }
      }
      reader.readAsText(fileinput.files[0])

    } else {
      srcImage.onload = function () {
        canvas.width = srcImage.width
        canvas.height = srcImage.height
        ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
        imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
      }
    }
  }
}

const gmin = document.getElementById('gmin')
const valuegmin = document.getElementById('valueGMin')
const gmax = document.getElementById('gmax')
const valuegmax = document.getElementById('valueGMax')

gmin.oninput = function (e) {
  valuegmin.innerHTML = gmin.value;
}

gmax.oninput = function (e) {
  valuegmax.innerHTML = gmax.value;
}

const minmax = document.getElementById('minmax')
const minmaxCanvas = document.getElementById('minmaxcanvas')
const minmaxs = minmaxCanvas.getContext('2d')
let minmaxImg = new Image

minmax.onclick = function (e) {

  let newImgData = calcInterval(parseInt(gmin.value), parseInt(gmax.value));

  minmaxImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  minmaxCanvas.width = minmaxImg.width
  minmaxCanvas.height = minmaxImg.height
  minmaxs.drawImage(minmaxImg, 0, 0, minmaxImg.width, minmaxImg.height)
}

const negativo = document.getElementById('negativo')
const negativoCanvas = document.getElementById('negativocanvas')
const negativos = negativoCanvas.getContext('2d')
let negativoImg = new Image

negativo.onclick = function (e) {

  let newImgData = calcInterval(255, 0);

  negativoImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  negativoCanvas.width = negativoImg.width
  negativoCanvas.height = negativoImg.height
  negativos.drawImage(negativoImg, 0, 0, negativoImg.width, negativoImg.height)
}

const binaria = document.getElementById('binaria')
const binariaCanvas = document.getElementById('binariacanvas')
const binarias = binariaCanvas.getContext('2d')
let binariaImg = new Image

binaria.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let grayscale = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    if ((grayscale >= 0) && (grayscale <= 127)) {
      newImgData.data[i] = 0
      newImgData.data[i + 1] = 0
      newImgData.data[i + 2] = 0
    } else {
      newImgData.data[i] = 255
      newImgData.data[i + 1] = 255
      newImgData.data[i + 2] = 255
    }
    newImgData.data[i + 3] = 255
  }

  binariaImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  binariaCanvas.width = binariaImg.width
  binariaCanvas.height = binariaImg.height
  binarias.drawImage(binariaImg, 0, 0, binariaImg.width, binariaImg.height)
}

const porpartes = document.getElementById('porpartes')
const porpartesCanvas = document.getElementById('porpartescanvas')
const porpartess = porpartesCanvas.getContext('2d')
let porpartesImg = new Image

porpartes.onclick = function (e) {

  let newImgData = calPorPartes(3);

  porpartesImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  porpartesCanvas.width = porpartesImg.width
  porpartesCanvas.height = porpartesImg.height
  porpartess.drawImage(porpartesImg, 0, 0, porpartesImg.width, porpartesImg.height)
}

function calPorPartes(interval) {
  let maiores = []
  let menores = []
  let init = 0
  let end = parseInt(255 / interval)

  for (let i = 1; i <= interval; i++) {
    maiores.push(end)
    menores.push(init)
    init = end + 1
    end += parseInt(255 / interval)

    if ((i == interval) && (maiores[i - 1] < 255)) {
      maiores[i - 1] = 255
    }

  }

  const imageData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let grayscale = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    for (let j = 0; j < interval; j++) {
      if (j == 0) {
        if ((grayscale >= menores[j]) && (grayscale <= maiores[j])) {
        imageData.data[i] = (menores[j] / maiores[j]) * (imgData.data[i] - maiores[j]) + menores[j]
        imageData.data[i + 1] = (menores[j] / maiores[j]) * (imgData.data[i + 1] - maiores[j]) + menores[j]
        imageData.data[i + 2] = (menores[j] / maiores[j]) * (imgData.data[i + 2] - maiores[j]) + menores[j]
        }
      } else if ((grayscale >= menores[j]) && (grayscale <= maiores[j])) {
        imageData.data[i] = ((menores[j] - menores[j - 1]) / (maiores[j] - maiores[j - 1])) * (imgData.data[i] - maiores[j - 1]) + menores[j - 1]
        imageData.data[i + 1] = ((menores[j] - menores[j - 1]) / (maiores[j] - maiores[j - 1])) * (imgData.data[i + 1] - maiores[j - 1]) + menores[j - 1]
        imageData.data[i + 2] = ((menores[j] - menores[j - 1]) / (maiores[j] - maiores[j - 1])) * (imgData.data[i + 2] - maiores[j - 1]) + menores[j - 1]
      }
    }
    imageData.data[i + 3] = 255
  }

  return imageData
}

const log = document.getElementById('log')
const logCanvas = document.getElementById('logcanvas')
const logs = logCanvas.getContext('2d')
let logImg = new Image

log.onclick = function (e) {

  let newImgData = getNormalise(logaritimo())

  logImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  logCanvas.width = logImg.width
  logCanvas.height = logImg.height
  logs.drawImage(logImg, 0, 0, logImg.width, logImg.height)
}

function logaritimo() {
  let maiores = [imgData.data[0], imgData.data[1], imgData.data[2]]
  const imageData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > maiores[0]) { maiores[0] = imgData.data[i] }
    if (imgData.data[i + 1] > maiores[1]) { maiores[1] = imgData.data[i + 1] }
    if (imgData.data[i + 2] > maiores[2]) { maiores[2] = imgData.data[i + 2] }
  }

  let ar = 255 / (Math.log(1 + maiores[0]))
  let ag = 255 / (Math.log(1 + maiores[1]))
  let ab = 255 / (Math.log(1 + maiores[2]))

  for (let i = 0; i < imgData.data.length; i += 4) {
    imageData.data[i] = ar * Math.log(1 + imgData.data[i])
    imageData.data[i + 1] = ag * Math.log(1 + imgData.data[i + 1])
    imageData.data[i + 2] = ab * Math.log(1 + imgData.data[i + 2])
    imageData.data[i + 3] = 255
  }

  return imageData
}

const raiz = document.getElementById('raiz')
const raizCanvas = document.getElementById('raizcanvas')
const raizs = raizCanvas.getContext('2d')
let raizImg = new Image

raiz.onclick = function (e) {

  let newImgData = getNormalise(raizes())

  raizImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  raizCanvas.width = raizImg.width
  raizCanvas.height = raizImg.height
  raizs.drawImage(raizImg, 0, 0, raizImg.width, raizImg.height)
}

function raizes() {
  let maiores = [imgData.data[0], imgData.data[1], imgData.data[2]]
  const imageData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > maiores[0]) { maiores[0] = imgData.data[i] }
    if (imgData.data[i + 1] > maiores[1]) { maiores[1] = imgData.data[i + 1] }
    if (imgData.data[i + 2] > maiores[2]) { maiores[2] = imgData.data[i + 2] }
  }

  let ar = 255 / (Math.sqrt(1 + maiores[0]))
  let ag = 255 / (Math.sqrt(1 + maiores[1]))
  let ab = 255 / (Math.sqrt(1 + maiores[2]))

  for (let i = 0; i < imgData.data.length; i += 4) {
    imageData.data[i] = ar * Math.sqrt(imgData.data[i])
    imageData.data[i + 1] = ag * Math.sqrt(imgData.data[i + 1])
    imageData.data[i + 2] = ab * Math.sqrt(imgData.data[i + 2])
    imageData.data[i + 3] = 255
  }

  return imageData
}

const expo = document.getElementById('expo')
const expoCanvas = document.getElementById('expocanvas')
const expos = expoCanvas.getContext('2d')
let expoImg = new Image

expo.onclick = function (e) {

  let newImgData = getNormalise(exponencial())

  for (let i = 0; i<imgData.data.length; i+=4){
    newImgData.data[i] += imgData.data[i]
    newImgData.data[i+1] += imgData.data[i+1]
    newImgData.data[i+2] += imgData.data[i+2]
    newImgData.data[i+3] = 255
  }

  expoImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  expoCanvas.width = expoImg.width
  expoCanvas.height = expoImg.height
  expos.drawImage(expoImg, 0, 0, expoImg.width, expoImg.height)
}

function exponencial() {
  let maiores = [imgData.data[0], imgData.data[1], imgData.data[2]]
  let imageData = []

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > maiores[0]) { maiores[0] = imgData.data[i] }
    if (imgData.data[i + 1] > maiores[1]) { maiores[1] = imgData.data[i + 1] }
    if (imgData.data[i + 2] > maiores[2]) { maiores[2] = imgData.data[i + 2] }
  }

  let ar = 255 / (Math.exp(maiores[0]) + 1)
  let ag = 255 / (Math.exp(maiores[1]) + 1)
  let ab = 255 / (Math.exp(maiores[2]) + 1)

  for (let i = 0; i < imgData.data.length; i += 4) {
    imageData.push(exponentialToInt((ar * (Math.exp(imgData.data[i]) + 1)).toPrecision()))
    imageData.push(exponentialToInt((ag * (Math.exp(imgData.data[i + 1]) + 1)).toPrecision()))
    imageData.push(exponentialToInt((ab * (Math.exp(imgData.data[i + 2]) + 1)).toPrecision()))
    imageData.push(255)
  }

  imageData = getNormalises(imageData)

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i+=4){
    newImgData.data[i] = imageData[i]
    newImgData.data[i+1] = imageData[i+1]
    newImgData.data[i+2] = imageData[i+2]
    newImgData.data[i+3] = imageData[i+3]
  }

  return newImgData
}

function exponentialToInt(value){
  let integer = value.replace('.', "")
  integer = integer.replace('e', "")
  integer = integer.replace('-', "")
  integer = integer.substring(0, integer.length - 2)

  let aux = parseInt(integer)

  return aux
}

const quadrado = document.getElementById('quadrado')
const quadradoCanvas = document.getElementById('quadradocanvas')
const quadrados = quadradoCanvas.getContext('2d')
let quadradoImg = new Image

quadrado.onclick = function (e) {

  let newImgData = getNormalise(quadrada())

  quadradoImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  quadradoCanvas.width = quadradoImg.width
  quadradoCanvas.height = quadradoImg.height
  quadrados.drawImage(quadradoImg, 0, 0, quadradoImg.width, quadradoImg.height)
}

function quadrada() {
  let maiores = [imgData.data[0], imgData.data[1], imgData.data[2]]
  const imageData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > maiores[0]) { maiores[0] = imgData.data[i] }
    if (imgData.data[i + 1] > maiores[1]) { maiores[1] = imgData.data[i + 1] }
    if (imgData.data[i + 2] > maiores[2]) { maiores[2] = imgData.data[i + 2] }
  }

  let ar = 255 / (Math.pow(1 + maiores[0], 2))
  let ag = 255 / (Math.pow(1 + maiores[1], 2))
  let ab = 255 / (Math.pow(1 + maiores[2], 2))

  for (let i = 0; i < imgData.data.length; i += 4) {
    imageData.data[i] = ar * Math.pow(imgData.data[i], 2)
    imageData.data[i + 1] = ag * Math.pow(imgData.data[i + 1], 2)
    imageData.data[i + 2] = ab * Math.pow(imgData.data[i + 2], 2)
    imageData.data[i + 3] = 255
  }

  return imageData
}

function calcInterval(min, max) {
  let maiores = [imgData.data[0], imgData.data[1], imgData.data[2]]
  let menores = [imgData.data[0], imgData.data[1], imgData.data[2]]

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > maiores[0]) { maiores[0] = imgData.data[i] }
    if (imgData.data[i + 1] > maiores[1]) { maiores[1] = imgData.data[i + 1] }
    if (imgData.data[i + 2] > maiores[2]) { maiores[2] = imgData.data[i + 2] }
    if (imgData.data[i] < menores[0]) { menores[0] = imgData.data[i] }
    if (imgData.data[i + 1] < menores[1]) { menores[1] = imgData.data[i + 1] }
    if (imgData.data[i + 2] < menores[2]) { menores[2] = imgData.data[i + 2] }
  }

  const imageData = new ImageData(srcImage.width, srcImage.height)

  let newInterval = (max - min)
  for (let i = 4; i < imgData.data.length; i += 4) {
    imageData.data[i] = (newInterval / (maiores[0] - menores[0])) * (imgData.data[i] - menores[0]) + min
    imageData.data[i + 1] = (newInterval / (maiores[1] - menores[1])) * (imgData.data[i + 1] - menores[1]) + min
    imageData.data[i + 2] = (newInterval / (maiores[2] - menores[2])) * (imgData.data[i + 2] - menores[2]) + min
    imageData.data[i + 3] = 255
  }

  return imageData
}

function imgDataToImg(imagedata, w, h) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  canvas.width = w
  canvas.height = h
  ctx.putImageData(imagedata, 0, 0)
  var image = new Image()
  image.src = canvas.toDataURL()
  return image
}

function getRGBfromInt(values) {
  let image = []
  for (let i = 0; i < values.length; i++) {
    image.push(values[i])
    image.push(values[i])
    image.push(values[i])
    image.push(255)
  }
  return image
}

function getNormalise(imageData) {
  let maiores = [imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]]
  let menores = [imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]]

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imageData.data[i] > maiores[0]) { maiores[0] = imageData.data[i] }
    if (imageData.data[i + 1] > maiores[1]) { maiores[1] = imageData.data[i + 1] }
    if (imageData.data[i + 2] > maiores[2]) { maiores[2] = imageData.data[i + 2] }
    if (imageData.data[i + 3] > maiores[3]) { maiores[3] = imageData.data[i + 3] }
    if (imageData.data[i] < menores[0]) { menores[0] = imageData.data[i] }
    if (imageData.data[i + 1] < menores[1]) { menores[1] = imageData.data[i + 1] }
    if (imageData.data[i + 2] < menores[2]) { menores[2] = imageData.data[i + 2] }
    if (imageData.data[i + 3] < menores[3]) { menores[3] = imageData.data[i + 3] }
  }

  for (let i = 0; i < imgData.data.length; i += 4) {
    if (imageData.data[i] > 255) {
      imageData.data[i] = (255 / (maiores[0] - menores[0])) * (imageData.data[i] - menores[0])
    }
    if (imageData.data[i + 1] > 255) {
      imageData.data[i + 1] = (255 / (maiores[1] - menores[1])) * (imageData.data[i + 1] - menores[1])
    }
    if (imageData.data[i + 2] > 255) {
      imageData.data[i + 2] = (255 / (maiores[2] - menores[2])) * (imageData.data[i + 2] - menores[2])
    }
    if (imageData.data[i + 3] > 255) {
      imageData.data[i + 3] = (255 / (maiores[3] - menores[3])) * (imageData.data[i + 3] - menores[3])
    }
  }

  return imageData
}

function getNormalises(imageData) {
  let maiores = [imageData[0], imageData[1], imageData[2], imageData[3]]
  let menores = [imageData[0], imageData[1], imageData[2], imageData[3]]

  for (let i = 4; i < imgData.data.length; i += 4) {
    if (imageData[i] > maiores[0]) { maiores[0] = imageData[i] }
    if (imageData[i + 1] > maiores[1]) { maiores[1] = imageData[i + 1] }
    if (imageData[i + 2] > maiores[2]) { maiores[2] = imageData[i + 2] }
    if (imageData[i + 3] > maiores[3]) { maiores[3] = imageData[i + 3] }
    if (imageData[i] < menores[0]) { menores[0] = imageData[i] }
    if (imageData[i + 1] < menores[1]) { menores[1] = imageData[i + 1] }
    if (imageData[i + 2] < menores[2]) { menores[2] = imageData[i + 2] }
    if (imageData[i + 3] < menores[3]) { menores[3] = imageData[i + 3] }
  }

  for (let i = 0; i < imgData.data.length; i += 4) {
    if (imageData[i] > 255) {
      imageData[i] = (255 / (maiores[0] - menores[0])) * (imageData[i] - menores[0])
    }
    if (imageData[i + 1] > 255) {
      imageData[i + 1] = (255 / (maiores[1] - menores[1])) * (imageData[i + 1] - menores[1])
    }
    if (imageData[i + 2] > 255) {
      imageData[i + 2] = (255 / (maiores[2] - menores[2])) * (imageData[i + 2] - menores[2])
    }
    if (imageData[i + 3] > 255) {
      imageData[i + 3] = (255 / (maiores[3] - menores[3])) * (imageData[i + 3] - menores[3])
    }
  }

  return imageData
}

function RGBtoYUV(r, g, b) {
  let y = (r * 0.299) + (g * 0.587) + (b * 0.114)
  let u = (r * -0.14713) + (g * -0.28886) + (b * 0.436)
  let v = (r * 0.615) + (g * -0.51499) + (b * -0.10001)
  return [y, u, v]
}

function HSLtoRGB(h, s, l) {
  if (h == 0) { h = 20 }
  if (s == 0) { s = 20 }
  if (l == 0) { l = 20 }
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function HSBtoRGB(h, s, b) {
  if (h == 0) { h = 20 }
  if (s == 0) { s = 20 }
  if (b == 0) { b = 20 }
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
}

