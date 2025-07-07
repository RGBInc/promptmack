"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  data: Record<string, any>[] | Record<string, any>;
  title?: string;
  maxRows?: number;
}

// Helper function to detect if data should be displayed as a table
export const shouldDisplayAsTable = (data: any): boolean => {
  if (!data) return false;
  
  // Convert single object to array for analysis
  const items = Array.isArray(data) ? data : [data];
  
  // Must have at least one item
  if (items.length === 0) return false;
  
  // Check if all items are objects (not primitives)
  if (!items.every(item => typeof item === 'object' && item !== null)) return false;
  
  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  items.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });
  
  // Must have reasonable number of columns (2-10 is good for tables)
  if (allKeys.size < 2 || allKeys.size > 10) return false;
  
  // Check if most values are primitive types (good for tables)
  const primitiveRatio = items.reduce((acc, item) => {
    const primitiveCount = Object.values(item).filter(value => 
      typeof value === 'string' || 
      typeof value === 'number' || 
      typeof value === 'boolean' ||
      value === null ||
      value === undefined
    ).length;
    return acc + (primitiveCount / Object.keys(item).length);
  }, 0) / items.length;
  
  // If more than 70% of values are primitive, it's good for table display
  return primitiveRatio > 0.7;
};

// Helper function to format cell values
const formatCellValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-zinc-400 italic">—</span>;
  }
  
  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Yes' : 'No'}
      </Badge>
    );
  }
  
  if (typeof value === 'number') {
    return <span className="font-mono">{value.toLocaleString()}</span>;
  }
  
  if (typeof value === 'string') {
    // Handle URLs
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline truncate max-w-[200px] inline-block"
        >
          {value.replace(/^https?:\/\//, '').replace(/^www\./, '')}
        </a>
      );
    }
    
    // Handle long text
    if (value.length > 100) {
      return (
        <span className="truncate max-w-[200px] inline-block" title={value}>
          {value}
        </span>
      );
    }
    
    return value;
  }
  
  // For complex objects, show a preview
  if (typeof value === 'object') {
    return (
      <span className="text-zinc-500 italic text-sm">
        {Array.isArray(value) ? `Array(${value.length})` : 'Object'}
      </span>
    );
  }
  
  return String(value);
};

// Helper function to format column headers
const formatColumnHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim();
};

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  title = "Data Table", 
  maxRows = 50 
}) => {
  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-zinc-500">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Convert single object to array
  const items = Array.isArray(data) ? data : [data];
  
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-zinc-500">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Get all unique columns from all items
  const columns = Array.from(
    new Set(
      items.flatMap(item => Object.keys(item))
    )
  ).sort();
  
  // Limit rows if needed
  const displayItems = items.slice(0, maxRows);
  const hasMoreRows = items.length > maxRows;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="outline">
            {items.length} {items.length === 1 ? 'row' : 'rows'}
            {hasMoreRows && ` (showing ${maxRows})`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-medium">
                    {formatColumnHeader(column)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayItems.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="max-w-[200px]">
                      {formatCellValue(item[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {hasMoreRows && (
          <p className="text-sm text-zinc-500 mt-2">
            Showing {maxRows} of {items.length} rows
          </p>
        )}
      </CardContent>
    </Card>
  );
};