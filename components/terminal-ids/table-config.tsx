import { z } from "zod"

export const uploadFormSchema = z.object({
  file: z.any().refine((file) => file !== null && file !== undefined, {
    message: "File is required"
  })
})

export const uploadFormFields = [
  {
    name: "file" as const,
    label: "Upload File",
    type: "file" as const,
    required: true,
    accept: ".xlsx,.xls,.csv",
    maxSize: "5MB",
    dragDrop: true,
    placeholder: "Select a file to upload"
  }
]

export const columns = [
  { key: "terminal_id", label: "Terminal ID", copiable: true },
  { key: "merchant_id", label: "Merchant ID", copiable: true },
  { key: "merchant_name", label: "Merchant Name" },
  { key: "bank_code", label: "Bank Code" },
  { key: "bank_acc_no", label: "Account Number", copiable: true },
  { key: "created_at", label: "Created At", truncate: true }
]

export const filters = [
  { name: "terminal_id" },
  { name: "merchant_id" },
  { name: "bank_code" },
  { name: "dates" }
]
