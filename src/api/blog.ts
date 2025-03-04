import { sdk } from "@lib/config" 

export const fetchBlogs = async (limit: number, offset: number) => {
    try {
      const response = await sdk.client.fetch(`/store/blogs`, {
        query: { limit, offset },
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
      const response = await sdk.client.fetch(`/store/blogs/${id}`);
      if (Array.isArray(response) && response.some(item => item.error)) {
        throw new Error("API returned errors: " + JSON.stringify(response));
      }
      return response;
    } catch (error) {
      console.error("Error in fetchBlogs:", error);
      throw error;
    }
  }
  