import { useState, useEffect } from 'react'
import api from '../services/api'

export function useMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMatches = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/matches')
      setMatches(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener partidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const createMatch = async (newMatch) => {
    try {
      await api.post('/matches', newMatch)
      await fetchMatches()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear partido')
    }
  }

  const deleteMatch = async (matchId) => {
    try {
      await api.delete(`/matches/${matchId}`)
      await fetchMatches()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar partido')
    }
  }

  const joinMatch = async (matchId) => {
    try {
      await api.put(`/matches/join/${matchId}`)
      await fetchMatches()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al unirse al partido')
    }
  }

  const leaveMatch = async (matchId) => {
    try {
      await api.put(`/matches/leave/${matchId}`)
      await fetchMatches()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al salir del partido')
    }
  }

  return {
    matches,
    loading,
    error,
    createMatch,
    deleteMatch,
    joinMatch,
    leaveMatch,
    refetch: fetchMatches
  }
}
