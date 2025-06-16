'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { db } from '@/lib/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  location: string
}

export function CustomerTable() {
  const [customers, setCustomers] = React.useState<Customer[]>([])

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'customers'))
        const data = snapshot.docs.map(doc => {
          const d = doc.data()
          return {
            id: doc.id,
            name: d.customerName || '',
            email: d.email || '',
            phone: d.phone || '',
            location: d.location || '',
          }
        })
        setCustomers(data)
      } catch (err) {
        console.error('Error fetching customers:', err)
      }
    }

    fetchCustomers()
  }, [])

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const customer = row.original
        const query = new URLSearchParams({
          customerId: customer.id,
          name: customer.name,
          email: customer.email,
        }).toString()

        return (
          <Link
            href={`/dashboard/services/new?${query}`}
            className="text-blue-600 hover:underline"
          >
            New Service
          </Link>
        )
      },
    },
  ]

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Customers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-50 text-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 border-b">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-gray-900">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
