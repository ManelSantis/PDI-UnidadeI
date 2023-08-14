import { add, addWidth, addHeight } from './addition.js'
import { sub, subWidth, subHeight } from './subtration.js'
import { multi, multiWidth, multiHeight } from './multiplication.js'
import { divis, divisWidth, divisHeight } from './division.js'
import { and, andWidth, andHeight } from './and.js'
import { or, orWidth, orHeight } from './or.js'
import { xor, xorWidth, xorHeight } from './xor.js'

const fileinput1 = document.getElementById('fileinput1')
const canvas1 = document.getElementById('canvas1')
const ctx1 = canvas1.getContext('2d', { willReadFrequently: true })
let srcImage1 = new Image
let imgData1 = null

const fileinput2 = document.getElementById('fileinput2')
const canvas2 = document.getElementById('canvas2')
const ctx2 = canvas2.getContext('2d', { willReadFrequently: true })
let srcImage2 = new Image
let imgData2 = null

const trunk = document.getElementById('trunk')

fileinput1.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage1.src = URL.createObjectURL(e.target.files[0])
    if (fileinput1.files[0].name.includes('.pgm')) {

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
        srcImage1 = imgDataToImg(newImgData, widthImgPGM1, heightImgPGM1)
        srcImage1.onload = function () {
          canvas1.width = srcImage1.width
          canvas1.height = srcImage1.height
          ctx1.drawImage(srcImage1, 0, 0, srcImage1.width, srcImage1.height)
          imgData1 = ctx1.getImageData(0, 0, srcImage1.width, srcImage1.height)
        }
      }
      reader.readAsText(fileinput1.files[0])

    } else {
      srcImage1.onload = function () {
        canvas1.width = srcImage1.width
        canvas1.height = srcImage1.height
        ctx1.drawImage(srcImage1, 0, 0, srcImage1.width, srcImage1.height)
        imgData1 = ctx1.getImageData(0, 0, srcImage1.width, srcImage1.height)
      }
    }
  }
}

fileinput2.onchange = function (e) {
  if (e.target.files && e.target.files.item(0)) {
    srcImage2.src = URL.createObjectURL(e.target.files[0])
    if (fileinput2.files[0].name.includes('.pgm')) {

      let widthImgPGM2 = 0
      let heightImgPGM2 = 0
      let reader = new FileReader()
      let values = []
      reader.onload = function (event) {
        let text = this.result
        let lines = text.split('\n')
        heightImgPGM2 += lines.length - 3
        for (let i = 3; i < lines.length; i++) {
          const aux = lines[i].split(' ')
          if (aux.length > 1) {
            widthImgPGM2 = aux.length
          }
          for (let j = 0; j < aux.length; j++) {
            values.push(aux[j])
          }
        }
        let data = getRGBfromInt(values)
        let newImgData = new ImageData(widthImgPGM2, heightImgPGM2)
        for (let i = 0; i < newImgData.data.length; i += 4) {
          newImgData.data[i] = data[i]
          newImgData.data[i + 1] = data[i + 1]
          newImgData.data[i + 2] = data[i + 2]
          newImgData.data[i + 3] = data[i + 3]
        }
        srcImage2 = imgDataToImg(newImgData, widthImgPGM2, heightImgPGM2)
        srcImage2.onload = function () {
          canvas2.width = srcImage2.width
          canvas2.height = srcImage2.height
          ctx2.drawImage(srcImage2, 0, 0, srcImage2.width, srcImage2.height)
          imgData2 = ctx2.getImageData(0, 0, srcImage2.width, srcImage2.height)
        }
      }
      reader.readAsText(fileinput2.files[0])
    } else {
      srcImage2.onload = function () {
        canvas2.width = srcImage2.width
        canvas2.height = srcImage2.height
        ctx2.drawImage(srcImage2, 0, 0, srcImage2.width, srcImage2.height)
        imgData2 = ctx2.getImageData(0, 0, srcImage2.width, srcImage2.height)
      }
    }
  }
}

const somar = document.getElementById('somar')
const soma = document.getElementById('soma')
const somando = soma.getContext('2d')
let somaImg = new Image

somar.onclick = function (e) {

  let newImgData = add(srcImage1, srcImage2, imgData1, imgData2)
  let width = addWidth(srcImage1, srcImage2)
  let height = addHeight(srcImage1, srcImage2)

  let imgData

  if (trunk.checked) {
    imgData = getTrunk(newImgData)
  } else {
    imgData = getNormalise(newImgData)
  }
  somaImg = imgDataToImg(imgData, width, height)
  soma.width = somaImg.width
  soma.height = somaImg.height
  somando.drawImage(somaImg, 0, 0, somaImg.width, somaImg.height)
}

const subtrair = document.getElementById('subtrair')
const subi = document.getElementById('sub')
const subtraindo = subi.getContext('2d')
let subImg = new Image

subtrair.onclick = function (e) {

  let newImgData = sub(srcImage1, srcImage2, imgData1, imgData2)
  let width = subWidth(srcImage1, srcImage2)
  let height = subHeight(srcImage1, srcImage2)
  let imgData

  if (trunk.checked) {
    imgData = getTrunk(newImgData)
  } else {
    imgData = getNormalise(newImgData)
  }

  subImg = imgDataToImg(imgData, width, height)
  subi.width = subImg.width
  subi.height = subImg.height
  subtraindo.drawImage(subImg, 0, 0, subImg.width, subImg.height)

}

const multiplicar = document.getElementById('multiplicar')
const mult = document.getElementById('mult')
const multiplicando = mult.getContext('2d')
let multImg = new Image

multiplicar.onclick = function (e) {

  let newImgData = multi(srcImage1, srcImage2, imgData1, imgData2)
  let width = multiWidth(srcImage1, srcImage2)
  let height = multiHeight(srcImage1, srcImage2)
  let imgData

  if (trunk.checked) {
    imgData = getTrunk(newImgData)
  } else {
    imgData = getNormalise(newImgData)
  }

  multImg = imgDataToImg(imgData, width, height)
  mult.width = multImg.width
  mult.height = multImg.height
  multiplicando.drawImage(multImg, 0, 0, multImg.width, multImg.height)

}

const dividir = document.getElementById('dividir')
const divi = document.getElementById('divi')
const dividindo = divi.getContext('2d')
let diviImg = new Image

dividir.onclick = function (e) {

  let newImgData = divis(srcImage1, srcImage2, imgData1, imgData2)
  let width = divisWidth(srcImage1, srcImage2)
  let height = divisHeight(srcImage1, srcImage2)
  let imgData

  if (trunk.checked) {
    imgData = getTrunk(newImgData)
  } else {
    imgData = getNormalise(newImgData)
  }

  diviImg = imgDataToImg(imgData, width, height)
  divi.width = diviImg.width
  divi.height = diviImg.height
  dividindo.drawImage(diviImg, 0, 0, diviImg.width, diviImg.height)
}

const andd = document.getElementById('andd')
const andn = document.getElementById('and')
const ands = andn.getContext('2d')
let andImg = new Image

andd.onclick = function (e) {

  let newImgData = and(srcImage1, srcImage2, imgData1, imgData2)
  let width = andWidth(srcImage1, srcImage2)
  let height = andHeight(srcImage1, srcImage2)
  let imgData

  if (trunk.checked) {
    imgData = getTrunk(newImgData)
  } else {
    imgData = getNormalise(newImgData)
  }
  andImg = imgDataToImg(imgData, width, height)
  andn.width = andImg.width
  andn.height = andImg.height
  ands.drawImage(andImg, 0, 0, andImg.width, andImg.height)

}

const orr = document.getElementById('orr')
const orn = document.getElementById('ors')
const ors = orn.getContext('2d')
let orImg = new Image

orr.onclick = function (e) {

  let newImgData = or(srcImage1, srcImage2, imgData1, imgData2)
  let width = orWidth(srcImage1, srcImage2)
  let height = orHeight(srcImage1, srcImage2)
  let imgData

  if (trunk.checked) {
    imgData = getTrunk(newImgData)
  } else {
    imgData = getNormalise(newImgData)
  }
  orImg = imgDataToImg(imgData, width, height)
  orn.width = orImg.width
  orn.height = orImg.height
  ors.drawImage(orImg, 0, 0, orImg.width, orImg.height)

}

const xorr = document.getElementById('xorr')
const xorn = document.getElementById('xor')
const xors = xorn.getContext('2d')
let xorImg = new Image

xorr.onclick = function (e) {

  let newImgData = xor(srcImage1, srcImage2, imgData1, imgData2)
  let width = xorWidth(srcImage1, srcImage2)
  let height = xorHeight(srcImage1, srcImage2)
  let imgData

  if (trunk.checked) {
    imgData = getTrunk(newImgData)
  } else {
    imgData = getNormalise(newImgData)
  }
  xorImg = imgDataToImg(imgData, width, height)
  xorn.width = xorImg.width
  xorn.height = xorImg.height
  xors.drawImage(xorImg, 0, 0, xorImg.width, xorImg.height)

}

function getNormalise(imageData) {
  let maiores = [imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]]
  let menores = [imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]]

  for (let i = 4; i < imgData1.data.length; i += 4) {
    if (imageData.data[i] > maiores[0]) { maiores[0] = imageData.data[i] }
    if (imageData.data[i + 1] > maiores[1]) { maiores[1] = imageData.data[i + 1] }
    if (imageData.data[i + 2] > maiores[2]) { maiores[2] = imageData.data[i + 2] }
    if (imageData.data[i + 3] > maiores[3]) { maiores[3] = imageData.data[i + 3] }
    if (imageData.data[i] < menores[0]) { menores[0] = imageData.data[i] }
    if (imageData.data[i + 1] < menores[1]) { menores[1] = imageData.data[i + 1] }
    if (imageData.data[i + 2] < menores[2]) { menores[2] = imageData.data[i + 2] }
    if (imageData.data[i + 3] < menores[3]) { menores[3] = imageData.data[i + 3] }
  }

  for (let i = 0; i < imgData1.data.length; i += 4) {
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

function getTrunk(imageData) {


  for (let i = 0; i < imgData1.data.length; i += 4) {
    if (imageData.data[i] > 255) { imageData.data[i] = 255 }
    if (imageData.data[i] < 0) { imageData.data[i] = 0 }

    if (imageData.data[i + 1] > 255) { imageData.data[i + 1] = 255 }
    if (imageData.data[i + 1] < 0) { imageData.data[i + 1] = 0 }

    if (imageData.data[i + 2] > 255) { imageData.data[i + 2] = 255 }
    if (imageData.data[i + 2] < 0) { imageData.data[i + 2] = 0 }

    imageData.data[i + 3] = 255
  }

  return imageData

}

function imgDataToImg(imagedata, width, height) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
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

