import { sdk } from "@lib/config" 

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ;


export const fetchBlogs = async (limit: number, offset: number) => {
    try {
      const response = await sdk.client.fetch(`/store/blogs`, {
        query: { limit, offset },
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
      });
      if (Array.isArray(response) && response.some(item => item.error)) {
        throw new Error("API returned errors: " + JSON.stringify(response));
      }
      return response;
    } catch (error) {
      console.error("Error in fetchBlogs:", error);
      throw error;
    }
  }

  export const fetchBlogById = async (id:string) => {
    try {
      const response = await sdk.client.fetch(`/store/blogs/${id}`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
      });
      if (Array.isArray(response) && response.some(item => item.error)) {
        throw new Error("API returned errors: " + JSON.stringify(response));
      }
      return response;
    } catch (error) {
      console.error("Error in fetchBlogs:", error);
      throw error;
    }
  }
  