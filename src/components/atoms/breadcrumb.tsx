import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BreadCrumb({
  prev,
  current,
}: {
  prev: {
    label: string;
    href: string;
  };
  current: string;
}) {
  return (
    <Breadcrumb className="m-4 ml-0">
      <BreadcrumbList>
        {/* <BreadcrumbItem>
          <BreadcrumbLink
            href={prev.href}
            className="text-xl font-semibold text-foreground hover:underline h-fit"
          >
            {prev.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator /> */}

        <BreadcrumbItem>
          <BreadcrumbPage className="text-4xl font-semibold">
            {current}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
