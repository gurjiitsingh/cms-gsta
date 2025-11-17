import React, { Suspense } from 'react'
import { EditServiceForm } from '../../components/services/EditServices'

export default function page() {
  return (
    <Suspense>
    <EditServiceForm />
    </Suspense>
  )
}
