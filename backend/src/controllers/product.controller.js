import { supabase } from "../supabaseClient.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock_quantity, barcode } = req.body;

    if (!name || price <= 0 || stock_quantity < 0) {
      return errorResponse(res, 400, "Invalid product data");
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, price, stock_quantity, barcode }])
      .select()
      .single();

    if (error) {
      return errorResponse(res, 500, error.message);
    }

    return successResponse(
      res,
      201,
      "Product created successfully",
      data
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (error) {
      return errorResponse(res, 500, error.message);
    }

    return successResponse(
      res,
      200,
      "Products fetched successfully",
      data
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return errorResponse(
        res,
        400,
        "Search query must be at least 2 characters"
      );
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${q}%`)
      .eq("is_active", true);

    if (error) {
      return errorResponse(res, 500, "Failed to search products");
    }

    return successResponse(
      res,
      200,
      "Search completed successfully",
      data
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock_quantity, barcode } = req.body;

    if (price !== undefined && price <= 0) {
      return errorResponse(res, 400, "Price must be greater than 0");
    }

    if (stock_quantity !== undefined && stock_quantity < 0) {
      return errorResponse(res, 400, "Stock quantity cannot be negative");
    }

    const { data, error } = await supabase
      .from("products")
      .update({ name, price, stock_quantity, barcode })
      .eq("id", id)
      .eq("is_active", true)
      .select()
      .maybeSingle();

    if (error) {
      return errorResponse(res, 500, error.message);
    }

    if (!data) {
      return errorResponse(res, 404, "Product not found");
    }

    return successResponse(
      res,
      200,
      "Product updated successfully",
      data
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return errorResponse(res, 500, error.message);
    }

    if (!data) {
      return errorResponse(res, 404, "Product not found");
    }

    return successResponse(
      res,
      200,
      "Product deleted successfully"
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal server error");
  }
};
