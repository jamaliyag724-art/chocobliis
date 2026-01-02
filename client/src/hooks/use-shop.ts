import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl, type InsertEnquiry } from "@shared/routes";

// Products
export function useProducts(params?: { category?: string; limit?: number }) {
  // Construct query key based on params to ensure caching works correctly per filter
  const queryKey = params 
    ? [api.products.list.path, params.category, params.limit] 
    : [api.products.list.path];
    
  // Construct URL with query params manually since fetch doesn't support body for GET
  // and our API definition expects them
  const url = new URL(api.products.list.path, window.location.origin);
  if (params?.category) url.searchParams.append("category", params.category);
  if (params?.limit) url.searchParams.append("limit", String(params.limit));

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}

// Reviews
export function useReviews() {
  return useQuery({
    queryKey: [api.reviews.list.path],
    queryFn: async () => {
      const res = await fetch(api.reviews.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
  });
}

// Contact
export function useSubmitEnquiry() {
  return useMutation({
    mutationFn: async (data: InsertEnquiry) => {
      const validated = api.contact.submit.input.parse(data);
      const res = await fetch(api.contact.submit.path, {
        method: api.contact.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.contact.submit.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit enquiry");
      }
      return api.contact.submit.responses[201].parse(await res.json());
    },
  });
}
