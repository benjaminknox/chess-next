import axios from 'axios';
import { User } from '../types'
import { Space, SelectUser } from '.'
import { Grid, Fab } from '@mui/material'
import { useState, useEffect } from 'react'
import ForwardIcon from '@mui/icons-material/Forward'

const classes = {
  center: {
    textAlign: 'center',
  },
  selectUser: {
    minWidth: '446px',
  },
  fabForwardIcon: {
    opacity: 0.8,
  },
}

export interface SelectUserContainerProps {
  selectOpponent: (user: User) => void
}

export function SelectUserContainer({ selectOpponent }: SelectUserContainerProps) {
  const [selectedUser, setSelectedUser] = useState<Partial<User> | undefined>(undefined)

  const [userList, setUserList] = useState<Partial<User>[]>([])

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUserList(response.data)
      })
  },[])

  const updateUser = (user: Partial<User>) => setSelectedUser(user)

  const startGame = () => {
    if (selectedUser) {
      selectOpponent(selectedUser as User)
    }
  }

  return (
    <Grid display='flex' direction='column' alignItems='center'>
      <Grid item>
        <SelectUser userList={userList} updateUser={updateUser} />
      </Grid>
      <Space size={94} />
      <Grid item>
        <Fab
          color='primary'
          data-cy='user-list-submit'
          onClick={startGame}
          disabled={!selectedUser}
        >
          <ForwardIcon sx={classes.fabForwardIcon} />
        </Fab>
      </Grid>
    </Grid>
  )
}
