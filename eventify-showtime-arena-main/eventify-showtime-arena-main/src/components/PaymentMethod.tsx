
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone } from "lucide-react";

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export const PaymentMethod = ({ paymentMethod, setPaymentMethod }: PaymentMethodProps) => {
  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <Label className="text-gray-800 mb-3 block font-semibold text-base">Payment Method</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={paymentMethod === "card" ? "default" : "outline"}
            className={`h-12 ${
              paymentMethod === "card"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                : "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Credit/Debit Card
          </Button>
          <Button
            variant={paymentMethod === "upi" ? "default" : "outline"}
            className={`h-12 ${
              paymentMethod === "upi"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                : "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400"
            }`}
            onClick={() => setPaymentMethod("upi")}
          >
            <Smartphone className="mr-2 h-5 w-5" />
            UPI
          </Button>
        </div>
      </div>

      {/* Payment Form Fields */}
      {paymentMethod === "card" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber" className="text-gray-800 font-medium">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 h-12"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-gray-800 font-medium">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 h-12"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-gray-800 font-medium">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cardName" className="text-gray-800 font-medium">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 h-12"
            />
          </div>
        </div>
      )}

      {paymentMethod === "upi" && (
        <div>
          <Label htmlFor="upiId" className="text-gray-800 font-medium">UPI ID</Label>
          <Input
            id="upiId"
            placeholder="username@upi"
            className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 h-12"
          />
        </div>
      )}
    </div>
  );
};
