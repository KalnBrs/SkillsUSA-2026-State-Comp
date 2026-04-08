type CreateItemPayload = {
  name: string
  description: string
  unit_costs: number
  sale_price: number
  units: number
}

type DeleteItemPayload = {
  id?: string
  name?: string
  units?: number
}

async function createItem(data: CreateItemPayload) {
  const response = await fetch("/api/inventory", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(data), 
  });

  if (!response.ok) throw new Error("There was an error while trying to create a item");

  const retData = await response.json();
  return retData
}

async function deleteItem(data: DeleteItemPayload) {
  const response = await fetch("/api/inventory", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) throw new Error("There was an error while trying to delete an item")

  return await response.json()
}

async function getInventory() {
  const inventory = await fetch("/api/inventory");
  if (!inventory.ok) throw new Error("There was an error while trying to get the inventory");

  return await inventory.json()
}

export { createItem, deleteItem, getInventory };