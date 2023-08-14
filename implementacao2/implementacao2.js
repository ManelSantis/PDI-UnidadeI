const fileinput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })
let srcImage = new Image
let imgData = null

let newPositionsX = []
let newPositionsY = []

let positionXOriginal = []
let positionYOriginal = []

const translationX = document.getElementById('translationX')
const translationY = document.getElementById('translationY')
let beforeX = 0
let beforeY = 0

let beforeAngle = 0

const rotate = document.getElementById('rotate')
const scal = document.getElementById('scal')

fileinput.onchange = function (e) {
  positionXOriginal = []
  positionYOriginal = []
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
          getPositions(0, 0, srcImage.width, srcImage.height)
        }
      }
      reader.readAsText(fileinput.files[0])

    } else {
      srcImage.onload = function () {
        canvas.width = 1120
        canvas.height = 515
        ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
        imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
        getPositions(0, 0, srcImage.width, srcImage.height)
      }
    }
  }
}

function getPositions(initX, initY, width, height) {
  let length = width * height
  let x = initX
  let y = initY
  let line = 0
  let column = 0
  for (let i = 0; i < length; i++) {
    if (i / width == (line + 1)) {
      x = 0
      line++
      y++
      column++
    }
    positionXOriginal.push(x)
    newPositionsX.push(x)
    x++
    positionYOriginal.push(y)
    newPositionsY.push(y)
  }
}

function translation(moveX, moveY) {
  for (let i = 0; i < positionXOriginal.length; i++) {
    positionXOriginal[i] = positionXOriginal[i] + moveX
    positionYOriginal[i] = positionYOriginal[i] + moveY
  }
}

function rotation(angle) {
  let centerX = Math.round(srcImage.width / 2)
  let centerY = Math.round(srcImage.height / 2 * srcImage.height)
  let cos = (Math.cos(angle * 3.14 / 180))
  let sin = (Math.sin(angle * 3.14 / 180))
  for (let i = 0; i < positionXOriginal.length; i++) {

    let x = parseInt(positionXOriginal[i] - positionXOriginal[centerX - 1])
    let y = parseInt(positionYOriginal[i] - positionYOriginal[centerY - 1])

    newPositionsX[i] = Math.round(x * cos - y * sin)
    newPositionsY[i] = Math.round(y * cos + x * sin)

    newPositionsX[i] = newPositionsX[i] + positionXOriginal[centerX - 1]
    newPositionsY[i] = newPositionsY[i] + positionYOriginal[centerY - 1]

  }
  console.log(centerX)
}

function scaling(value) {
  let newPositionsX = []
  let newPositionsY = []

  for (let i = 0; i < positionXOriginal.length; i++) {
    for (let j = 1; j <= value; j++) {
      newPositionsX.push(positionXOriginal[i] * j)
      newPositionsY.push(positionYOriginal[i] * j)
    }
  }

}

function drawPixel(x, y, r, g, b, a) {
  let color = "rgba(" + r + "," + g + "," + b + "," + a + ")"
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

translationX.oninput = function (e) {
  canvas.width = canvas.width
  canvas.height = canvas.height
  let newX = parseInt(e.target.value)
  if (newX < beforeX) { newX = (beforeX - newX) * -1 } else { newX = newX - beforeX }
  translation(newX, 0)

  let position = 0

  for (let i = 0; i < imgData.data.length; i += 4) {
    let r = imgData.data[i]
    let g = imgData.data[i + 1]
    let b = imgData.data[i + 2]
    let a = imgData.data[i + 3]
    drawPixel(positionXOriginal[position], positionYOriginal[position], r, g, b, a)
    position++
  }
  beforeX = parseInt(e.target.value)

  rotates(beforeAngle)
}

translationY.oninput = function (e) {
  canvas.width = canvas.width
  canvas.height = canvas.height
  let newY = parseInt(e.target.value)
  if (newY < beforeY) { newY = (beforeY - newY) * -1 } else { newY = newY - beforeY }
  translation(0, newY)

  let position = 0

  for (let i = 0; i < imgData.data.length; i += 4) {
    let r = imgData.data[i]
    let g = imgData.data[i + 1]
    let b = imgData.data[i + 2]
    let a = imgData.data[i + 3]
    drawPixel(positionXOriginal[position], positionYOriginal[position], r, g, b, a)
    position++
  }

  beforeY = e.target.value
  rotates(beforeAngle)
}

rotate.oninput = function (e) {
  let angle = parseInt(e.target.value)
  rotates(angle)
}

function rotates(angle) {
  canvas.width = canvas.width
  canvas.height = canvas.height
  rotation(angle)
  console.log(newPositionsX)
  console.log(newPositionsY)


  let position = 0

  for (let i = 0; i < imgData.data.length; i += 4) {
    let r = imgData.data[i]
    let g = imgData.data[i + 1]
    let b = imgData.data[i + 2]
    let a = imgData.data[i + 3]
    drawPixel(newPositionsX[position], newPositionsY[position], r, g, b, a)
    position++
  }
  beforeAngle = angle
}

function newImageData(image) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0, image.width, image.height)
  let data = ctx.getImageData(0, 0, image.width, image.height)
  return data
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