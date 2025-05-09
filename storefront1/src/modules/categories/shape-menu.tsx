"use client"

import Image from "next/image"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { DiamondShape } from "./diamondPricingTable"

interface ShapeMenuProps {
  shapes: DiamondShape[]
  selectedShape: DiamondShape
  onShapeSelect: (shape: DiamondShape) => void
}

export default function ShapeMenu({
  shapes,
  selectedShape,
  onShapeSelect,
}: ShapeMenuProps) {
  return (
    <Menu as="div" className="flex justify-center">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <div className="flex items-center gap-2">
            <Image
              src={selectedShape.imageSrc}
              alt={selectedShape.imageAlt}
              width={20}
              height={20}
              className="object-contain"
            />
            {selectedShape.name}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </MenuButton>
      </div>

      <MenuItems className="mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {shapes.map((shape) => (
            <MenuItem
              key={shape.name}
              as="button"
              className={({ active }) =>
                `flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  active ? "bg-gray-100" : ""
                }`
              }
              onClick={() => onShapeSelect(shape)}
            >
              <Image
                src={shape.imageSrc}
                alt={shape.imageAlt}
                width={20}
                height={20}
                className="object-contain"
              />
              {shape.name}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}
