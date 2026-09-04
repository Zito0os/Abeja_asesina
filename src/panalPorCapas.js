const layerOneAngles = [30, 90, 150, 210, 270, 330]

const polarPoint = (distance, angle) => {
  const radians = (angle * Math.PI) / 180

  return {
    x: Math.cos(radians) * distance,
    y: Math.sin(radians) * distance,
  }
}

export function panalPorCapas(sideWidth) {
  const apotema = (sideWidth * Math.sqrt(3)) / 4
  const distance = apotema * 2
  const layerOne = layerOneAngles.map((angle) => ({
    ...polarPoint(distance, angle),
    layer: 1,
    angle,
  }))
  const layerTwo = layerOneAngles.flatMap((angle, index) => {
    const nextAngle = layerOneAngles[(index + 1) % layerOneAngles.length]
    const midpointAngle = angle + (nextAngle > angle ? nextAngle - angle : nextAngle + 360 - angle) / 2

    return [
      { ...polarPoint(distance * 2, angle), layer: 2, angle },
      { ...polarPoint(distance * Math.sqrt(3), midpointAngle), layer: 2, angle: midpointAngle },
    ]
  })

  const layers = [
    { x: 0, y: 0, layer: 0, angle: 0 },
    ...layerOne,
    ...layerTwo,
  ]

  return layers.slice(0, 19)
}