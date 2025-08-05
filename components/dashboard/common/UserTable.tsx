import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit3, Trash2 } from "lucide-react"
import type { User } from "@/types"

interface UserTableProps {
  users: User[]
  loading: boolean
  t: any
  getRoleColor: (role: string) => string
  onEdit: (user: User) => void
  onDelete: (id: string, email: string) => void
}

export const UserTable: React.FC<UserTableProps> = ({ users, loading, t, getRoleColor, onEdit, onDelete }) => {
  if (loading) return <div className="p-6">Loading...</div>
  if (!users.length) return <div className="text-center py-12">{t.noUsersFound || "No users found"}</div>
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">{t.customerNumber}</TableHead>
            <TableHead className="min-w-[200px]">{t.email}</TableHead>
            <TableHead className="min-w-[100px]">{t.role}</TableHead>
            <TableHead className="min-w-[150px]">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} className={index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/20"}>
              <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-100">{user.customerNumber}</TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">{user.email}</TableCell>
              <TableCell>
                <Badge className={`${getRoleColor(user.role)} font-medium`}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                    <Edit3 className="mr-1 h-3 w-3" />{t.edit}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(user.id, user.email)} className="text-red-600 border-red-200">
                    <Trash2 className="mr-1 h-3 w-3" />{t.delete}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}