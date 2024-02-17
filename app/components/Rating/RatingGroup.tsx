import { useState } from "react";

export const RatingGroup: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <div
          key={value}
          onClick={() => handleStarClick(value)}
          onMouseEnter={() => handleStarHover(value)}
          onMouseLeave={handleStarLeave}
          className="relative cursor-pointer"
        >
          <input
            type="radio"
            name="rating"
            value={value}
            checked={value === rating}
            onChange={() => handleStarClick(value)}
            className="hidden"
          />
          <span
            className={`text-3xl  ${
              value <= (hoveredRating || rating)
                ? "text-yellow-500"
                : "text-gray-500"
            }`}
          >
            &#9733;
          </span>
        </div>
      ))}
    </div>
  );
};
