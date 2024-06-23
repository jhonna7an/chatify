/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
"use client"

import { useState, memo, useEffect } from "react";

import { TbJson } from "react-icons/tb";
import { RiText } from "react-icons/ri";
import { PiFileHtmlDuotone } from "react-icons/pi";
import { IoCodeSlashOutline } from "react-icons/io5";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import json from '../assets/formats.json'

const formats = [
  {
    value: "text",
    label: "Text",
    icon: RiText,
  },
  {
    value: "json",
    label: "Json",
    icon: TbJson,
  },
  // {
  //   value: "html",
  //   label: "HTML",
  //   icon: PiFileHtmlDuotone,
  // }
]

export const CodeSelector = memo(({ setFormatType, messageSended }) => {
  // const [ formats, setFormats ] = useState(JSON.parse(json))
  const [ open, setOpen ] = useState(false)
  const [ selectedStatus, setSelectedStatus ] = useState(null);

  useEffect(() => {
    if (messageSended) {
      setSelectedStatus(formats.find((format) => format.value === 'text') || null);
    }
  }, [messageSended]);

  const onFormatTypeSelected = (value) => {
    setSelectedStatus(formats.find((priority) => priority.value === value) || null);
    setFormatType(value);
    setOpen(false);
  }

  return (
    <div className="flex items-center space-x-4">
      <Popover open={ open } onOpenChange={ setOpen }>
        <PopoverTrigger asChild>
          <Button variant="ghost"
            className="w-[40px] h-[40px] rounded-full text-center text-xl px-2">
            { selectedStatus ? (
              <selectedStatus.icon/>
            ) : (
              <IoCodeSlashOutline/>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="top" align="start">
          <Command>
            <CommandInput placeholder="Seleccione un formato" />
            <CommandList>
              <CommandEmpty>No se encontraron resultados</CommandEmpty>
              <CommandGroup>
                { formats.map((format) => (
                  <CommandItem
                    key={format.value}
                    value={format.value}
                    onSelect={ onFormatTypeSelected }>
                    <format.icon
                      className={ cn("mr-2 h-4 w-4",
                        format.value === selectedStatus?.value
                          ? "opacity-100"
                          : "opacity-40"
                      ) }
                    />
                    <span>{format.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
});

