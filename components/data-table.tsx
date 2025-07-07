"use client";

import React from "react";

import { DataTable } from "@/components/custom/data-table";

interface DataTableToolResult {
  data: any;
  title?: string;
  maxRows?: number;
  timestamp?: string;
}

interface DataTableProps {
  result: DataTableToolResult;
}

export const DataTableComponent: React.FC<DataTableProps> = ({ result }) => {
  const { data, title, maxRows } = result;
  
  return (
    <div className="w-full">
      <DataTable 
        data={data}
        title={title}
        maxRows={maxRows}
      />
    </div>
  );
};

export default DataTableComponent;