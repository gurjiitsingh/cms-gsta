'use client'
import React, { Suspense } from 'react'
import { ServiceForm } from '../../components/services/ServicesForm'


export default function CustomersPage() {
  return (
    <div className="p-6">
      <Suspense>
      <ServiceForm />
      </Suspense>
    </div>
  )
}