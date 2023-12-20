import { Align } from '../types'
import { stringToColor } from '../common'
import { Box, Avatar } from '@mui/material'

export interface PlayerCardProps {
  me?: boolean
  name: string
  avatarUrl?: string
  align?: Align
}

const classes = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  },
  avatar: {
    border: '2px solid rgba(34, 56, 67, 0.5)',
  },
  ['avatar-align-left']: {
    marginRight: '8px',
  },
  ['avatar-align-right']: {
    marginLeft: '8px',
  },
}

export function PlayerCard({ me = false, name, align }: PlayerCardProps) {
  align = align || 'left'

  return (
    <Box
      data-cy={`avatar-${align}`}
      sx={{ ...classes.wrapper }}
      flexDirection={align === 'left' ? 'row' : 'row-reverse'}
    >
      <Avatar
        sx={{
          ...classes.avatar,
          ...classes[`avatar-align-${align}`],
          bgcolor: stringToColor(name),
        }}
      >
        {name && name[0].toUpperCase()}
      </Avatar>
      <div>{me ? 'me' : name}</div>
    </Box>
  )
}
