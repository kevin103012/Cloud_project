import { Lottie } from 'lottie-react'
import cubesAnimation from '../animations/CargaCubo/animations/12345.json'

interface LoaderProps {
  size?: number
}

export default function Loader({ size = 128 }: LoaderProps) {
  return (
    <Lottie
      src={cubesAnimation}
      loop
      autoplay
      style={{ width: size, height: size }}
    />
  )
}
