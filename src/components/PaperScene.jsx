import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  varying vec2 vUv;
  varying float vFold;

  float easeOutCubic(float value) {
    return 1.0 - pow(1.0 - value, 3.0);
  }

  void main() {
    vUv = uv;
    float open = easeOutCubic(uProgress);
    float fold = 1.0 - open;
    vec3 transformed = position;
    float radius = length(position.xy);
    float angle = atan(position.y, position.x);
    float crease = sin(angle * 7.0 + radius * 12.0) * 0.18;
    float ripple = sin(position.x * 14.0 + position.y * 10.0) * 0.06;

    transformed.xy *= mix(0.1, 1.0, open);
    transformed.xy += fold * vec2(
      cos(angle * 4.0 + radius * 8.0),
      sin(angle * 5.0 - radius * 7.0)
    ) * 0.07;
    transformed.z = fold * (0.58 + crease + ripple) * (1.0 - radius * 0.12);
    transformed.z += sin(uTime * 0.6 + radius * 9.0) * fold * 0.025;
    vFold = fold;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHasTexture;
  varying vec2 vUv;
  varying float vFold;

  float random(vec2 value) {
    return fract(sin(dot(value, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float grain = random(vUv * 180.0) * 0.045;
    float crease = smoothstep(0.47, 0.5, abs(sin(vUv.x * 25.0) * sin(vUv.y * 19.0))) * vFold * 0.08;
    float edge = smoothstep(0.0, 0.08, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
    vec3 paper = vec3(0.95, 0.9, 0.77) + grain - crease;
    paper *= mix(0.92, 1.0, edge);
    vec4 landing = texture2D(uTexture, vUv);
    vec3 color = mix(paper, landing.rgb, uHasTexture);
    color -= crease;
    gl_FragColor = vec4(color, mix(0.98, landing.a, uHasTexture));
  }
`

export function PaperScene({ progress, textureCanvas }) {
  const canvasRef = useRef(null)
  const progressRef = useRef(progress)
  const textureRef = useRef(textureCanvas)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    textureRef.current = textureCanvas
  }, [textureCanvas])

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const geometry = new THREE.PlaneGeometry(4.6, 3.2, 72, 72)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: progressRef.current },
        uTime: { value: 0 },
        uTexture: { value: textureRef.current ? new THREE.CanvasTexture(textureRef.current) : null },
        uHasTexture: { value: textureRef.current ? 1 : 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    })
    const paper = new THREE.Mesh(geometry, material)
    scene.add(paper)

    const resize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      const visibleWidth = visibleHeight * camera.aspect
      paper.scale.set(visibleWidth / 4.6, visibleHeight / 3.2, 1)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    const clock = new THREE.Clock()
    let animationFrame
    const render = () => {
      material.uniforms.uProgress.value = progressRef.current
      material.uniforms.uTime.value = clock.getElapsedTime()
      if (textureRef.current && !material.uniforms.uHasTexture.value) {
        const texture = new THREE.CanvasTexture(textureRef.current)
        texture.colorSpace = THREE.SRGBColorSpace
        material.uniforms.uTexture.value = texture
        material.uniforms.uHasTexture.value = 1
      }
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="paper-canvas"
      aria-hidden="true"
    />
  )
}
