import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';

interface SuccessToastProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
}

export const SuccessToast = ({ isVisible, onClose, productName }: SuccessToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-green-800">
              Produto adicionado ao carrinho!
            </p>
            <p className="text-sm text-green-600 mt-1">
              {productName} foi adicionado com sucesso.
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-green-400 hover:text-green-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

