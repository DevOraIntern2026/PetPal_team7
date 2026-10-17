"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { adminApi } from "../../lib/adminApi";
import { getErrorMessage } from "../../lib/api";
import { money } from "../../lib/format";
import { useAdminList, useDebounced } from "../../hooks/useAdminList";
import DataTable from "./DataTable";
import { ConfirmModal, Field, Modal, ModalActions, inputCls } from "./Modal";

const PAGE_SIZE = 20;

const num = (msg) =>
  z
    .string()
    .refine(
      (v) => v.trim() !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0,
      msg,
    );

const schema = z.object({
  name: z.string().trim().min(2, "Enter a product name"),
  category: z.string().trim().min(1, "Enter a category"),
  material: z.string().trim(),
  color: z.string().trim(),
  price: num("Enter a valid price"),
  stockQuantity: num("Enter a valid stock number").refine(
    (v) => Number.isInteger(Number(v)),
    "Stock must be a whole number",
  ),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https?:\/\//.test(v),
      "Use a full link starting with https://",
    ),
  description: z.string().trim(),
});

function ProductForm({ product, onSaved, onCancel }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      category: product?.category ?? "",
      material: product?.material ?? "",
      color: product?.color ?? "",
      price: product ? String(product.price) : "",
      stockQuantity: product ? String(product.stockQuantity) : "",
      imageUrl: product?.imageUrl ?? "",
      description: product?.description ?? "",
    },
  });

  async function onSubmit(v) {
    setServerError("");
    const body = {
      name: v.name,
      category: v.category,
      material: v.material,
      color: v.color,
      price: Number(v.price),
      description: v.description,
      imageUrl: v.imageUrl || null,
      stockQuantity: Number(v.stockQuantity),
    };
    try {
      if (product) await adminApi.products.update(product.id, body);
      else await adminApi.products.create(body);
      onSaved();
    } catch (err) {
      setServerError(
        getErrorMessage(err, "Could not save the product. Please try again."),
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          error={errors.name?.message}
          className="sm:col-span-2">
          <input className={inputCls} {...register("name")} />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <input className={inputCls} {...register("category")} />
        </Field>
        <Field label="Material" error={errors.material?.message}>
          <input className={inputCls} {...register("material")} />
        </Field>
        <Field label="Color" error={errors.color?.message}>
          <input className={inputCls} {...register("color")} />
        </Field>
        <Field label="Price (EGP)" error={errors.price?.message}>
          <input
            inputMode="decimal"
            className={inputCls}
            {...register("price")}
          />
        </Field>
        <Field label="Stock" error={errors.stockQuantity?.message}>
          <input
            inputMode="numeric"
            className={inputCls}
            {...register("stockQuantity")}
          />
        </Field>
        <Field
          label="Image link"
          error={errors.imageUrl?.message}
          hint="Optional. Paste a link to the product image.">
          <input className={inputCls} {...register("imageUrl")} />
        </Field>
        <Field
          label="Description"
          error={errors.description?.message}
          className="sm:col-span-2">
          <textarea
            rows={3}
            className={inputCls}
            {...register("description")}
          />
        </Field>
      </div>
      {serverError && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {serverError}
        </p>
      )}
      <ModalActions
        onCancel={onCancel}
        busy={isSubmitting}
        submitLabel={product ? "Save changes" : "Add product"}
      />
    </form>
  );
}

export default function ProductsSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [deleting, setDeleting] = useState(null);
  const [delState, setDelState] = useState({ busy: false, error: "" });

  const debounced = useDebounced(search);
  const { items, totalCount, status, reload } = useAdminList(
    adminApi.products.list,
    { search: debounced, page, pageSize: PAGE_SIZE },
  );

  async function confirmDelete() {
    setDelState({ busy: true, error: "" });
    try {
      await adminApi.products.remove(deleting.id);
      setDeleting(null);
      setDelState({ busy: false, error: "" });
      reload();
    } catch (err) {
      setDelState({
        busy: false,
        error: getErrorMessage(err, "Could not delete the product."),
      });
    }
  }

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3">
          {p.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.imageUrl}
              alt=""
              className="size-10 rounded-xl object-cover"
            />
          ) : (
            <span className="grid size-10 place-items-center rounded-xl bg-primary-tint text-primary-strong">
              <Package size={18} aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{p.name}</p>
            <p className="truncate text-xs text-ink-muted">
              {[p.category, p.material, p.color].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (p) => money.format(p.price) },
    {
      key: "stock",
      header: "Stock",
      render: (p) => (
        <span
          className={
            p.stockQuantity <= 5 ? "font-semibold text-accent-strong" : ""
          }>
          {p.stockQuantity}
          {p.stockQuantity <= 5 && " (low)"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            p.isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-ink-muted"
          }`}>
          {p.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (p) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Edit ${p.name}`}
            onClick={() => setEditing(p)}
            className="focus-ring grid size-9 place-items-center rounded-full text-primary-strong hover:bg-primary-tint">
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${p.name}`}
            onClick={() => {
              setDelState({ busy: false, error: "" });
              setDeleting(p);
            }}
            className="focus-ring grid size-9 place-items-center rounded-full text-danger hover:bg-rose-50">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products"
            aria-label="Search products"
            className={`${inputCls} pl-10`}
          />
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="btn-primary w-auto! gap-2">
          <Plus size={16} aria-hidden="true" /> Add product
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        status={status}
        onRetry={reload}
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPage={setPage}
        emptyText="No products found."
      />

      <Modal
        open={Boolean(editing)}
        title={editing && editing !== "new" ? "Edit product" : "Add product"}
        onClose={() => setEditing(null)}>
        <ProductForm
          product={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete product"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
        busy={delState.busy}
        error={delState.error}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
