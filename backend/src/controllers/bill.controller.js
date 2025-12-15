import { supabase } from "../supabaseClient.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { isPositiveNumber } from "../utils/validation.js";

/**
 * CREATE BILL
 */
export const createBill = async (req, res) => {
  try {
    const { items, payment_method } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, "Bill must contain at least one item");
    }

    if (!payment_method) {
      return errorResponse(res, 400, "Payment method is required");
    }

    let billTotal = 0;
    const validatedItems = [];

    // STEP 1 — VALIDATE ITEMS
    for (const item of items) {
      if (!item.product_id || !isPositiveNumber(item.quantity)) {
        return errorResponse(res, 400, "Invalid product or quantity");
      }

      const { data: product, error } = await supabase
        .from("products")
        .select("id, name, price, stock_quantity")
        .eq("id", item.product_id)
        .eq("is_active", true)
        .maybeSingle();

      if (error || !product) {
        return errorResponse(res, 404, "Product not found");
      }

      if (product.stock_quantity < item.quantity) {
        return errorResponse(
          res,
          400,
          `Insufficient stock for ${product.name}`
        );
      }

      billTotal += product.price * item.quantity;

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
        current_stock: product.stock_quantity
      });
    }

    // STEP 2 — CREATE BILL
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .insert([
        {
          total_amount: billTotal,
          payment_method
        }
      ])
      .select()
      .single();

    if (billError || !bill) {
      return errorResponse(res, 500, "Failed to create bill");
    }

    // STEP 3 — INSERT ITEMS + UPDATE STOCK
    for (const item of validatedItems) {
      await supabase.from("bill_items").insert([
        {
          bill_id: bill.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        }
      ]);

      await supabase
        .from("products")
        .update({
          stock_quantity: item.current_stock - item.quantity
        })
        .eq("id", item.product_id);
    }

    return successResponse(
      res,
      201,
      "Bill created successfully",
      bill
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

/**
 * GET ALL BILLS
 */
export const getAllBills = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("bills")
      .select("id, total_amount, payment_method, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse(res, 500, error.message);
    }

    return successResponse(
      res,
      200,
      "Bills fetched successfully",
      data
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

/**
 * GET SINGLE BILL
 */
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("bills")
      .select(`
        id,
        total_amount,
        payment_method,
        created_at,
        bill_items (
          quantity,
          unit_price,
          products (
            name,
            barcode
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return errorResponse(res, 404, "Bill not found");
    }

    return successResponse(
      res,
      200,
      "Bill fetched successfully",
      data
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};
