import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 h-full">
        <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {product.title}
          </h3>
          <div className="flex items-center space-x-1 mb-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {product.rating.rate} ({product.rating.count})
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">${product.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
