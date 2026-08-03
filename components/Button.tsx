import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "membership";
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200";

  const variants = {
    primary: `${baseStyles} text-white bg-navy-500 hover:bg-navy-400 shadow-[0_2px_8px_rgba(6,15,28,0.4)] hover:shadow-[0_4px_12px_rgba(6,15,28,0.5)] hover:scale-[1.02]`,
    membership: `${baseStyles} text-white bg-navy-700 border border-navy-400 hover:bg-navy-600`,
  };

  return (
    <Link href={href} className={`${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
