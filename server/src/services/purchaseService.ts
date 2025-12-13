import Purchase, { IPurchase } from '../models/Purchase';
import Sweet from '../models/Sweet';
import User from '../models/User';

/**
 * Purchase Service
 * Handles business logic for purchase operations
 */

export class PurchaseService {
  /**
   * Create a new purchase and reduce sweet stock
   * @param userId - ID of user making purchase
   * @param sweetId - ID of sweet being purchased
   * @param quantity - Number of items to purchase
   * @param deliveryNote - Optional delivery instructions
   */
  async createPurchase(
    userId: string,
    sweetId: string,
    quantity: number,
    deliveryNote?: string,
    contactName?: string,
    contactEmail?: string
  ): Promise<IPurchase> {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate sweet exists
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    // Validate stock availability
    if (sweet.quantity < quantity) {
      throw new Error(`Insufficient stock. Available: ${sweet.quantity}, Requested: ${quantity}`);
    }

    // Calculate total price
    const totalPrice = sweet.price * quantity;

    // Reduce sweet stock
    sweet.quantity -= quantity;
    await sweet.save();

    // Create purchase record
    const purchase = await Purchase.create({
      userId,
      sweetId,
      sweetName: sweet.name,
      quantity,
      totalPrice,
      deliveryNote: deliveryNote || '',
      contactName: contactName || user.name || '',
      contactEmail: contactEmail || user.email,
      purchasedAt: new Date(),
    });

    return purchase;
  }

  /**
   * Get all purchases (for admin) with user and sweet details
   */
  async getPurchaseHistory(): Promise<IPurchase[]> {
    const purchases = await Purchase.find()
      .populate('userId', 'email name')
      .populate('sweetId', 'name category price')
      .sort({ purchasedAt: -1 })
      .lean();

    return purchases as IPurchase[];
  }

  /**
   * Get purchases for a specific user
   * @param userId - ID of user to fetch purchases for
   */
  async getUserPurchases(userId: string): Promise<IPurchase[]> {
    const purchases = await Purchase.find({ userId })
      .populate('sweetId', 'name category price')
      .sort({ purchasedAt: -1 })
      .lean();

    return purchases as IPurchase[];
  }

  /**
   * Get purchases for a specific sweet
   * @param sweetId - ID of sweet to fetch purchases for
   */
  async getSweetPurchases(sweetId: string): Promise<IPurchase[]> {
    const purchases = await Purchase.find({ sweetId })
      .populate('userId', 'email name')
      .sort({ purchasedAt: -1 })
      .lean();

    return purchases as IPurchase[];
  }

  /**
   * Get purchase statistics
   */
  async getPurchaseStats(): Promise<{
    totalPurchases: number;
    totalRevenue: number;
    topSweets: Array<{ sweetId: string; sweetName: string; count: number }>;
  }> {
    const purchases = await Purchase.find().lean();

    const totalPurchases = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.totalPrice, 0);

    // Group by sweet to find top sellers
    const sweetMap = new Map<string, { sweetName: string; count: number }>();
    purchases.forEach((p) => {
      if (!sweetMap.has(p.sweetId.toString())) {
        sweetMap.set(p.sweetId.toString(), { sweetName: p.sweetName, count: 0 });
      }
      const entry = sweetMap.get(p.sweetId.toString())!;
      entry.count += p.quantity;
    });

    const topSweets = Array.from(sweetMap.entries())
      .map(([sweetId, data]) => ({
        sweetId,
        sweetName: data.sweetName,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPurchases,
      totalRevenue,
      topSweets,
    };
  }
}

export default new PurchaseService();
