import Link from "next/link";

interface MembershipButtonProps {
  className?: string;
}

export default function MembershipButton({ className = "" }: MembershipButtonProps) {
  return (
    <Link
      href="/membership"
      className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-navy-700 border border-navy-400 rounded-lg hover:bg-navy-600 transition-colors duration-200 ${className}`}
    >
      Membership
    </Link>
  );
}
