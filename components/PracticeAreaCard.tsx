'use client';

interface PracticeAreaCardProps {
  name: string;
  description: string;
}

export default function PracticeAreaCard({ name, description }: PracticeAreaCardProps) {
  return (
    <div className="bg-navy-800 rounded-xl border border-white/10 p-6 transition-all duration-200 hover:border-navy-400 hover:-translate-y-1">
      <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
      <p className="text-white/90 text-sm leading-relaxed">{description}</p>
    </div>
  );
}