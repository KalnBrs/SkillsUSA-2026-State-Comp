import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

function getInventoryName(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function getInventoryUnits(value: unknown) {
  return value === undefined ? 1 : Number(value)
}

export async function GET() {
  const inventory = await prisma.inventory.findMany()

  return NextResponse.json({ data: inventory })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = getInventoryName(body.name)
    const description =
      typeof body.description === "string" && body.description.trim().length > 0
        ? body.description.trim()
        : null
    const unitCost = Number(body.unit_costs)
    const salePrice = Number(body.sale_price)
    const units = getInventoryUnits(body.units)

    if (
      name.length < 4 ||
      name.length > 255 ||
      !Number.isFinite(unitCost) ||
      !Number.isFinite(salePrice) ||
      unitCost < 0 ||
      salePrice < 0 ||
      !Number.isInteger(units) ||
      units < 1
    ) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 })
    }

    const existingItem = await prisma.inventory.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        }
      }
    })

    if (existingItem) {
      const item = await prisma.inventory.update({
        where: { id: existingItem.id },
        data: {
          description,
          unitCost,
          salePrice,
          units: {
            increment: units
          }
        }
      })

      return NextResponse.json(
        { message: 'Item updated successfully', data: item },
        { status: 200 }
      )
    }

    const item = await prisma.inventory.create({
      data: {
        name,
        description,
        unitCost,
        salePrice,
        units
      }
    })

    return NextResponse.json(
      { message: 'Item created successfully', data: item },
      { status: 201 }
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {message: 'An error occurred while saving inventory: ' + error.message},
        {status: 500}
      )
    } else {
      return NextResponse.json(
        {message: 'An unexpected error occurred' + error},
        {status: 500}
      )
    }
    
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()

    const id = typeof body.id === "string" ? body.id.trim() : ""
    const name = getInventoryName(body.name)
    const units = getInventoryUnits(body.units)

    if (!id && (name.length < 4 || name.length > 255)) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    }

    if (!Number.isInteger(units) || units < 1) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    }

    const existingItem = await prisma.inventory.findFirst({
      where: id
        ? { id }
        : {
            name: {
              equals: name,
              mode: "insensitive",
            },
          },
    })

    if (!existingItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    if (existingItem.units <= units) {
      const deletedItem = await prisma.inventory.delete({
        where: { id: existingItem.id },
      })

      return NextResponse.json(
        { message: "Item deleted successfully", data: deletedItem, deleted: true },
        { status: 200 }
      )
    }

    const updatedItem = await prisma.inventory.update({
      where: { id: existingItem.id },
      data: {
        units: {
          decrement: units,
        },
      },
    })

    return NextResponse.json(
      { message: "Item updated successfully", data: updatedItem, deleted: false },
      { status: 200 }
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred while deleting inventory: " + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" + error },
      { status: 500 }
    )
  }
}