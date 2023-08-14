export function xor(image1, image2, imgData1, imgData2) {
    let width = image1.width
    let height = image1.height

    let start1 = 0
    let end1 = start1 + (image1.width * 4 * image1.height)
    let start2 = 0
    let end2 = start2 + (image2.width * 4 * image2.height)

    //Altura maior 
    if ((image2.height > image1.height) && (image1.width == image2.width)) {
        height = image2.height
        let difference = image2.height - image1.height
        start1 = (width * 4 * difference) - 1
        end1 = start1 + (width * 4 * image1.height)
    }

    if ((image1.height > image2.height) && (image1.width == image2.width)) {
        height = image1.height
        let difference = image1.height - image2.height
        start2 = (width * 4 * difference) - 1
        end2 = start1 + (width * 4 * image2.height)
    }

    //Largura maior
    if ((image2.width > image1.width) && (image1.height == image2.height)) {
        width = image2.width
        let difference = image2.width - image1.width
        start1 = parseInt(difference / 2) * 4
        end2 = 0
        if (difference % 2 == 0) {
            end1 = start1
        } else {
            end1 = start1 + 1
        }
    }

    if ((image1.width > image2.width) && (image1.height == image2.height)) {
        width = image1.width
        let difference = image1.width - image2.width
        start2 = parseInt(difference / 2) * 4
        end1 = 0
        if (difference % 2 == 0) {
            end2 = start2
        } else {
            end2 = start2 + 1
        }
    }

    //Altura e largura maiores
    if ((image1.width > image2.width) && (image1.height > image2.height)) {
        width = image1.width
        height = image1.height
        let difference1 = image1.width - image2.width
        let difference2 = image1.height - image2.height
        start2 = (parseInt(difference1) / 2 * 4) + (width * 4 * parseInt(difference2 / 2)) - 1

        if (difference2 % 2 == 0) {
            end2 = (parseInt(difference1 / 2) * 4)
        } else {
            end2 = (parseInt(difference1 / 2) * 4) + 1
        }

        end1 = 0
    }

    if ((image2.width > image1.width) && (image2.height > image1.height)) {
        width = image2.width
        height = image2.height
        let difference1 = image2.width - image1.width
        let difference2 = image2.height - image1.height
        start1 = (parseInt(difference1) / 2 * 4) + (width * 4 * parseInt(difference2 / 2)) - 1

        if (difference2 % 2 == 0) {
            end1 = (parseInt(difference1 / 2) * 4)
        } else {
            end1 = (parseInt(difference1 / 2) * 4) + 1
        }

        end2 = 0
    }

    //Operações com base no tamanho das imagens

    let newImgData = new ImageData(width, height)

    //Altura de uma das imagens maior
    if (((image2.height > image1.height) || (image1.height > image2.height)) && (image1.width == image2.width)) {
        for (let i = 0; i < newImgData.data.length; i += 4) {
            newImgData.data[i] = 0
            newImgData.data[i + 1] = 0
            newImgData.data[i + 2] = 0
            newImgData.data[i + 3] = 255

            if ((i >= start1) && (i <= end1)) {
                newImgData.data[i] = imgData1.data[i]
                newImgData.data[i + 1] = imgData1.data[i + 1]
                newImgData.data[i + 2] = imgData1.data[i + 2]
                newImgData.data[i + 3] = imgData1.data[i + 3]
            }

            if ((i >= start2) && (i <= end2)) {
                if (newImgData.data[i] == 0) {
                    newImgData.data[i] = (newImgData.data[i] ^ imgData2.data[i])
                    newImgData.data[i + 1] = (newImgData.data[i + 1] ^ imgData2.data[i + 1])
                    newImgData.data[i + 2] = (newImgData.data[i + 2] ^ imgData2.data[i + 2])
                    newImgData.data[i + 3] = (newImgData.data[i + 3] ^ imgData2.data[i + 3])
                } else {
                    newImgData.data[i] = imgData2.data[i]
                    newImgData.data[i + 1] = imgData2.data[i + 1]
                    newImgData.data[i + 2] = imgData2.data[i + 2]
                    newImgData.data[i + 3] = imgData2.data[i + 3]
                }
            }
            newImgData.data[i + 3] = 255
        }
    }

    //Largura de uma das imagens maior
    if (((image2.width > image1.width) || (image1.width > image2.width)) && (image1.height == image2.height)) {
        let lines1 = 1
        let lines2 = 1
        let initStart1 = start1
        let initStart2 = start2
        let inserteds1 = 0
        let inserteds2 = 0
        for (let i = 0; i < newImgData.data.length; i += 4) {
            newImgData.data[i] = 0
            newImgData.data[i + 1] = 0
            newImgData.data[i + 2] = 0
            newImgData.data[i + 3] = 255

            if (i >= start1) {
                newImgData.data[i] = imgData1.data[inserteds1]
                newImgData.data[i + 1] = imgData1.data[inserteds1 + 1]
                newImgData.data[i + 2] = imgData1.data[inserteds1 + 2]
                newImgData.data[i + 3] = imgData1.data[inserteds1 + 3]
                inserteds1 += 4;
                if (inserteds1 / (image1.width * 4) == lines1) {
                    lines1++
                    start1 = initStart1 + (i + 4) + end1
                }
            }

            if (i >= start2) {
                if (newImgData.data[i] == 0) {
                    newImgData.data[i] = (newImgData.data[i] ^ imgData2.data[inserteds2])
                    newImgData.data[i + 1] = (newImgData.data[i + 1] ^ imgData2.data[inserteds2 + 1])
                    newImgData.data[i + 2] = (newImgData.data[i + 2] ^ imgData2.data[inserteds2 + 2])
                    newImgData.data[i + 3] = (newImgData.data[i + 3] ^ imgData2.data[inserteds2 + 3])
                } else {
                    newImgData.data[i] = imgData2.data[inserteds2]
                    newImgData.data[i + 1] = imgData2.data[inserteds2 + 1]
                    newImgData.data[i + 2] = imgData2.data[inserteds2 + 2]
                    newImgData.data[i + 3] = imgData2.data[inserteds2 + 3]
                }
                inserteds2 += 4
                if (inserteds2 / (image2.width * 4) == lines2) {
                    lines2++
                    start2 = initStart2 + (i + 4) + end2
                }
            }

            newImgData.data[i + 3] = 255
        }
    }

    //Largura e Altura de uma das imagens maior
    if (((image1.height > image2.height) && (image1.width > image2.width)) || ((image2.height > image1.height) && (image2.width > image1.width))) {
        let lines1 = 1
        let lines2 = 1
        let inserteds1 = 0
        let inserteds2 = 0
        for (let i = 0; i < newImgData.data.length; i += 4) {
            newImgData.data[i] = 0
            newImgData.data[i + 1] = 0
            newImgData.data[i + 2] = 0
            newImgData.data[i + 3] = 255

            if (i >= start1) {
                if (inserteds1 < imgData1.data.length) {
                    newImgData.data[i] = imgData1.data[inserteds1]
                    newImgData.data[i + 1] = imgData1.data[inserteds1 + 1]
                    newImgData.data[i + 2] = imgData1.data[inserteds1 + 2]
                    newImgData.data[i + 3] = imgData1.data[inserteds1 + 3]
                    inserteds1 += 4;
                    if ((inserteds1 / (image1.width * 4) == lines1) && (lines1 <= image1.height)) {
                        lines1++
                        start1 = (i + 4) + end1 * 2
                    }
                }
            }

            if (i >= start2) {
                if (inserteds2 < imgData2.data.length) {
                    if (newImgData.data[i] == 0) {
                        newImgData.data[i] = (newImgData.data[i] ^ imgData2.data[inserteds2])
                        newImgData.data[i + 1] = (newImgData.data[i + 1] ^ imgData2.data[inserteds2 + 1])
                        newImgData.data[i + 2] = (newImgData.data[i + 2] ^ imgData2.data[inserteds2 + 2])
                        newImgData.data[i + 3] = (newImgData.data[i + 3] ^ imgData2.data[inserteds2 + 3])
                    } else {
                        newImgData.data[i] = imgData2.data[inserteds2]
                        newImgData.data[i + 1] = imgData2.data[inserteds2 + 1]
                        newImgData.data[i + 2] = imgData2.data[inserteds2 + 2]
                        newImgData.data[i + 3] = imgData2.data[inserteds2 + 3]
                    }
                    inserteds2 += 4
                    if ((inserteds2 / (image2.width * 4) == lines2) && (lines2 <= image2.height)) {
                        lines2++
                        start2 = (i + 4) + end2 * 2
                    }
                }
            }

            newImgData.data[i + 3] = 255
        }
    }

    //Largura e Altura de tamanho igual
    if ((image1.height == image2.height) && (image1.width == image2.width)) {
        for (let i = 0; i < newImgData.data.length; i += 4) {
            newImgData.data[i] = (imgData1.data[i] ^ imgData2.data[i])
            newImgData.data[i + 1] = (imgData1.data[i + 1] ^ imgData2.data[i + 1])
            newImgData.data[i + 2] = (imgData1.data[i + 2] ^ imgData2.data[i + 2])
            newImgData.data[i + 3] = 255
        }
    }

    return newImgData
}

export function xorWidth(image1, image2) {
    if (image1.width > image2.width) { return image1.width } else { return image2.width }
}

export function xorHeight(image1, image2) {
    if (image1.height > image2.height) { return image1.height } else { return image2.height }
}
