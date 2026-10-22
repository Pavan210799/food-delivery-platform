import { useState } from 'react'

export default function Photo({ src, alt, className = '', priority = false }) {
  const [failedSrc, setFailedSrc] = useState('')
  const failed = failedSrc === src

  if (failed) {
    return <div className={`bg-sand ${className}`} role="img" aria-label={alt} />
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  )
}
