import { useState, useEffect } from 'react'

export function useMatches() {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    const storedMatches = localStorage.getItem('matches')
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches))
    }
  }, [])

  const updateMatches = (newMatches) => {
    setMatches(newMatches)
    localStorage.setItem('matches', JSON.stringify(newMatches))
  }

  const createMatch = (newMatch) => {
    const updatedMatches = [...matches, newMatch]
    updateMatches(updatedMatches)
  }

  const deleteMatch = (matchId) => {
    const updatedMatches = matches.filter(match => match.id !== matchId)
    updateMatches(updatedMatches)
  }

  const joinMatch = (matchId, userId) => {
    const updatedMatches = matches.map(match => 
      match.id === matchId ? { ...match, idEquipoVisitante: userId } : match
    )
    updateMatches(updatedMatches)
  }

  const leaveMatch = (matchId) => {
    const updatedMatches = matches.map(match => 
      match.id === matchId ? { ...match, idEquipoVisitante: null } : match
    )
    updateMatches(updatedMatches)
  }

  return {
    matches,
    createMatch,
    deleteMatch,
    joinMatch,
    leaveMatch
  }
}