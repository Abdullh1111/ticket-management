'use client';
import LoadingSpinner from '@/components/Loading';
import TicketShow from '@/components/ticket/user.ticket'
import { useUserTicketsQuery } from '@/redux/services/ticket.service'
import { TTicket } from '@/types/Ticket.interface'
import React, {useEffect } from 'react'

export default function DashboardTicket() {
  const [Tickets, setTickets] = React.useState<TTicket[]>([])

  const {data, error, isLoading} = useUserTicketsQuery();

  useEffect(() => {
    if (data) {
      console.log(data)
      setTickets(data)
    }
    if(error) {
      alert('Failed to fetch tickets')
    }
    if(isLoading) {
    }
  }, [data, error, isLoading])
  return (
    isLoading ? 
      <div className='flex justify-center min-h-screen items-center'><LoadingSpinner /> Loading...</div>: 
    <div>
      <h1 className="text-2xl font-semibold mb-4">Tickets</h1>
      <div className="space-y-4 flex flex-wrap">
        {Tickets.map((ticket) => (
          <TicketShow key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  )
}
