import Image from "next/image"

export default function UserComponent({entries}) {
  // Sample progress data - in a real app this would come from your backend
  const progressValues = [
    0.1, 0.3, 0.2, 0.8, 0.5, 
    0.6, 0.4, 0.9, 0.2, 0.7,
    0.3, 0.9, 0.6, 0.4, 0.8, 
    0.1, 0.6, 0.3, 0.5, 0.8, 
    0.9, 0.2, 0.6, 0.2
  ]

  // Function to map values to colors
  const getColor = (value) => {
    const purple = [157, 60, 114] // RGB for #9D3C72
    const green = [72, 187, 120] // RGB for #48BB78

    const r = Math.round(purple[0] + (green[0] - purple[0]) * value)
    const g = Math.round(purple[1] + (green[1] - purple[1]) * value)
    const b = Math.round(purple[2] + (green[2] - purple[2]) * value)

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="min-h-screen bg-[#E7F1D3] p-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <h1 className="text-[#1F2937] text-3xl font-serif mb-8">Juniper</h1>
        
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            {/* <Image
              src="/Helen_Euc.png"
              alt="Profile picture"
              fill
              className="object-cover"
            /> */}
          </div>
          <h2 className="text-[#1F2937] text-2xl font-medium">
            Helen&apos;s<br />progress
          </h2>
        </div>
        {/* Progress Grid */}
        <div className="grid grid-cols-12 gap-1">
          {progressValues.map((value, index) => (
            <div
              key={index}
              className="aspect-square rounded-sm"
              style={{ backgroundColor: getColor(value) }}
              aria-label={`Progress square ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}