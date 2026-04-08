'use client'

import { FormEvent, useEffect, useState } from "react"

import { createItem, getInventory, deleteItem } from "@/services/inventoryManagement"

type Mode = "admin" | "cashier"

type InventoryItem = {
  id: string
  name: string
  description: string | null
  unitCost: number | string
  salePrice: number | string
  units: number
}

type CartItem = {
  id: string
  name: string
  salePrice: number
  quantity: number
}

type ItemFormState = {
  name: string
  description: string
  unit_costs: string
  sale_price: string
  units: string
}

const emptyForm: ItemFormState = {
  name: "",
  description: "",
  unit_costs: "",
  sale_price: "",
  units: "1",
}

function asCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function asNumber(value: number | string) {
  return Number(value)
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("admin")
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [form, setForm] = useState<ItemFormState>(emptyForm)
  const [isLoadingInventory, setIsLoadingInventory] = useState(true)
  const [isSavingItem, setIsSavingItem] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadInventory() {
    setIsLoadingInventory(true)

    try {
      const response = await getInventory()
      setInventory(response.data ?? [])
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load inventory")
    } finally {
      setIsLoadingInventory(false)
    }
  }

  useEffect(() => {
    void loadInventory()
  }, [])

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSavingItem(true)
    setNotice(null)
    setError(null)

    try {
      const response = await createItem({
        name: form.name,
        description: form.description,
        unit_costs: Number(form.unit_costs),
        sale_price: Number(form.sale_price),
        units: Number(form.units),
      })

      setNotice(response.message ?? "Inventory updated")
      setForm(emptyForm)
      await loadInventory()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save item")
    } finally {
      setIsSavingItem(false)
    }
  }

  function handleScan(item: InventoryItem) {
    const availableUnits = item.units - (cart.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0)

    if (availableUnits <= 0) {
      setError(`No more ${item.name} units are available to scan.`)
      return
    }

    setError(null)
    setNotice(`${item.name} added to cart`)
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      return [
        ...currentCart,
        {
          id: item.id,
          name: item.name,
          salePrice: asNumber(item.salePrice),
          quantity: 1,
        },
      ]
    })
  }

  async function handlePaid() {
    if (cart.length === 0) {
      return
    }

    setIsSavingItem(true)
    setError(null)
    setNotice(null)

    try {
      await Promise.all(
        cart.map((item) =>
          deleteItem({
            id: item.id,
            units: item.quantity,
          })
        )
      )

      setCart([])
      setNotice("Payment recorded. Inventory updated.")
      await loadInventory()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to delete item")
    } finally {
      setIsSavingItem(false)
    }
  }

  function handleCancel() {
    if (cart.length === 0) {
      return
    }

    setCart([])
    setNotice("Sale canceled. Cart cleared.")
    setError(null)
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.salePrice * item.quantity, 0)

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-neutral-900 md:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Register App</h1>
              <p className="text-sm text-neutral-600">Switch between admin and cashier mode.</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("admin")}
                className={`rounded border px-4 py-2 text-sm ${
                  mode === "admin"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setMode("cashier")}
                className={`rounded border px-4 py-2 text-sm ${
                  mode === "cashier"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700"
                }`}
              >
                Cashier
              </button>
            </div>
          </div>

          {notice && <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p>}
          {error && <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </header>

        {mode === "admin" ? (
          <section className="grid gap-6 md:grid-cols-2">
            <form onSubmit={handleAddItem} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
              <div>
                <h2 className="text-xl font-semibold">Add Item</h2>
                <p className="text-sm text-neutral-600">Submitting an existing name adds more units to that item.</p>
              </div>

              <label className="block space-y-1 text-sm">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  required
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows={3}
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block space-y-1 text-sm">
                  <span>Unit Cost</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.unit_costs}
                    onChange={(event) => setForm((current) => ({ ...current, unit_costs: event.target.value }))}
                    className="w-full rounded border border-neutral-300 px-3 py-2"
                    required
                  />
                </label>

                <label className="block space-y-1 text-sm">
                  <span>Sale Price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.sale_price}
                    onChange={(event) => setForm((current) => ({ ...current, sale_price: event.target.value }))}
                    className="w-full rounded border border-neutral-300 px-3 py-2"
                    required
                  />
                </label>

                <label className="block space-y-1 text-sm">
                  <span>Units</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.units}
                    onChange={(event) => setForm((current) => ({ ...current, units: event.target.value }))}
                    className="w-full rounded border border-neutral-300 px-3 py-2"
                    required
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSavingItem}
                  className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {isSavingItem ? "Saving..." : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="rounded border border-neutral-300 px-4 py-2 text-sm"
                >
                  Clear
                </button>
              </div>
            </form>

            <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Inventory</h2>
                <button
                  type="button"
                  onClick={() => void loadInventory()}
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                >
                  Refresh
                </button>
              </div>

              {isLoadingInventory ? (
                <p className="text-sm text-neutral-500">Loading inventory...</p>
              ) : inventory.length === 0 ? (
                <p className="text-sm text-neutral-500">No inventory items yet.</p>
              ) : (
                <div className="space-y-2">
                  {inventory.map((item) => (
                    <div key={item.id} className="rounded border border-neutral-200 p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-neutral-500">{item.description || "No description"}</p>
                        </div>
                        <p className="text-sm text-neutral-600">{item.units} in stock</p>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm text-neutral-600">
                        <span>Cost: {asCurrency(asNumber(item.unitCost))}</span>
                        <span>Price: {asCurrency(asNumber(item.salePrice))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Items</h2>
                <button
                  type="button"
                  onClick={() => void loadInventory()}
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                >
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Available</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingInventory ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-neutral-500">Loading inventory...</td>
                      </tr>
                    ) : inventory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-neutral-500">No inventory items available.</td>
                      </tr>
                    ) : (
                      inventory.map((item) => {
                        const quantityInCart = cart.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0
                        const availableUnits = item.units - quantityInCart

                        return (
                          <tr key={item.id} className="border-b border-neutral-200">
                            <td className="px-3 py-2">
                              <div>{item.name}</div>
                              <div className="text-xs text-neutral-500">{item.description || "No description"}</div>
                            </td>
                            <td className="px-3 py-2">{asCurrency(asNumber(item.salePrice))}</td>
                            <td className="px-3 py-2">{availableUnits}</td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => handleScan(item)}
                                disabled={availableUnits <= 0}
                                className="rounded bg-neutral-900 px-3 py-1.5 text-white disabled:bg-neutral-300"
                              >
                                Scan
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Cart</h2>
                <span className="text-sm text-neutral-600">{cartItemCount} items</span>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-neutral-500">No items scanned yet.</p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded border border-neutral-200 bg-white px-3 py-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-neutral-500">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{asCurrency(item.salePrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                <p className="font-medium">Total</p>
                <p className="font-semibold">{asCurrency(cartTotal)}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handlePaid}
                  disabled={cart.length === 0 || isSavingItem}
                  className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:bg-neutral-300"
                >
                  {isSavingItem ? "Processing..." : "Paid"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cart.length === 0 || isSavingItem}
                  className="rounded border border-neutral-300 px-4 py-2 text-sm disabled:text-neutral-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
