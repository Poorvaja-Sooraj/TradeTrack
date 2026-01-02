import {supabase} from "../supabaseClient.js";

export const getExpiryWarnings = async (req, res) => {
  try {
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + 7);

    const { data, error } = await supabase
      .from("products")
      .select("id, name, expiry_date")
      .lte("expiry_date", warningDate.toISOString().split("T")[0])
      .gte("expiry_date", today.toISOString().split("T")[0]);

    if (error) throw error;

    const warnings = data.map(product => {
      const diff =
        Math.ceil(
          (new Date(product.expiry_date) - today) /
          (1000 * 60 * 60 * 24)
        );

      return `${product.name} : expires in ${diff} days`;
    });

    res.json({
      success: true,
      warnings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getLowStockWarnings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, stock_quantity")
      .lt("stock_quantity", 10);

    if (error) throw error;

    const warnings = data.map(product => {
      return `${product.name} : ${product.stock_quantity} left`;
    });

    res.json({
      success: true,
      warnings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
