import { type VariantProps } from "class-variance-authority"
import { type TooltipContentProps } from "@radix-ui/react-tooltip"
import { sidebarMenuButtonVariants } from "./variants"

export type SidebarContextType = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | TooltipContentProps
} & VariantProps<typeof sidebarMenuButtonVariants>