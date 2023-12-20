import { useRouter } from "next/navigation";
import { SelectUserContainer } from '../../components'

export default function SelectOpponent() {
  const router = useRouter()

  return (
    <SelectUserContainer
      selectOpponent={user => {
        router.push(`/new-game/${user.id}/select-side`)
      }}
    />
  )
}
