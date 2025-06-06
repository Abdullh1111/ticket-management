import LoadingSpinner from '@/components/Loading'
import React from 'react'

export default function loading() {
  return (
    <div className='flex justify-center items-center h-screen'>

      <LoadingSpinner size={80} />
    </div>
  )
}
