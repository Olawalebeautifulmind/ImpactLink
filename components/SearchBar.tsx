'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchFilters {
  cause?: string
  location?: string
  type?: string
}

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (filters: SearchFilters) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (filters.cause) {
      params.set('cause', filters.cause)
    } else {
      params.delete('cause')
    }

    if (filters.location) {
      params.set('location', filters.location)
    } else {
      params.delete('location')
    }

    if (filters.type) {
      params.set('type', filters.type)
    } else {
      params.delete('type')
    }

    router.push(`/projects?${params.toString()}`)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="cause" className="block text-sm font-medium text-gray-700">
            Cause
          </label>
          <select
            id="cause"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            onChange={(e) => handleSearch({ cause: e.target.value })}
            value={searchParams.get('cause') || ''}
          >
            <option value="">All Causes</option>
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="health">Health</option>
            <option value="poverty">Poverty</option>
            <option value="animals">Animals</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Enter location"
            onChange={(e) => handleSearch({ location: e.target.value })}
            value={searchParams.get('location') || ''}
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            onChange={(e) => handleSearch({ type: e.target.value })}
            value={searchParams.get('type') || ''}
          >
            <option value="">All Types</option>
            <option value="volunteer">Volunteer</option>
            <option value="donation">Donation</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>
    </div>
  )
} 