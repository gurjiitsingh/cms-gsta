import React, { Suspense } from 'react'
import EditProjectForm from './components/EditProjectForm'

export default function page() {
  return (
    <Suspense>
      <EditProjectForm />
    </Suspense>
  )
}
