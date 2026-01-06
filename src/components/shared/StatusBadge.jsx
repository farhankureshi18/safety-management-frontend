export function StatusBadge({ status }) {
  const baseClasses = "inline-block px-2 py-0.5 rounded text-xs font-medium";

  const normalizedStatus = status
    ?.toLowerCase()
    .replace(/\s+/g, "-"); // 👈 KEY FIX

  switch (normalizedStatus) {
    case "pending":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-500`}>Pending</span>;

     case "low":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-500`}>Low</span>;

       case "medium":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Medium</span>;

    case "open":
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Open</span>;

     case "high":
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>High</span>;

    case "in-progress":
      return <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>In Progress</span>;

    case "rejected":
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;

      case "critical":
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Critical</span>;

      case "overdue":
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Delayed</span>;

    case "completed":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;

    case "approved":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;

    case "close":
      return <span className={`${baseClasses} bg-gray-200 text-gray-800`}>Closed</span>;

    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
  }
}

