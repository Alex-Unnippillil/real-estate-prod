"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetTenantInvoicesQuery, usePayInvoiceMutation } from "@/state/api";
import React from "react";

const InvoicesPage = () => {
  const { data: invoices, isLoading } = useGetTenantInvoicesQuery();
  const [payInvoice] = usePayInvoiceMutation();

  const handlePay = async (id: number) => {
    try {
      const res = await payInvoice(id).unwrap();
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="dashboard-container">
      <Header title="Invoices" subtitle="View and pay your rent invoices" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>${invoice.amountDue.toFixed(2)}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>
                {invoice.status !== "Paid" && (
                  <Button onClick={() => handlePay(invoice.id)}>Pay</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(!invoices || invoices.length === 0) && <p>No invoices available.</p>}
    </div>
  );
};

export default InvoicesPage;
