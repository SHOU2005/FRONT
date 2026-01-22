export default function CategoryChip({ category }) {
  const getCategoryClass = (cat) => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105";
    
    const categoryMap = {
      'Income': `${baseClasses} border-emerald-500 bg-emerald-500/20 text-emerald-300`,
      'Expense': `${baseClasses} border-rose-500 bg-rose-500/20 text-rose-300`,
      'UPI Transfer': `${baseClasses} border-blue-500 bg-blue-500/20 text-blue-300`,
      'Bank Transfer': `${baseClasses} border-cyan-500 bg-cyan-500/20 text-cyan-300`,
      'Cash Flow': `${baseClasses} border-purple-500 bg-purple-500/20 text-purple-300`,
      'EMI': `${baseClasses} border-orange-500 bg-orange-500/20 text-orange-300`,
      'Loan': `${baseClasses} border-amber-500 bg-amber-500/20 text-amber-300`,
      'Investment': `${baseClasses} border-indigo-500 bg-indigo-500/20 text-indigo-300`,
      'Refund': `${baseClasses} border-lime-500 bg-lime-500/20 text-lime-300`,
      'Reward/Cashback': `${baseClasses} border-yellow-500 bg-yellow-500/20 text-yellow-300`,
      'Bill Payment': `${baseClasses} border-red-500 bg-red-500/20 text-red-300`,
      'Subscription': `${baseClasses} border-pink-500 bg-pink-500/20 text-pink-300`,
      'Unknown': `${baseClasses} border-gray-500 bg-gray-500/20 text-gray-400`,
    };
    
    return categoryMap[cat] || categoryMap['Unknown'];
  };
  
  return (
    <span className={getCategoryClass(category)}>
      {category || 'Unknown'}
    </span>
  );
}

