// import { cn } from "@/lib/utils";
// import { Bell } from "lucide-react";


// export function PageHeader({ title, subtitle, action, className,notifications=[] }) {
//   const unreadCount = notifications.filter((n) => !n.isRead).length;

  
//   return (
//     <div
//       className={cn(
//         "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
//         className
//       )}
//     >
//       <div>
//         <h1 className="page-header">{title}</h1>
//         {subtitle && <p className="page-subtitle mb-0">{subtitle}</p>}
//       </div>

//       <div className="flex items-center gap-4 relative">
//         <Bell className="w-5 h-5 text-muted-foreground" />

//        {unreadCount > 0 && (
//           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}

//       {action && <div className="flex-shrink-0">{action}</div>}
//       </div>
//     </div>
//   );
// }




import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
  className,
  notifications = [],
}) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8",
        className
      )}
    >
      {/* Left */}
      <div>
        <h1 className="page-header">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button
          type="button"
          className="relative flex items-center justify-center
                     w-9 h-9 sm:w-10 sm:h-10
                     rounded-full hover:bg-muted transition"
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />

          {/* Badge */}
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5",
                "min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px]",
                "px-1 rounded-full bg-red-500 text-white",
                "text-[10px] sm:text-xs font-medium",
                "flex items-center justify-center leading-none"
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Optional action */}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
