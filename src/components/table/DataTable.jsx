import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFns,
  flexRender,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import * as React from "react";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  filterFns,
  sortFns,
});

function DataTable({ columns, data, className }) {
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [sorting, setSorting] = React.useState([])

  const table = useTable({
    features,
    data,
    columns,
      onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      columnFilters,
      columnVisibility,
      sorting
    },
  });

  return (
    <div className={cn("w-full min-w-0 max-w-4xl", className)}>
      <div className="flex flex-wrap items-center gap-3 py-4">
        <Input
          className="max-w-xs bg-background"
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          placeholder="Filter by name..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
        />
        <Input
          className="max-w-xs bg-background"
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          placeholder="Filter by email..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDownIcon className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  checked={column.getIsVisible()}
                  className="capitalize"
                  key={column.id}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-background shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="break-words px-2 sm:px-4 [&_button]:h-auto [&_button]:min-h-9 [&_button]:whitespace-normal [&_button]:break-words [&_button]:px-1 [&_button]:text-xs sm:[&_button]:text-sm"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="break-words px-2 sm:px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;
