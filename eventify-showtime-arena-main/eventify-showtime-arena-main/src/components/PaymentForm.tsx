
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { PaymentMethod } from "./PaymentMethod";

interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onPayment: () => void;
  isProcessing: boolean;
  finalAmount: number;
}

export const PaymentForm = ({ 
  paymentMethod, 
  setPaymentMethod, 
  onPayment, 
  isProcessing, 
  finalAmount 
}: PaymentFormProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-md border-gray-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center text-xl">
          <CreditCard className="mr-2 h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentMethod 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        <div className="flex items-center justify-center text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
          <Lock className="h-4 w-4 mr-2" />
          Your payment information is secure and encrypted
        </div>

        <Button
          onClick={onPayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 text-lg shadow-lg"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Processing Payment...
            </div>
          ) : (
            `Pay ₹${finalAmount}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
