import { Link, useLocation } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

// Regex patterns moved to top level for performance
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NUMERIC_ID_REGEX = /^\d+$/;
const RANDOM_ID_REGEX = /^[A-Za-z0-9\-_]{16,}$/;
const HAS_UPPERCASE_REGEX = /[A-Z]/;
const HAS_LOWERCASE_REGEX = /[a-z]/;
const HAS_NUMBER_REGEX = /[0-9]/;

export function RouteBreadcrumb() {
  const location = useLocation();
  const isMobile = useIsMobile();

  // UUID regex pattern
  const isUUID = (str: string) => {
    return UUID_REGEX.test(str);
  };

  // Check if segment looks like a numeric ID
  const isNumericId = (str: string) => {
    return NUMERIC_ID_REGEX.test(str);
  };

  // Check if segment looks like a random ID string
  const isRandomId = (str: string) => {
    return (
      RANDOM_ID_REGEX.test(str) &&
      HAS_UPPERCASE_REGEX.test(str) &&
      HAS_LOWERCASE_REGEX.test(str) &&
      HAS_NUMBER_REGEX.test(str)
    );
  };

  // Format UUID segments
  const formatUUID = (segment: string) => {
    const shortId = segment.split('-')[0].toUpperCase();
    return `ID ${shortId}`;
  };

  // Format numeric ID segments
  const formatNumericId = (segment: string) => {
    return `#${segment}`;
  };

  // Format random ID segments
  const formatRandomId = (segment: string) => {
    const shortId = segment.substring(0, 8).toUpperCase(); // Take first 8 characters
    return `ID ${shortId}`;
  };

  // Format regular text segments
  const formatTextSegment = (segment: string) => {
    return segment
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Main format segment function
  const formatSegment = (segment: string) => {
    if (isUUID(segment)) {
      return formatUUID(segment);
    }

    if (isNumericId(segment)) {
      return formatNumericId(segment);
    }

    if (isRandomId(segment)) {
      return formatRandomId(segment);
    }

    return formatTextSegment(segment);
  };

  // Build breadcrumb items from the current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const allBreadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = formatSegment(segment);

    return { path, label };
  });

  // Determine which items to show based on total count (including Home)
  const totalItems = allBreadcrumbItems.length + 1; // +1 for Home
  const showDropdown = isMobile && totalItems >= 3; // Show dropdown only on mobile when >=3 parts (including home)

  let visibleItems = allBreadcrumbItems;
  let dropdownItems: typeof allBreadcrumbItems = [];

  if (showDropdown && allBreadcrumbItems.length > 1) {
    // On mobile: show only the ends (home + last item) with dropdown for middle items
    // Home is always visible, so we show only the last breadcrumb item
    visibleItems = allBreadcrumbItems.slice(-1); // Only last item
    dropdownItems = allBreadcrumbItems.slice(0, -1); // All items except the last
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {allBreadcrumbItems.length > 0 && <BreadcrumbSeparator />}

        {/* Show all items normally if no dropdown needed */}
        {!showDropdown &&
          visibleItems.map((item, index) => (
            <BreadcrumbItem key={item.path}>
              {index === visibleItems.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}

        {/* Show dropdown layout when needed (mobile only) */}
        {showDropdown && (
          <>
            {/* Dropdown menu for all items except the last */}
            {dropdownItems.length > 0 && (
              <>
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="size-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {dropdownItems.map((item) => (
                        <DropdownMenuItem asChild key={item.path}>
                          <Link to={item.path}>{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}

            {/* Last item */}
            {visibleItems.length > 0 && (
              <BreadcrumbItem>
                <BreadcrumbPage>{visibleItems[0].label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
