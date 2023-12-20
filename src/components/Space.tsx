import { Box } from '@mui/material'

interface SpaceProps {
  size: number
}

export function Space({ size }: SpaceProps) {
  return <Box data-cy='size' style={{ height: `${size}px` }} />
}
