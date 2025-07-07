import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";
import { ArrowLeft, Star, ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      navigate("/cart");
    } catch (err) {
      console.error("You must be logged in to add items to cart.");
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg p-8">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-contain"
          />
        </div>

        <div className="space-y-6">
          <div>
            <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium text-gray-900 ml-1">
                  {product.rating.rate}
                </span>
              </div>
              <span className="text-gray-600">
                ({product.rating.count} reviews)
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-6">
              ${product.price}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
