import Image from 'next/image';

interface BeKosherLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function BeKosherLogo({ width = 180, height = 69, className = '' }: BeKosherLogoProps) {
  return (
    <Image
      src="/images/logo.svg"
      alt="BeKosher Logo"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
} 