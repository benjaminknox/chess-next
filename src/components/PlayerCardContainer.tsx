import axios from "axios";
import { Align } from "../types";
import { PlayerCard } from "./PlayerCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface PlayerCardContainerProps {
  userId: string;
  align: Align;
}

export function PlayerCardContainer({
  userId,
  align,
}: PlayerCardContainerProps) {
  const { data: session, status } = useSession();
  const [name, setName] = useState<string>("");
  const [me, setMe] = useState<boolean>(false);

  useEffect(() => {
    if(session) {
    axios(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(response => {
        setMe((session.user as {id: string}).id === userId);
        setName(response.data.username);
      });
    }
  }, [
    session,
    userId,
  ]);

  return <PlayerCard me={me} name={name} align={align} />;
}
