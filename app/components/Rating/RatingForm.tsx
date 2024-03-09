import { useState } from "react";

type Props = {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
};

export const RatingForm: React.FC<Props> = ({ rating, setRating }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <div
          key={value}
          onClick={() => setRating(value)}
          onMouseEnter={() => setHoveredRating(value)}
          onMouseLeave={() => setHoveredRating(0)}
          className="relative cursor-pointer"
        >
          <input
            type="radio"
            name="rating"
            value={value}
            checked={value === rating}
            onChange={() => setRating(value)}
            className="hidden"
          />
          <span
            className={`text-3xl ${
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
