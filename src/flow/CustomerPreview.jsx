import { CustomerProvider } from '../customer/CustomerContext';
import CustomerApp from '../customer/CustomerApp';

export default function CustomerPreview({ onLogout }) {
  return (
    <CustomerProvider>
      <CustomerApp onExitToLanding={onLogout} />
    </CustomerProvider>
  );
}
