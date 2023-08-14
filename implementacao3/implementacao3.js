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

const red = document.getElementById('red')
const redCanvas = document.getElementById('r')
const reds = redCanvas.getContext('2d')
let redImg = new Image

red.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = imgData.data[i]
    newImgData.data[i + 1] = 0
    newImgData.data[i + 2] = 0
    newImgData.data[i + 3] = 255
  }

  redImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  redCanvas.width = redImg.width
  redCanvas.height = redImg.height
  reds.drawImage(redImg, 0, 0, redImg.width, redImg.height)
}

const green = document.getElementById('green')
const greenCanvas = document.getElementById('g')
const greens = greenCanvas.getContext('2d')
let greenImg = new Image

green.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = 0
    newImgData.data[i + 1] = imgData.data[i + 1]
    newImgData.data[i + 2] = 0
    newImgData.data[i + 3] = 255
  }

  greenImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  greenCanvas.width = greenImg.width
  greenCanvas.height = greenImg.height
  greens.drawImage(greenImg, 0, 0, greenImg.width, greenImg.height)
}

const blue = document.getElementById('blue')
const blueCanvas = document.getElementById('b')
const blues = blueCanvas.getContext('2d')
let blueImg = new Image

blue.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = 0
    newImgData.data[i + 1] = 0
    newImgData.data[i + 2] = imgData.data[i + 2]
    newImgData.data[i + 3] = 255
  }

  blueImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  blueCanvas.width = blueImg.width
  blueCanvas.height = blueImg.height
  blues.drawImage(blueImg, 0, 0, blueImg.width, blueImg.height)
}

const gray = document.getElementById('gray')
const grayCanvas = document.getElementById('gr')
const grays = grayCanvas.getContext('2d')
let grayImg = new Image

gray.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let grayScale = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3
    newImgData.data[i] = grayScale
    newImgData.data[i + 1] = grayScale
    newImgData.data[i + 2] = grayScale
    newImgData.data[i + 3] = 255
  }

  grayImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  grayCanvas.width = grayImg.width
  grayCanvas.height = grayImg.height
  grays.drawImage(grayImg, 0, 0, grayImg.width, grayImg.height)
}

const cian = document.getElementById('cian')
const cianCanvas = document.getElementById('c')
const cians = cianCanvas.getContext('2d')
let cianImg = new Image

cian.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    var c = 1 - (imgData.data[i] / 255)
    var m = 1 - (imgData.data[i + 1] / 255)
    var y = 1 - (imgData.data[i + 2] / 255)
    var k = Math.min(c, Math.min(m, y))

    c = (c - k) / (1 - k)
    c = Math.round(c * 10000) / 100
    k = Math.round(k * 10000) / 100

    newImgData.data[i] = c
    newImgData.data[i + 1] = 255
    newImgData.data[i + 2] = 255
    newImgData.data[i + 3] = k
  }

  cianImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  cianCanvas.width = cianImg.width
  cianCanvas.height = cianImg.height
  cians.drawImage(cianImg, 0, 0, cianImg.width, cianImg.height)
}

const margenta = document.getElementById('margenta')
const margentaCanvas = document.getElementById('m')
const margentas = margentaCanvas.getContext('2d')
let margentaImg = new Image

margenta.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    var c = 1 - (imgData.data[i] / 255);
    var m = 1 - (imgData.data[i + 1] / 255);
    var y = 1 - (imgData.data[i + 2] / 255);
    var k = Math.min(c, Math.min(m, y));

    m = (m - k) / (1 - k);
    m = Math.round(m * 10000) / 100;
    k = Math.round(k * 10000) / 100

    newImgData.data[i] = 255
    newImgData.data[i + 1] = m
    newImgData.data[i + 2] = 255
    newImgData.data[i + 3] = k
  }

  margentaImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  margentaCanvas.width = margentaImg.width
  margentaCanvas.height = margentaImg.height
  margentas.drawImage(margentaImg, 0, 0, margentaImg.width, margentaImg.height)
}

const yellow = document.getElementById('yellow')
const yellowCanvas = document.getElementById('y')
const yellows = yellowCanvas.getContext('2d')
let yellowImg = new Image

yellow.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    var c = 1 - (imgData.data[i] / 255);
    var m = 1 - (imgData.data[i + 1] / 255);
    var y = 1 - (imgData.data[i + 2] / 255);
    var k = Math.min(c, Math.min(m, y));

    y = (y - k) / (1 - k);
    y = Math.round(y * 10000) / 100;
    k = Math.round(k * 10000) / 100

    newImgData.data[i] = 255
    newImgData.data[i + 1] = 255
    newImgData.data[i + 2] = y
    newImgData.data[i + 3] = k
  }

  yellowImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  yellowCanvas.width = yellowImg.width
  yellowCanvas.height = yellowImg.height
  yellows.drawImage(yellowImg, 0, 0, yellowImg.width, yellowImg.height)
}

const key = document.getElementById('key')
const keyCanvas = document.getElementById('k')
const keys = keyCanvas.getContext('2d')
let keyImg = new Image

key.onclick = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    var c = 1 - (imgData.data[i] / 255);
    var m = 1 - (imgData.data[i + 1] / 255);
    var y = 1 - (imgData.data[i + 2] / 255);
    var k = Math.min(c, Math.min(m, y));

    k = Math.round(k * 10000) / 100

    newImgData.data[i] = 0
    newImgData.data[i + 1] = 0
    newImgData.data[i + 2] = 0
    newImgData.data[i + 3] = k
  }

  keyImg = imgDataToImg(newImgData, srcImage.width, srcImage.height)
  keyCanvas.width = keyImg.width
  keyCanvas.height = keyImg.height
  keys.drawImage(keyImg, 0, 0, keyImg.width, keyImg.height)
}

const yuv = document.getElementById('yuv')

const yuvCanvas = document.getElementById('yuvcanvas')
const yuvs = yuvCanvas.getContext('2d')
let yuvImg = new Image

const yvCanvas = document.getElementById('yvcanvas')
const yvs = yvCanvas.getContext('2d')
let yvImg = new Image

const yuCanvas = document.getElementById('yucanvas')
const yus = yuCanvas.getContext('2d')
let yuImg = new Image

const uvCanvas = document.getElementById('uvcanvas')
const uvs = uvCanvas.getContext('2d')
let uvImg = new Image

yuv.onclick = function (e) {

  let yuvnewImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let yuvInRgb = RGBtoYUV(imgData.data[i],imgData.data[i+1],imgData.data[i+2])
    yuvnewImgData.data[i] = imgData.data[i] + yuvInRgb[0]
    yuvnewImgData.data[i + 1] = imgData.data[i + 1] + yuvInRgb[1]
    yuvnewImgData.data[i + 2] = imgData.data[i + 2] + yuvInRgb[2]
    yuvnewImgData.data[i + 3] = imgData.data[i + 3]
  }

  //const imgDataNew = getNormalise(newImgData)
  yuvImg = imgDataToImg(yuvnewImgData, srcImage.width, srcImage.height)
  yuvCanvas.width = yuvImg.width
  yuvCanvas.height = yuvImg.height
  yuvs.drawImage(yuvImg, 0, 0, yuvImg.width, yuvImg.height)

  let uvnewImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let yuvInRgb = RGBtoYUV(imgData.data[i],imgData.data[i+1],imgData.data[i+2])
    uvnewImgData.data[i] = 0
    uvnewImgData.data[i + 1] = imgData.data[i + 1] + yuvInRgb[1]
    uvnewImgData.data[i + 2] = imgData.data[i + 2] + yuvInRgb[2]
    uvnewImgData.data[i + 3] = imgData.data[i + 3]
  }

  //const imgDataNew = getNormalise(newImgData)
  uvImg = imgDataToImg(uvnewImgData, srcImage.width, srcImage.height)
  uvCanvas.width = uvImg.width
  uvCanvas.height = uvImg.height
  uvs.drawImage(uvImg, 0, 0, uvImg.width, uvImg.height)
  
  let yunewImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let yuvInRgb = RGBtoYUV(imgData.data[i],imgData.data[i+1],imgData.data[i+2])
    yunewImgData.data[i] = imgData.data[i] + yuvInRgb[0]
    yunewImgData.data[i + 1] = imgData.data[i + 1] + yuvInRgb[1]
    yunewImgData.data[i + 2] = 0
    yunewImgData.data[i + 3] = imgData.data[i + 3]
  }

  //const imgDataNew = getNormalise(newImgData)
  yuImg = imgDataToImg(yunewImgData, srcImage.width, srcImage.height)
  yuCanvas.width = yuImg.width
  yuCanvas.height = yuImg.height
  yus.drawImage(yuImg, 0, 0, yuImg.width, yuImg.height)

  let yvnewImgData = new ImageData(srcImage.width, srcImage.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    let yuvInRgb = RGBtoYUV(imgData.data[i],imgData.data[i+1],imgData.data[i+2])
    yvnewImgData.data[i] = imgData.data[i] + yuvInRgb[0]
    yvnewImgData.data[i + 1] = 0
    yvnewImgData.data[i + 2] = imgData.data[i + 2] + yuvInRgb[2]
    yvnewImgData.data[i + 3] = imgData.data[i + 3]
  }

  //const imgDataNew = getNormalise(newImgData)
  yvImg = imgDataToImg(yvnewImgData, srcImage.width, srcImage.height)
  yvCanvas.width = yvImg.width
  yvCanvas.height = yvImg.height
  yvs.drawImage(yvImg, 0, 0, yvImg.width, yvImg.height)
}

const h = document.getElementById('h')
const s = document.getElementById('s')
const l = document.getElementById('l')
const hslCanvas = document.getElementById('hslcanvas')
const hsls = hslCanvas.getContext('2d')
let hslImg = new Image

h.oninput = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  const hslInRgb = HSLtoRGB(h.value, s.value, l.value)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = imgData.data[i] + hslInRgb[0]
    newImgData.data[i + 1] = imgData.data[i + 1] + hslInRgb[1]
    newImgData.data[i + 2] = imgData.data[i + 2] + hslInRgb[2]
    newImgData.data[i + 3] = imgData.data[i + 3]
  }

  const imgDataNew = getNormalise(newImgData)
  hslImg = imgDataToImg(imgDataNew, srcImage.width, srcImage.height)
  hslCanvas.width = hslImg.width
  hslCanvas.height = hslImg.height
  hsls.drawImage(hslImg, 0, 0, hslImg.width, hslImg.height)
}

s.oninput = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  const hslInRgb = HSLtoRGB(h.value, s.value, l.value)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = imgData.data[i] + hslInRgb[0]
    newImgData.data[i + 1] = imgData.data[i + 1] + hslInRgb[1]
    newImgData.data[i + 2] = imgData.data[i + 2] + hslInRgb[2]
    newImgData.data[i + 3] = imgData.data[i + 3]
  }

  const imgDataNew = getNormalise(newImgData)
  hslImg = imgDataToImg(imgDataNew, srcImage.width, srcImage.height)
  hslCanvas.width = hslImg.width
  hslCanvas.height = hslImg.height
  hsls.drawImage(hslImg, 0, 0, hslImg.width, hslImg.height)
}

l.oninput = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  const hslInRgb = HSLtoRGB(h.value, s.value, l.value)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = imgData.data[i] + hslInRgb[0]
    newImgData.data[i + 1] = imgData.data[i + 1] + hslInRgb[1]
    newImgData.data[i + 2] = imgData.data[i + 2] + hslInRgb[2]
    newImgData.data[i + 3] = imgData.data[i + 3]
  }

  const imgDataNew = getNormalise(newImgData)
  hslImg = imgDataToImg(imgDataNew, srcImage.width, srcImage.height)
  hslCanvas.width = hslImg.width
  hslCanvas.height = hslImg.height
  hsls.drawImage(hslImg, 0, 0, hslImg.width, hslImg.height)
}

const hb = document.getElementById('hb')
const sb = document.getElementById('sb')
const bb = document.getElementById('bb')
const hsbCanvas = document.getElementById('hsbcanvas')
const hsbs = hsbCanvas.getContext('2d')
let hsbImg = new Image

hb.oninput = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  const hsbInRgb = HSBtoRGB(hb.value, sb.value, bb.value)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = imgData.data[i] + hsbInRgb[0]
    newImgData.data[i + 1] = imgData.data[i + 1] + hsbInRgb[1]
    newImgData.data[i + 2] = imgData.data[i + 2] + hsbInRgb[2]
    newImgData.data[i + 3] = imgData.data[i + 3]
  }

  const imgDataNew = getNormalise(newImgData)
  hsbImg = imgDataToImg(imgDataNew, srcImage.width, srcImage.height)
  hsbCanvas.width = hsbImg.width
  hsbCanvas.height = hsbImg.height
  hsbs.drawImage(hsbImg, 0, 0, hsbImg.width, hsbImg.height)
}

sb.oninput = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  const hsbInRgb = HSBtoRGB(hb.value, sb.value, bb.value)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = imgData.data[i] + hsbInRgb[0]
    newImgData.data[i + 1] = imgData.data[i + 1] + hsbInRgb[1]
    newImgData.data[i + 2] = imgData.data[i + 2] + hsbInRgb[2]
    newImgData.data[i + 3] = imgData.data[i + 3]
  }

  const imgDataNew = getNormalise(newImgData)
  hsbImg = imgDataToImg(imgDataNew, srcImage.width, srcImage.height)
  hsbCanvas.width = hsbImg.width
  hsbCanvas.height = hsbImg.height
  hsbs.drawImage(hsbImg, 0, 0, hsbImg.width, hsbImg.height)
}

bb.oninput = function (e) {

  let newImgData = new ImageData(srcImage.width, srcImage.height)

  const hsbInRgb = HSBtoRGB(hb.value, sb.value, bb.value)

  for (let i = 0; i < imgData.data.length; i += 4) {
    newImgData.data[i] = imgData.data[i] + hsbInRgb[0]
    newImgData.data[i + 1] = imgData.data[i + 1] + hsbInRgb[1]
    newImgData.data[i + 2] = imgData.data[i + 2] + hsbInRgb[2]
    newImgData.data[i + 3] = imgData.data[i + 3]
  }

  const imgDataNew = getNormalise(newImgData)
  hsbImg = imgDataToImg(imgDataNew, srcImage.width, srcImage.height)
  hsbCanvas.width = hsbImg.width
  hsbCanvas.height = hsbImg.height
  hsbs.drawImage(hsbImg, 0, 0, hsbImg.width, hsbImg.height)
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

function RGBtoYUV(r, g, b) {
  let y = (r * 0.299) + (g * 0.587) + (b * 0.114)
  let u = (r * -0.14713) + (g * -0.28886) + (b * 0.436)
  let v = (r * 0.615) + (g * -0.51499) + (b * -0.10001)
  return [y, u, v]
}

function HSLtoRGB(h, s, l) {
  if (h == 0) { h = 20 }
  if (s == 0) { s = 20 }
  if (l == 0) { l = 20}
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

